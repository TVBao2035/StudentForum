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

export const createGroup = async (data) => {
    return await axios.post(`/group`, data)
}

export const updateGroup = async({ name, description, image, id}) => {
    return await axios.put(`/group`, { name, description, image, id })
}

export const deleteGroup = async (groupId) => {
    return await axios.delete(`/group/${groupId}`);
}

export const getAllGroupInvitation = async (groupId) => {
    return await axios.get(`/group/invitation/${groupId}`);
}

export const createGroupInvitation = async ({groupId, userId}) => {
    return await axios.post(`/group/invitation`, {groupId, userId});
}

export const deleteGroupInvitation = async (invitationId) => {
    return await axios.delete(`/group/invitation/${invitationId}`);
}

export const updateStateGroupInvitation = async (invitationId) => {
    return await axios.put(`/group/invitation/${invitationId}`);
}