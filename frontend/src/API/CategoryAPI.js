import axios  from "../Configs/axios";

export const getAllCategories = async (search="") => {
    return await axios.get(`/category?search=${search}`);
}