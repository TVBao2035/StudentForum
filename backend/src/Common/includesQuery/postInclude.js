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
        model: db.Group,
        where: {
            isDelete: false,
        },
        attributes: ['id', 'name', 'description']
    }
]

module.exports = postInclude;