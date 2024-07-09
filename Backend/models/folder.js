const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const folderSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    parentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Folder',
        default: null
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

folderSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const Folder = mongoose.model('Folder', folderSchema);

module.exports = Folder;
