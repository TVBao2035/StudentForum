const joi = require('joi');

const updateUserDTO = joi.object({
    name: joi.string().allow(null, ""),
    email: joi.string().email().required(),
    phone: joi.string().required(),
    avatar: joi.string().required(),
});

module.exports = updateUserDTO;