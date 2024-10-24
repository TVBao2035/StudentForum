const joi = require('joi');


const createCategoryDTO = joi.object({
    name: joi.string().required()
})

module.exports = createCategoryDTO;