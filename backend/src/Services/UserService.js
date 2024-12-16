const { Op } = require("sequelize");
const db = require("../Models");
const bcrypt = require("bcryptjs/dist/bcrypt");
const hashPassword = require("../Helpers/hashPassword");
const accessToken = require("../Helpers/accessToken");
const checkUser = require("../Common/checks/checkUser");
const checkGroup = require("../Common/checks/checktGroup");
const createHistory = require("../Common/create/createHistory");
const getTimeNow = require("../Helpers/getTimeNow");
const { message } = require("../DTOs/UserDTO/createUserDTO");

class UserService{
    
    changePassword(password, userId){
        return new Promise(async (resolve, reject) => {
            try {
                const user = await checkUser(userId);
                if(user.status === 404) return resolve(user);
                console.log(user.password);
                const checkPassword = bcrypt.compareSync(password.currentPassword, user.password);
                if (!checkPassword) {
                    return resolve({
                        status: 404,
                        message: "Password hiện tại không đúng"
                    })
                }
               
                const newPassword =  hashPassword(password.newPassword);

                user.password = newPassword;
                await user.save();
                await createHistory({userId, title: "Thay Đổi Password", content: `Bạn đã thay đổ Password lúc ${getTimeNow()}`})
                resolve({
                    status: 200,
                    message: `Thay Đổi Password Thành Công`
                })
            } catch (error) {
                reject({
                    status: 400,
                    message: `Lỗi Thay đổi Password ${error}`
                })
            }
        })
    }

    getByGroupId(groupId){
        return new Promise(async(resolve, reject) => {
            try {
                const group = await checkGroup(groupId);
                if(group.status === 404) return resolve(group);

                const data = await db.User.findAll({
                    attributes: ["id", "name", "phone", "email", "avatar", "isAdmin"],
                    where: { isDelete: false },
                    include: {
                        model: db.Group,
                        as: "members",
                        where: {
                            [Op.and]: [
                                {isDelete: false},
                                {id: groupId}
                            ]
                        }
                    }
                });
                resolve({
                    status: 200,
                    message: `Lấy tất cả thành viên nhóm thành công`,
                    data
                })
            } catch (error) {
                reject({
                    status: 400,
                    message: `Lỗi lấy tất cả thành viên nhóm ${error}`
                })
            }
        })
    }

    getAll(search){
        return new Promise(async (resolve, reject) => {
            try {
                var searchName = {}
                if(search.trim().length !== 0){
                    searchName = {
                        [Op.or]:[
                            {
                                name: {[Op.like]:`%${search.trim()}%`}
                            },
                            {
                                email: { [Op.like]: `%${search.trim()}%` }
                            },
                            {
                                phone: { [Op.like]: `%${search.trim()}%` }
                            }
                        ]
                      
                    }
                }
                const data = await db.User.findAll({
                    where: {
                        [Op.and]:[
                            {isDelete: false},
                            searchName
                        ]
                    },
                    attributes: {
                        exclude: ['password', 'isDelete']
                    }
                });
                resolve({
                    status: 200,
                    message: `Lấy Tất Cả Người Dùng Thành Công`,
                    data
                })
            } catch (error) {
                reject({
                    status: 400,
                    message: `Error Get All User ${error}`
                })
            }
        })
    }

    getDetails(userId, userReq){
        
        return new Promise(async(resolve, reject) => {
            try {
                const user = await db.User.findOne({
                    where: {
                        [Op.and]: [{id: userId}, {isDelete: false}]
                    },
                    attributes: {
                        exclude: ['password', 'isAdmin', 'isDelete', 'createdAt', 'updatedAt']
                    },
                })
                if(!user){
                    return resolve({
                        status: 404,
                        message: `Không Tìm Thấy Người Dùng Với ID: ${userId}`
                    })
                }

                let isOwner = user.id === userReq.id;
                let isFriend = false;
                let isSending = false;
                let isWaitAccept = false;
                if(!isOwner)
                {
                    const friends = await db.Friend.findAll({
                        where: {
                            [Op.and]: [
                                {userId: userReq.id}, 
                                { isDelete: false },
                            ]
                        }
                    });

                    isFriend = friends.some(friend => friend.friendId === user.id && friend.isAccept === true);
                   
                    if(!isFriend){
                        isSending = friends.some(friend => friend.friendId === user.id && friend.isAccept === false);
                        const invitations = await db.Friend.findAll({
                            where: {
                                [Op.and]: [
                                    { userId: user.id },
                                    { isDelete: false },
                                    { isAccept: false }
                                ]
                            }
                        })

                        isWaitAccept = invitations.some(invitation => invitation.friendId === userReq.id);
                    }
                }

                resolve({
                    status: 200,
                    message: `Lấy Chi Tiết Người Dùng Thành Công!!`,
                    data: {
                        ...user.dataValues,
                        isOwner,
                        isFriend,
                        isSending,
                        isWaitAccept
                    }
                })

            } catch (error) {
                reject ({
                    status: 400,
                    message: `Error Get Details User ${error}`
                })
            }
        })
    }

