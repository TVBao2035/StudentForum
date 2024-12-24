const createCategoryDTO = require("../DTOs/CategoryDTO/createCategoryDTO");
const updateCategoryDTO = require("../DTOs/CategoryDTO/updateCategoryDTO");
const CategoryService = require("../Services/CategoryService");

class CategoryController{

    async update(req, res){
        try {
            const {value, error} = updateCategoryDTO.validate(req.body);
            if(error){
                return res.status(404).json({
                    status: 404,
                    message: error.message
                })
            }
            
            const data =await CategoryService.update(value);
            res.status(200).json(data);
        } catch (error) {
            console.log(error);
            res.status(400).json(error);
        }
    }

    async delete(req, res){
        try {
            const categoryId = req.params.id;
            const data = await CategoryService.delete(categoryId);
            res.status(200).json(data); 
        } catch (error) {   
            console.log(error);
            res.status(400).json(error);
        }
    }
    
    async create(req, res){
        try {
            const {value, error} = createCategoryDTO.validate(req.body);
            if(error){
                return res.status(404).json({
                    status: 404,
                    message: error.message
                })
            }

            const data = await CategoryService.create(value);
            res.status(200).json(data);
        } catch (error) {
            console.log(error);
            res.status(400).json(error);
        }
    }

    async getById(req, res){
        try {
            const categoryId = req.params.id;
            const data = await CategoryService.getById(categoryId);
            res.status(200).json(data);
        } catch (error) {
            console.log(error);
            res.status(400).json(error);
        }
    }

    async getAll(req, res){
        try {
            const search = req.query.search;
            const data = await CategoryService.getAll(search);
            res.status(200).json(data);
        } catch (error) {
            console.log(error);
            res.status(400).json(error);
        }
    }
}

module.exports = new CategoryController;