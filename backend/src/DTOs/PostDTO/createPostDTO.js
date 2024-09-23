const joi = require('joi');

const createPostDTO = joi.object({
    userId: joi.number().required(),
    groupId: joi.number().allow(null, ''),
    categoryId: joi.number().required(),
    content: joi.string().required(),
    image: joi.string().allow(null, '')
})

module.exports = createPostDTO;