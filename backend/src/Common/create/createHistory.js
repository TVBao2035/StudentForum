const db = require("../../Models");

const createHistory =  ({userId, title, content}) => {
    return new Promise(async (resolve, reject) => {
        try {
            await db.History.create({
                userId,
                title,
                content
            })
            resolve({
                status: 200,
                message: `Tạo lịch thành công`
            })
        } catch (error) {
            reject({
                status: 400,
                message: `Tạo lịch sử thất bại`
            })
        }
    })
}

module.exports = createHistory;