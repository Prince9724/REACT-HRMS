import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import orderService from './orderService';

export const createOrder = createAsyncThunk('orders/create', async (orderData) => {
  return await orderService.createOrder(orderData);
});

export const fetchAllOrders = createAsyncThunk('orders/fetchAll', async () => {
  return await orderService.fetchAllOrders();
});

export const fetchMyOrders = createAsyncThunk('orders/fetchMy', async (employeeId) => {
  return await orderService.fetchOrdersByEmployee(employeeId);
});

export const updateOrderStatus = createAsyncThunk('orders/updateStatus', async ({ id, status }) => {
  return await orderService.updateOrderStatus(id, status);
});

// ✅ Add this new thunk for full order update
export const updateOrder = createAsyncThunk('orders/update', async ({ id, updates }) => {
  return await orderService.updateOrder(id, updates);
});

const orderSlice = createSlice({
  name: 'orders',
  initialState: { allOrders: [], myOrders: [], isLoading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllOrders.pending, (state) => { state.isLoading = true; })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.allOrders = action.payload;
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(fetchMyOrders.pending, (state) => { state.isLoading = true; })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.myOrders = action.payload;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.allOrders.push(action.payload);
        state.myOrders.push(action.payload);
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const updated = action.payload;
        const updateList = (list) => {
          const idx = list.findIndex(o => o.id === updated.id);
          if (idx !== -1) list[idx] = updated;
        };
        updateList(state.allOrders);
        updateList(state.myOrders);
      })
      // ✅ Add handler for updateOrder
      .addCase(updateOrder.fulfilled, (state, action) => {
        const updated = action.payload;
        const updateList = (list) => {
          const idx = list.findIndex(o => o.id === updated.id);
          if (idx !== -1) list[idx] = updated;
        };
        updateList(state.allOrders);
        updateList(state.myOrders);
      });
  },
});

export default orderSlice.reducer;