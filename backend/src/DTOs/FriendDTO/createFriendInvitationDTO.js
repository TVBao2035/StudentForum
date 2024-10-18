const joi = require('joi');

const createFriendInvitation = joi.object({
    userId: joi.number().required(),
    friendId: joi.number().required(),
})

module.exports = createFriendInvitation;