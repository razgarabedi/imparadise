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
    res.status(201).json({
      message: 'User registered successfully',
      user: { id: newUser.id, username: newUser.username, email: newUser.email, role: newUser.role },
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

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Error logging in.' });
  }
}; 