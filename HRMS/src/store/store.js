import { configureStore } from "@reduxjs/toolkit";
import userReducer  from '../feature/userslice/userSlice.js';

export const store = configureStore({
    
    reducer:{
        user:userReducer
    }     
})
 