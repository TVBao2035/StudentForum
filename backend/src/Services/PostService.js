const { Op } = require("sequelize");
const db = require("../Models");
const checkPost = require("../Common/checks/checkPost");
const checkCategory = require("../Common/checks/checkCategory");
const checkGroup = require("../Common/checks/checktGroup");
const checkUser = require("../Common/checks/checkUser");
const postInclude = require("../Common/includesQuery/postInclude");
const createHistory = require("../Common/create/createHistory");
const getTimeNow = require("../Helpers/getTimeNow");


class PostService {

    getByGroupId(groupId){
        return new Promise(async(resolve, reject) => {
            try {
                const group = await checkGroup(groupId);
                if(group.status === 404) return resolve(group);

                const data = await db.Post.findAll({
                    attributes: ["id", "content", "image", "createdAt", "updatedAt"],
                    where: {
                        [Op.and]: [
                            {isDelete: false},
                            {groupId}
                        ]
                    },
                    include: postInclude
                });

                resolve({
                    status: 200,
                    message: `Lấy tất cả bài đăng của nhóm thành công`,
                    data
                })
            } catch (error) {
                reject(
                    {
                        status: 400,
                        message: `Lỗi lấy tất cả bài đăng của nhóm ${error}`
                    }
                )
            }
        })
    }

    delete(id) {
        return new Promise(async (resolve, reject) => {
            try {
                const post = await checkPost(id)

                if (post?.status === 404) {
                    return resolve(post)
                }

                post.isDelete = true;
                await post.save();
                await createHistory({
                    userId: post.userId,
                    title: `Xóa bài đăng`,
                    content: `Bạn đã xóa bài đăng của mình lúc ${getTimeNow()}`
                })
                resolve({
                    status: 200,
                    message: `Xóa Bài Đăng Thành Công!!`
                })
            } catch (error) {
                reject({
                    status: 400,
                    message: `Error Delete Post ${error}`
                })
            }
        })
    }

    update({ id, categoryId, content, image }) {
        return new Promise(async (resolve, reject) => {
            try {
                const post = await checkPost(id);

                if (post?.status === 404) {
                    return resolve(post)
                }

                const category = await checkCategory(categoryId);

                if (category?.status === 404) {
                    return resolve(category);
                }


                post.content = content;
                post.categoryId = categoryId;
                post.image = image;
                await post.save();
                await createHistory({
                    userId: post.userId,
                    title: `Cập nhật bài đăng`,
                    content: `Bạn đã cập nhật bài đăng của mình lúc ${getTimeNow()}`
                })
                resolve({
                    status: 200,
                    message: `Cập Nhật Bài Đăng Thành Công!!!`
                })
            } catch (error) {
                reject({
                    status: 400,
                    message: `Error Update Post ${error}`
                })
            }
        })
    }

    create({ userId, groupId, categoryId, content, image }) {
        return new Promise(async (resolve, reject) => {
            try {
                const user = await checkUser(userId);
                if (user?.status === 404) {
                    return resolve(user);
                }

                const category = await checkCategory(categoryId);

                if (category?.status === 404) {
                    return resolve(category);
                }

                if (groupId) {
                    const group = await checkGroup(groupId);

                    if (group?.status === 404) {
                        return resolve(group);
                    }
                }

                await db.Post.create({
                    userId,
                    groupId,
                    categoryId,
                    content,
                    image
                })
                await createHistory({
                    userId,
                    title: `Tạo mới bài đăng`,
                    content: `Bạn đã tạo mới bài đăng lúc ${getTimeNow()}`
                })
                resolve({
                    status: 200,
                    message: `Tạo Bài Đăng Thành Công!!`,
                })

            } catch (error) {
                reject({
                    status: 400,
                    message: `Error Create Post ${error}`
                })
            }
        })
    }

    getDeltails(id) {
        return new Promise(async (resolve, reject) => {
            try {
                const post = await db.Post.findOne({
                    attributes: {
                        exclude: ['isDelete', 'groupId', 'userId']
                    },
                    include: postInclude,
                    where: {
                        [Op.and]: [
                            { id }, { isDelete: false }
                        ]
                    }
                });

                if (!post) {
                    return resolve({
                        status: 404,
                        message: `Không Tìm Tháy Bài Đăng Với Id: ${id}`
                    })
                }

                resolve({
                    status: 200,
                    message: `Lấy Chi Tiết Bài Đăng Thành Công!!`,
                    data: post
                })

            } catch (error) {
                reject({
                    status: 400,
                    message: `Error Get Details Post ${error}`
                })
            }
        })
    }

    getAll(search) {
        return new Promise(async (resolve, reject) => {
            try {
                var searchUser = {}
                if (search.trim().length !== 0) {
                    searchUser = {
                        name: { [Op.like]: `%${search.trim()}%` }
                    }
                }
                const data = await db.Post.findAll({
                    where: {
                        [Op.and]: [
                            {isDelete: false},
                            {groupId: null},
                            
                        ]
                    },
                    attributes: {
                        exclude: ['updatedAt', 'isDelete']
                    },
                    order: [
                        ['createdAt', "DESC"],
                    ],
                    include: [
                        ...postInclude,
                        {
                            model: db.User,
                            where: {
                                [Op.and]:[
                                    {isDelete: false},
                                    searchUser
                                ]
                            }
                        }
                    ]

                })

                resolve({
                    status: 200,
                    message: `Lấy Tất Cả Bài Đăng Thành Công!!`,
                    data
                })
            } catch (error) {
                reject({
                    status: 400,
                    message: `Error Get All Post ${error}`
                })
            }
        })
    }

    getAllPostByUserId(userId) {
        return new Promise(async (resolve, reject) => {
            try {
                const user = await checkUser(userId);

                if (user?.status === 404) {
                    return resolve(user);
                }

                const data = await db.Post.findAll({
                    attributes: ['content', 'image', 'createdAt', 'id'],
                    order: [
                        ['createdAt', "DESC"],
                    ],
                    where: {
                        [Op.and]: [
                            { userId }, { isDelete: false }
                        ]
                    },
                    include: [
                        {
                            model: db.User,
                            where: {
                                isDelete: false,
                            },
                            attributes: ['avatar', 'name', 'id']
                        },
                        {
                            model: db.Categorys,
                            where: {
                                isDelete: false,
                            },
                            attributes: ['name']
                        },
                        {
                            model: db.Like,
                            where: {
                                isDelete: false,
                            },
                            required: false,
                            attributes: ['userId']
                        }
                    ]
                });

                resolve({
                    status: 200,
                    message: `Láy Tất Cả Bài Đăng Có Id Của Người Dùng Là ${userId}`,
                    data
                })

            } catch (error) {
                reject({
                    status: 400,
                    message: `Error Get All Posts By User Id ${error}`
                })
            }
        })
    }
}

module.exports = new PostService;