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
    res.status(500).json({ error: 'Error fetching settings.' });
  }
};

exports.updateSetting = async (req, res) => {
  const { key } = req.params;
  const { value } = req.body;

  try {
    const updatedSetting = await Setting.update(key, value);
    if (!updatedSetting) {
        return res.status(404).json({ error: 'Setting not found.' });
    }
    res.json(updatedSetting);
  } catch (error) {
    res.status(500).json({ error: 'Error updating setting.' });
  }
}; 