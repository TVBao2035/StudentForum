import { createSlice } from "@reduxjs/toolkit";

const initialState = { 
    isOpen: false
}


export const modalChangePassword = createSlice({
    name: 'modalChangePassword',
    initialState: initialState,
    reducers: {
        openModalChangePassword: (state, action) =>{
            state.isOpen = true;
        },
        closeModalChangePassword: (state, action) => {
            state.isOpen = false;
        }
    }
});

export const {openModalChangePassword, closeModalChangePassword} = modalChangePassword.actions;

export default modalChangePassword.reducer;