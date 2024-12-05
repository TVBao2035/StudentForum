const acceptFriendInvitation = require("../DTOs/FriendDTO/acceptFriendInvitationDTO");
const createFriendInvitation = require("../DTOs/FriendDTO/createFriendInvitationDTO");
const FriendService = require("../Services/FriendService");

class FriendController{

    
    async deleteInvitation(req, res){
        try {
            const { userId, friendId } = req.query;
            if (!userId || !friendId) {
                return res.status(404).json({
                    status: 404,
                    message: `Dữ liệu không hợp lệ`
                })
            }
            const data = await FriendService.deleteInvitation(userId, friendId);
            res.status(200).json(data);
        } catch (error) {
            console.log(error);
            res.status(400).json(error);
        }
    }

    async deleteFriend(req, res){
        try {
            const {userId, friendId} = req.query;
            if(!userId || !friendId){
                return res.status(404).json({
                    status: 404,
                    message: `Dữ liệu không hợp lệ`
                })
            }
            const data = await FriendService.deleteFriend(userId, friendId);
            res.status(200).json(data);
        } catch (error) {
            console.log(error);
            res.status(400).json(error);
        }
    }

    async getFriendsByUserId(req, res){
        try {
            const userId = req.params.userId;
            const data = await FriendService.getFriendsByUserId(userId);
            res.status(200).json(data);
        } catch (error) {
            console.log(error);
            res.status(400).json(error);
        }
    }

    async getFriendInvitation(req, res){
        try {
            const friendId = req.params.friendId;
            const data = await FriendService.getFriendInvitation(friendId);
            res.status(200).json(data);
        } catch (error) {
            console.log(error);
            res.status(400).json(error);
        }
    }

    async createFriendInvitation(req, res){
        try {
            const {error, value} = createFriendInvitation.validate(req.body);
            if(error){
                return res.status(404).json({
                    status: 404,
                    message: error.message,
                })
            }

            const data = await FriendService.createFriendInvitation(value);
            res.status(200).json(data);
        } catch (error) {
            console.log(error);
            res.status(400).json(error);
        }
    }

    async acceptFriendInvitation(req, res){
        try {
            const {error, value} = acceptFriendInvitation.validate(req.body);
            if (error) {
                return res.status(404).json({
                    status: 404,
                    message: error.message,
                })
            }
            const data = await FriendService.acceptFriendInvitation(value);
            res.status(200).json(data);
        } catch (error) {
            console.log(error);
            res.status(400).json(error);
        }
    }

}

module.exports = new FriendController;