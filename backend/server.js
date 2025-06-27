const express = require('express');
const cors = require('cors');
require('dotenv').config();
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 5000;
const host = process.env.HOST || 'localhost';

const tempDir = path.join(__dirname, 'tmp');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3001'
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static('uploads'));

// Routes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const userRoutes = require('./routes/userRoutes');
app.use('/api/user', userRoutes);

const folderRoutes = require('./routes/folderRoutes');
app.use('/api/folders', folderRoutes);

const imageRoutes = require('./routes/imageRoutes');
app.use('/api/images', imageRoutes);

const adminRoutes = require('./routes/adminRoutes');
app.use('/api/admin', adminRoutes);

const settingsRoutes = require('./routes/settingsRoutes');
app.use('/api/settings', settingsRoutes);

const Setting = require('./models/Setting');
app.get('/api/public-settings', async (req, res) => {
  try {
    const keys = ['website_name', 'website_logo_url', 'homepage_image_url'];
    const settings = await Setting.getMultiple(keys);
    res.json(settings);
  } catch (error) {
    console.error('Error fetching site settings:', error);
    res.status(500).json({ message: 'Error fetching site settings' });
  }
});

app.get('/', (req, res) => {
  res.send('Hello from backend!');
});

app.listen(port, host, () => {
  console.log(`Server is running on ${host}:${port}`);
}); 