import { combineReducers } from "@reduxjs/toolkit";
import modalPostReducer from './modalPostSlice';
import modalGroupReducer from './modalGroupSlice';

 const modalSlice = combineReducers({modaPost: modalPostReducer, modalGroup:  modalGroupReducer});

export default modalSlice;