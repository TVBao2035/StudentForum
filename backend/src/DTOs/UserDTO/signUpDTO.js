const joi = require('joi');


const signUpDTO = joi.object({
    name: joi.string().allow(null, ""),
    email: joi.string().email().required(),
    phone: joi.string().required(),
    password: joi.string().required(),
})

module.exports = signUpDTO;