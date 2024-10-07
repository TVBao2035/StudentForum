import axios from '../Configs/axios.js';

export const refresh = () => {
    return axios.get('/refresh');
}
export const logOut = () => {
    return axios.get('/logout');
}
export const signIn = ({email, password})=>{
    return axios.post('/signIn', {email, password});
}

export const signUp = ({ name, email, phone, password }) => {
    return axios.post('/signUp', { name, email, phone, password });
}

export const getAll = () => {
    return axios.get('');
}

export const getDetails = (userId) => {
    return axios.get(`/${userId}`);
}

