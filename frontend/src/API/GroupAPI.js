import axios from '.././Configs//axios';

export const getAllGroup = async() => {
    return await axios.get('/group');
}