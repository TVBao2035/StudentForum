import axios  from "../Configs/axios";

export const getAllCategories = async () => {
    return await axios.get(`/category`);
}