import { configureStore } from '@reduxjs/toolkit'
import userReducer from './User/userSlice';

const store = configureStore({
    reducer: {
        user: userReducer
    },
});

export default store;