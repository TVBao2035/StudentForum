const { Op } = require("sequelize");
const db = require("../Models");
const checkUser = require("../Common/checkUser");
const checkPost = require("../Common/checkPost");
const checkComment = require("../Common/checkComment");

class CommentService{

    create({userId, commentId, postId, content}){
        return new Promise(async(resolve, reject) => {
            try {
                const user = await checkUser(userId);
                if(user.status === 404){
                    return resolve(user)
                }

                const post = await checkPost(postId);
                if(post.status === 404){
                    return resolve(post);
                }

                if(commentId !== 0){
                    const comment = await checkComment(commentId);
                    if(comment.status === 404){
                        return resolve(comment);
                    }
                }

                await db.Comment.create({
                    userId, commentId, postId, content
                })
                resolve({
                    status: 200,
                    message: `Tạo Bình Luận Thành Công`
                })
               
            } catch (error) {
                reject({
                    status: 400,
                    message: `Error Create Comment ${error}`,
                })
            }
        })
    }

    getAllCommentByPostId(postId){
        let level = 5;
        const getChildrenComment = (level) => {
            if (level===0){
                return {
                    model: db.Comment,
                    as: 'children',
                    attributes: ['id', 'content', 'createdAt', 'commentId'],
                    include: [
                        {
                            model: db.User,
                            where: {
                                isDelete: false,
                            },
                            attributes: ['name', 'avatar', 'id'],
                        },
                        {
                            model: db.Like,
                            required: false,
                            where:{
                                isDelete: false
                            },
                            attributes: ['id', 'userId']
                        },
                    ]
                }
            }
            level--;
            return {
                model: db.Comment,
                as: 'children',
                attributes: ['id', 'content', 'createdAt', 'commentId'],
                include: [
                    {
                        model: db.User,
                        where: {
                            isDelete: false
                        },
                        attributes: ['name', 'avatar', 'id']
                    },
                    {
                        model: db.Like,
                        required: false,
                        attributes: ['id', 'userId'],
                        where: {
                            isDelete: false
                        },
                    },
                    getChildrenComment(level)
                ]
            }
        }

        return new Promise(async (resolve, reject) => {
            try {
                const post = await checkPost(postId)

                if (post?.status === 404) {
                    return resolve(post)
                }


               const data = await db.Comment.findAll({
                where: {
                    [Op.and]: [
                        {postId},{isDelete: false},{commentId: 0}
                    ]
                },
                attributes: ['id', 'content', 'createdAt', 'commentId'],
                include: [
                    {
                        model: db.User,
                        where: {
                            isDelete: false
                        },
                        attributes: ['name', 'avatar', 'id']
                    },
                    {
                        model: db.Like,
                        attributes: ['id', 'userId'],
                        required: false,
                        where: {
                            isDelete: false
                        },
                    },
                    getChildrenComment(level)
                ]
               });
               return resolve({
                    status: 200,
                    message: `Lấy Tất Cả Bình Luận Theo Bài Post`,
                    data
               });
            } catch (error) {
                reject({
                    status: 400,
                    message: `Error Get All Comments By Post Id ${error}`,
                })
            }
        })
    }

    getComment(commentId){
        return new Promise(async(resolve, reject) => {
            try {
               const data = await db.Comment.findOne({
                attributes: ['content'],
                where: {
                    [Op.and] : [
                        {id: commentId},
                        {isDelete: false}
                    ]
                }
               }) ;
               if(!data) {
                   return resolve({
                       state: 404,
                       message: `Không Tìm Thấy Bình Luận Với Id ${commentId}`
                   });
               }

               resolve({
                status: 200,
                message: `Lấy Bình Luận Thành Công`,
                data
               })

            } catch (error) {
                reject({
                    status: 400,
                    message: `Error Get Comment ${error}`
                })
            }
        })
    }
}
module.exports = new CommentService;