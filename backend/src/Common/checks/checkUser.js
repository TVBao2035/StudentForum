const { Op } = require('sequelize');
const db = require('../../Models');

const checkUser = (userId) => {

    return new Promise(async(resolve, reject) => {
        try {
            const user = await db.User.findOne({
                where: {
                    [Op.and]: [
                        {id: userId}, {isDelete: false}
                    ]
                }
            });
            if(!user){
                return resolve({
                    status: 404,
                    message: `Không Tìm Thấy Người Dùng: ${userId}`
                })
            }
            return resolve(user)
        } catch (error) {
            reject(`Error Check User ${error}`)
        }
    })
}

module.exports = checkUser;