const express = require('express');
const HistoryController = require('../Controllers/HistoryController');
const route = express.Router();


route.post('/', HistoryController.create);
route.get('/:userId', HistoryController.getAllByUserId);
route.put('/:id', HistoryController.update);
module.exports = route;