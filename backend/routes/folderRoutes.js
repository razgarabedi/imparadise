const express = require('express');
const router = express.Router();
const folderController = require('../controllers/folderController');
const imageController = require('../controllers/imageController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { optionalAuth } = require('../middleware/optionalAuth');
const { authorizeRole } = require('../middleware/roleMiddleware');

// --- Public Routes ---
// These routes are accessible to everyone and use optional authentication
// to provide enhanced data for logged-in users.
router.get('/public', folderController.getPublicFolders);
router.get('/:folderId', optionalAuth, folderController.getFolderById);
router.get('/:folderId/images', optionalAuth, imageController.getImagesInFolder);


// --- Authentication Middleware ---
// All routes defined below this point require a valid token.
router.use(authenticateToken);


// --- Private Routes ---
router.post('/', authorizeRole(['user', 'admin']), folderController.createFolder);
router.get('/', folderController.getFolders);
router.put('/:folderId', authorizeRole(['user', 'admin']), folderController.updateFolder);
router.delete('/:folderId', authorizeRole(['user', 'admin']), folderController.deleteFolder);


module.exports = router; 