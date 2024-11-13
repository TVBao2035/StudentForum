import axios from '../Configs/axios';

export  const getAllPost = async() => {
    return await axios.get(`/post`);
}

export const getAllPostByUserId = async (userId) => {
    return await axios.get(`/post/user/${userId}`);
}

export const createPost = async({userId, groupId=null, categoryId, content, image})=> {
    return await axios.post('/post', {userId, groupId, categoryId, content, image});
}