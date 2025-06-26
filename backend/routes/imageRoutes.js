const express = require('express');
const router = express.Router();
const { uploadImage, deleteImage, downloadSelectedImages } = require('../controllers/imageController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { authorizeRole } = require('../middleware/roleMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post(
  '/upload/:folderId',
  authenticateToken,
  authorizeRole(['user', 'admin']),
  upload.array('images', 10),
  uploadImage
);

router.delete(
  '/:id',
  authenticateToken,
  authorizeRole(['user', 'admin']),
  deleteImage
);

router.post(
  '/download-selected',
  authenticateToken,
  authorizeRole(['user', 'admin']),
  downloadSelectedImages
);

module.exports = router; 