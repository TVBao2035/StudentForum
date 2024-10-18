const { Op } = require("sequelize");
const db = require("../Models")

const checkGroup = (groupId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const group = await db.Group.findOne({
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