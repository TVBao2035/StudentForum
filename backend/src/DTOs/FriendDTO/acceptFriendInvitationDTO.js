const joi = require('joi');

const acceptFriendInvitation = joi.object({
    id: joi.number().required(),
    userId: joi.number().required(),
    friendId: joi.number().required(),
});

module.exports = acceptFriendInvitation;