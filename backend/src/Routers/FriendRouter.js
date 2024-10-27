const express = require('express');
const FriendController = require('../Controllers/FriendController');
const router = express.Router();

router.get('/user/:userId', FriendController.getFriendsByUserId);
router.get('/invite/:friendId', FriendController.getFriendInvitation);
router.post('/accept', FriendController.acceptFriendInvitation);
router.post('/invite', FriendController.createFriendInvitation);
module.exports = router;