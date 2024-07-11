const mongoose = require("mongoose");
const { Schema } = mongoose;

const replySchema = new Schema({
    username: String,
    date: String,
    reply: String,
});

const historySchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    actiontype: {
        type: String
    },
    actiontext: {
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
    name: {
        type: String
    },
    username: {
        type: String
    },
    pdfData: {
        type: String
    },
    formDataMap: {
        type: Array
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
    folderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Folder',
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const Doc = mongoose.model("Document", documentSchema);

module.exports = Doc;
