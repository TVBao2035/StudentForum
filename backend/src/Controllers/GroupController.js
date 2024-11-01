const createGroupDTO = require("../DTOs/GroupDTO/createGroupDTO");
const updateGroupDTO = require("../DTOs/GroupDTO/updateGroupDTO");
const GroupService = require("../Services/GroupService");

class GroupController{
   
    async update(req, res){
        try {
            const {value, error} = updateGroupDTO.validate(req.body);
            if(error){
                return res.status(404).json({
                    status: 404,
                    message: error.message
                })
            }

            const data = await GroupService.update(value);
            res.status(200).json(data);
        } catch (error) {
            console.log(error);
            res.status(400).json(error);
        }
    }
    async delete(req, res){
        try {
            const groupId = req.params.id;
            const data = await GroupService.delete(groupId);
            res.status(200).json(data);
        } catch (error) {
            console.log(error);
            res.status(400).jon(error);
        }
    }

    async create(req, res){
        try {
            const {error, value} = createGroupDTO.validate(req.body);
            if(error){
                return res.status(404).jons({
                    status: 404,
                    message: error.message
                })
            }
            const data = await GroupService.create(value);
            res.status(200).json(data);
        } catch (error) {
            console.log(error);
            res.status(400).json(error);
        }
    }

    async getById(req, res){
        try {
            const groupId = req.params.id;
            const data = await GroupService.getById(groupId);
            res.status(200).json(data);
        } catch (error) {
            console.log(error);
            res.status(400).json(error);
        }
    }

    async getByUserId(req, res){
        try {
            const userId = req.params.userId;
            const data = await GroupService.getByUserId(userId);
            res.status(200).json(data);
        } catch (error) {
            console.log(error);
            res.status(400).json(error);
        }
    }

    async getAll(req, res){
        try {
            const data = await GroupService.getAll();
            res.status(200).json(data);
        } catch (error) {
            console.log(error);
            res.status(400).json(error);
        }
    }
}


module.exports = new GroupController;