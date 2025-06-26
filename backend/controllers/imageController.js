const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const Image = require('../models/Image');
const Folder = require('../models/Folder');
const Setting = require('../models/Setting');
const imageProcessingService = require('../services/imageProcessingService');

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

    const protocol = req.headers['x-forwarded-proto'] || req.protocol;
    const uploadsDir = path.join(__dirname, '..', 'uploads');
    const newImages = [];
    
    for (const file of files) {
      const localUrl = `${protocol}://${req.get('host')}/uploads/${file.filename}`;
      
      let thumbnailFilename = null;
      let thumbnailUrl = null;
      let previewFilename = null;
      let previewUrl = null;
      
      try {
        const thumbnailResult = await imageProcessingService.generateThumbnail(file.path, uploadsDir);
        thumbnailFilename = thumbnailResult.thumbnailFilename;
        thumbnailUrl = `${protocol}://${req.get('host')}/uploads/${thumbnailFilename}`;
        
        const previewResult = await imageProcessingService.generatePreview(file.path, uploadsDir);
        previewFilename = previewResult.previewFilename;
        previewUrl = `${protocol}://${req.get('host')}/uploads/${previewFilename}`;
      } catch (processingError) {
        console.error('Image processing failed for file:', file.filename, processingError);
        // Decide if you want to continue without thumbnail/preview or skip this file
      }

      const newImage = await Image.create(
        file.originalname,
        file.filename,
        file.mimetype,
        file.size,
        folderId,
        user.id,
        localUrl,
        thumbnailFilename,
        thumbnailUrl,
        previewFilename,
        previewUrl
      );
      newImages.push(newImage);
    }
    
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
    // If something goes wrong after the file is saved, delete the files
    if (files && files.length > 0) {
      for (const file of files) {
        try {
          fs.unlinkSync(file.path);
        } catch (unlinkError) {
          console.error('Error deleting file:', unlinkError);
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
    const { id } = req.params; // Changed from imageId to id to match router
    const user = req.user;

    try {
        const image = await Image.findById(id);
        if (!image) {
            return res.status(404).json({ error: 'Image not found.' });
        }

        if (image.user_id !== user.id && user.role !== 'admin') {
            return res.status(403).json({ error: 'Forbidden: You do not have permission to delete this image.' });
        }
        
        const uploadsDir = path.join(__dirname, '..', 'uploads');
        const imagePath = path.join(uploadsDir, image.stored_filename);
        
        // Delete original image file
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }

        // Delete thumbnail file if it exists
        if (image.thumbnail_filename) {
            const thumbnailPath = path.join(uploadsDir, image.thumbnail_filename);
            if (fs.existsSync(thumbnailPath)) {
                fs.unlinkSync(thumbnailPath);
            }
        }

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
            const imagePath = path.join(uploadsDir, image.stored_filename);
            if (fs.existsSync(imagePath)) {
                archive.file(imagePath, { name: image.filename });
            }
        }

        archive.finalize();

    } catch (error) {
        console.error("Error downloading images:", error);
        res.status(500).json({ error: 'Error preparing images for download.' });
    }
}; 