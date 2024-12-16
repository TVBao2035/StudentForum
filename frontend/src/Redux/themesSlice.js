import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isChangeThemes: false
}

export const themesSlice = createSlice({
    name: 'themes',
    initialState: initialState,
    reducers: {
        setChangeThemes: (state, action) => {
            state.isChangeThemes = action.payload;
        }
    }
});

export const { setChangeThemes } = themesSlice.actions;

export default themesSlice.reducer;