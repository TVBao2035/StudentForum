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
                    message: `Not Found Post With ID: ${postId}`
                });
            }

            resolve({
                status: 200,
                data: post
            });
        } catch (error) {
            reject("Error Check Post " + error);
        }
    })
}

module.exports = checkPost;