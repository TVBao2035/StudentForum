import axios from "../Configs/axios.js";

//User
export const getAllUser = (search="", limit="") => {
  return axios.get(`?search=${search}&limit=${limit}`);
};

export const createUser = async ({ name, email, phone, avatar, password }) => {
  return await axios.post(`/`, { name, email, phone, avatar, password });
};

export const updateUser = async ({ userData, userId }) => {
  return await axios.put(`/${userId}`, userData);
};

export const deleteUser = async (userId) => {
  return await axios.delete(`/${userId}`);
};

//Post
export const getAllPost = async (search="") => {
  return await axios.get(`/post?search=${search}`);
};

export const createPost = async ({
  userId,
  groupId = null,
  categoryId,
  content,
  image,
}) => {
  return await axios.post(`/post`, {
    userId,
    groupId,
    categoryId,
    content,
    image,
  });
};

export const updatePost = async ({ postId, postData }) => {
  return await axios.put(`/post/${postId}`, postData);
};

export const deletePost = async (postId) => {
  return await axios.delete(`/post/${postId}`);
};

//Category
export const getAllCategory = async (search="") => {
  return await axios.get(`/category?search=${search}`);
};

export const createCategory = async ({ name }) => {
  return await axios.post(`/category`, { name });
};

export const updateCategory = async ({ categoryId, name }) => {
  return await axios.put(`/category/`, { id: categoryId, name });
};

export const deleteCategory = async (categoryId) => {
  return await axios.delete(`/category/${categoryId}`);
};

//Group

export const getAllGroup = async (search="") => {
  return await axios.get(`/group?search=${search}`);
};

export const createGroup = async ({ name, description, image, userId }) => {
  return await axios.post(`/group`, { name, description, image, userId });
};

export const updateGroup = async ({ groupId, name, description, image }) => {
  return await axios.put(`/group/`, { id: groupId, name, description, image });
};

export const deleteGroup = async (groupId) => {
  return await axios.delete(`/group/${groupId}`);
};
