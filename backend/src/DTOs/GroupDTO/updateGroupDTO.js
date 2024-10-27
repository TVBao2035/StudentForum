const joi = require('joi');
const { describe } = require('./createGroupDTO');
const updateGroupDTO = joi.object({
    id: joi.number().required(),
    name: joi.string().required(),
    description: joi.string().allow(null, "")
});

module.exports = updateGroupDTO;