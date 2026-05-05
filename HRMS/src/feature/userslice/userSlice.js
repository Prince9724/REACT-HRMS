import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

// ✅ GET
export const fetchUser = createAsyncThunk(
    "user/fetch",
    async () => {
        const res = await axios.get("http://localhost:3000/employe")
        return res.data
    }
)

// ✅ DELETE
export const deleteUser = createAsyncThunk(
    "user/delete",
    async (id) => {
        await axios.delete(`http://localhost:3000/employe/${id}`)
        return id
    }
)

// ✅ UPDATE
export const updateUser = createAsyncThunk(
    "user/update",
    async (updatedUser) => {
        const res = await axios.put(
            `http://localhost:3000/employe/${updatedUser.id}`,
            updatedUser
        )
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
                state.user = action.payload
                state.status = "succeeded"
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