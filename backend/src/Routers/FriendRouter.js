const express = require('express');
const FriendController = require('../Controllers/FriendController');
const router = express.Router();

router.get('/user/:userId', FriendController.getFriendsByUserId);
router.get('/invite/:friendId', FriendController.getFriendInvitation);
router.post('/invite', FriendController.createFriendInvitation);
router.post('/accept', FriendController.acceptFriendInvitation);
module.exports = router;