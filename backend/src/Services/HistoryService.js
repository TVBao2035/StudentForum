const checkUser = require("../Common/checks/checkUser");
const { message } = require("../DTOs/HistoryDTO/createHistoryDTO");
const db = require("../Models");

class HistoryService{

    update(historyId){
        return new Promise(async (resolve, reject) => {
            try {
                const history = await db.History.findOne({
                    where: {
                        id: historyId
                    }
                });

                if(!history) return resolve({
                    status: 404,
                    message: `Không tìm thấy Id của lịch sử`
                });

                history.isRead = true;
                await history.save();
                resolve({
                    status: 200,
                    message: `Cập nhật trạng thái lịch sử thành công`
                })
            } catch (error) {
                reject({
                    status: 400,
                    message: `Lỗi cập nhật trạng thái lịch sử`
                })
            }
        })
    }

    create(reqHistory){
        return new Promise(async (resolve, reject) => {
            try {
                console.log(reqHistory);
                const user = await checkUser(reqHistory.userId);
                if (user?.status === 404) return resolve(user);
                await db.History.create(reqHistory);
            
                resolve({
                    status: 200,
                    message: `Thêm mới lịch sử thành công!`
                })
            } catch (error) {
                reject({
                    status: 400,
                    message: `Lỗi tạo mới lịch sử ${error}`
                })
            }
        })
    }

    getAllByUserId(userId){
        return new Promise(async (resolve, reject) => {
            try {
                const user = await checkUser(userId);
                if(user?.status === 404) return resolve(user);

                const data = await db.History.findAll(
                    {
                        where: {
                            userId
                        },
                        attributes: {
                            exclude: ['updatedAt', 'userId']
                        },
                        order: [
                            ['createdAt', "DESC"],
                        ],
                    }
                )

                resolve({
                    status: 200,
                    message: `Lấy tất cả lịch sử thành công`,
                    data
                })
            } catch (error) {
                reject({
                    status: 400,
                    message: `Lỗi lấy tất cả lịch sử ${error}`
                })
            }
        })
    }
}

module.exports = new HistoryService;