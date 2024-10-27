const { Op } = require("sequelize");
const db = require("../../Models");
const postInclude = require("../includesQuery/postInclude");

const checkGroup = (groupId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const group = await db.Group.findOne({
                attributes: ['id', 'name', 'description'],
                include: [
                    {
                        model: db.User,
                        attributes: ['id', 'name', 'avatar'],
                        where: {
                            isDelete: false
                        },
                        required: false
                    },
                    {
                        model: db.Post,
                        attributes: ['id', 'content', 'image', 'createdAt'],
                        include: postInclude
                    }
                ],
                where: {
                    [Op.and]: [{ id: groupId }, { isDelete: false }]
                }
            });

            if (!group) {
                return resolve({
                    status: 404,
                    message: `Không Tìm Thấy Nhóm Với ID: ${groupId}`
                });
            }

            resolve(group);
        } catch (error) {
            reject(`Error Check Group ${error}`);
        }
    })
}

module.exports = checkGroup;