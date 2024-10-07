import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isLoading: false,
    isLoadingOrther: false
}

export const laodingSlice = createSlice({
    name: 'loading',
    initialState: initialState,
    reducers: {
        setLoading: (state, action)=>{
            state.isLoading = action.payload
        },
        setLoadingOrther: (state, action) => {
            state.isLoadingOrther = action.payload
        }
    }
});

export const { setLoading, setLoadingOrther } = laodingSlice.actions;

export default laodingSlice.reducer;