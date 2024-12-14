const { Op, where } = require("sequelize");
const db = require("../Models");
const { post } = require("../Routers/CommentRouter");
const checkUser = require("../Common/checks/checkUser");
const checkPost = require("../Common/checks/checkPost");
const checkComment = require("../Common/checks/checkComment");
const createHistory = require("../Common/create/createHistory");
const getTimeNow = require("../Helpers/getTimeNow");

class LikeService {
    create(userId, postId = null, commentId = null){
        return new Promise(async (resolve, reject) => {
            try {
                const user = await checkUser(userId);
                if (user?.status === 404) {
                    return resolve(user);
                }
                var post;
                if(postId && postId !== 'null'){
                    post = await checkPost(postId)

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
    
                const userOfPost = await checkUser(postId);
                if(userOfPost?.status === 404) resolve(userOfPost)
                createHistory({
                    userId,
                    title: `Tương tác với bài đăng`,
                    content: `Bạn đã thích bài đăng của ${post.userId === userId ? "mình " : `${userOfPost.name}`} lúc ${getTimeNow()}`
                })
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
                var userIdOfPost;
                if(postId && postId !== 'null'){
                    const post = await checkPost(postId)

                    if (post?.status === 404) {
                        return resolve(post)
                    }
                    userIdOfPost = post.userId;
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
                    userIdOfPost = comment.userId;
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

                if(userIdOfPost){
                    const userOfPost = await checkUser(userIdOfPost);
                    if (userOfPost?.status === 404) return resolve(userOfPost);
                    createHistory({
                        userId,
                        title: `Bỏ tương tác bài đăng`,
                        content: `Bạn đã bỏ thích bài đăng của  ${Number(userIdOfPost) === Number(userId) ? "mình " : `${userOfPost.name}`} lúc ${getTimeNow()}`,
                    })
                }

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