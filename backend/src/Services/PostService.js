const { where, Op } = require("sequelize");
const db = require("../Models");
const { message } = require("../DTOs/UserDTO/createUserDTO");

class PostService{

    delete(id){
        return new Promise(async (resolve, reject) => {
            try {
                const post = await db.Post.findOne({
                    where: {
                        [Op.and]:[
                            {id}, {isDelete: false}
                        ]
                    }
                });

                if(!post){
                    return resolve({
                        status: 404,
                        message: `Not Found Post With Id: ${id}`
                    })
                }

                post.isDelete = true;
                await post.save();
                resolve({
                    status: 200,
                    message: `Delete Post Success!!`
                })
            } catch (error) {
                reject({
                    status: 404,
                    message: `Error Delete Post ${error}`
                })
            }
        })
    }

    update({ id, categoryId, content, image }){
        return new Promise(async (resolve, reject) => {
            try {
                const post = await db.Post.findOne({
                    where: {
                        [Op.and]: [
                            {id}, {isDelete: false}
                        ]
                    }
                });
                if(!post){
                    return resolve({
                        status: 404,
                        message: `Not Found Post With Id :${id}`
                    })
                }

                const category = await db.Categorys.findOne({
                    where: {
                        [Op.and]: [
                            {id: categoryId},
                            {isDelete: false}
                        ]
                    }
                });

                if(!category){
                    return resolve({
                        status: 404,
                        message: `Not Found Category With ID: ${categoryId}`
                    })
                }


                post.content = content;
                post.categoryId = categoryId;
                post.image = image;
                await post.save();
                resolve({
                    status: 200,
                    message: `Update Post Success!!!`
                })
            } catch (error) {
                reject({
                    status: 404,
                    message: `Error Update Post ${error}`
                })
            }
        })
    }

    create({userId, groupId, categoryId, content, image}){
        return new Promise(async(resolve, reject) => {
            try {
                const user = await db.User.findOne({
                    where: {
                        [Op.and]:[
                            {id: userId},
                            {isDelete: false}
                        ]
                    }
                });
                if(!user){
                    return resolve({
                        status: 404,
                        message: `Not Found User With Id: ${userId}`,
                        data: "userId"
                    })
                }

                const category = await db.Categorys.findOne({
                    where: {
                        [Op.and]: [
                            {id: categoryId},
                            {isDelete: false}
                        ]
                    }
                })

                if(!category){
                    return resolve({
                        status: 404,
                        message: `Not Found Category With Id: ${categoryId}`,
                        data: `categoryId`
                    })
                }

                if(groupId){
                    const group = await db.Group.findOne({
                        where: {
                            [Op.and]: [
                                {id: groupId},
                                {isDelete: false}
                            ]
                        }
                    });

                    if(!group){
                        return resolve({
                            status: 404,
                            message: `Not Found Group With id: ${groupId}`,
                            data: "groupId"
                        })
                    }
                }

                await db.Post.create({
                    userId,
                    groupId,
                    categoryId,
                    content,
                    image
                })

                resolve({
                    status: 200,
                    message: `Create Post Success!!`,
                })

            } catch (error) {
                reject({
                    status: 404,
                    message: `Error Create Post ${error}`
                })
            }
        })
    }
    
    getDeltails(id){
        return new Promise(async (resolve, reject) => {
            try {
                const post = await db.Post.findOne({
                    attributes:{
                        exclude: ['isDelete', 'groupId', 'userId', 'categoryId']
                    },
                    include: [
                        {
                            model: db.Categorys,
                            attributes: {
                                exclude: ['isDelete', 'updatedAt', 'createdAt']
                            },
                        },
                        {
                            model: db.User,
                            attributes: ['id', 'name', 'avatar']
                        },
                        {
                            model: db.Group,
                            attributes: ['id', 'name', 'description']
                        }
                    ],
                    where: {
                        [Op.and]: [
                            { id }, { isDelete: false }
                        ]
                    }
                });

                if (!post) {
                    return resolve({
                        status: 404,
                        message: `Not Found Post With Id: ${id}`
                    })
                }

                resolve({
                    status: 200,
                    message: `Get Details Post Success!!`,
                    data: post
                })

            } catch (error) {
                reject({
                    status: 404,
                    message: `Error Get Details Post ${error}`
                })
            }
        })
    }

    getAll(){
        return new Promise( async (resolve, reject) => {
            try {
                const data = await db.Post.findAll({
                    where: {
                        isDelete: false
                    },
                    attributes: {
                        exclude: ['createdAt', 'updatedAt', 'isDelete']
                    },
                    include:{
                        model: db.Categorys,
                        attributes: ['name']
                    },
                    order: [
                        ['createdAt', 'desc']
                    ]
                })

                resolve({
                    status: 200,
                    message: `Get All Post Success!!`,
                    data
                })
            } catch (error) {
                reject({
                    status: 404,
                    message: `Error Get All Post ${error}`
                })
            }
        })
    }
}

module.exports = new PostService;