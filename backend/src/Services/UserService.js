const bcrypt = require("bcryptjs/dist/bcrypt");
const hashPassword = require("../Helpers/hashPassword");
const db = require("../Models");
const accessToken = require("../Helpers/accessToken");
const { where, Op } = require("sequelize");

class UserService{
    create(data){
        return new Promise(async(resolve, reject) => {
            try {
                const checkEmail = await db.User.findOne({
                    where: {
                        [Op.and]: [{email: data.email}, {isDelete: false}]
                    }
                })

                if(checkEmail){
                    return resolve({
                        status: 404,
                        message: `Email is Existing!!`
                    })
                }

                const checkPhone = await db.User.findOne({
                    where: {
                        [Op.and]: [{phone: data.phone}, {isDelete: false}]
                    }
                })

                if(checkPhone){
                    return resolve({
                        status: 404,
                        message: `Phone is Existing!!`
                    })
                }
                data.password = hashPassword(data.password);
                await db.User.create(data);
                resolve({
                    status: 200,
                    message: `Create User Success!!`
                })
            } catch (error) {
                reject({
                    status: 404,
                    message: `Error Create User ${error}`
                })
            }
        })
    }
    
    udpate(data, userId){
        return new Promise(async (resolve, reject) => {
            try {
                const user = await db.User.findOne({
                    where: {
                        [Op.and]: [{id: userId}, {isDelete: false}]
                    }
                })

                if(!user){
                    return resolve({
                        status: 404,
                        message: `Not Found User With Id: ${userId}`
                    })
                }

                user.email = data.email;
                user.phone = data.phone;
                user.name = data.name;
                user.avatar = data.avatar;
                await user.save();
                resolve({
                    status: 200,
                    message: `Update User Success!`
                })
            } catch (error) {
                reject({
                    status: 404,
                    message: `Error Update User ${error}`
                })
            }
        })
    }

    delete(userId){
        return new Promise(async (resolve, reject) => {
            try {
                const user = await db.User.findOne({
                    where: {
                        [Op.and]: [{id: userId}, {isDelete: false}]
                    }
                });

                if(!user){
                    return resolve({
                        status: 404,
                        message: `Not Found User With Id: ${userId}`
                    })
                }

                user.isDelete = true;
                await user.save();
                resolve({
                    status: 200,
                    message: `Delete User Success`
                })

            } catch (error) {
                reject({
                    status: 404,
                    message: `Error Delete User ${error}`
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
                    message: `Get All User Success!!`,
                    data
                })
            } catch (error) {
                reject({
                    status: 404,
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
                    include: [
                        {
                            model: db.User,
                            as: "friends",
                            attributes: {
                                exclude: ['password', 'isAdmin', 'isDelete', 'createdAt', 'updatedAt']
                            },
                        },
                        {
                            model: db.Post,
                            include: [
                                {
                                    model: db.Categorys,
                                    attributes: ['name']
                                },
                                {
                                    model: db.User,
                                    attributes: {
                                        exclude: ['password', 'isAdmin', 'isDelete', 'createdAt', 'updatedAt']
                                    },
                                },
                            ],
                            attributes: {
                                exclude: ['isDelete', 'categoryId', 'updatedAt', 'userId']
                            }
                        }
                    ]
                })

                if(!user){
                    return resolve({
                        status: 404,
                        message: `Not Found User By Id: ${userId}`
                    })
                }

                resolve({
                    status: 200,
                    message: `Get Details User Success!!`,
                    data: user
                })

            } catch (error) {
                reject ({
                    status: 404,
                    message: `Error Get Details User ${error}`
                })
            }
        })
    }

    refresh(data){
        return new Promise(async (resolve, reject) => {
            try {
                const user = await db.User.findOne({
                    where: {
                        [Op.and]: [{ id: data.id }, { isDelete: false }]
                    }
                })

                if(!user){
                    return resolve({
                        status: 404,
                        message: `Not Found User!!`
                    })
                }

                resolve({
                    status: 200,
                    message: `Refresh Success`,
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
                    status: 404,
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
                        message: `Account Is Not Resgiter!!`,
                        data: "email"
                    })
                }
             
                const checkPassword = bcrypt.compareSync(password, user.password);
                if(!checkPassword){
                    return resolve({
                        status: 404,
                        message: `Password Is Wrong!!`,
                        data: "password"
                    })
                }
                resolve({
                    status: 200,
                    message: `Sign In Success!!`,
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
                    status: 404,
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
                        message: `Email Is Existing!!`
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
                        message: `Phone Is Existing!!`
                    })
                }
                password = hashPassword(password);
                await db.User.create({
                    name, email, phone, password, isAdmin: false
                })

                resolve({
                    status: 200,
                    message: `Create User Success!`
                })
            } catch (error) {
                reject({
                    status: 404,
                    message: `Error Create User ${error}`
                })
            }
        })
    }
    
    
}

module.exports = new UserService;