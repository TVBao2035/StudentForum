import axios from '../Configs/axios';

export const getFriendsByUserId = async (userId) => {
    return await axios.get(`/friend/user/${userId}`);
}

export const getFriendInvitation = async (friendId) => {
    return await axios.get(`/friend/invite/${friendId}`);
}

export const acceptFriendInvitation = async (id, userId, friendId) => {
    return await axios.post('/friend/accept', {id, userId, friendId});
}

export const deleteFriendInvitation = async (invitationId) => {
    return await axios.delete(`/friend/invite/${invitationId}`);
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