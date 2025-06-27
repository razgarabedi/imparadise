const Folder = require('../models/Folder');
const Image = require('../models/Image');
const path = require('path');
const fs = require('fs');
const archiver = require('archiver');
const { v4: uuidv4 } = require('uuid');

exports.createFolder = async (req, res) => {
  const { name, isPublic } = req.body;
  const userId = req.user.id;

  try {
    const newFolder = await Folder.create(name, userId, isPublic);
    res.status(201).json(newFolder);
  } catch (error) {
    res.status(500).json({ error: 'Error creating folder.' });
  }
};

exports.getFolders = async (req, res) => {
  const userId = req.user.id;

  try {
    const folders = await Folder.findByUserId(userId);
    res.json(folders);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching folders.' });
  }
};

exports.getPublicFolders = async (req, res) => {
  try {
    const folders = await Folder.findAllPublic();
    res.json(folders);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching public folders.' });
  }
};

exports.updateFolder = async (req, res) => {
  const { folderId } = req.params;
  const { name, isPublic } = req.body;
  const { id: userId, role } = req.user;

  try {
    const folder = await Folder.findById(folderId);
    if (!folder) {
      return res.status(404).json({ error: 'Folder not found.' });
    }

    if (folder.user_id !== userId && role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden: You do not have permission to update this folder.' });
    }

    const updatedFolder = await Folder.update(folderId, name, isPublic);
    res.json(updatedFolder);
  } catch (error) {
    res.status(500).json({ error: 'Error updating folder.' });
  }
};

exports.deleteFolder = async (req, res) => {
  const { folderId } = req.params;
  const { id: userId, role } = req.user;

  try {
    const folder = await Folder.findById(folderId);
    if (!folder) {
      return res.status(404).json({ error: 'Folder not found.' });
    }

    if (folder.user_id !== userId && role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden: You do not have permission to delete this folder.' });
    }

    await Folder.delete(folderId);
    res.json({ message: 'Folder deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting folder.' });
  }
};

exports.getFolderById = async (req, res) => {
  const { folderId } = req.params;
  const user = req.user;

  try {
    const folder = await Folder.findById(folderId);
    if (!folder) {
      return res.status(404).json({ error: 'Folder not found.' });
    }

    const isOwner = user && folder.user_id === user.id;
    const isAdmin = user && user.role === 'admin';

    if (!folder.is_public && !isOwner && !isAdmin) {
      return res.status(403).json({ error: 'Forbidden: You do not have permission to view this folder.' });
    }

    res.json(folder);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching folder.' });
  }
};

exports.downloadFolder = async (req, res) => {
  const { id } = req.params;
  const user = req.user;

  try {
    const folder = await Folder.findById(id);
    if (!folder) {
      return res.status(404).json({ error: 'Folder not found.' });
    }

    const isOwner = user && folder.user_id === user.id;
    const isAdmin = user && user.role === 'admin';

    if (!folder.is_public && !isOwner && !isAdmin) {
      return res.status(403).json({ error: 'Forbidden: You do not have permission to download this folder.' });
    }

    const images = await Image.findByFolderId(id);
    if (images.length === 0) {
      return res.status(404).json({ error: 'This folder is empty.' });
    }

    const tempDir = path.join(__dirname, '..', 'tmp');
    const tempFileName = `${uuidv4()}.zip`;
    const tempFilePath = path.join(tempDir, tempFileName);

    const output = fs.createWriteStream(tempFilePath);
    const archive = archiver('zip', {
      zlib: { level: 9 }
    });

    output.on('close', () => {
      const fileSize = archive.pointer();
      res.setHeader('Content-Length', fileSize);
      res.attachment(`${folder.name}.zip`);

      const readStream = fs.createReadStream(tempFilePath);
      readStream.pipe(res);

      readStream.on('end', () => {
        fs.unlink(tempFilePath, (err) => {
          if (err) {
            console.error('Error deleting temporary zip file:', err);
          }
        });
      });

      readStream.on('error', (err) => {
        console.error('Error streaming temporary zip file:', err);
        fs.unlink(tempFilePath, () => {});
        res.status(500).send('Error sending file');
      });
    });

    archive.on('error', (err) => {
      throw err;
    });

    archive.pipe(output);

    const uploadsDir = path.join(__dirname, '..', 'uploads');
    for (const image of images) {
      if (image.stored_filename) {
        const imagePath = path.join(uploadsDir, image.folder_id.toString(), image.stored_filename);
        if (fs.existsSync(imagePath)) {
          archive.file(imagePath, { name: image.filename });
        }
      }
    }

    archive.finalize();
  } catch (error) {
    console.error("Error downloading folder:", error);
    res.status(500).json({ error: 'Error preparing folder for download.' });
  }
}; 