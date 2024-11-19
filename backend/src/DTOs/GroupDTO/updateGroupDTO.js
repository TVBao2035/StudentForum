const joi = require('joi');

const updateGroupDTO = joi.object({
    id: joi.number().required(),
    name: joi.string().required(),
    description: joi.string().allow(null, ""),
    image: joi.string().allow("", null),
});

module.exports = updateGroupDTO;