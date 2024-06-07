const jwt = require('jsonwebtoken');
const jwtSecret = require('../config').jwtSecret;
const maxAge = require("../config").maxAge;

const jwtSign = function (object) {
    const token = jwt.sign({ object }, jwtSecret, {
        expiresIn: maxAge
    });
    return token;
}

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided" });
    }
    try {
        const decoded = jwt.verify(token, jwtSecret);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
}

module.exports = {
    jwtSign,
    verifyToken
}