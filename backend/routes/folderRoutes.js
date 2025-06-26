const express = require('express');
const router = express.Router();
const { createFolder, getFolders, getPublicFolders, updateFolder, deleteFolder, getFolderById } = require('../controllers/folderController');
const { getImagesInFolder } = require('../controllers/imageController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { optionalAuth } = require('../middleware/optionalAuth');
const { authorizeRole } = require('../middleware/roleMiddleware');

// Get all public folders (no authentication required)
router.get('/public', getPublicFolders);

// Get a single folder by ID
router.get('/:folderId', optionalAuth, getFolderById);

// Get images in a folder (publicly accessible if folder is public)
router.get('/:folderId/images', optionalAuth, getImagesInFolder);

// All routes below are protected
router.use(authenticateToken);

router.post('/', authorizeRole(['user', 'admin']), createFolder);
router.get('/', authorizeRole(['user', 'admin']), getFolders);
router.put('/:id', authorizeRole(['user', 'admin']), updateFolder);
router.delete('/:id', authorizeRole(['user', 'admin']), deleteFolder);

module.exports = router; 