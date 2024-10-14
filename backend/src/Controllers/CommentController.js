const CommentService = require("../Services/CommentService");

class CommentController{
    async getAllCommentByPostId(req, res){
        try {
            const postId = req.params.postId;
            const data = await CommentService.getAllCommentByPostId(postId);
            res.status(200).json(data);
        } catch (error) {
            res.status(404).json(error);
        }
    }

    async getComment(req, res){
        try {
            const commentId = req.params.commentId;
            const data = await CommentService.getComment(commentId);
            res.status(200).json(data);
        } catch (error) {
            console.log(error);
            res.status(404).json(error);
        }
    }
}
module.exports = new CommentController;