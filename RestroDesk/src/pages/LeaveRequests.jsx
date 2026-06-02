import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchAllLeaveRequests, approveLeave, rejectLeave, markBackFromLeave } from '../features/leave/leaveSlice';
import { fetchEmployees } from '../features/employees/employeeSlice';
import { fetchTables, reassignAllTables } from '../features/tables/tablesSlice';
import Spinner from '../components/Common/Spinner';
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  UserGroupIcon, 
  CalendarIcon,
  MagnifyingGlassIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';

const LeaveRequests = () => {
  const dispatch = useAppDispatch();
  const { allRequests, isLoading } = useAppSelector(state => state.leave);
  const { list: employees } = useAppSelector(state => state.employees);

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [historyFilter, setHistoryFilter] = useState('all'); // all, approved, rejected
  const [historyDateFilter, setHistoryDateFilter] = useState('');

  useEffect(() => {
    dispatch(fetchAllLeaveRequests());
    dispatch(fetchEmployees());
  }, [dispatch]);

  const handleApprove = async (request) => {
    if (window.confirm(`Approve leave for ${request.employeeName}?`)) {
      await dispatch(approveLeave({ id: request.id, employeeId: request.employeeId }));
      await dispatch(reassignAllTables());
      dispatch(fetchTables());
      dispatch(fetchAllLeaveRequests());
      alert(`${request.employeeName} is now on leave. Tables redistributed.`);
    }
  };

  const handleReject = async (id) => {
    if (window.confirm('Reject this leave request?')) {
      await dispatch(rejectLeave({ id }));
      dispatch(fetchAllLeaveRequests());
    }
  };

  const handleMarkBack = async (employeeId, employeeName) => {
    if (window.confirm(`${employeeName} is back from leave?`)) {
      await dispatch(markBackFromLeave(employeeId));
      await dispatch(reassignAllTables());
      dispatch(fetchTables());
      dispatch(fetchEmployees());
      dispatch(fetchAllLeaveRequests());
      alert(`${employeeName} is now active. Tables redistributed.`);
    }
  };

  // Filter pending requests with search
  let pendingRequests = allRequests.filter(r => r.status === 'pending');
  if (searchTerm.trim()) {
    const term = searchTerm.toLowerCase();
    pendingRequests = pendingRequests.filter(req =>
      req.employeeName.toLowerCase().includes(term) ||
      req.reason.toLowerCase().includes(term)
    );
  }

  // Employees on leave with search
  let employeesOnLeave = employees.filter(e => e.role === 'employee' && e.isOnLeave);
  if (searchTerm.trim()) {
    const term = searchTerm.toLowerCase();
    employeesOnLeave = employeesOnLeave.filter(emp =>
      emp.name.toLowerCase().includes(term) ||
      emp.email.toLowerCase().includes(term)
    );
  }

  // History requests with filters
  let historyRequests = allRequests.filter(r => r.status !== 'pending');
  
  // Filter by status (approved/rejected)
  if (historyFilter !== 'all') {
    historyRequests = historyRequests.filter(r => r.status === historyFilter);
  }
  
  // Filter by date
  if (historyDateFilter) {
    historyRequests = historyRequests.filter(r => {
      const requestDate = new Date(r.requestedAt).toISOString().split('T')[0];
      return requestDate === historyDateFilter;
    });
  }
  
  // Search in history
  if (searchTerm.trim()) {
    const term = searchTerm.toLowerCase();
    historyRequests = historyRequests.filter(req =>
      req.employeeName.toLowerCase().includes(term) ||
      req.reason?.toLowerCase().includes(term)
    );
  }
  
  // Sort history by date (newest first)
  historyRequests = [...historyRequests].sort((a, b) => new Date(b.requestedAt) - new Date(a.requestedAt));

  if (isLoading) return <Spinner />;

  return (
    <div className="space-y-6">
      {/* ✅ Search Bar - Common for all sections */}
      <div className="bg-white rounded-2xl shadow-lg p-4">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-[200px] flex items-center gap-2 border rounded-lg p-2 bg-gray-50">
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by employee name or reason..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="flex-1 outline-none bg-transparent"
            />
          </div>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="text-red-500 text-sm hover:text-red-700"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Pending Requests */}
      <div className="bg-white rounded-2xl shadow-lg p-5">
        <div className="flex flex-wrap justify-between items-center mb-4 gap-3">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-yellow-500" /> Pending Leave Requests ({pendingRequests.length})
          </h2>
        </div>
        {pendingRequests.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No pending leave requests</p>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {pendingRequests.map(req => (
              <div key={req.id} className="border rounded-lg p-4 flex flex-wrap justify-between items-center hover:bg-gray-50 transition">
                <div>
                  <p className="font-semibold text-lg">{req.employeeName}</p>
                  <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                    <CalendarIcon className="w-4 h-4" /> {req.fromDate} to {req.toDate}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Reason: {req.reason}</p>
                  <p className="text-xs text-gray-400 mt-1">Requested: {new Date(req.requestedAt).toLocaleString()}</p>
                </div>
                <div className="flex gap-2 mt-3 sm:mt-0">
                  <button onClick={() => handleApprove(req)} className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 transition">
                    <CheckCircleIcon className="w-4 h-4" /> Approve
                  </button>
                  <button onClick={() => handleReject(req.id)} className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-700 transition">
                    <XCircleIcon className="w-4 h-4" /> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Employees Currently On Leave */}
      <div className="bg-white rounded-2xl shadow-lg p-5">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <UserGroupIcon className="w-6 h-6 text-red-500" /> On Leave ({employeesOnLeave.length})
        </h2>
        {employeesOnLeave.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No employees on leave</p>
        ) : (
          <div className="space-y-3">
            {employeesOnLeave.map(emp => (
              <div key={emp.id} className="border rounded-lg p-4 flex flex-wrap justify-between items-center hover:bg-gray-50 transition">
                <div>
                  <p className="font-semibold">{emp.name}</p>
                  <p className="text-sm text-gray-500">{emp.email}</p>
                  <p className="text-xs text-gray-400 mt-1">Contact: {emp.contact || 'N/A'}</p>
                </div>
                <button onClick={() => handleMarkBack(emp.id, emp.name)} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition">
                  <CheckCircleIcon className="w-4 h-4" /> Mark Back from Leave
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Leave History with Filters */}
      <div className="bg-white rounded-2xl shadow-lg p-5">
        <div className="flex flex-wrap justify-between items-center mb-4 gap-3">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <FunnelIcon className="w-6 h-6 text-gray-600" /> Leave History ({historyRequests.length})
          </h2>
          <div className="flex flex-wrap gap-3">
            {/* Status Filter */}
            <select
              value={historyFilter}
              onChange={e => setHistoryFilter(e.target.value)}
              className="border rounded-lg p-2 text-sm bg-white"
            >
              <option value="all">All Status</option>
              <option value="approved">Approved Only</option>
              <option value="rejected">Rejected Only</option>
            </select>
            
            {/* Date Filter */}
            <input
              type="date"
              value={historyDateFilter}
              onChange={e => setHistoryDateFilter(e.target.value)}
              className="border rounded-lg p-2 text-sm"
              placeholder="Filter by date"
            />
            
            {/* Clear Filters Button */}
            {(historyFilter !== 'all' || historyDateFilter) && (
              <button
                onClick={() => {
                  setHistoryFilter('all');
                  setHistoryDateFilter('');
                }}
                className="text-red-500 text-sm hover:text-red-700 px-2"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
        
        {historyRequests.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No leave history found</p>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="p-3 text-left">Employee</th>
                  <th className="p-3 text-left">Leave Period</th>
                  <th className="p-3 text-left">Reason</th>
                  <th className="p-3 text-left">Requested On</th>
                  <th className="p-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {historyRequests.map(req => (
                  <tr key={req.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">{req.employeeName}</td>
                    <td className="p-3 text-sm">
                      <CalendarIcon className="w-4 h-4 inline mr-1 text-gray-400" />
                      {req.fromDate} → {req.toDate}
                    </td>
                    <td className="p-3 text-sm text-gray-600">{req.reason || '—'}</td>
                    <td className="p-3 text-sm text-gray-500">{new Date(req.requestedAt).toLocaleDateString()}</td>
                    <td className="p-3 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1 ${
                        req.status === 'approved' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {req.status === 'approved' ? (
                          <CheckCircleIcon className="w-3 h-3" />
                        ) : (
                          <XCircleIcon className="w-3 h-3" />
                        )}
                        {req.status === 'approved' ? 'Approved' : 'Rejected'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaveRequests;