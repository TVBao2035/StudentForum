const { Op } = require('sequelize');
const db = require('../Models');
const checkGroup = require('../Common/checks/checktGroup');
const checkUser = require('../Common/checks/checkUser');
const getTimeNow = require('../Helpers/getTimeNow');
const createHistory = require('../Common/create/createHistory');
class GroupService {
    updateStateInvitation(invitationId){
        return new Promise(async (resolve, reject) => {
            try {
                const invitation = await db.GroupUser.findOne({
                    where: {
                        [Op.and]: [
                            {id: invitationId},
                            {isDelete: false}
                        ]
                    }
                });
                const group = await db.Group.findOne({
                    where: {
                        id: invitation.groupId
                    }
                })
                if(!invitation) return resolve({
                    status: 404,
                    message: 'Không tìm thấy lời mời vào nhóm với ID: ' + invitationId,
                });

                invitation.isAccept = true;
                await invitation.save();
                await createHistory({
                    userId: invitation.userId,
                    title: `Yêu cầu tham gia nhóm được chấp nhận `,
                    content: `Bạn đã là thành viên của nhóm ${group.name} lúc ${getTimeNow()}`
                });
                resolve({
                    status: 200,
                    message: `Cập nhật trạng thái của lời mời vào nhóm thành công`
                })

            } catch (error) {
                reject({
                    status: 400,
                    message:  `Lỗi cập nhật trạng thái của lời mời vào nhóm ${error}`
                })
            }
        })
    }

    deleteInvitation(invitationId){
        return new Promise(async (resolve, reject) => {
            try {
                const invitation = await db.GroupUser.findOne({
                    where: {
                        [Op.and]: [
                            {isDelete: false},
                            {id: invitationId}
                        ]
                    }
                })
                if(!invitation) return resolve({
                    status: 404,
                    message: `Không tìm thấy lời mời với ID : ${invitationId}`
                });
                
                const group = await db.Group.findOne({
                    where: {
                        id: invitation.groupId
                    }
                })
                invitation.isDelete = true;
                await invitation.save();
                await createHistory({
                    userId: invitation.userId,
                    title: `Huỷ yêu cầu tham gia nhóm `,
                    content: `Bạn hủy gửi yêu cầu tham nhóm ${group.name} lúc ${getTimeNow()}`
                });
                resolve({
                    status: 200,
                    message: `Xóa lời mời vào nhóm thành công`
                })
            } catch (error) {
                reject({
                    status: 400,
                    message: `Lỗi xóa lời mời vào nhóm ${error}`
                })
            }
        })
    }

    createInvitation(invitation){
        return new Promise(async (resolve, reject) => {
            try {
                console.log(invitation);
                const groupuser = await db.GroupUser.findOne({
                    where: {
                        userId: invitation.userId,
                        groupId: invitation.groupId
                    }
                });
                var group;
                if(groupuser && groupuser?.isDelete === false){
                    return resolve({
                        status: 404,
                        message: "Lời mời vào nhóm đã tồn tại"
                    })
                } else if(groupuser?.isDelete === true){
                    groupuser.isDelete = false;
                    groupuser.isAccept = false;
                    group = await db.Group.findOne({
                        where: {
                            id: groupuser.groupId
                        }
                    })
                    console.log(group.name);
                    await groupuser.save();
                    await createHistory({
                        userId: invitation.userId,
                        title: `Gửi yêu cầu tham gia nhóm `,
                        content: `Bạn đã gửi yêu cầu tham nhóm ${group.name} lúc ${getTimeNow()}`
                    });
                    return resolve({
                        status: 200,
                        message: 'Tạo lời mời tham gia nhóm thành công',
                    })

                }

                const data = await db.GroupUser.create(invitation);
                group = await db.Group.findOne({
                    where: {
                        id: data.groupId
                    }
                })
                data.isAccept = false;
                await data.save();
                await createHistory({
                    userId: invitation.userId,
                    title: `Gửi yêu cầu tham gia nhóm `,
                    content: `Bạn đã gửi yêu cầu tham nhóm ${group.name} lúc ${getTimeNow()}`
                });
                resolve({
                    status: 200,
                    message: 'Tạo lời mời tham gia nhóm thành công',
                })
            } catch (error) {
                reject({
                    status: 400,
                    message: `Lỗi tạo lời mời tham gia nhóm ${error}`
                })
            }
        })
    }

    getInvitation(groupId){
        return new Promise(async (resolve, reject) => {
            try {
                const group = await checkGroup(groupId);

                if(group.status === 404) return resolve(group);
                
                const data = await db.GroupUser.findAll({
                    attributes: [`createdAt`, 'groupId', 'id'],
                    where: {
                        [Op.and]:[
                            {groupId},
                            {isAccept: false},
                            {isDelete: false}
                        ]
                    },
                    include:[
                        {
                            model: db.User,
                            as: 'invitation',
                            attributes: ['id', 'name', 'avatar']
                        }
                    ],
                })
                resolve({
                    status: 200,
                    message: 'Lấy Tất Cả Lời Mời Thành Công',
                    data
                })
            } catch (error) {
                reject({
                    status: 400,
                    message: `Lỗi Lấy Tất Cả Lời Mời ${error}`
                })
            }
        })
    }

