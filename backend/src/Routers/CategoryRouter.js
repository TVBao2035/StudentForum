const express = require('express');
const CategoryController = require('../Controllers/CategoryController');

const router = express.Router();

router.put(`/`, CategoryController.update);
router.delete(`/:id`, CategoryController.delete);
router.get(`/:id`, CategoryController.getById); 
router.get(`/`, CategoryController.getAll);
router.post(`/`, CategoryController.create);

module.exports = router;