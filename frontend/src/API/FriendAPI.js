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