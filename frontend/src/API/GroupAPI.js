import axios from '.././Configs//axios';


export const getAllGroupJoin = async (userId) => {
    return await axios.get(`/group/user/${userId}`);
}
export const getAllGroup = async() => {
    return await axios.get('/group');
}

export const getDetailGroup = async (groupId) => {
    return await axios.get(`/group/${groupId}`);
}