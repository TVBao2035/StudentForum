import axios from '../Configs/axios';

export const getFriendsByUserId = async (userId) => {
    return await axios.get(`/friend/user/${userId}`);
}

export const getFriendInvitation = async (friendId) => {
    return await axios.get(`/friend/invite/${friendId}`);
}

export const acceptFriendInvitation = async (userId, friendId, id) => {
    return await axios.post('/friend/accept', {id, userId, friendId});
}

export const cancelFriendInvitation = async (userId, friendId) => {
    return await axios.delete(`/friend/invite/cancel?userId=${userId}&friendId=${friendId}`);
}
export const deleteFriend = async (userId, friendId) => {
    return await axios.delete(`/friend?userId=${userId}&friendId=${friendId}`);
}
export const deleteInvitation = async (userId, friendId) => {
    return await axios.delete(`/friend/invite?userId=${userId}&friendId=${friendId}`);
}
export const createInvitation = async (userId, friendId) => {
    return await axios.post(`/friend/invite`, {userId, friendId});
}