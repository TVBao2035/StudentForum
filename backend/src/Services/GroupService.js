const { Op, col } = require('sequelize');
const db = require('../Models');
const checkGroup = require('../Common/checks/checktGroup');
const checkUser = require('../Common/checks/checkUser');
const { message } = require('../DTOs/GroupDTO/createGroupDTO');

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

                if(!invitation) return resolve({
                    status: 404,
                    message: 'Không tìm thấy lời mời vào nhóm với ID: ' + invitationId,
                });

                invitation.isAccept = true;
                await invitation.save();
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

                invitation.isDelete = true;
                await invitation.save();
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
                const groupuser = await db.GroupUser.findOne({
                    where: {
                        userId: invitation.userId,
                        groupId: invitation.groupId
                    }
                });

                if(groupuser && groupuser?.isDelete === false){
                    return resolve({
                        status: 404,
                        message: "Lời mời vào nhóm đã tồn tại"
                    })
                } else if(groupuser?.isDelete === true){
                    groupuser.isDelete = false;
                    groupuser.isAccept = false;
                    await groupuser.save();
                    return resolve({
                        status: 200,
                        message: 'Tạo lời mời tham gia nhóm thành công',
                    })

                }

                const data = await db.GroupUser.create(invitation);
                data.isAccept = false;
                await data.save();
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

    update({id, name, description, image}){
        return new Promise(async(resolve, reject) => {
            try {
                const group = await checkGroup(id);
                if(group.status === 404) return resolve(group);

                group.name = name;
                group.description = description;
                group.image = image;
                await group.save();
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

    delete(groupId){
        return new Promise(async(resolve, reject) => {
            try {
                const group = await checkGroup(groupId);
                if(group.status === 404) return resolve(group);
                group.isDelete = true;
                await group.save();
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

    getById(groupId) {
        return new Promise(async (resolve, reject) => {
            try {
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

    getAll() {
        return new Promise(async (resolve, reject) => {
            try {
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
}

module.exports = new GroupService;