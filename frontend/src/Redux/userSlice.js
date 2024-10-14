import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    id: '',
    name: '',
    avatar: '',
    phone: '',
    email: '',
    isAdmin: false,
    token: ''
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setName: (state, action) => {
            state.name = action.payload;
        },
        setAll: (state, action) => {
            state.token = action.payload.token;
            state.id = action.payload.id;
            state.name = action.payload.name;
            state.avatar = action.payload.avatar;
            state.isAdmin = action.payload.isAdmin;
            state.email = action.payload.email;
            state.phone = action.payload.phone;
        }
    }
});

export const {setName, setAll} = userSlice.actions;

export { initialState };

export default userSlice.reducer;

