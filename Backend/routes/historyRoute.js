// routes/historyRoute.js
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
const upload = multer({ storage: storage });


const { getAllHistories, getHistory, createHistory, updateHistory, deleteHistory } = require('../controllers/historyController');

router.get('/history', getAllHistories);
router.get('/history/:uniqueId', getHistory);
router.post('/history', upload.single('pdfFile'), createHistory);
router.put('/history/:uniqueId', upload.single('pdfFile'), updateHistory);
router.delete('/history/:uniqueId', deleteHistory);

module.exports = router;
