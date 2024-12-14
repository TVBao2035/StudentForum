import axios from '../Configs/axios.js';

export const refresh = async () => {
    return await axios.get('/refresh');
}
export const logOut = async () => {
    return await axios.get('/logout');
}
export const signIn = async ({email, password})=>{
    return await axios.post('/signIn', {email, password});
}

export const signUp = async ({ name, email, phone, password }) => {
    return await axios.post('/signUp', { name, email, phone, password });
}

export const getAll = async (search="") => {
    return await axios.get(`?search=${search}`);
}

export const getDetails = async (userId) => {
    return await axios.get(`/${userId}`);
}


export const updateUser = async ({id, name, avatar, phone, email}) => {
    return await axios.put(`/${id}`, {name, email, avatar, phone});
}
