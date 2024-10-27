const joi = require("joi");

const updateCategoryDTO = joi.object({
    id: joi.number().required(),
    name: joi.string().required(),
})

module.exports = updateCategoryDTO;