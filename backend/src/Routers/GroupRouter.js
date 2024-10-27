const express = require('express');
const GroupController = require('../Controllers/GroupController');
const router = express.Router();

router.put('/', GroupController.update);
router.delete('/:id', GroupController.delete);
router.post(`/`, GroupController.create);
router.get(`/:id`, GroupController.getById);
router.get(`/`, GroupController.getAll);
module.exports = router;