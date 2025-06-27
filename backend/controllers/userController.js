const User = require('../models/User');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const { password_hash, ...userProfile } = user;
        res.json(userProfile);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { username, email } = req.body;
        const userId = req.user.id;

        // Check if username or email is already taken by another user
        const existingUserByUsername = await User.findByUsername(username);
        if (existingUserByUsername && existingUserByUsername.id !== userId) {
            return res.status(400).json({ message: 'Username is already taken' });
        }

        const existingUserByEmail = await User.findByEmail(email);
        if (existingUserByEmail && existingUserByEmail.id !== userId) {
            return res.status(400).json({ message: 'Email is already in use' });
        }

        const updatedUser = await User.updateProfile(userId, username, email);
        res.json(updatedUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid current password' });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(newPassword, salt);

        await User.updatePassword(userId, passwordHash);
        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.uploadProfilePicture = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!req.file) {
            return res.status(400).json({ message: 'Please upload a file' });
        }

        // If user already has a profile picture, delete the old one
        if (user.profile_picture_url) {
            const oldFilePath = path.join(__dirname, '../../', user.profile_picture_url.substring(1));
            if (fs.existsSync(oldFilePath)) {
                try {
                    fs.unlinkSync(oldFilePath);
                } catch(err) {
                    console.error("Error deleting old profile picture:", err);
                }
            }
        }
        
        const profilePictureUrl = `/uploads/profile-pictures/${req.file.filename}`;
        await User.updateProfilePicture(userId, profilePictureUrl);

        res.json({ profilePictureUrl });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}; 