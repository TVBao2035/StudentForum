const joi = require('joi');

const createCommentDTO = joi.object({
    userId: joi.number().required(),
    postId: joi.number().required(),
    commentId: joi.number().allow(null, '').default(0),
    content: joi.string().allow(null, ""),
});


module.exports = createCommentDTO;