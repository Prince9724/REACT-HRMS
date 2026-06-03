import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../services/axiosInstance';
import { reassignAllTables, fetchTables } from '../tables/tablesSlice';

// Fetch all leave requests (manager)
export const fetchAllLeaveRequests = createAsyncThunk('leave/fetchAll', async () => {
  const res = await axios.get('/leaveRequests');
  return res.data;
});

// Fetch my leave requests (employee)
export const fetchMyLeaveRequests = createAsyncThunk('leave/fetchMy', async (employeeId) => {
  const res = await axios.get(`/leaveRequests?employeeId=${employeeId}`);
  return res.data;
});

// Request leave (employee)
export const requestLeave = createAsyncThunk('leave/request', async (leaveData) => {
  const newRequest = {
    ...leaveData,
    status: 'pending',
    requestedAt: new Date().toISOString()
  };
  const res = await axios.post('/leaveRequests', newRequest);
  return res.data;
});

// Approve leave (manager)
export const approveLeave = createAsyncThunk('leave/approve', async ({ id, employeeId }, { dispatch }) => {
  // Update leave request status
  await axios.patch(`/leaveRequests/${id}`, { status: 'approved' });
  // Update employee isOnLeave to true
  await axios.patch(`/users/${employeeId}`, { isOnLeave: true });
  
  // Reassign tables after employee goes on leave
  await dispatch(reassignAllTables());
  await dispatch(fetchTables());
  
  return { id, employeeId };
});

// Reject leave (manager) - ✅ FIXED
export const rejectLeave = createAsyncThunk('leave/reject', async ({ id }, { dispatch }) => {
  // Update leave request status to 'rejected'
  await axios.patch(`/leaveRequests/${id}`, { status: 'rejected' });
  return { id };
});

// Mark employee back from leave (manager)
export const markBackFromLeave = createAsyncThunk('leave/markBack', async (employeeId, { dispatch }) => {
  await axios.patch(`/users/${employeeId}`, { isOnLeave: false });
  
  // Also mark all approved leave requests as completed
  const leaveRequests = await axios.get(`/leaveRequests?employeeId=${employeeId}&status=approved`);
  for (const req of leaveRequests.data) {
    await axios.patch(`/leaveRequests/${req.id}`, { status: 'completed' });
  }
  
  // Reassign tables after employee returns from leave
  await dispatch(reassignAllTables());
  await dispatch(fetchTables());
  
  return employeeId;
});

const leaveSlice = createSlice({
  name: 'leave',
  initialState: { 
    allRequests: [], 
    myRequests: [], 
    isLoading: false, 
    error: null 
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllLeaveRequests.pending, (state) => { state.isLoading = true; })
      .addCase(fetchAllLeaveRequests.fulfilled, (state, action) => {
        state.isLoading = false;
        state.allRequests = action.payload;
      })
      .addCase(fetchAllLeaveRequests.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(fetchMyLeaveRequests.pending, (state) => { state.isLoading = true; })
      .addCase(fetchMyLeaveRequests.fulfilled, (state, action) => {
        state.isLoading = false;
        state.myRequests = action.payload;
      })
      .addCase(requestLeave.fulfilled, (state, action) => {
        state.myRequests.push(action.payload);
        state.allRequests.push(action.payload);
      })
      .addCase(approveLeave.fulfilled, (state, action) => {
        const idx = state.allRequests.findIndex(r => r.id === action.payload.id);
        if (idx !== -1) state.allRequests[idx].status = 'approved';
        const myIdx = state.myRequests.findIndex(r => r.id === action.payload.id);
        if (myIdx !== -1) state.myRequests[myIdx].status = 'approved';
      })
      // ✅ FIXED: rejectLeave handler
      .addCase(rejectLeave.fulfilled, (state, action) => {
        const idx = state.allRequests.findIndex(r => r.id === action.payload.id);
        if (idx !== -1) state.allRequests[idx].status = 'rejected';
        const myIdx = state.myRequests.findIndex(r => r.id === action.payload.id);
        if (myIdx !== -1) state.myRequests[myIdx].status = 'rejected';
      })
      .addCase(markBackFromLeave.fulfilled, (state, action) => {
        const employeeRequests = state.allRequests.filter(r => r.employeeId === action.payload && r.status === 'approved');
        employeeRequests.forEach(req => req.status = 'completed');
      });
  },
});

export default leaveSlice.reducer;