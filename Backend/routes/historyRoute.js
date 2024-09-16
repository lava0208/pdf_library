const express = require('express');
const router = express.Router();

const path = require('path');
const multer = require('multer');
const { setCurrentFile } = require('../utils/currentFile');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Specify the destination folder for uploads
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname); // Get the file extension
        const currentFileName = file.fieldname + '-' + Date.now() + ext;
        cb(null, currentFileName); // Rename the file with original extension
        console.log(currentFileName);
        setCurrentFile("uploads/" + currentFileName);
    }
});
const upload = multer({
    storage: storage,
    limits: {
        fieldSize: 25 * 1024 * 1024, // Allow fields up to 25MB
        fileSize: 50 * 1024 * 1024,  // Allow file uploads up to 50MB
    }
});

const { getAllDocuments, getAllFolderDocuments, getDocument, createDocument, updateDocument, updateDocumentName, deleteDocument, moveDocument } = require('../controllers/historyController');

router.get('/history/:username', getAllDocuments);
router.get('/history/folder/:username/:folderId?', getAllFolderDocuments);
router.get('/history/:username/:uniqueId', getDocument);
router.post('/history', upload.single('pdfFile'), createDocument);
router.put('/history/:uniqueId', upload.single('pdfFile'), updateDocument);
router.put('/history/:uniqueId/documentname', updateDocumentName);
router.delete('/history/:username/:uniqueId', deleteDocument);
router.put('/history/:uniqueId/move', moveDocument);

module.exports = router;
