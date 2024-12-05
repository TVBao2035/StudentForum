const createHistoryDTO = require("../DTOs/HistoryDTO/createHistoryDTO");
const HistoryService = require("../Services/HistoryService");

class HistoryController{

    async update(req, res){
        try {
            const historyId = req.params.id;
            const data = await HistoryService.update(historyId);
            res.status(200).json(data);
        } catch (error) {
            console.log(error);
            res.status(400).json(error);
        }
    }

    async getAllByUserId(req, res){
        try {
            const userId = req.params.userId;
            const data = await HistoryService.getAllByUserId(userId);
            res.status(200).json(data);
        } catch (error) {
            console.log(error);
            res.status(400).json(error);
        }
    }

    async create(req, res){
        try {
            const {value, error} = createHistoryDTO.validate(req.body);
            if(error){
                return res.status(404).json({
                    status: 404,
                    message: error.message
                })
            }

            const data = await HistoryService.create(value);
            res.status(200).json(data);
        } catch (error) {
            console.log(error);
            res.status(400).json(error);
        }
    }
}

module.exports = new HistoryController;