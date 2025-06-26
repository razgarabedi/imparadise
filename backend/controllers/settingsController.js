const Setting = require('../models/Setting');

// @desc    Get settings for logged-in users
// @route   GET /api/settings/user
// @access  Private
const getUserSettings = async (req, res) => {
  try {
    const userSettingsKeys = ['max_upload_size'];
    const settings = await Setting.getMultiple(userSettingsKeys);
    res.json(settings);
  } catch (error) {
    console.error('Error fetching user settings:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getUserSettings,
}; 