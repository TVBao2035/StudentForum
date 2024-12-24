const { Op } = require("sequelize")
const db = require("../Models");
const checkUser = require("../Common/checks/checkUser");
const checkInvitation = require("../Common/checks/checkInvitation");
const createHistory = require('../Common/create/createHistory');
const getTimeNow = require("../Helpers/getTimeNow");

class FriendService{
    deleteInvitation(userId, friendId){
        return new Promise(async (resolve, reject) => {
            try {
                const user = await checkUser(userId);
                if (user?.status === 404) {
                    return resolve(user);
                }

                const friend = await checkUser(friendId);
                if (friend?.status === 404) {
                    return resolve(user);
                }

                const invitation = await db.Friend.findOne({
                    where: {
                        [Op.and]: [
                            { userId },
                            { friendId },
                            {isDelete: false}
                        ]
                    }
                })
                if (!invitation) 
                    return resolve({
                        status: 404,
                        message: `Lời mời không tồn tại`
                    })
                
                invitation.isDelete = true;
                await invitation.save();
               
                await createHistory({
                    userId: invitation.friendId,
                    title: `Không chấp nhận yêu cầu kết bạn `,
                    content: `Bạn không chấp nhận yêu câu kết bạn với ${user.name} lúc ${getTimeNow()}`
                });
                await createHistory({
                    userId: invitation.userId,
                    title: `Yêu cầu kết bạn bị trừ chối`,
                    content: `${friend.name} đã hủy yêu câu kết bạn lúc ${getTimeNow()}`
                })
                    resolve({
                        status: 200,
                        message: `Xóa lời mời thành công`
                    })
            } catch (error) {
                reject({
                    status: 400,
                    message: "Lỗi xóa lời mời" + error
                })
            }
        })
    }
    
    deleteFriend(userId, friendId){
        return new Promise ( async(resolve, reject) => {
            try {
                const user = await checkUser(userId);
                if (user?.status === 404) {
                    return resolve(user);
                }

                const friend = await checkUser(friendId);
                if (friend?.status === 404) {
                    return resolve(user);
                }

                const userInvitation = await db.Friend.findOne({
                    where: {
                        [Op.and]: [
                            {userId},
                            {friendId},
                            {isDelete: false},
                        ]
                    }
                })

                if(!userInvitation){
                    return resolve({
                        status: 404,
                        message: `Lời mời không tồn tại`
                    })
                }
                const friendInvitation = await db.Friend.findOne({
                    where: {
                        [Op.and] : [
                            {userId: friendId},
                            {friendId: userId},
                            {isDelete: false}
                        ]
                    }
                })
                if (!friendInvitation) {
                    return resolve({
                        status: 404,
                        message: `Lời mời không tồn tại`
                    })
                }
                
                userInvitation.isDelete = true;
                friendInvitation.isDelete = true;

                await userInvitation.save();
                await friendInvitation.save();
                await createHistory({
                    userId: userInvitation.userId,
                    title: `Xóa kết bạn `,
                    content: ` Bạn xóa kết bạn với ${friend.name} lúc ${getTimeNow()}`
                });
                await createHistory({
                    userId: userInvitation.friendId,
                    title: `Xóa kết bạn`,
                    content: `${user.name} đã xóa kết bạn với bạn lúc ${getTimeNow()}`
                })
                resolve({
                    status: 200,
                    message: `Xóa bạn thành công`
                })

            } catch (error) {
                reject({
                    status: 400,
                    message: 'Lỗi xóa lời mời' + error
                })
            }
        })
    }

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
                            as: "yourFriend",
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
                    include: [
                        {
                            model: db.User,
                            as: "user",
                            attributes: ['id', 'name', 'avatar']
                            
                        }
                    ],
                    attributes: ['id', 'createdAt']
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
                console.log(userId, friendId);
                const user = await checkUser(userId);
                if (user?.status === 404) {
                    return resolve(user);
                }
                console.log(user.id);
                const friend = await checkUser(friendId);
                if (friend?.status === 404) {
                    return resolve(friend)
                }
                console.log(friend.id);
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
                await createHistory({
                    userId,
                    title: `Bạn đã gửi yêu cầu kết bạn `,
                    content: `Bạn đã gửi yêu câu kết bạn ${friend.name} lúc ${getTimeNow()}`
                });
                await createHistory({
                    userId: friendId,
                    title: `Lời mời kết bạn`,
                    content: `${user.name} đã gửi yêu câu kết bạn tới bạn lúc ${getTimeNow()}`
                })
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

