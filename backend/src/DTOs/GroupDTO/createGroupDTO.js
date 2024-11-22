const joi = require('joi');
const createGroupDTO = joi.object({
    name: joi.string().required(),
    description: joi.string().allow(null, ""),
    image: joi.string().allow(null, ""),
    userId: joi.number().required()
})

module.exports= createGroupDTO;