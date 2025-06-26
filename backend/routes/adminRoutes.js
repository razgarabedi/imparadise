const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  updateUserRole,
  deleteUser,
  getSettings,
  updateSetting,
} = require('../controllers/adminController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { authorizeRole } = require('../middleware/roleMiddleware');

// All routes in this file are for admins only
router.use(authenticateToken);
router.use(authorizeRole(['admin']));

// User management
router.get('/users', getAllUsers);
router.put('/users/:userId/role', updateUserRole);
router.delete('/users/:userId', deleteUser);

// Settings management
router.get('/settings', getSettings);
router.put('/settings/:key', updateSetting);

module.exports = router; 