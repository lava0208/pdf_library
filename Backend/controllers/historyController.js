// controllers/historyController.js
const Doc = require('../models/history');

const getHistory = async function (req, res) {
    try {
        const documents = await Doc.find();
        res.status(200).json(documents);
    } catch (error) {
        res.status(500).send('Error occurred: ' + error.message);
    }
}

const createHistory = async function (req, res) {
    try {
        const histories = req.body;

        if (!Array.isArray(histories)) {
            return res.status(400).json({ message: 'Invalid data format: histories should be an array.' });
        }

        if (histories.length === 0) {
            // If the payload is an empty array, delete all histories
            await History.deleteMany({});
            return res.status(200).json({ message: 'All histories have been deleted.' });
        }

        const pages = [...new Set(histories.map(history => history.page))];

        if (pages.length !== 1) {
            return res.status(400).json({ message: 'All histories must be for the same page.' });
        }

        const page = pages[0];

        // Delete existing records for the specified page
        await History.deleteMany({ page });

        // Save the new records
        const savedHistories = await History.insertMany(histories);

        // Group histories by page
        const groupedHistories = savedHistories.reduce((acc, history) => {
            if (!acc[history.page]) {
                acc[history.page] = { page: history.page, list: [] };
            }
            acc[history.page].list.push(history);
            return acc;
        }, {});

        const result = Object.values(groupedHistories);

        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error occurred: ' + error.message });
    }
};

module.exports = {
    getHistory,
    // createHistory,
}
