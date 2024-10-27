const { Op } = require("sequelize")
const db = require("../Models");
const checkUser = require("../Common/checks/checkUser");

class FriendService{
    getFriendsByUserId(userId){
        return new Promise(async(resolve, reject) => {
            try {
                const user = await checkUser(userId);
                if (user?.status === 404) {
                    return resolve(user);
                }

                const data =  await db.Friend.findAll({
                    where: {
                        [Op.and]: [
                            { userId }, 
                            { isDelete: false }, 
                            { isAccept: true}
                        ]
                    },
                    attributes: ['id'],
                    include:[
                        {
                            model: db.User,
                            where:{
                                isDelete:false
                            },
                            attributes: ['id', 'name', 'avatar']
                        }
                    ]
                })

                resolve({
                    status: 200,
                    message: `Lấy Tất Cả Bàn Bè Theo Id Của Dùng Thành Công`,
                    data
                })
            } catch (error) {
                reject({
                    status: 400,
                    message: `Error Get Friends By User Id ${error}`
                })
            }
        })
    }

    getFriendInvitation(friendId){
        return new Promise(async (resolve, reject) => {
            try {
                const user = await checkUser(friendId);
                if (user?.status === 404) {
                    return resolve(user);
                }
                const data = await db.Friend.findAll({
                    where: {
                        [Op.and]: [
                            { friendId },
                            { isDelete: false },
                            { isAccept: false }
                        ]
                    },
                    attributes: ['id', 'userId', 'friendId', 'createdAt']
                });
                resolve({
                    status: 200,
                    message: `Lấy Tất Cả Lời Mời Thành Công`,
                    data
                })
            } catch (error) {
                reject({
                    status: 400,
                    message: `Error Get Friend Invitation ${error}`
                })
            }
        })
    }

    createFriendInvitation({userId, friendId}){
        return new Promise(async(resolve, reject) => {
            try {
                const user = await checkUser(userId);
                if (user?.status === 404) {
                    return resolve(user);
                }
                const friend = await checkUser(friendId);
                if (friend?.status === 404) {
                    return resolve(friend)
                }
                
                const invitation = await db.Friend.findOne({
                    where: {
                        [Op.and]: [
                            {userId}, {friendId}
                        ]
                    }
                });
                // check invitation is existing
                if(invitation && invitation.isDelete === false){
                    return resolve({
                        status: 404,
                        message: `Lời Mời Kết Bạn Đã Tồn Tại`
                    }) 
                }
                // if invitation has deleted then update isDelete = false and isAccept = false;
                if(invitation && invitation.isDelete){
                    invitation.isDelete = false;
                    invitation.isAccept = false;
                    await invitation.save();
                    return resolve({
                        status: 200,
                        message: `Tạo Lời Mời Kết Bạn Thành Công`
                    })
                }

                await db.Friend.create({
                    friendId, userId
                });
                resolve({
                    status: 200,
                    message: `Tạo Lời Mời Kết Bạn Thành Công`
                })
            } catch (error) {
                reject({
                    status: 400,
                    message: `Errror Create Friend Invitation ${error}`
                })
            }
        })
    }

    acceptFriendInvitation({userId, friendId, id}){
        return new Promise(async(resolve, reject) => {
            try {
                const user = await checkUser(userId);
                if (user?.status === 404) {
                    return resolve(user);
                }

                const friend = await checkUser(friendId);
                if (friend?.status === 404) {
                    return resolve(friend)
                }

                const isInvitationExisting = await db.Friend.findOne({
                    where: {
                        [Op.and]: [
                            { userId }, { friendId }
                        ]
                    }
                });
                // check invitation is existing
                if (isInvitationExisting && isInvitationExisting.isDelete === false) {
                    return resolve({
                        status: 404,
                        message: `Lời Mời Kết Bạn Đã Tồn Tại`
                    })
                }
                // if invitation has deleted then update isDelete = false and isAccept = false;
                if (isInvitationExisting && isInvitationExisting.isDelete) {
                    isInvitationExisting.isDelete = false;
                    isInvitationExisting.isAccept = false;
                    await isInvitationExisting.save();
                    return resolve({
                        status: 200,
                        message: `Tạo Lời Mời Kết Bạn Thành Công`
                    })
                }
                const invitation = await db.Friend.findOne({
                    where: {
                        id
                    }
                })
                if(!invitation){
                    return resolve({
                        status: 404,
                        message: `NKhông Tìm Thấy Lời Mời Vơi Id: ${id}`
                    })
                }

                invitation.isAccept = true;
                await invitation.save();
                await db.Friend.create({
                    userId, friendId, 
                    isAccept: true
                });
                resolve({
                    status: 200,
                    message: `Chấp Nhận Lời Mời Thành Công`,
                });
            } catch (error) {
                reject({
                    status: 400,
                    messsage: `Error Accepting Invitation ${error}`
                })
            }
        })
    }
}

module.exports = new FriendService;