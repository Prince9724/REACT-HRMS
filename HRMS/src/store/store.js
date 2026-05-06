import { configureStore } from "@reduxjs/toolkit"
import userReducer from "../feature/userslice/userSlice"
import attendanceReducer from "../feature/AttendenceSlice.js"

export const store = configureStore({
  reducer: {
    user: userReducer,
    attendance: attendanceReducer
  }
})