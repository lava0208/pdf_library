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
        const {id, username, date, page, reply } = req.body;

        const newHistory = new History({
            id,
            username,
            date,
            page,
            reply
        });

        const savedHistory = await newHistory.save();
        res.status(201).json(savedHistory);
    } catch (error) {
        res.status(500).send('Error occurred: ' + error.message);
    }
}

module.exports = {
    getHistory,
    createHistory,
}
