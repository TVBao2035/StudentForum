const { Op } = require("sequelize");
const db = require("../../Models");

const postInclude = [
    {
        model: db.Categorys,
        where: {
            isDelete: false,
        },
        attributes: {
            exclude: ['isDelete', 'updatedAt', 'creaedAt']
        },
    },
    {
        model: db.User,
        where: {
            isDelete: false,
        },
        attributes: ['id', 'name', 'avatar']
    },

    {
        model: db.Like,
        where: {
            isDelete: false
        },
        required: false,
        attributes: {
            exclude: ['createdAt', 'updatedAt']
        },
    }
   
]

module.exports = postInclude;