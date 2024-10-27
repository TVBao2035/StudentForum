const joi = require('joi');
const createGroupDTO = joi.object({
    name: joi.string().required(),
    description: joi.string().allow(null, "")
})

module.exports= createGroupDTO;