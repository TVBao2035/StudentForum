const joi = require('joi');

const signInDTO = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required()
})

module.exports = signInDTO;