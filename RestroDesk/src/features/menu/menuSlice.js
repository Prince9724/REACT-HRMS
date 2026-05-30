import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import menuService from './menuService';

// Async thunks
export const fetchMenu = createAsyncThunk('menu/fetch', async (_, thunkAPI) => {
  try {
    return await menuService.getMenu();
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const addMenuItem = createAsyncThunk('menu/add', async (itemData, thunkAPI) => {
  try {
    return await menuService.addItem(itemData);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

// Slice
const menuSlice = createSlice({
  name: 'menu',
  initialState: { items: [], isLoading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMenu.pending, (state) => { state.isLoading = true; })
      .addCase(fetchMenu.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchMenu.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(addMenuItem.fulfilled, (state, action) => {
        state.items.push(action.payload);
      });
  },
});

export default menuSlice.reducer;