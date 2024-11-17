const joi = require('joi');
const createInvitationGroupDTO = joi.object({
    userId: joi.number().required(),
    groupId: joi.number().required()
})

module.exports = createInvitationGroupDTO;