const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const userCount = await User.count();
    const role = userCount === 0 ? 'admin' : 'user';

    const newUser = await User.create(username, email, passwordHash, role);

    const payload = { id: newUser.id, role: newUser.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({
      token,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        storage_limit: newUser.storage_limit,
        storage_used: newUser.storage_used,
        profile_picture_url: newUser.profile_picture_url
      },
      message: 'User registered successfully'
    });
  } catch (error) {
    res.status(500).json({ error: 'Error registering new user.' });
  }
};

exports.loginUser = async (req, res) => {
  const { usernameOrEmail, password } = req.body;

  try {
    const isEmail = usernameOrEmail.includes('@');
    const user = isEmail 
      ? await User.findByEmail(usernameOrEmail) 
      : await User.findByUsername(usernameOrEmail);
      
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const payload = { id: user.id, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        storage_limit: user.storage_limit,
        storage_used: user.storage_used,
        profile_picture_url: user.profile_picture_url
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Error logging in.' });
  }
};

exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }
        res.json({
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            storage_limit: user.storage_limit,
            storage_used: user.storage_used,
            profile_picture_url: user.profile_picture_url
        });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching user data.' });
    }
}; 