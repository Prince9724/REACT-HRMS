import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

const API = "http://localhost:3000/attendance"

// ✅ GET attendance
export const fetchAttendance = createAsyncThunk(
  "attendance/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(API)
      return res.data
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

// ✅ ADD attendance (check-in)
export const addAttendance = createAsyncThunk(
  "attendance/add",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post(API, data)
      return res.data
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

const attendanceSlice = createSlice({
  name: "attendance",
  initialState: {
    attendance: [],
    status: "idle",
    error: null
  },
  reducers: {},

  extraReducers: (builder) => {
    builder
      // ✅ FETCH
      .addCase(fetchAttendance.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchAttendance.fulfilled, (state, action) => {
        state.status = "succeeded"

        // 🔥 safe data handling
        state.attendance = (action.payload || []).filter(
          (a) => a && typeof a === "object"
        )
      })
      .addCase(fetchAttendance.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload || action.error.message
      })

      // ✅ ADD (check-in)
      .addCase(addAttendance.fulfilled, (state, action) => {
        state.attendance.push(action.payload)
      })
      .addCase(addAttendance.rejected, (state, action) => {
        state.error = action.payload
      })
  }
})

export default attendanceSlice.reducer