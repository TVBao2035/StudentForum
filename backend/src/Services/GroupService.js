const { Op } = require('sequelize');
const db = require('../Models');
const checkGroup = require('../Common/checks/checktGroup');
class GroupService {
    update({id, name, description}){
        return new Promise(async(resolve, reject) => {
            try {
                const group = await checkGroup(id);
                if(group.status === 404) return resolve(group);

                group.name = name;
                group.description = description;
                await group.save();
                resolve({
                    status: 200,
                    message: `Cập nhật nhóm thành công`
                })
            } catch (error) {
                reject({
                    status: 400,
                    message: `Lỗi cập nhật nhóm ${error}`
                })
            }
        })
    }
    delete(groupId){
        return new Promise(async(resolve, reject) => {
            try {
                const group = await checkGroup(groupId);
                if(group.status === 404) return resolve(group);
                group.isDelete = true;
                await group.save();
                resolve({
                    status: 200,
                    message: `Xoá Nhóm Thành Công`
                })
            } catch (error) {
                reject({
                    status: 400,
                    message: `Lỗi Xóa Nhóm ${error}`
                })
            }
        })
    }
    create(group){
        return new Promise(async(resolve, reject) => {
            try {
                await db.Group.create(group);
                resolve({
                    status: 200,
                    message: `Tạo Nhóm Thành Công`
                })
            } catch (error) {
                reject({
                    status: 400,
                    message: `Lỗi Tạo Nhóm ${error}`
                })
            }
        })
    }
    getById(groupId) {
        return new Promise(async (resolve, reject) => {
            try {
                const group = await checkGroup(groupId);

                if (group.status === 404) return resolve(group);

                resolve({
                    status: 200,
                    message: `Lấy Nhóm Với Id=${groupId} thành công`,
                    data: group
                })

            } catch (error) {
                reject({
                    status: 400,
                    message: `Lỗi Lấy Nhóm Với ID: ${groupId} ${error}`,
                })
            }
        })
    }
    getAll() {
        return new Promise(async (resolve, reject) => {
            try {
                const data = await db.Group.findAll({
                    attributes: ['id', 'name', 'description'],
                    where: {
                        isDelete: false
                    }
                });

                resolve({
                    status: 200,
                    message: `Lấy tất cả nhóm thành công!`,
                    data
                })
            } catch (error) {
                reject({
                    status: 400,
                    message: `Lỗi lấy tất cả nhóm ${error}`
                })
            }
        })
    }
}

module.exports = new GroupService;