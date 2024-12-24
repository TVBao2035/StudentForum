const express = require('express');
const GroupController = require('../Controllers/GroupController');
const router = express.Router();
const checkToken = require('../Middlewares/checkToken');

router.get(`/invitation/:id`,checkToken, GroupController.getInvitation);
router.post(`/invitation`,checkToken, GroupController.createInvitation);
router.delete(`/invitation/:id`,checkToken, GroupController.deleteInvitation);
router.put(`/invitation/:id`,checkToken, GroupController.updateStateInvitation);

router.get('/user/:userId',checkToken, GroupController.getByUserId);

router.put('/',checkToken, GroupController.update);
router.delete('/:id',checkToken, GroupController.delete);
router.post(`/`,checkToken, GroupController.create);
router.get(`/:id`,checkToken, GroupController.getById);
router.get(`/`,checkToken, GroupController.getAll);

module.exports = router;