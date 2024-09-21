import axios from '../Configs/axios.js';

export const signIn = ({email, password})=>{
    return axios.post('/signIn', {email, password});
}

export const signUp = ({ userName, email, password }) => {
    return axios.post('/signUp', { userName, email, password });
}

export const getAll = () => {
    return axios.get('');
}

