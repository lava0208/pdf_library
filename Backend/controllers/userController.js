const User = require('../models/user');
const bcrypt = require('bcrypt');
const { jwtSign } = require('../utils/jwt');

const colors = ['grey', 'blue', 'green', 'yellow', 'orange', 'red'];

const path = require('path');

const userSignup = async function (req, res) {
    try {
        const { username, email, password, role } = req.body;
        const user = await User.findOne({ $or: [{ username: username }, { email: email }] });
        if (user) {
            return res.status(409).json({status: 'error', message: 'User already exists'});
        } else {
            const newUser = new User({
                username: username,
                email: email,
                password: password,
                role: role,
                signature: []
            });
            await newUser.save();
            return res.status(201).send({status: 'success', message: 'User created successfully'});
        }
    } catch (err) {
        return res.status(500).send('Error occurred: ' + err.message);
    }
}

const userSignin = async function (req, res) {
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(409).send('User doesn\'t exist');
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(409).send('Password doesn\'t match');
        }

        const token = jwtSign({
            id: user._id,
            username: user.username,
            email: user.email,
        });

        return res.status(201).json({
            token: token,
            username: user.username,
            color: randomColor,
            message: "User logged in successfully"
        });
    } catch (error) {
        return res.status(500).send('Error occurred: ' + error.message);
    }
}
const getUserSignature = async function (req, res) {
    try {
        const { username } = req.params;
        const user = await User.findOne({ username: username });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!user.signature || user.signature.length === 0) {
            return res.status(200).json({ message: "Signature not found", signature: [] });
        }

        const signatureUrls = user.signature.map(sig => path.basename(sig));

        res.status(200).json({ message: "success", signatures: signatureUrls });
    } catch (err) {
        console.error("Error fetching signature:", err.message);
        res.status(500).json({ message: err.message });
    }
}

const uploadUserSignature = async function (req, res) {
    try {
        const { username } = req.params;
        const user = await User.findOne({ username: username });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.signature.push(path.basename(req.file.path));
        user.signature = user.signature.filter(Boolean);

        await user.save();

        res.json({ message: "Signature uploaded successfully", signature: user.signature });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

module.exports = {
    userSignup,
    userSignin,
    getUserSignature,
    uploadUserSignature
}