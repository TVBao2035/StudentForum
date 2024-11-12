const { Op } = require("sequelize");
const db = require("../Models");
const bcrypt = require("bcryptjs/dist/bcrypt");
const hashPassword = require("../Helpers/hashPassword");
const accessToken = require("../Helpers/accessToken");
const checkUser = require("../Common/checks/checkUser");
const checkGroup = require("../Common/checks/checktGroup");

class UserService{
    
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

    getAll(){
        return new Promise(async (resolve, reject) => {
            try {
                const data = await db.User.findAll({
                    where: {
                        isDelete: false
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

    getDetails(userId){
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

                resolve({
                    status: 200,
                    message: `Lấy Chi Tiết Người Dùng Thành Công!!`,
                    data: user
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
                await db.User.create(data);
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
                await db.User.create({
                    name, email, phone, password, isAdmin: false
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