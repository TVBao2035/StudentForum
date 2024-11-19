const express = require('express');
const GroupController = require('../Controllers/GroupController');
const router = express.Router();

router.get(`/invitation/:id`, GroupController.getInvitation);
router.post(`/invitation`, GroupController.createInvitation);
router.delete(`/invitation/:id`, GroupController.deleteInvitation);
router.put(`/invitation/:id`, GroupController.updateStateInvitation);

router.get('/user/:userId', GroupController.getByUserId);

router.put('/', GroupController.update);
router.delete('/:id', GroupController.delete);
router.post(`/`, GroupController.create);
router.get(`/:id`, GroupController.getById);
router.get(`/`, GroupController.getAll);

module.exports = router;