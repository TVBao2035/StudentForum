const express = require('express');
const FriendController = require('../Controllers/FriendController');
const router = express.Router();

router.get('/user/:userId', FriendController.getFriendsByUserId);
router.get('/invite/:friendId', FriendController.getFriendInvitation);
router.post('/accept', FriendController.acceptFriendInvitation);

router.delete('/invite/:id', FriendController.deleteFriendInvitation);
router.post('/invite', FriendController.createFriendInvitation);
module.exports = router;