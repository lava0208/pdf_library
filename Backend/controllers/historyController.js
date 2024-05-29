// controllers/historyController.js
const History = require('../models/history');

const getHistory = async function (req, res) {
    try {
        const historyRecords = await History.find();

        // Group histories by page
        const groupedHistories = historyRecords.reduce((acc, history) => {
            const page = history.page;
            if (!acc[page]) {
                acc[page] = { page: page, list: [] };
            }
            acc[page].list.push(history);
            return acc;
        }, {});

        const result = Object.values(groupedHistories);

        res.status(200).json(result);
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

        // Group histories by page
        const groupedHistories = savedHistories.reduce((acc, history) => {
            const page = history.page;
            if (!acc[page]) {
                acc[page] = { page: page, list: [] };
            }
            acc[page].list.push(history);
            return acc;
        }, {});

        const result = Object.values(groupedHistories);

        res.status(201).json(result);
    } catch (error) {
        res.status(500).send('Error occurred: ' + error.message);
    }
}

module.exports = {
    getHistory,
    createHistory,
}
