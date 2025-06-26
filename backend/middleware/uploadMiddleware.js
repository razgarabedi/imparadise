const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const Setting = require('../models/Setting');

const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp', 'image/webp', 'image/tiff', 'image/svg+xml'];

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});

const fileFilter = (req, file, cb) => {
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only image files are allowed.'), false);
    }
};

const createUploader = async () => {
    try {
        const maxUploadSizeSetting = await Setting.get('max_upload_size');
        const maxUploadSize = maxUploadSizeSetting ? parseInt(maxUploadSizeSetting.value, 10) : 5242880; // Default 5MB
        return multer({
            storage: storage,
            fileFilter: fileFilter,
            limits: {
                fileSize: maxUploadSize
            }
        });
    } catch (error) {
        console.error("Failed to fetch upload settings, using default.", error);
        // Fallback to default if DB fails
        return multer({
            storage: storage,
            fileFilter: fileFilter,
            limits: {
                fileSize: 5242880 // 5MB
            }
        });
    }
};

const genericUploadMiddleware = (multerMethod, fieldName, count) => {
    return (req, res, next) => {
        createUploader().then(uploader => {
            const uploaderInstance = uploader[multerMethod](fieldName, count);
            uploaderInstance(req, res, (err) => {
                if (err instanceof multer.MulterError) {
                    if (err.code === 'LIMIT_FILE_SIZE') {
                        const limit = uploader.opts.limits.fileSize;
                        return res.status(400).json({ message: `File is too large. Max size is ${Math.round(limit / 1024 / 1024)}MB.` });
                    }
                    return res.status(400).json({ message: err.message });
                } else if (err) {
                    return res.status(400).json({ message: err.message });
                }
                next();
            });
        }).catch(err => {
            console.error("Error creating uploader:", err);
            return res.status(500).json({ message: "Could not initialize file upload." });
        });
    };
};

const upload = {
    single: (fieldName) => genericUploadMiddleware('single', fieldName),
    array: (fieldName, maxCount) => genericUploadMiddleware('array', fieldName, maxCount),
};

module.exports = upload;