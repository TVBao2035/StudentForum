const createUserDTO = require("../DTOs/UserDTO/createUserDTO");
const signInDTO = require("../DTOs/UserDTO/signInDTO");
const signUpDTO = require("../DTOs/UserDTO/signUpDTO");
const updateUserDTO = require("../DTOs/UserDTO/updateUserDTO");
const UserService = require("../Services/UserService");
require('dotenv').config();
class UserController{

    async changePassword (req, res){
        try {
        
            const data = await UserService.changePassword(req.body, req.user.decode.id);
            res.status(200).json(data);
        } catch (error) {
            console.log(error);
            res.status(400).json(error);
        }
    }

    async getByGroupId(req, res){
        try {
            const groupId = req.params.id;
            const data = await UserService.getByGroupId(groupId);
            res.status(200).json(data);
        } catch (error) {
            console.log(error);
            res.status(400).json(error);
        }
    }

    async create(req, res){
        try {
            const {error, value} = createUserDTO.validate(req.body);
            if(error){
                return res.status(404).json({
                    status: 404,
                    message: error.message,
                    data: error.details[0].path[0]
                })
            }

            const data = await UserService.create(value);
            res.status(200).json(data);
        } catch (error) {
            console.log(error);
            res.status(400).json(error);
        }
    }

    async update(req, res){
        try {
            const {error, value} = updateUserDTO.validate(req.body);
            const userId = req.params.id;
            if(error){
                return res.status(404).json({
                    status: 404,
                    message: error.message
                })
            }

            const data = await UserService.udpate(value, userId);
            res.status(200).json(data);
        } catch (error) {
            console.log(error);
            res.status(400).json(error);
        }
    }

    async delete(req, res) { 
        try {
            const userId = req.params.id;
            const data = await UserService.delete(userId);
            res.status(200).json(data);
        } catch (error) {
            console.log(error);
            res.status(400).json(error);
        }
    }

    async refresh(req, res){
        try {
            const user = req.user.decode;
            const data = await UserService.refresh(user);
            const timestamp = Number(process.env.TIMESTAMP) * 1000;
            res.cookie("accessToken", data.data.accessToken, {
                httpOnly: true,
                sameSite: 'none',
                expires: new Date(Date.now() + timestamp),
                secure: true
            }).status(200).json(data);
        } catch (error) {
            console.log(error);
            res.status(400).json(error);
        }
    }

    async getDetails(req, res){
        try {
            const userId = req.params.id;
            const userReq = req.user.decode;
            const data = await UserService.getDetails(userId, userReq);
            res.status(200).json(data);
        } catch (error) {
            console.log(error);
            res.status(400).json(error);
        }
    }

    async getAll(req, res){
        try {
            const search = req.query.search;
            const limit = req.query.limit;
            
            const data = await UserService.getAll(search, limit.trim().length===0? null : Number(limit));
            res.status(200).json(data);
        } catch (error) {
            console.log(error);
            res.status(400).json(error);
        }
    }

    async signIn(req, res){
        try {
   
            const {error, value} = signInDTO.validate(req.body);
            if(error){
                return res.status(404).json({
                    status: 404,
                    message: error.message,
                    data: error.details[0].path[0]
                })
            }
            const data = await UserService.signIn(value);
            if(data.status === 404){
                return res.status(404).json(data);
            }
            
            const timestamp = Number(process.env.TIMESTAMP) * 1000;
            return res.cookie("accessToken", data?.data?.accessToken, {
                httpOnly: true,
                sameSite: 'none',
                expires: new Date(Date.now() + timestamp),
                secure: true
            }).status(200).json(data);
        } catch (error) {
            console.log(error);
            res.status(400).json(error);
        }
    }

    async signUp(req, res){
        try {
            const {error, value} = signUpDTO.validate(req.body);
            if(error){
                return res.status(404).json({
                    status: 404,
                    message: error.message,
                    data: error.details[0].path[0]
                })
            }
            const data = await UserService.signUp(value);
            res.status(200).json(data);
        } catch (error) {
            console.log(error);
            res.status(400).json(error);
        }
    }

    async logout(req, res){
        try {
            return res.clearCookie("accessToken").status(200).json({
                status: 200,
                message: `Đăng Xuất Thành Công!!!`
            })
        } catch (error) {
            res.status(400).json(error);
        }
    }
}

module.exports = new UserController;