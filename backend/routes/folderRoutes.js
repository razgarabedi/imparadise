const express = require('express');
const router = express.Router();
const folderController = require('../controllers/folderController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { authorizeRole } = require('../middleware/roleMiddleware');

router.use(authenticateToken);

router.post('/', authorizeRole(['user', 'admin']), folderController.createFolder);
router.get('/', folderController.getFolders);
router.get('/:folderId', folderController.getFolderById);
router.put('/:folderId', authorizeRole(['user', 'admin']), folderController.updateFolder);
router.delete('/:folderId', authorizeRole(['user', 'admin']), folderController.deleteFolder);
router.get('/public/:folderId', folderController.getFolderById);

module.exports = router; 