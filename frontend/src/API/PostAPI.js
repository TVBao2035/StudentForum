import axios from '../Configs/axios';

export  const getAllPost = async() => {
    return await axios.get(`/post`);
}