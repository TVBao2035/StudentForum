const joi = require('joi');

const createHistoryDTO = joi.object({
    userId: joi.number().required(),
    content: joi.string().allow(null, "")
})

module.exports = createHistoryDTO;