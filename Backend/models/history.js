// models/History.js
const mongoose = require("mongoose");
const { Schema } = mongoose;

const replySchema = new Schema({
    username: String,
    date: String,
    reply: String,
});

const historySchema = new mongoose.Schema({
    // id: {
    //     type: String,
    // },
    actiontype: {
        type: String
    },
    username: {
        type: String,
    },
    date: {
        type: Date,
    },
    page: {
        type: String,
    },
    reply: {
        type: [replySchema],
    },
});

const documentSchema = new Schema({
    uniqueId: {
        type: String,
        unique: true,
        required: true
    },
    pdfData: {
        type: String
    },
    formData: {
        type: String
    },
    textData: {
        type: String
    },
    uniqueLink: {
        type: String
    },
    history: [historySchema],
});

const Doc = mongoose.model("Document", documentSchema);

module.exports = Doc;
