// models/History.js
const mongoose = require("mongoose");

const historySchema = new mongoose.Schema({
    id: {
        type: String,
        unique: true,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    page: {
        type: String,
        required: true
    },
    reply: {
        type: String,
    },
});

const History = mongoose.model("History", historySchema);

module.exports = History;
