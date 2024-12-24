const express = require('express');
const LikeController = require('../Controllers/LikeController');
const router = express.Router();
const checkToken = require('../Middlewares/checkToken');
router.post('/', checkToken, LikeController.create);
router.delete(`/`,checkToken, LikeController.delete);
module.exports = router;