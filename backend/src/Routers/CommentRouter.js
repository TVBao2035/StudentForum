const express = require('express');
const CommentController = require('../Controllers/CommentController');
const router = express.Router();
const checkToken = require('../Middlewares/checkToken');


router.get(`/post/:postId`,checkToken, CommentController.getAllCommentByPostId);
router.post(`/`,checkToken, CommentController.create);
router.get(`/:commentId`,checkToken, CommentController.getComment);
module.exports = router;