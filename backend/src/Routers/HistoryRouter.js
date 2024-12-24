const express = require('express');
const HistoryController = require('../Controllers/HistoryController');
const route = express.Router();
const checkToken = require('../Middlewares/checkToken');

route.post('/',checkToken, HistoryController.create);
route.get('/:userId',checkToken, HistoryController.getAllByUserId);
route.put('/:id', checkToken, HistoryController.update);
module.exports = route;