    update({id, name, description, image}, user){
        return new Promise(async(resolve, reject) => {
            try {
                const group = await checkGroup(id);
                if(group.status === 404) return resolve(group);

                group.name = name;
                group.description = description;
                group.image = image;
                await group.save();
                await createHistory({
                    userId: user.id,
                    title: `Chỉnh sửa thông tin nhóm `,
                    content: `Bạn đã chỉnh sửa thông tin nhóm ${group.name} lúc ${getTimeNow()}`
                });
                resolve({
                    status: 200,
                    message: `Cập nhật nhóm thành công`
                })
            } catch (error) {
                reject({
                    status: 400,
                    message: `Lỗi cập nhật nhóm ${error}`
                })
            }
        })
    }

    delete(groupId, user){
        return new Promise(async(resolve, reject) => {
            try {
                const group = await checkGroup(groupId);
                if(group.status === 404) return resolve(group);
                group.isDelete = true;
                await group.save();
              
                await createHistory({
                    userId: user.id,
                    title: `Xóa nhóm `,
                    content: `Bạn đã xóa nhóm ${group.name} lúc ${getTimeNow()}`
                });
                resolve({
                    status: 200,
                    message: `Xoá Nhóm Thành Công`
                })
            } catch (error) {
                reject({
                    status: 400,
                    message: `Lỗi Xóa Nhóm ${error}`
                })
            }
        })
    }

    create(group){
        return new Promise(async(resolve, reject) => {
            try {
                const newGroup = await db.Group.create(group);
                await db.GroupUser.create({
                    userId: group.userId,
                    groupId: newGroup.id,
                    isAccept: true
                })
                await createHistory({
                    userId: group.userId,
                    title: `Tạo nhóm thành công`,
                    content: `Bạn đã tạo nhóm ${group.name} thành công lúc ${getTimeNow()}`
                });
                resolve({
                    status: 200,
                    message: `Tạo Nhóm Thành Công`
                })
            } catch (error) {
                reject({
                    status: 400,
                    message: `Lỗi Tạo Nhóm ${error}`
                })
            }
        })
    }

    getById(groupId, user) {
        return new Promise(async (resolve, reject) => {
            try {
                const checkUserExitInGroup = await db.GroupUser.findOne({
                    where:{
                        [Op.and]:[
                            {groupId},
                            {userId: user.id},
                            {isAccept: true},
                            {isDelete: false}
                        ]
                    }
                });
                if(!checkUserExitInGroup){
                    return resolve({
                        status: 404,
                        message: "Bạn không có quyền truy cập vào nhóm"
                    });
                }
                const group = await checkGroup(groupId);

                if (group.status === 404) return resolve(group);

                resolve({
                    status: 200,
                    message: `Lấy Nhóm Với Id=${groupId} thành công`,
                    data: group
                })

            } catch (error) {
                reject({
                    status: 400,
                    message: `Lỗi Lấy Nhóm Với ID: ${groupId} ${error}`,
                })
            }
        })
    }

    getByUserId(userId){
        return new Promise(async (resolve, reject) => {
            try {
                const user = await checkUser(userId);
                if(user.status === 404){
                    return resolve(user);
                }
                const data = await db.Group.findAll({
                    attributes: ['id', 'name', 'description', 'image'],
                    include: [
                        {
                            model: db.GroupUser,
                            as: 'groupuser',
                            where: {
                                [Op.and]: [
                                    { isAccept: true},
                                    {userId: user.id},
                                    {isDelete: false}
                                ]
                               
                            }, 
                            required: true
                        },
                        {
                            model: db.User,
                            as: 'captain',
                            attributes: ["id"],
                            
                        }
                    ],
                    where: {
                        isDelete: false
                    }
                });

                resolve({
                    status: 200,
                    message: `Lấy tất cả nhóm thành công!`,
                    data
                })
            } catch (error) {
                reject({
                    status: 400,
                    message: `Lỗi lấy tất cả nhóm ${error}`
                })
            }
        })
    }

    getAll(search) {
        return new Promise(async (resolve, reject) => {
            try {
                var searchName = {};
                if(search.trim().length !== 0){
                    searchName = {
                        name:{ [Op.like]: `%${search.trim()}%`}
                    }
                }
                const data = await db.Group.findAll({
                    attributes: ['id', 'name', 'description', "image"],
                    include: [
                        { 
                            model: db.GroupUser, as: 'groupuser', 
                            attributes: ['userId', 'isAccept', 'id'],
                            where: {
                                isDelete: false 
                            },
                            include: { 
                                        model: db.User, as: "invitation", 
                                        where: {isDelete: false}, 
                                        attributes: ['id', 'name', 'avatar']
                                    }
                        },
                        {
                            model: db.User, as: "captain",
                            attributes: ["id", 'name', 'avatar'],
                        }
                      
                    ],
                    where: {
                        [Op.and]: [
                            { isDelete: false },
                            searchName
                        ]

                    }
                });

                resolve({
                    status: 200,
                    message: `Lấy tất cả nhóm thành công!`,
                    data
                })
            } catch (error) {
                reject({
                    status: 400,
                    message: `Lỗi lấy tất cả nhóm ${error}`
                })
            }
        })
    }
}

module.exports = new GroupService;