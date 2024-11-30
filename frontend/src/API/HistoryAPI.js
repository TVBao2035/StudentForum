import axios from '.././Configs//axios';

export const getAllHistoryByUserId = async (userId) => {
    return await axios.get(`/history/${userId}`);
}

export const updateStateHistory = async (historyId) => {
    return await axios.put(`history/${historyId}`);
}