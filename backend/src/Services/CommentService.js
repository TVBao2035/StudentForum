const { Op } = require("sequelize");
const db = require("../Models");

class CommentService{
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
               const post = await db.Post.findOne({
                where: {
                    [Op.and]: [
                        {id: postId},
                        {isDelete: false}
                    ]
                }
               });
               if(!post){
                return resolve({
                    status: 404,
                    message: `Not Found Post With Id: ${postId}`
                })
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
                    message: `Get All Comments By Post Id`,
                    data
               });
            } catch (error) {
                reject({
                    status: 404,
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
                       message: `Not Found Comment With Id: ${commentId}`
                   });
               }

               resolve({
                status: 200,
                message: `Get Comment Success`,
                data
               })

            } catch (error) {
                reject({
                    status: 404,
                    message: `Error Get Comment ${error}`
                })
            }
        })
    }
}
module.exports = new CommentService;