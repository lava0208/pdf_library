const Folder = require('../models/folder');

// Create a new folder
const createFolder = async (req, res) => {
    try {
        const { name, parentId } = req.body;
        const newFolder = new Folder({
            name,
            parentId: parentId ? mongoose.Types.ObjectId(parentId) : null,
        });
        const savedFolder = await newFolder.save();
        res.status(201).json(savedFolder);
    } catch (error) {
        res.status(500).json({ message: 'Error creating folder', error });
    }
};

// Get all folders
const getFolders = async (req, res) => {
    try {
        const { parentId } = req.query;
        if (parentId) {
            const folder = await Folder.findOne({where: {parentId: parentId}});
            const result= [];
            if (folder) {
                result.push(folder)
            }
            res.status(200).json(result);
        } else {
            let query = { parentId: null };
            const folders = await Folder.find(query);
            res.status(200).json(folders);
        }
    } catch (error) {
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
        const { id } = req.params;
        const { name, parentId } = req.body;
        const updatedFolder = await Folder.findByIdAndUpdate(
            id,
            {
                name,
                parentId: parentId ? mongoose.Types.ObjectId(parentId) : null,
                updatedAt: new Date(),
            },
            { new: true }
        );
        if (!updatedFolder) {
            return res.status(404).json({ message: 'Folder not found' });
        }
        res.status(200).json(updatedFolder);
    } catch (error) {
        res.status(500).json({ message: 'Error updating folder', error });
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

module.exports = {
    createFolder,
    getFolders,
    getFolderById,
    updateFolder,
    deleteFolder
};
