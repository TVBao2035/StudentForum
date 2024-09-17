const joi = require('joi');

const createUserDTO = joi.object({
    name: joi.string().allow(null, ""),
    email: joi.string().email().required(),
    phone: joi.string().required(),
    avatar: joi.string().allow(null, ""),
    password: joi.string().required()
})

module.exports = createUserDTO;