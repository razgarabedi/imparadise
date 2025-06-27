const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  updateUserRole,
  deleteUser,
  getSettings,
  updateSetting,
  uploadSettingImage,
  updateUserStorageLimit,
} = require('../controllers/adminController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { authorizeRole } = require('../middleware/roleMiddleware');
const upload = require('../middleware/uploadMiddleware');

// All routes in this file are for admins only
router.use(authenticateToken);
router.use(authorizeRole(['admin']));

// User management
router.get('/users', getAllUsers);
router.put('/users/:userId/role', updateUserRole);
router.delete('/users/:userId', deleteUser);
router.put('/users/:userId/storage-limit', updateUserStorageLimit);

// Settings management
router.get('/settings', getSettings);
router.put('/settings', updateSetting);
router.post('/settings/upload', upload.single('image'), uploadSettingImage);

module.exports = router; 