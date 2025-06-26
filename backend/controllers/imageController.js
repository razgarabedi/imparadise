const { v4: uuidv4 } = require('uuid');
const path = require('path');
const { PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const s3Client = require('../config/s3');
const Image = require('../models/Image');
const Folder = require('../models/Folder');
const Setting = require('../models/Setting');

const BUCKET_NAME = process.env.AWS_BUCKET_NAME;
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
      return res.status(400).json({ error: `File size exceeds the maximum limit of ${maxUploadSize / 1024 / 1024}MB.` });
    }

    const folder = await Folder.findById(folderId);
    if (!folder) {
      return res.status(404).json({ error: 'Folder not found.' });
    }

    if (folder.user_id !== user.id && user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden: You do not have permission to upload to this folder.' });
    }

    const storedFilename = `${uuidv4()}${path.extname(file.originalname)}`;
    const s3Url = `https://${BUCKET_NAME}.s3.amazonaws.com/${storedFilename}`;

    const params = {
      Bucket: BUCKET_NAME,
      Key: storedFilename,
      Body: file.buffer,
      ContentType: file.mimetype,
    };
    await s3Client.send(new PutObjectCommand(params));
    
    const newImage = await Image.create(
      file.originalname,
      storedFilename,
      file.mimetype,
      file.size,
      folderId,
      user.id,
      s3Url
    );

    res.status(201).json(newImage);
  } catch (error) {
    console.error("Error uploading image:", error);
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
    const { imageId } = req.params;
    const user = req.user;

    try {
        const image = await Image.findById(imageId);
        if (!image) {
            return res.status(404).json({ error: 'Image not found.' });
        }

        if (image.user_id !== user.id && user.role !== 'admin') {
            return res.status(403).json({ error: 'Forbidden: You do not have permission to delete this image.' });
        }

        const params = {
            Bucket: BUCKET_NAME,
            Key: image.stored_filename,
        };
        await s3Client.send(new DeleteObjectCommand(params));
        await Image.delete(imageId);

        res.json({ message: 'Image deleted successfully.' });
    } catch (error) {
        console.error("Error deleting image:", error);
        res.status(500).json({ error: 'Error deleting image.' });
    }
}; 