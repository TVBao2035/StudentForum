import { configureStore } from '@reduxjs/toolkit'
import userReducer from './userSlice';
import loadingReducer from './loadingSlice';
import postReducer from './postSlice';
import modalReducer from './modalSlice';
import themesReducer from './themesSlice';

const store = configureStore({
    reducer: {
        user: userReducer,
        loading: loadingReducer,
        post: postReducer,
        modal: modalReducer,
        themes: themesReducer
    },
});

export default store;