import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import employeeService from './employeeService';

export const fetchEmployees = createAsyncThunk('employees/fetch', async () => {
  return await employeeService.fetchEmployees();
});

export const addEmployee = createAsyncThunk('employees/add', async (empData) => {
  return await employeeService.addEmployee(empData);
});

export const updateEmployee = createAsyncThunk('employees/update', async ({ id, updates }) => {
  return await employeeService.updateEmployee(id, updates);
});

export const deleteEmployee = createAsyncThunk('employees/delete', async (id) => {
  await employeeService.deleteEmployee(id);
  return id;
});

const employeeSlice = createSlice({
  name: 'employees',
  initialState: { list: [], isLoading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployees.pending, (state) => { state.isLoading = true; })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.isLoading = false;
        state.list = action.payload;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(addEmployee.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(updateEmployee.fulfilled, (state, action) => {
        const idx = state.list.findIndex(e => e.id === action.payload.id);
        if (idx !== -1) state.list[idx] = action.payload;
      })
      .addCase(deleteEmployee.fulfilled, (state, action) => {
        state.list = state.list.filter(e => e.id !== action.payload);
      });
  },
});

export default employeeSlice.reducer;