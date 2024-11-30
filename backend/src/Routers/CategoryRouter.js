const express = require('express');
const router = express.Router();
const CategoryController = require('../Controllers/CategoryController');

router.put(`/`, CategoryController.update);
router.delete(`/:id`, CategoryController.delete);
router.get(`/:id`, CategoryController.getById); 
router.get(`/`, CategoryController.getAll);
router.post(`/`, CategoryController.create);

module.exports = router;