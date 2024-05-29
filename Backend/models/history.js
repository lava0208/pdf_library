// models/History.js
const mongoose = require("mongoose");

const historySchema = new mongoose.Schema({
    id: {
        type: String,
        unique: true,
        required: true
    },
    actiontype: {
        type: String
    },
    username: {
        type: String,
        required: true
    },
    date: {
        type: Date,
    },
    page: {
        type: String,
    },
    reply: {
        type: String,
    },
});

const History = mongoose.model("History", historySchema);

module.exports = History;
