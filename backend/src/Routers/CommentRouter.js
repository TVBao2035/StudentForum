const express = require('express');
const CommentController = require('../Controllers/CommentController');
const router = express.Router();



router.get(`/post/:postId`, CommentController.getAllCommentByPostId);
router.post(`/`, CommentController.create);
router.get(`/:commentId`, CommentController.getComment);
module.exports = router;