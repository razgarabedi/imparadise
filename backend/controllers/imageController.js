const fs = require('fs');
const path = require('path');
const Image = require('../models/Image');
const Folder = require('../models/Folder');
const Setting = require('../models/Setting');

const DEFAULT_MAX_UPLOAD_SIZE = 5 * 1024 * 1024; // 5MB

exports.uploadImage = async (req, res) => {
  const { folderId } = req.params;
  const file = req.file;
  const user = req.user;

  if (!file) {
    return res.status(400).json({ error: 'Image file is required.' });
  }
  if (!folderId) {
    return res.status(400).json({ error: 'Folder ID is required.' });
  }

  try {
    const maxUploadSizeSetting = await Setting.get('max_upload_size');
    const maxUploadSize = maxUploadSizeSetting ? parseInt(maxUploadSizeSetting.value, 10) : DEFAULT_MAX_UPLOAD_SIZE;

    if (file.size > maxUploadSize) {
      // Clean up the uploaded file if it's too large
      fs.unlinkSync(file.path);
      return res.status(400).json({ error: `File size exceeds the maximum limit of ${maxUploadSize / 1024 / 1024}MB.` });
    }

    const folder = await Folder.findById(folderId);
    if (!folder) {
      fs.unlinkSync(file.path);
      return res.status(404).json({ error: 'Folder not found.' });
    }

    if (folder.user_id !== user.id && user.role !== 'admin') {
      fs.unlinkSync(file.path);
      return res.status(403).json({ error: 'Forbidden: You do not have permission to upload to this folder.' });
    }

    const protocol = req.headers['x-forwarded-proto'] || req.protocol;
    const localUrl = `${protocol}://${req.get('host')}/uploads/${file.filename}`;
    
    const newImage = await Image.create(
      file.originalname,
      file.filename,
      file.mimetype,
      file.size,
      folderId,
      user.id,
      localUrl
    );

    res.status(201).json(newImage);
  } catch (error) {
    console.error("Error uploading image:", error);
    // If something goes wrong after the file is saved, delete the file
    if (file && file.path) {
      fs.unlinkSync(file.path);
    }
    res.status(500).json({ error: 'Error uploading image.' });
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
        
        const imagePath = path.join(__dirname, '..', 'uploads', image.stored_filename);
        
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }

        await Image.delete(id);

        res.json({ message: 'Image deleted successfully.' });
    } catch (error) {
        console.error("Error deleting image:", error);
        res.status(500).json({ error: 'Error deleting image.' });
    }
}; 