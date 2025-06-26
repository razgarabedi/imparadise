const express = require('express');
const router = express.Router();
const { getUserSettings } = require('../controllers/settingsController');
const { authenticateToken } = require('../middleware/authMiddleware');

// This route is for fetching settings for logged-in users.
// It only requires authentication, not admin rights.
router.get('/', authenticateToken, getUserSettings);

module.exports = router; 