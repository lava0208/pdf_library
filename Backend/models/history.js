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

// Add a virtual to return historyId as the same as id
historySchema.virtual('historyId').get(function() {
    return this.id;  // Simply return the `id` field as `historyId`
});

// Ensure virtuals are included in toJSON and toObject output
historySchema.set('toJSON', { virtuals: true });
historySchema.set('toObject', { virtuals: true });

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
    commentData: {
        type: String
    },
    uniqueLink: {
        type: String
    },
    history: [historySchema], // Embed historySchema
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
}, {
    toJSON: { virtuals: true }, // Ensure virtuals are included in JSON
    toObject: { virtuals: true } // Ensure virtuals are included in Objects
});

const Doc = mongoose.model("Document", documentSchema);

module.exports = Doc;
