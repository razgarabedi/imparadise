const express = require('express');
const router = express.Router();
const { uploadImage, deleteImage, downloadBulkImages } = require('../controllers/imageController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { authorizeRole } = require('../middleware/roleMiddleware');
const { optionalAuth } = require('../middleware/optionalAuth');
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
  '/download/bulk',
  optionalAuth,
  downloadBulkImages
);

module.exports = router; 