                var invitation;

                if(id){
                    invitation = await db.Friend.findOne({
                        where: {
                            [Op.and]: [
                                {id},
                                {isDelete: false}
                            ]
                        }
                    })

                }else{
                    invitation = await db.Friend.findOne({
                        where: {
                            [Op.and]: [
                                {userId: friendId},
                                {friendId: userId},
                                {isDelete: false}
                            ]
                        }
                    })
                    
                }
                
                if (!invitation) {
                    return resolve({
                        status: 404,
                        message: `NKhông Tìm Thấy Lời Mời Vơi Id: ${id}`
                    })
                }

                const isInvitationExisting = await db.Friend.findOne({
                    where: {
                        [Op.and]: [
                            { userId }, { friendId }
                        ]
                    }
                });

                
                // check invitation is existing
                if (isInvitationExisting && isInvitationExisting.isDelete === false && isInvitationExisting.isAccept === true) {
                    return resolve({
                        status: 404,
                        message: `Lời Mời Kết Bạn Đã Tồn Tại`
                    })
                }
                await createHistory({
                    userId: user.id,
                    title: `Chấp nhận yêu cầu kết bạn `,
                    content: ` Bạn đã chấp nhận yêu câu kết bạn với ${friend.name} lúc ${getTimeNow()}`
                });
                await createHistory({
                    userId: friend.id,
                    title: `Yêu cầu kết bạn được chấp nhận`,
                    content: `${user.name} đã chấp nhận yêu câu kết bạn với bạn lúc ${getTimeNow()}`
                })
                // check again !!!!!!!!!
                if (isInvitationExisting && isInvitationExisting.isDelete === false && isInvitationExisting.isAccept === false) {
                    isInvitationExisting.isAccept = true;
                    invitation.isAccept = true;
                    await invitation.save();
                    await isInvitationExisting.save();
                    return resolve({
                        status: 200,
                        message: `Chấp nhận Lời Mời Kết Bạn Thành Công`
                    })
                }
                
                // if invitation has deleted then update isDelete = false and isAccept = true;
                if (isInvitationExisting && isInvitationExisting.isDelete) {
                    isInvitationExisting.isDelete = false;
                    isInvitationExisting.isAccept = true;
                    invitation.isAccept = true;
                    await invitation.save();
                    await isInvitationExisting.save();
                    return resolve({
                        status: 200,
                        message: `Chấp nhận Lời Mời Kết Bạn Thành Công`
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

    cancelFriendInvitation({userId, friendId}){
        return new Promise(async(resolve, reject) => {
            try {
                const user = await checkUser(userId);
                if (user?.status === 404) {
                    return resolve(user);
                }

                const friend = await checkUser(friendId);
                if (friend?.status === 404) {
                    return resolve(user);
                }

                const invitation = await db.Friend.findOne({
                    where: {
                        [Op.and]: [
                            { userId },
                            { friendId },
                            { isDelete: false }
                        ]
                    }
                })
                if (!invitation)
                    return resolve({
                        status: 404,
                        message: `Lời mời không tồn tại`
                    })
                invitation.isDelete = true;
                await invitation.save();
                await createHistory({
                    userId: invitation.userId,
                    title: `Thu hồi yêu cầu kết bạn `,
                    content: ` Bạn đã thu hồi yêu câu kết bạn với ${friend.name} lúc ${getTimeNow()}`
                });
                await createHistory({
                    userId: invitation.friendId,
                    title: `Thu hồi yêu cầu kết bạn`,
                    content: `${user.name} đã thu hồi yêu câu kết bạn với bạn lúc ${getTimeNow()}`
                })
                resolve({
                    status: 200,
                    message: `Xóa Lời Mời Thành Công`
                })
            } catch (error) {
                reject({
                    status: 400,
                    message: `Lỗi Xóa Lời Mời ${error}`
                })
            }
        })
    }
}

module.exports = new FriendService;