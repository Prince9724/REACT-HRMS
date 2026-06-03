import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from './authService';

export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }, thunkAPI) => {
    try {
      return await authService.login(email, password);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const initialState = {
  user: null,
  isLoading: true,  // ✅ Start with loading true
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isLoading = false;
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.isLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, setUser } = authSlice.actions;
export default authSlice.reducer;