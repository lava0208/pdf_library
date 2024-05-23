// models/History.js
const mongoose = require("mongoose");

const HistorySchema = new mongoose.Schema({
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

const History = mongoose.model("History", HistorySchema);

module.exports = History;
