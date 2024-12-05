import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    modalCreate: {
        isOpen: false,
    }
}

export const modalPostSlice = createSlice({
    name: 'modalPost',
    initialState: initialState,
    reducers: {
        openModalCreatePost: (state, action) => {
            state.modalCreate.isOpen = true;
        },
        closeModalCreatePost: (state, action) => {
            state.modalCreate.isOpen = false;
        }
    }
})

export const { openModalCreatePost, closeModalCreatePost } = modalPostSlice.actions;

export default modalPostSlice.reducer;