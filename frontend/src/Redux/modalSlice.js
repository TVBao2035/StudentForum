import { combineReducers } from "@reduxjs/toolkit";
import modalPostReducer from './modalPostSlice';
import modalGroupReducer from './modalGroupSlice';
import modalChangePasswordReducer from './modalChangePassword';
 const modalSlice = combineReducers({
                                        modaPost: modalPostReducer, 
                                        modalGroup:  modalGroupReducer, 
                                        modalChangePassword: modalChangePasswordReducer
                                    });

export default modalSlice;