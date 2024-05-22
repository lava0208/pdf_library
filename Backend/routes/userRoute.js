const express = require('express');
const router = express.Router();
const {userSignup, userSignin} = require('../controllers/userController');
const { verifyToken } = require('../utils/jwt');

router.post("/signup", userSignup);
router.post("/signin", userSignin);
router.get("/signin", verifyToken, (req, res) => {
    res.json({message: "You have access to login here."})
})

module.exports = router;