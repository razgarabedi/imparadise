const fs = require('fs');
const path = require('path');
const Image = require('../models/Image');
const Folder = require('../models/Folder');
const Setting = require('../models/Setting');
const imageProcessingService = require('../services/imageProcessingService');

const DEFAULT_MAX_UPLOAD_SIZE = 5 * 1024 * 1024; // 5MB

exports.uploadImage = async (req, res) => {
  const { folderId } = req.params;
  const files = req.files;
  const user = req.user;

  if (!files || files.length === 0) {
    return res.status(400).json({ error: 'Image file(s) are required.' });
  }
  if (!folderId) {
    return res.status(400).json({ error: 'Folder ID is required.' });
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
      // Check if file is a supported image format
      if (!imageProcessingService.isSupportedImageFormat(file.mimetype)) {
        continue; // Skip unsupported formats
      }

      const localUrl = `${protocol}://${req.get('host')}/uploads/${file.filename}`;
      
      // Generate thumbnail
      let thumbnailFilename = null;
      let thumbnailUrl = null;
      
      try {
        const thumbnailResult = await imageProcessingService.generateThumbnail(file.path, uploadsDir);
        thumbnailFilename = thumbnailResult.thumbnailFilename;
        thumbnailUrl = `${protocol}://${req.get('host')}/uploads/${thumbnailFilename}`;
      } catch (thumbnailError) {
        console.error('Thumbnail generation failed for file:', file.filename, thumbnailError);
        // Continue without thumbnail if generation fails
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
        thumbnailUrl
      );
      newImages.push(newImage);
    }
    
    res.status(201).json(newImages);
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