const mongoose = require('mongoose');
const Folder = require('../models/folder');

const createFolder = async (req, res) => {
    try {
        const { name, parentId } = req.body;
        const newFolder = new Folder({
            name,
            parentId: parentId ? new mongoose.Types.ObjectId(parentId) : null,
        });
        const savedFolder = await newFolder.save();
        res.status(201).json(savedFolder);
    } catch (error) {
        console.error('Error creating folder:', error);
        res.status(500).json({ message: 'Error creating folder', error });
    }
};

// Get all folders
const getFolders = async (req, res) => {
    try {
        const { parentId } = req.query;
        const query = parentId ? { parentId: parentId } : { parentId: null };
        const folders = await Folder.find(query);
        res.status(200).json(folders);
    } catch (error) {
        console.error('Error fetching folders:', error);
        res.status(500).json({ message: 'Error fetching folders', error });
    }
};

// Get a single folder by ID
const getFolderById = async (req, res) => {
    try {
        const { id } = req.params;
        const folder = await Folder.findById(id);
        if (!folder) {
            return res.status(404).json({ message: 'Folder not found' });
        }
        res.status(200).json(folder);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching folder', error });
    }
};

// Update a folder
const updateFolder = async (req, res) => {
    try {
        const { name } = req.body;
        const folderId = req.params.id;

        const updatedFolder = await Folder.findByIdAndUpdate(
            folderId,
            { $set: { name: name } },
            { new: true, useFindAndModify: false }
        );

        if (!updatedFolder) {
            return res.status(404).json({ message: 'Folder not found' });
        }

        res.status(200).json(updatedFolder);
    } catch (error) {
        console.error('Error updating folder name:', error);
        res.status(500).json({ message: 'Error updating folder name', error });
    }
};

// Delete a folder
const deleteFolder = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedFolder = await Folder.findByIdAndDelete(id);
        if (!deletedFolder) {
            return res.status(404).json({ message: 'Folder not found' });
        }
        res.status(200).json({ message: 'Folder deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting folder', error });
    }
};

// Folder controller
const moveFolder = async (req, res) => {
    try {
        const { folderId } = req.params;
        const { newParentId } = req.body;

        const folder = await Folder.findByIdAndUpdate(
            folderId,
            { parentId: newParentId },
            { new: true }
        );

        if (!folder) {
            return res.status(404).json({ message: 'Folder not found' });
        }

        res.status(200).json({ message: 'Folder moved successfully', folder });
    } catch (error) {
        res.status(500).json({ message: 'Error moving folder', error });
    }
};

module.exports = {
    createFolder,
    getFolders,
    getFolderById,
    updateFolder,
    deleteFolder,
    moveFolder
};
