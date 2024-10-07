import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    token: '',
    id: '',
    name: '',
    avatar: '',
    isAdmin: false,
    email: '',
    phone: '',
    friends: [],
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setName: (state, action) => {
            state.name = action.payload;
        },
        setDataMain: (state, action) => {
            state.token = action.payload.token;
            state.id = action.payload.id;
            state.name = action.payload.name;
            state.avatar = action.payload.avatar;
            state.isAdmin = action.payload.isAdmin;
        },
        setData: (state, action) => {
            state.email = action.payload.email;
            state.phone = action.payload.phone;
            state.friends = action.payload.friends;
        }
    }
});

export const { setName, setData, setDataMain } = userSlice.actions;

export default userSlice.reducer;