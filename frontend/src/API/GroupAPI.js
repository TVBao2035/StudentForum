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

export const getAllGroupInvitation = async (groupId) => {
    return await axios.get(`/group/invitation/${groupId}`);
}

export const createGroupInvitation = async ({groupId, userId}) => {
    return await axios.post(`/group/invitation`, {groupId, userId});
}