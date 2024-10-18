import { configureStore } from '@reduxjs/toolkit'
import userReducer from './userSlice';
import loadingReducer from './loadingSlice';
import postReducer from './postSlice';
const store = configureStore({
    reducer: {
        user: userReducer,
        loading: loadingReducer,
        post: postReducer,
    },
});

export default store;