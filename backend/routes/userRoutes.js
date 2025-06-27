const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken: authMiddleware } = require('../middleware/authMiddleware');
const profilePictureUpload = require('../middleware/profilePictureUpload');

// @route   GET api/user/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', authMiddleware, userController.getProfile);

// @route   PUT api/user/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', authMiddleware, userController.updateProfile);

// @route   PUT api/user/password
// @desc    Change user password
// @access  Private
router.put('/password', authMiddleware, userController.changePassword);

// @route   POST api/user/profile-picture
// @desc    Upload profile picture
// @access  Private
router.post('/profile-picture', [authMiddleware, profilePictureUpload], userController.uploadProfilePicture);

module.exports = router; 