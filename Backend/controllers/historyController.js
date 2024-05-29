// controllers/historyController.js
const History = require('../models/history');

const getHistory = async function (req, res) {
    try {
        const historyRecords = await History.find();
        res.status(200).json(historyRecords);
    } catch (error) {
        res.status(500).send('Error occurred: ' + error.message);
    }
}

const createHistory = async function (req, res) {
    try {
        const histories = req.body;

        if (!Array.isArray(histories)) {
            return res.status(400).send('Request body should be an array of history objects');
        }

        const savedHistories = await History.insertMany(histories);

        res.status(201).json(savedHistories);
    } catch (error) {
        res.status(500).send('Error occurred: ' + error.message);
    }
}

module.exports = {
    getHistory,
    createHistory,
}
