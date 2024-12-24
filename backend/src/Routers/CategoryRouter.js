const express = require('express');
const router = express.Router();
const CategoryController = require('../Controllers/CategoryController');
const checkToken = require('../Middlewares/checkToken');
const checkAdmin = require('../Middlewares/checkAdmin');

router.put(`/`,checkToken, checkAdmin,CategoryController.update);
router.delete(`/:id`,checkToken, checkAdmin, CategoryController.delete);
router.get(`/:id`,checkToken, CategoryController.getById); 
router.get(`/`,checkToken, CategoryController.getAll);
router.post(`/`, checkToken, checkAdmin, CategoryController.create);

module.exports = router;