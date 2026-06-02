import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../services/axiosInstance';

// Fetch all tables
export const fetchTables = createAsyncThunk('tables/fetch', async () => {
  const res = await axios.get('/tables');
  return res.data;
});

// Add a new table
export const addTable = createAsyncThunk('tables/add', async (tableNumber) => {
  const newTable = { number: parseInt(tableNumber), assignedTo: null };
  const res = await axios.post('/tables', newTable);
  return res.data;
});

// Delete a table
export const deleteTable = createAsyncThunk('tables/delete', async (id) => {
  await axios.delete(`/tables/${id}`);
  return id;
});

// Assign a single table (by manager)
export const assignTable = createAsyncThunk('tables/assign', async ({ id, assignedTo }) => {
  const res = await axios.patch(`/tables/${id}`, { assignedTo });
  return res.data;
});

// Reassign all tables equally among ACTIVE waiters (not on leave)
export const reassignAllTables = createAsyncThunk('tables/reassignAll', async (_, { getState }) => {
  const state = getState();
  const tables = state.tables.list;
  const users = state.employees.list; // employees list from employees slice
  const activeWaiters = users.filter(u => u.role === 'employee' && !u.isOnLeave);
  if (activeWaiters.length === 0) return tables;

  // Sort tables by id to keep order
  const sortedTables = [...tables].sort((a,b) => a.id - b.id);
  const result = [];
  for (let i = 0; i < sortedTables.length; i++) {
    const waiterIndex = i % activeWaiters.length;
    const assignedTo = activeWaiters[waiterIndex].id;
    const updated = { ...sortedTables[i], assignedTo };
    // Patch each table
    await axios.patch(`/tables/${sortedTables[i].id}`, { assignedTo });
    result.push(updated);
  }
  return result;
});

const tablesSlice = createSlice({
  name: 'tables',
  initialState: { list: [], isLoading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTables.pending, (state) => { state.isLoading = true; })
      .addCase(fetchTables.fulfilled, (state, action) => {
        state.isLoading = false;
        state.list = action.payload;
      })
      .addCase(fetchTables.rejected, (state, action) => { state.isLoading = false; state.error = action.error.message; })
      .addCase(addTable.fulfilled, (state, action) => { state.list.push(action.payload); })
      .addCase(deleteTable.fulfilled, (state, action) => { state.list = state.list.filter(t => t.id !== action.payload); })
      .addCase(assignTable.fulfilled, (state, action) => {
        const idx = state.list.findIndex(t => t.id === action.payload.id);
        if (idx !== -1) state.list[idx] = action.payload;
      })
      .addCase(reassignAllTables.fulfilled, (state, action) => { state.list = action.payload; });
  },
});

export default tablesSlice.reducer; 