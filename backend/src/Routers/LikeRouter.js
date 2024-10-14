const express = require('express');
const LikeController = require('../Controllers/LikeController');
const router = express.Router();

router.post('/', LikeController.create);
router.delete(`/`, LikeController.delete);
module.exports = router;