const fs = require('fs');
const uuid = require('uuid');
const Doc = require('../models/history');
const { getCurrentFile } = require('../utils/currentFile');
require('dotenv').config();

const getAllHistories = async (req, res) => {
    try {
        const { username } = req.params;
        const documents = await Doc.find({ username });

        res.status(200).json(documents);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Error occurred: ' + error.message);
    }
}

const getHistory = async (req, res) => {
    try {
        const { uniqueId, username } = req.params;
        const document = await Doc.findOne({ uniqueId, username });

        res.status(200).json(document);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Error occurred: ' + error.message);
    }
};

const createHistory = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send('No PDF file uploaded.');
        }

        const { username } = req.body;
        const formDataMap = new Map();
        const pdfFilePath = getCurrentFile();
        const pdfFileData = fs.readFileSync(pdfFilePath);
        const base64Data = pdfFileData.toString('base64');
        const dataUri = `data:application/pdf;base64,${base64Data}`;

        const uniqueId = uuid.v4();
        let newDataSet = [];

        const formData = req.body.pdfFormData;
        const textData = req.body.pdfTextData;

        newDataSet.push({
            pdfData: dataUri,
            formData: formData,
            textData: textData,
        });

        formDataMap.set(uniqueId, newDataSet);

        const history = JSON.parse(req.body.history); // Parse the history JSON string

        const uniqueLink = `https://${process.env.HOST}/pdfviewer/?id=${uniqueId}&draft=true`;

        // Create and save the new document
        const newDocument = new Doc({
            uniqueId,
            username,
            pdfData: dataUri,
            formData,
            textData,
            history,
            uniqueLink
        });

        await newDocument.save();

        res.status(201).json({ message: 'Document saved successfully', uniqueLink, uniqueId });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Error occurred: ' + error.message);
    }
};

const updateHistory = async (req, res) => {
    try {
        const { uniqueId } = req.params;
        const { username } = req.body;
        const updateData = {};

        if (req.file) {
            const pdfFilePath = req.file.path;
            const pdfFileData = fs.readFileSync(pdfFilePath);
            const base64Data = pdfFileData.toString('base64');
            const dataUri = `data:application/pdf;base64,${base64Data}`;
            updateData.pdfData = dataUri;
        }

        if (req.body.pdfFormData) {
            updateData.formData = req.body.pdfFormData;
        }

        if (req.body.pdfTextData) {
            updateData.textData = req.body.pdfTextData;
        }

        if (req.body.history) {
            const history = typeof req.body.history === 'string' ? JSON.parse(req.body.history) : req.body.history;
            updateData.history = history;
        }

        const updatedDocument = await Doc.findOneAndUpdate({ uniqueId, username }, { $set: updateData }, { new: true });

        if (!updatedDocument) {
            return res.status(404).json({ message: 'Document not found' });
        }

        res.status(200).json({ message: 'Document updated successfully', document: updatedDocument });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Error occurred: ' + error.message);
    }
};

const deleteHistory = async (req, res) => {
    try {
        const { uniqueId, username } = req.params;

        const deletedDocument = await Doc.findOneAndDelete({ uniqueId, username });

        if (!deletedDocument) {
            return res.status(404).json({ message: 'Document not found' });
        }

        res.status(200).json({ message: 'Document deleted successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Error occurred: ' + error.message);
    }
};

module.exports = {
    getAllHistories,
    getHistory,
    createHistory,
    updateHistory,
    deleteHistory
};
