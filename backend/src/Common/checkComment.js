const { Op } =  require( "sequelize");
const  db = require("../Models")

const checkComment = (commentId) => {
    return new Promise(async(resolve, reject) => {
        try {
            const comment = await db.Comment.findOne({
                where: {
                   [Op.and]: [ {id: commentId}, {isDelete: false}]
                }
            });

            if(!comment){
                return resolve({
                    status: 404,
                    message: `Không Tìm Thấy Bình Luận Với ID: ${commentId}`
                });
            }

            resolve({
                status: 200,
                data: comment
            })
        } catch (error) {
            reject(`Error Check Comment ${error}`);
        }
    })
}

module.exports = checkComment;