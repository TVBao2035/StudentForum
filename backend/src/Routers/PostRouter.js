const express = require('express');
const PostController = require('../Controllers/PostController');
const checkToken = require("../Middlewares/checkToken");
const router = express.Router();

router.get(`/user/:userId`,checkToken, PostController.getAllPostByUserId);
router.get(`/group/:id`,checkToken,  PostController.getByGroupId);

router.delete(`/:id`, checkToken, PostController.delete);
router.put(`/:id`, checkToken, PostController.update);
router.post(`/` , checkToken, PostController.create);
router.get(`/:id`, checkToken, PostController.getDetails);
router.get(`/`, checkToken, PostController.getAll);

module.exports = router;