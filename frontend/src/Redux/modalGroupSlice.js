import { createSlice } from "@reduxjs/toolkit";



const initialState = {
    modalCreate: {
        isOpen: false
    },
    modalUpdate: {
        isOpen: false,
        id: null,
        name: "",
        description: "",
        image: "",
    },
    modalDelete: {
        isOpen: false
    }
}
export const modalGroupSlice = createSlice({
    name: 'modalGroup',
    initialState: initialState,
    reducers: {
        openModalCreateGroup: (state, action) => {
            state.modalCreate.isOpen = true;
        },
        closeModalCreateGroup: (state, action) => {
            state.modalCreate.isOpen = false;
        },
        openModalUpdateGroup: (state, action ) => {
            state.modalUpdate.isOpen = true;
            state.modalUpdate.id = action.payload.id;
            state.modalUpdate.name = action.payload.name;
            state.modalUpdate.image = action.payload.image;
            state.modalUpdate.description = action.payload.description;
        },
        closeModalUpdateGroup: (state, action) => {
            state.modalUpdate.isOpen = false;
            state.modalUpdate.id = null;
            state.modalUpdate.name = "";
            state.modalUpdate.image = "";
            state.modalUpdate.description = "";
        },
    }
});

export const { openModalCreateGroup, closeModalCreateGroup, openModalUpdateGroup, closeModalUpdateGroup } = modalGroupSlice.actions;
export default modalGroupSlice.reducer;