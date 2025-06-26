const User = require('../models/User');
const Setting = require('../models/Setting');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching users.' });
  }
};

exports.updateUserRole = async (req, res) => {
  const { userId } = req.params;
  const { role } = req.body;

  try {
    const updatedUser = await User.updateRole(userId, role);
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found.' });
    }
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: 'Error updating user role.' });
  }
};

exports.deleteUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const deletedUser = await User.delete(userId);
    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found.' });
    }
    res.json({ message: 'User deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting user.' });
  }
};

exports.getSettings = async (req, res) => {
  try {
    const settings = await Setting.getAll();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching settings' });
  }
};

exports.updateSetting = async (req, res) => {
  try {
    const { key, value } = req.body;
    await Setting.update(key, value);
    res.json({ message: 'Setting updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating setting', error: error.message });
  }
};

exports.uploadSettingImage = async (req, res) => {
  try {
    const { settingKey } = req.body;
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided.' });
    }
    if (!['website_logo_url', 'homepage_image_url'].includes(settingKey)) {
      return res.status(400).json({ message: 'Invalid setting key for image upload.' });
    }

    console.log('--- Debugging Image Upload ---');
    console.log('x-forwarded-proto Header:', req.headers['x-forwarded-proto']);
    console.log('Host Header:', req.get('host'));
    console.log('req.protocol:', req.protocol);

    const protocol = req.headers['x-forwarded-proto'] || req.protocol;
    const imageUrl = `${protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    
    console.log('Generated Image URL:', imageUrl);
    console.log('-----------------------------');

    await Setting.update(settingKey, imageUrl);

    res.json({ imageUrl });
  } catch (error) {
    console.error('Error uploading setting image:', error)
    res.status(500).json({ message: 'Error uploading image', error: error.message });
  }
}; 