    create(data) {
        return new Promise(async (resolve, reject) => {
            try {
                const checkEmail = await db.User.findOne({
                    where: {
                        [Op.and]: [{ email: data.email }, { isDelete: false }]
                    }
                })

                if (checkEmail) {
                    return resolve({
                        status: 404,
                        message: `Email đã tồn tại!!`
                    })
                }

                const checkPhone = await db.User.findOne({
                    where: {
                        [Op.and]: [{ phone: data.phone }, { isDelete: false }]
                    }
                })

                if (checkPhone) {
                    return resolve({
                        status: 404,
                        message: `Phone đã tồn tại!!`
                    })
                }
                data.password = hashPassword(data.password);
                const newUser = await db.User.create(data);
                createHistory({
                    userId: newUser.id,
                    title: `Tài khoản mới`,
                    content: `Bạn đã đăng ký tài khoản thành công tên tài khoản là ${newUser.email} được tạo lúc ${getTimeNow()} `
                })
                resolve({
                    status: 200,
                    message: `Tạo Người Thành Công!!`
                })
            } catch (error) {
                reject({
                    status: 400,
                    message: `Error Create User ${error}`
                })
            }
        })
    }

    udpate(data, userId) {
        return new Promise(async (resolve, reject) => {
            try {
                const user = await checkUser(userId);
                if (user?.status === 404) {
                    return resolve(user);
                }


                user.email = data.email;
                user.phone = data.phone;
                user.name = data.name;
                user.avatar = data.avatar;
                await user.save();
                createHistory({
                    userId,
                    title: `Cập nhật thông tin tài khoản`,
                    content: `Bạn đã cập nhật thông tin tài khoản lúc ${getTimeNow()}`
                })
                resolve({
                    status: 200,
                    message: `Cập Nhật Người Dùng Thành Công!`
                })
            } catch (error) {
                reject({
                    status: 400,
                    message: `Error Update User ${error}`
                })
            }
        })
    }

    delete(userId) {
        return new Promise(async (resolve, reject) => {
            try {
                const user = await checkUser(userId);

                if (user?.status === 404) {
                    return resolve(user);
                }

                user.isDelete = true;
                await user.save();
                resolve({
                    status: 200,
                    message: `Xóa Người Dùng Thành Công`
                })

            } catch (error) {
                reject({
                    status: 400,
                    message: `Error Delete User ${error}`
                })
            }
        })
    }

    refresh(data){
        return new Promise(async (resolve, reject) => {
            try {
                const user = await checkUser(data.id);

                if(user?.status === 404){
                    return resolve(user)
                }

                resolve({
                    status: 200,
                    message: `Làm Mới Thành Công`,
                    data: {
                        accessToken: accessToken(user),
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        phone: user.phone,
                        isAdmin: user.isAdmin,
                        avatar: user.avatar
                    }
                })
            } catch (error) {
                reject({
                    status: 400,
                    messgage: `Error Refresh!!!`
                })
            }
        })
    }

    signIn({email, password}){
        return new Promise(async(resolve, reject) => {
            try {
                const user = await db.User.findOne({
                    where: {
                        [Op.and]: [{ email}, { isDelete: false }]
                    },
                })
             
                if(!user){
                   
                    return resolve({
                        status: 404,
                        message: `Tài Khoản Chưa Được Đăng Kí!`,
                        data: "email"
                    })
                }
             
                const checkPassword = bcrypt.compareSync(password, user.password);
                if(!checkPassword){
                    return resolve({
                        status: 404,
                        message: `Mật Khẩu Sai!!`,
                        data: "password"
                    })
                }
               
                createHistory({ userId: user.id, title: "Đăng nhập", content: `Bạn đã đăng nhập vào tài khoản ${user.email} lúc ${getTimeNow()}` })
                resolve({
                    status: 200,
                    message: `Đăng Nhập Thành Công!!`,
                    data: {
                        accessToken: accessToken(user),
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        phone: user.phone,
                        isAdmin: user.isAdmin,
                        avatar: user.avatar
                    }
                })

            } catch (error) {
                reject({
                    status: 400,
                    message: `Error Sign In ${error}`
                })
            }
        })
    }

    signUp({name, email, phone, password}){
        return new Promise(async(resolve, reject) => {
            try {
                const checkEmail = await db.User.findOne({
                    where: {
                        [Op.and]: [{ email }, { isDelete: false }]
                    }
                })
                if(checkEmail){
                    return resolve({
                        status: 404,
                        message: `Email Đã Tồn Tại!!`
                    })
                }
                const checkPhone = await db.User.findOne({
                    where: {
                        [Op.and]: [{ phone }, { isDelete: false }]
                    }
                })
                if(checkPhone){
                    return resolve({
                        status: 404,
                        message: `Phone Đã Tồn Tại!!`
                    })
                }
                password = hashPassword(password);
                const newUser = await db.User.create({
                    name, email, phone, password, isAdmin: false
                })
                createHistory({
                    userId: newUser.id,
                    title: `Tài khoản mới`,
                    content: `Bạn đã đăng ký tài khoản thành công tên tài khoản là ${newUser.email} được tạo lúc ${getTimeNow()} `
                })
                resolve({
                    status: 200,
                    message: `Tạo Người Dùng Thành Công!`
                })
            } catch (error) {
                reject({
                    status: 400,
                    message: `Error Create User ${error}`
                })
            }
        })
    }
    
    
}

module.exports = new UserService;