const express = require('express');
const FriendController = require('../Controllers/FriendController');
const router = express.Router();
const checkToken = require('../Middlewares/checkToken');

router.get('/user/:userId', checkToken, FriendController.getFriendsByUserId);
router.get('/invite/:friendId', checkToken, FriendController.getFriendInvitation);

router.delete('/invite', checkToken, FriendController.deleteInvitation);
router.delete(`/`, checkToken, FriendController.deleteFriend);

router.post('/accept', checkToken, FriendController.acceptFriendInvitation);

router.delete('/invite/cancel', checkToken, FriendController.cancelFriendInvitation);
router.post('/invite', checkToken, FriendController.createFriendInvitation);
module.exports = router;