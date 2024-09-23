const express = require('express');
const UserController = require('../Controllers/UserController');
const checkToken = require('../Middlewares/checkToken');
const router = express.Router();

router.get('/logout', UserController.logout);
router.post(`/signUp`, UserController.signUp);
router.post(`/signIn`, UserController.signIn);
router.get(`/refresh`, checkToken, UserController.refresh);

router.post('/', checkToken, UserController.create);
router.put(`/:id`, checkToken, UserController.update);
router.delete(`/:id`, checkToken, UserController.delete);
router.get(`/:id`, checkToken, UserController.getDetails);
router.get(`/`, UserController.getAll);
module.exports = router;