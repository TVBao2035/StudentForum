const createPostDTO = require("../DTOs/PostDTO/createPostDTO");
const updatePostDTO = require("../DTOs/PostDTO/updatePostDTO");
const PostService = require("../Services/PostService");

class PostController{
    async delete(req, res){
        try {
            const id = req.params.id;
            const data = await PostService.delete(id);
            res.status(200).json(data);
        } catch (error) {
            console.log(error);
            res.status(404).json(error);
        }
    }
    
    async update(req, res){
        try {
            const {error, value} = updatePostDTO.validate(req.body);
            const id = req.params.id;

            if(error){
                return res.status(404).json({
                    status: 404,
                    message: error.message,
                    data: error.details[0].path[0]
                })
            }
            const {categoryId, content, image} = value;
            const data = await PostService.update({ categoryId, content, image , id});
            res.status(200).json(data);
        } catch (error) {
            console.log(error);
            res.status(404).json(error);
        }
    }

    async create(req, res){
        try {
            const {error, value} = createPostDTO.validate(req.body);
            if(error){
                return res.status(200).json({
                    status: 404,
                    message: error.message,
                    data: error.details[0].path[0]
                })
            }

            const data = await PostService.create(value);
            res.status(200).json(data);
        } catch (error) {
            console.log(error);
            res.status(404).json(error);
        }
    }

    async getDetails(req, res){
        try {
            const id = req.params.id;
            const data = await PostService.getDeltails(id);
            res.status(200).json(data);
        } catch (error) {
            console.log(error);
            res.status(404).json(error);
        }
    }

    async getAll(req, res){
        try {
            const data = await PostService.getAll();
            res.status(200).json(data);
        } catch (error) {
            console.log(error);
            res.status(404).json(error);
        }
    }
}

module.exports = new PostController;