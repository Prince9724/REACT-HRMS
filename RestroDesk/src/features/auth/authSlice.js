import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from './authService';

export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }, thunkAPI) => {
    try {
      console.log('📤 Dispatching loginUser:', email);
      const user = await authService.login(email, password);
      console.log('📥 loginUser success:', user);
      return user;
    } catch (error) {
      console.error('❌ loginUser error:', error.message);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const initialState = {
  user: null,
  isLoading: false,  // ✅ Changed to false initially to avoid infinite spinner
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isLoading = false;
      state.error = null;
      localStorage.removeItem('reduxState');
      console.log('🚪 Logged out');
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.isLoading = false;
      state.error = null;
      console.log('👤 User set:', action.payload?.name);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        console.log('⏳ Login pending...');
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.error = null;
        console.log('✅ Login fulfilled:', action.payload?.name);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        console.error('❌ Login rejected:', action.payload);
      });
  },
});

export const { logout, setUser } = authSlice.actions;
export default authSlice.reducer;