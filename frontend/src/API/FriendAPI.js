import axios from '../Configs/axios';

export const getFriendsByUserId = async (userId) => {
    return await axios.get(`/friend/user/${userId}`);
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