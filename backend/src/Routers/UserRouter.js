const express = require('express');
const UserController = require('../Controllers/UserController');
const checkToken = require('../Middlewares/checkToken');
const checkAdmin = require("../Middlewares/checkAdmin");
const router = express.Router();

router.get('/logout', UserController.logout);
router.post(`/signUp`, UserController.signUp);
router.post(`/signIn`, UserController.signIn);
router.get(`/refresh`, checkToken, UserController.refresh);


router.put(`/password`, checkToken, UserController.changePassword);
router.get('/user/group/:id', checkToken, UserController.getByGroupId);
router.get(`/:id`, checkToken, UserController.getDetails);
router.get(`/`, checkToken, UserController.getAll);


router.post('/', checkToken, checkAdmin, UserController.create);
router.put(`/:id`, checkToken, UserController.update);
router.delete(`/:id`, checkToken, UserController.delete);

module.exports = router;