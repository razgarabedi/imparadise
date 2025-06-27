const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const Image = require('../models/Image');
const Folder = require('../models/Folder');
const Setting = require('../models/Setting');
const imageProcessingService = require('../services/imageProcessingService');
const User = require('../models/User');

const DEFAULT_MAX_UPLOAD_SIZE = 5 * 1024 * 1024; // 5MB

exports.uploadImage = async (req, res) => {
  const { folderId } = req.params;
  const files = req.files;
  const user = req.user;
  const skippedFiles = req.skippedFiles || [];

  if ((!files || files.length === 0) && skippedFiles.length === 0) {
    return res.status(400).json({ error: 'Image file(s) are required.' });
  }

  if (!folderId) {
    return res.status(400).json({ error: 'Folder ID is required.' });
  }

  if ((!files || files.length === 0) && skippedFiles.length > 0) {
    return res.status(400).json({
      message: 'All selected files were of unsupported formats.',
      skippedFiles: skippedFiles,
    });
  }

  try {
    const folder = await Folder.findById(folderId);
    if (!folder) {
      return res.status(404).json({ error: 'Folder not found.' });
    }

    if (folder.user_id !== user.id && user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden: You do not have permission to upload to this folder.' });
    }

    const currentUser = await User.findById(user.id);
    if (!currentUser) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const storageUsed = Number(currentUser.storage_used);
    const storageLimit = Number(currentUser.storage_limit);

    let totalUploadSize = 0;
    for (const file of files) {
      totalUploadSize += file.size;
    }

    if (storageUsed + totalUploadSize > storageLimit) {
      // Clean up uploaded files that haven't been processed
      for (const file of files) {
        fs.unlinkSync(file.path);
      }
      return res.status(413).json({ error: 'Storage limit exceeded.' });
    }

    const protocol = req.headers['x-forwarded-proto'] || req.protocol;
    const newImages = [];
    
    for (const file of files) {
      const processedImage = await imageProcessingService.processAndSaveImage(file, folderId);
      
      const localUrl = `${protocol}://${req.get('host')}/${processedImage.path}`;
      const thumbnailUrl = `${protocol}://${req.get('host')}/${processedImage.thumbnail_path}`;
      const previewUrl = `${protocol}://${req.get('host')}/${processedImage.preview_path}`;

      const newImage = await Image.create(
        file.originalname,
        processedImage.filename,
        processedImage.mimeType,
        file.size,
        folderId,
        user.id,
        localUrl,
        processedImage.thumbnail_filename,
        thumbnailUrl,
        processedImage.preview_filename,
        previewUrl
      );
      newImages.push(newImage);
    }
    
    await User.updateStorageUsed(user.id, totalUploadSize);

    const response = {
        newImages,
        message: 'Images uploaded successfully.'
    };

    if (skippedFiles.length > 0) {
        response.message = `Some files were skipped due to unsupported format.`;
        response.skippedFiles = skippedFiles;
    }

    res.status(201).json(response);
  } catch (error) {
    console.error("Error uploading image:", error);
    if (files && files.length > 0) {
      for (const file of files) {
        try {
          // file.path might not exist if processing failed early
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
        } catch (unlinkError) {
          console.error('Error deleting file after upload error:', unlinkError);
        }
      }
    }
    res.status(500).json({ error: 'Error uploading image(s).' });
  }
};

exports.getImagesInFolder = async (req, res) => {
    const { folderId } = req.params;
    const user = req.user;

    try {
        const folder = await Folder.findById(folderId);
        if (!folder) {
            return res.status(404).json({ error: 'Folder not found.' });
        }

        const isOwner = user && folder.user_id === user.id;
        const isAdmin = user && user.role === 'admin';

        if (!folder.is_public && !isOwner && !isAdmin) {
            return res.status(403).json({ error: 'Forbidden: You do not have permission to view this folder.' });
        }

        const images = await Image.findByFolderId(folderId);
        res.json(images);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching images.' });
    }
};

exports.deleteImage = async (req, res) => {
    const { id } = req.params;
    const user = req.user;

    try {
        const image = await Image.findById(id);
        if (!image) {
            return res.status(404).json({ error: 'Image not found.' });
        }

        if (image.user_id !== user.id && user.role !== 'admin') {
            return res.status(403).json({ error: 'Forbidden: You do not have permission to delete this image.' });
        }
        
        if (image.stored_filename) {
            const uploadsDir = path.join(__dirname, '..', 'uploads');
            const imageFolderPath = path.join(uploadsDir, image.folder_id.toString());

            const imagePath = path.join(imageFolderPath, image.stored_filename);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }

            if (image.thumbnail_filename) {
                const thumbnailPath = path.join(imageFolderPath, image.thumbnail_filename);
                if (fs.existsSync(thumbnailPath)) {
                    fs.unlinkSync(thumbnailPath);
                }
            }
            
            if (image.preview_filename) {
                const previewPath = path.join(imageFolderPath, image.preview_filename);
                if (fs.existsSync(previewPath)) {
                    fs.unlinkSync(previewPath);
                }
            }

            if (fs.existsSync(imageFolderPath)) {
                const files = fs.readdirSync(imageFolderPath);
                if (files.length === 0) {
                    fs.rmdirSync(imageFolderPath);
                }
            }
        }
        
        await User.updateStorageUsed(image.user_id, -image.size);
        await Image.delete(id);

        res.json({ message: 'Image deleted successfully.' });
    } catch (error) {
        console.error("Error deleting image:", error);
        res.status(500).json({ error: 'Error deleting image.' });
    }
};

exports.downloadBulkImages = async (req, res) => {
    const { imageIds } = req.body;
    const user = req.user;

    if (!imageIds || !Array.isArray(imageIds) || imageIds.length === 0) {
        return res.status(400).json({ error: 'Image IDs are required.' });
    }

    try {
        const images = await Image.findByIds(imageIds);
        if (images.length === 0) {
            return res.status(404).json({ error: 'No images found for the given IDs.' });
        }
        
        if (user) {
            // User is authenticated, check ownership or admin role
            const isOwnerOrAdmin = images.every(img => img.user_id === user.id || user.role === 'admin');
            if (!isOwnerOrAdmin) {
                return res.status(403).json({ error: 'Forbidden: You do not have permission to download one or more of these images.' });
            }
        } else {
            // User is not authenticated, check if all images are in a public folder
            const firstImage = images[0];
            const folder = await Folder.findById(firstImage.folder_id);

            if (!folder || !folder.is_public) {
                return res.status(403).json({ error: 'Forbidden: You must be logged in to download images from a private folder.' });
            }

            const allInSamePublicFolder = images.every(img => img.folder_id === folder.id);
            if (!allInSamePublicFolder) {
                return res.status(400).json({ error: 'All images must belong to the same public folder for bulk download.' });
            }
        }
        
        const uploadsDir = path.join(__dirname, '..', 'uploads');
        const archive = archiver('zip', {
            zlib: { level: 9 }
        });

        res.attachment('images.zip');
        archive.pipe(res);

        for (const image of images) {
            if (image.stored_filename) {
                const imagePath = path.join(uploadsDir, image.folder_id.toString(), image.stored_filename);
                if (fs.existsSync(imagePath)) {
                    archive.file(imagePath, { name: image.filename });
                }
            }
        }

        archive.finalize();

    } catch (error) {
        console.error("Error downloading images:", error);
        res.status(500).json({ error: 'Error preparing images for download.' });
    }
}; 