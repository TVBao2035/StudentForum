const joi = require('joi');

const createLikeDTO = joi.object({
    postId: joi.number().allow(null, ''),
    commentId: joi.number().allow(null, ''),
    userId: joi.number().required(),
});

module.exports = createLikeDTO;