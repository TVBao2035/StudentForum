import axios from '../Configs/axios.js';

//User
export const getAllUser = () => {
    return axios.get('');
}

export const createUser = async ({ data }) => {
    return await axios.post(`/`, data);
}

export const updateUser = async ({ userData, userId }) => {
    return await axios.put(`/${userId}`, userData);
}

export const deleteUser = async (userId) => {
    return await axios.delete(`/${userId}`);
}

//Post
export const getAllPost = async() => {
    return await axios.get(`/post`);
}

export const createPost = async ({ userId, groupId, categoryId, content, image }) => {
    return await axios.post(`/post/`, {userId, groupId, categoryId, content, image});
}

export const updatePost = async ({ postId, postData }) => {
    return await axios.put(`/post/${postId}`, { postData });
}

export const deletePost = async (postId) => {
    return await axios.delete(`/post/${postId}`);
}

//Category
export const getAllCategory = async () => {
    return await axios.get(`/category`);
}

export const createCategory = async ({ categoryName }) => {
    return await axios.post(`/category`, categoryName);
}

export const updateCategory = async ({ categoryId, name }) => {
    return await axios.put(`/category/`, { id: categoryId, name } );
}

export const deleteCategory = async (categoryId) => {
    return await axios.delete(`/category/${categoryId}`);
}









