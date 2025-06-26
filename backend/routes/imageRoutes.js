const express = require('express');
const router = express.Router();
const { uploadImage, deleteImage } = require('../controllers/imageController');
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

module.exports = router; 