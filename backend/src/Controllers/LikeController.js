const createLikeDTO = require("../DTOs/LikeDTO/createLikeDTO");
const LIkeService = require("../Services/LIkeService");
class LikeController{
    async create(req, res){
        try {
            console.log(req.body);
            const {error, value} = createLikeDTO.validate(req.body);
            if(error){
                return res.status(404).json({
                    status: 404,
                    message: error.message,
                    data: error.details[0].path[0]
                });
            }
            const {userId, postId=null, commentId=null} = value;

            const data = await LIkeService.create(userId, postId, commentId);
            res.status(200).json(data);
        } catch (error) {
            console.log(error);
            res.status(400).json(error);
        }
    }

    async delete(req, res){
        try {
            const { userId, postId=null, commentId=null } = req.query;
            const data = await LIkeService.delete(userId, postId, commentId);
            res.status(200).json(data);
        } catch (error) {
            console.log(error);
            res.status(400).json(error);
        }
    }
}

module.exports = new LikeController;