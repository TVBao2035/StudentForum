import axios from '../Configs/axios';

export  const getAllPost = async() => {
    return await axios.get(`/post`);
}
export const getAllPostByUserId = async (userId) => {
    return await axios.get(`/post/user/${userId}`);
}
export const getDetailsPost = async (postId) => {
    return await axios.get(`/post/${postId}`);
}
export const createPost = async({userId, groupId=null, categoryId, content, image})=> {
    return await axios.post('/post', {userId, groupId, categoryId, content, image});
}
export const getAllPostByGroupId = async (groupId) => {
    return await axios.get(`post/group/${groupId}`);

}

export const updatePost = async (postId, content, categoryId, image) => {
    return await axios.put(`post/${postId}`, {
        content, categoryId, image
    });
}

export const deletePost = async (postId) => {
    return await axios.delete(`post/${postId}`);
}