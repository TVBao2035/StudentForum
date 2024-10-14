const { Op, where } = require("sequelize");
const db = require("../Models");
const { post } = require("../Routers/CommentRouter");

class LikeService {
    create(userId, postId = null, commentId = null){
        console.log({postId, commentId});
        return new Promise(async (resolve, reject) => {
            try {
                const user = await db.User.findOne({
                    where: { 
                        [Op.and]: [
                            {id: userId},
                            {isDelete: false}
                        ]
                     }
                });
                if (!user) {
                    return resolve({
                        status: 404,
                        message: `Not Found User With Id: ${userId}`,
                    });
                }
                if(postId && postId !== 'null'){
                    const post = await db.Post.findOne({
                        where: {
                            [Op.and]: [
                                { id: postId },
                                { isDelete: false }
                            ]
                        }
                    });
                    if(!post){
                        return resolve({
                            status: 404,
                            message: `Not Found Post With Id: ${postId}`
                        })
                    }
                }
                if (commentId && commentId !== 'null') {
                    const comment = await db.Comment.findOne({
                        where: {
                            [Op.and]: [
                                {id: commentId},
                                {isDelete: false}
                            ]
                        }
                    });
                    if (!comment) {
                        return resolve({
                            status: 404,
                            message: `Not Found Comment With Id: ${commentId}`
                        })
                    }
                }
                const like = await db.Like.findOne({
                    where: {
                        [Op.and]: [{userId}, {postId}, {commentId}]
                    }
                });
                if(like){
                  like.isDelete = false;
                  await like.save();
                }else{
                    await db.Like.create({
                        userId,
                        postId,
                        commentId
                    });
                }
                resolve({
                    status: 200,
                    message: `Create Like Success!!`
                })
            } catch (error) {
                reject({
                    status: 404,
                    message: `Error Create Like ${error}`,
                })
            }
        })
    }

    delete(userId, postId=null, commentId=null){
        return new Promise(async(resolve, reject) => {
            try {
                console.log({userId, postId, commentId});
                const user = await db.User.findOne({
                    where: {
                        [Op.and]: [
                            { id: userId },
                            { isDelete: false }
                        ]
                    }
                });
                if (!user) {
                    return resolve({
                        status: 404,
                        message: `Not Found User With Id: ${userId}`,
                    });
                }

                var like;
                if(postId && postId !== 'null'){
                    const post = await db.Post.findOne({
                        where: {
                            [Op.and]: [
                                { id: postId },
                                { isDelete: false }
                            ]
                        }
                    });
                    if (!post) {
                        return resolve({
                            status: 404,
                            message: `Not Found Post With Id: ${postId}`
                        })
                    }
                    like = await db.Like.findOne({
                        where: {
                            [Op.and]: [
                                { userId },
                                { postId },
                            ]
                        }
                    });
                }
                if(commentId && commentId !== 'null'){
                    const comment = await db.Comment.findOne({
                        where: {
                            [Op.and]: [
                                { id: commentId },
                                { isDelete: false }
                            ]
                        }
                    });
                    if (!comment) {
                        return resolve({
                            status: 404,
                            message: `Not Found Comment With Id: ${commentId}`
                        })
                    }
                    like = await db.Like.findOne({
                        where: {
                            [Op.and]: [
                                { userId },
                                { commentId }
                            ]
                        }
                    });
                }

                

                if(!like){
                    return resolve({
                        status: 404,
                        message: `Not Found Like`
                    })
                }

                like.isDelete = true;
                await like.save();
                return resolve({
                    status: 200,
                    message: `Delete Like Success`
                })
            } catch (error) {
                reject({
                    status: 404,
                    message: `Error Delete Like ${error}`,
                })
            }
        })
    }
}

module.exports = new LikeService;