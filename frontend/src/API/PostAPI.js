import axios from '../Configs/axios';

export  const getAllPost = async() => {
    return await axios.get(`/post`);
}

export const getAllPostByUserId = async (userId) => {
    return await axios.get(`/post/user/${userId}`);
}