import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../services/axiosInstance';

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
export const approveLeave = createAsyncThunk('leave/approve', async ({ id, employeeId }) => {
  // Update leave request status
  await axios.patch(`/leaveRequests/${id}`, { status: 'approved' });
  // Update employee isOnLeave to true
  await axios.patch(`/users/${employeeId}`, { isOnLeave: true });
  return { id, employeeId };
});

// Reject leave (manager)
export const rejectLeave = createAsyncThunk('leave/reject', async ({ id }) => {
  await axios.patch(`/leaveRequests/${id}`, { status: 'rejected' });
  return id;
});

// Mark employee back from leave (manager)
export const markBackFromLeave = createAsyncThunk('leave/markBack', async (employeeId) => {
  await axios.patch(`/users/${employeeId}`, { isOnLeave: false });
  // Also mark all pending leave requests as completed or just delete? Better to close them
  const leaveRequests = await axios.get(`/leaveRequests?employeeId=${employeeId}&status=approved`);
  for (const req of leaveRequests.data) {
    await axios.patch(`/leaveRequests/${req.id}`, { status: 'completed' });
  }
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
      .addCase(fetchMyLeaveRequests.pending, (state) => { state.isLoading = true; })
      .addCase(fetchMyLeaveRequests.fulfilled, (state, action) => {
        state.isLoading = false;
        state.myRequests = action.payload;
      })
      .addCase(requestLeave.fulfilled, (state, action) => {
        state.myRequests.push(action.payload);
      })
      .addCase(approveLeave.fulfilled, (state, action) => {
        const idx = state.allRequests.findIndex(r => r.id === action.payload.id);
        if (idx !== -1) state.allRequests[idx].status = 'approved';
      })
      .addCase(rejectLeave.fulfilled, (state, action) => {
        const idx = state.allRequests.findIndex(r => r.id === action.payload);
        if (idx !== -1) state.allRequests[idx].status = 'rejected';
      });
  },
});

export default leaveSlice.reducer;