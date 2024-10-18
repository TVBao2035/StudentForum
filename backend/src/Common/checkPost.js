const { Op } = require("sequelize");
const db = require("../Models");

const checkPost = (postId) => {
    return new Promise(async(resolve, reject) => {
        try {
            const post = await db.Post.findOne({
                where: {
                    [Op.and]: [
                        {id: postId}, {isDelete: false}
                    ]
                }
            });

            if(!post){
                return resolve({
                    status: 404,
                    message: `Không Tìm Thấy Bài Đăng Với Id: ${postId}`
                });
            }

            resolve(post);
        } catch (error) {
            reject("Error Check Post " + error);
        }
    })
}

module.exports = checkPost;