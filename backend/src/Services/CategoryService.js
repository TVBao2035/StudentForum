const { Op } = require("sequelize");
const db = require("../Models");
const checkCategory = require("../Common/checkCategory");
const { message } = require("../DTOs/CategoryDTO/createCategoryDTO");

class CategoryService{

    update({id, name}){
        return new Promise(async(resolve, reject) => {
            try {
                const category = await checkCategory(id);
                if(category.status === 404) return resolve(category);

                category.name = name;
                await category.save();
                resolve({
                    status: 200,
                    message: `Cập Nhật Danh Mục Thành Công`
                })
            } catch (error) {
                reject({
                    status: 400,
                    message: `Lỗi Cập Nhật Danh Mục ${error}`
                })
            }
        })
    }

    delete(categoryId){
        return new Promise(async(resolve, reject) => {
            try {
                const category = await checkCategory(categoryId);
                if(category.status === 404) return resolve(category);

                category.isDelete = true;
                await category.save();
                resolve({
                    status: 200,
                    message: `Xóa Danh Mục Thành Công`
                })
            } catch (error) {
                reject({
                    status: 404,
                    message: `Lỗi Xóa Danh Mục ${error}`
                })
            }
        })
    }

    getById(categoryId){
        return new Promise(async (resolve, reject) => {
            try {
                const category = await checkCategory(categoryId);
                if (category.status === 404) return resolve(category);

                resolve({
                    status: 200,
                    message: `Lấy Id của danh mục thành công`,
                    data: category
                })
            } catch (error) {
                reject({
                    status: 400,
                    message: `Lỗi lấy id của danh mục ${error}`
                })
            }
        })
    }

    create(categoryName){
        return new Promise(async(resolve, reject) => {
            try {
                await db.Categorys.create(categoryName);
                resolve({
                    status: 200,
                    message: `Tạo danh mục thành công`
                })
            } catch (error) {
                reject({
                    status: 400,
                    message: `Lỗi tạo danh mục ${error}`
                })
            }
        })
    }

    getAll(){
        return new Promise(async(resolve, reject) => {
            try {
                const data = await db.Categorys.findAll({
                    attributes: ['id', 'name'],
                    where: {
                        isDelete: false
                    }
                });

                resolve({
                    status: 200,
                    message: `Lấy tất cả danh mục thành công`,
                    data
                })
            } catch (error) {
                reject({
                    status: 400,
                    message: `Lỗi lấy tất cả danh mục ${error}`
                })   
            }
        })
    }
}

module.exports = new CategoryService;