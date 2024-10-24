const { Op } = require("sequelize");
const db = require("../Models")

const checkCategory = (categoryId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const category = await db.Categorys.findOne({
                attributes: ['id', 'name'],
                where: {
                    [Op.and]: [{ id: categoryId }, { isDelete: false }]
                }
            });

            if (!category) {
                return resolve({
                    status: 404,
                    message: `Không Tìm Thấy Loại Bài Đăng Với ID : ${categoryId}`
                });
            }

            resolve(category);
        } catch (error) {
            reject(`Error Check Category ${error}`);
        }
    })
}

module.exports = checkCategory;