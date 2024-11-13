import axios  from "../Configs/axios";

export const getAll = async () => {
    return await axios.get(`/category`);
}