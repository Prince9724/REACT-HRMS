import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const API = "http://localhost:3000/employe"

// ✅ GET
export const fetchUser = createAsyncThunk(
  "user/fetch",
  async () => {
    const res = await axios.get(API)
    return res.data
  }
)

// ✅ DELETE
export const deleteUser = createAsyncThunk(
  "user/delete",
  async (id) => {
    await axios.delete(`${API}/${id}`)
    return id
  }
)

// ✅ UPDATE
export const updateUser = createAsyncThunk(
  "user/update",
  async (updatedUser) => {

    // 🔥 IMPORTANT FIX (salary number me convert)
    const res = await axios.put(`${API}/${updatedUser.id}`, {
      ...updatedUser,
      salary: Number(updatedUser.salary)
    })

    return res.data
  }
)

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      // FETCH
      .addCase(fetchUser.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.status = "succeeded"

        // 🔥 SIMPLE DIRECT ASSIGN (NO FILTER)
        state.user = action.payload || []
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.error = action.error.message
        state.status = "failed"
      })

      // DELETE
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.user = state.user.filter(u => u.id !== action.payload)
      })

      // UPDATE
      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.user.findIndex(u => u.id === action.payload.id)
        if (index !== -1) {
          state.user[index] = action.payload
        }
      })
  }
})

export default userSlice.reducer