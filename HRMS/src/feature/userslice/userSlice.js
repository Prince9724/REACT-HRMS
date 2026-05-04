import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

export const fetchUser = createAsyncThunk(
    "user/fetch",
    async () => {
        const res = await axios.get("http://localhost:3000/employe") // ✅ spelling fix
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
    }
})

export default userSlice.reducer