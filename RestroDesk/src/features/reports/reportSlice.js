import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchSalesReport } from './reportService';

export const getSalesReport = createAsyncThunk('reports/sales', async ({ startDate, endDate }) => {
  return await fetchSalesReport(startDate, endDate);
});

const reportSlice = createSlice({
  name: 'reports',
  initialState: { sales: null, topDishes: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getSalesReport.pending, (state) => { state.loading = true; })
      .addCase(getSalesReport.fulfilled, (state, action) => {
        state.loading = false;
        state.sales = action.payload.totalSales;
        state.totalOrders = action.payload.totalOrders;
        state.topDishes = action.payload.topDishes;
      })
      .addCase(getSalesReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default reportSlice.reducer;