const Folder = require('../models/Folder');

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