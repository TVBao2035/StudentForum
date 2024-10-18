const { Op, where } = require("sequelize");
const db = require("../Models");
const { post } = require("../Routers/CommentRouter");
const checkUser = require("../Common/checkUser");
const checkPost = require("../Common/checkPost");
const checkComment = require("../Common/checkComment");

class LikeService {
    create(userId, postId = null, commentId = null){
        return new Promise(async (resolve, reject) => {
            try {
                const user = await checkUser(userId);
                if (user?.status === 404) {
                    return resolve(user);
                }

                if(postId && postId !== 'null'){
                    const post = await checkPost(postId)

                    if (post?.status === 404) {
                        return resolve(post)
                    }

                }
                if (commentId && commentId !== 'null') {
                    const comment = await checkComment(commentId);
                    if (comment.status === 404) {
                        return resolve(comment);
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
                    message: `Tạo Lượt Thích Thành Công!!`
                })
            } catch (error) {
                reject({
                    status: 400,
                    message: `Error Create Like ${error}`,
                })
            }
        })
    }

    delete(userId, postId=null, commentId=null){
        return new Promise(async(resolve, reject) => {
            try {
                const user = await checkUser(userId);
                if (user?.status === 404) {
                    return resolve(user);
                }
                var like;
                if(postId && postId !== 'null'){
                    const post = await checkPost(postId)

                    if (post?.status === 404) {
                        return resolve(post)
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
                    const comment = await checkComment(commentId);
                    if (comment.status === 404) {
                        return resolve(comment);
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
                        message: `Không Tìm Thấy Lượt Thích`
                    })
                }

                like.isDelete = true;
                await like.save();
                return resolve({
                    status: 200,
                    message: `Xóa Lượt Thích Thành Công`
                })
            } catch (error) {
                reject({
                    status: 400,
                    message: `Error Delete Like ${error}`,
                })
            }
        })
    }
}

module.exports = new LikeService;