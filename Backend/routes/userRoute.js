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

const { userSignup, userSignin, getUserSignature, uploadUserSignature } = require('../controllers/userController');
const { verifyToken } = require('../utils/jwt');

router.post("/signup", userSignup);
router.post("/signin", userSignin);
router.get("/signin", verifyToken, (req, res) => {
    res.json({ message: "You have access to login here." })
})

router.get("/api/users/signature/:username", getUserSignature)

router.post('/api/users/signature/:username', upload.single('signature'), uploadUserSignature);

module.exports = router;