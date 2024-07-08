const express = require('express');
const router = express.Router();

const { createFolder, getFolders, getFolderById, updateFolder, deleteFolder } = require('../controllers/folderController');

router.post('/folder', createFolder);
router.get('/folder', getFolders);
router.get('/folder/:id', getFolderById);
router.put('/folder/:id', updateFolder);
router.delete('/folder/:id', deleteFolder);

module.exports = router;
