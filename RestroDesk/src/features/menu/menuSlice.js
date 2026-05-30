import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import menuService from './menuService';

export const fetchMenu = createAsyncThunk('menu/fetch', async () => {
  return await menuService.getMenu();
});

export const addMenuItem = createAsyncThunk('menu/add', async (itemData) => {
  return await menuService.addMenuItem(itemData);
});

export const updateMenuItem = createAsyncThunk('menu/update', async ({ id, updates }) => {
  return await menuService.updateMenuItem(id, updates);
});

export const deleteMenuItem = createAsyncThunk('menu/delete', async (id) => {
  await menuService.deleteMenuItem(id);
  return id;
});

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
        state.error = action.error.message;
      })
      .addCase(addMenuItem.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateMenuItem.fulfilled, (state, action) => {
        const index = state.items.findIndex(i => i.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(deleteMenuItem.fulfilled, (state, action) => {
        state.items = state.items.filter(i => i.id !== action.payload);
      });
  },
});

export default menuSlice.reducer;