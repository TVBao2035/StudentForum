const express = require('express');
const FriendController = require('../Controllers/FriendController');
const router = express.Router();

router.get('/user/:userId', FriendController.getFriendsByUserId);
router.get('/invite/:friendId', FriendController.getFriendInvitation);

router.delete('/invite', FriendController.deleteInvitation);
router.delete(`/`, FriendController.deleteFriend);

router.post('/accept', FriendController.acceptFriendInvitation);
router.post('/invite', FriendController.createFriendInvitation);
module.exports = router;