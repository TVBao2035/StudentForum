const joi = require('joi');

const updatePostDTO = joi.object({
    categoryId: joi.number().required(),
    content: joi.string().allow(null, ''),
    image: joi.string().allow(null, '')
});

module.exports = updatePostDTO;