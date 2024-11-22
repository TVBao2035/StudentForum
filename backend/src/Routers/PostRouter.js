const express = require('express');
const PostController = require('../Controllers/PostController');
const router = express.Router();

router.get(`/user/:userId`, PostController.getAllPostByUserId);
router.get(`/group/:id`, PostController.getByGroupId);

router.delete(`/:id`, PostController.delete);
router.put(`/:id`, PostController.update);
router.post(`/` , PostController.create);
router.get(`/:id`, PostController.getDetails);
router.get(`/`, PostController.getAll);

module.exports = router;