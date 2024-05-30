// routes/historyRoute.js
const express = require('express');
const router = express.Router();
// const { getHistory, createHistory } = require('../controllers/historyController');
const { getHistory } = require('../controllers/historyController');

router.get('/history', getHistory);
// router.post('/history', createHistory);

module.exports = router;
