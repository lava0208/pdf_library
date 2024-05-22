const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        required: true,
        default: "Client",
    },
    password: {
        type: String,
        required: true,
    },
    salt: {
        type: String,
    }
});

UserSchema.pre("save", async function (next) {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(this.password, salt);
        this.password = hashedPassword;
        this.salt = salt;
        next();
    } catch (error) {
        next(error);
    }
})

const User = mongoose.model("User", UserSchema);

module.exports = User;