import axios from '../Configs/axios';

export const getFriendsByUserId = async (userId) => {
    return await axios.get(`/friend/user/${userId}`);
}