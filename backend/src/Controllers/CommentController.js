const createCommentDTO = require("../DTOs/CommentDTO/createCommentDTO");
const CommentService = require("../Services/CommentService");

class CommentController{
    async create(req, res){
        try {
            const {error, value} = createCommentDTO.validate(req.body);
            if(error){
                return res.status(404).json({
                    status: 404,
                    message: error.message
                });
            }

            const data = await CommentService.create(value);
            res.status(200).json(data);
        } catch (error) {
            console.log(error);
            res.status(400).json(error);
        }
    }
    
    async getAllCommentByPostId(req, res){
        try {
            const postId = req.params.postId;
            const data = await CommentService.getAllCommentByPostId(postId);
            res.status(200).json(data);
        } catch (error) {
            res.status(400).json(error);
        }
    }

    async getComment(req, res){
        try {
            const commentId = req.params.commentId;
            const data = await CommentService.getComment(commentId);
            res.status(200).json(data);
        } catch (error) {
            console.log(error);
            res.status(400).json(error);
        }
    }
}
module.exports = new CommentController;