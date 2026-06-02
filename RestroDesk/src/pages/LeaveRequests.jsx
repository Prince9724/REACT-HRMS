import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchAllLeaveRequests, approveLeave, rejectLeave, markBackFromLeave } from '../features/leave/leaveSlice';
import { fetchEmployees } from '../features/employees/employeeSlice';
import { fetchTables, reassignAllTables } from '../features/tables/tablesSlice';
import Spinner from '../components/Common/Spinner';
import { CheckCircleIcon, XCircleIcon, UserGroupIcon, CalendarIcon } from '@heroicons/react/24/outline';

const LeaveRequests = () => {
  const dispatch = useAppDispatch();
  const { allRequests, isLoading } = useAppSelector(state => state.leave);
  const { list: employees } = useAppSelector(state => state.employees);

  useEffect(() => {
    dispatch(fetchAllLeaveRequests());
    dispatch(fetchEmployees());
  }, [dispatch]);

  const handleApprove = async (request) => {
    if (window.confirm(`Approve leave for ${request.employeeName}?`)) {
      await dispatch(approveLeave({ id: request.id, employeeId: request.employeeId }));
      // Reassign tables after employee goes on leave
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

  const pendingRequests = allRequests.filter(r => r.status === 'pending');
  const approvedRequests = allRequests.filter(r => r.status === 'approved');
  
  // Employees currently on leave
  const employeesOnLeave = employees.filter(e => e.role === 'employee' && e.isOnLeave);

  if (isLoading) return <Spinner />;

  return (
    <div className="space-y-6">
      {/* Pending Requests */}
      <div className="bg-white rounded-2xl shadow-lg p-5">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <CalendarIcon className="w-6 h-6 text-yellow-500" /> Pending Leave Requests ({pendingRequests.length})
        </h2>
        {pendingRequests.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No pending leave requests</p>
        ) : (
          <div className="space-y-3">
            {pendingRequests.map(req => (
              <div key={req.id} className="border rounded-lg p-4 flex flex-wrap justify-between items-center">
                <div>
                  <p className="font-semibold">{req.employeeName}</p>
                  <p className="text-sm text-gray-500">
                    {req.fromDate} to {req.toDate}
                  </p>
                  <p className="text-sm text-gray-500">Reason: {req.reason}</p>
                  <p className="text-xs text-gray-400">Requested: {new Date(req.requestedAt).toLocaleString()}</p>
                </div>
                <div className="flex gap-2 mt-2 sm:mt-0">
                  <button onClick={() => handleApprove(req)} className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700">
                    <CheckCircleIcon className="w-4 h-4" /> Approve
                  </button>
                  <button onClick={() => handleReject(req.id)} className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-700">
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
              <div key={emp.id} className="border rounded-lg p-4 flex flex-wrap justify-between items-center">
                <div>
                  <p className="font-semibold">{emp.name}</p>
                  <p className="text-sm text-gray-500">{emp.email}</p>
                </div>
                <button onClick={() => handleMarkBack(emp.id, emp.name)} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700">
                  <CheckCircleIcon className="w-4 h-4" /> Mark Back from Leave
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Approved/Rejected History */}
      <div className="bg-white rounded-2xl shadow-lg p-5">
        <h2 className="text-2xl font-bold mb-4">📋 Leave History</h2>
        {allRequests.filter(r => r.status !== 'pending').length === 0 ? (
          <p className="text-gray-500 text-center py-4">No leave history</p>
        ) : (
          <div className="space-y-2">
            {allRequests.filter(r => r.status !== 'pending').map(req => (
              <div key={req.id} className="border-b pb-2 flex justify-between items-center">
                <div>
                  <p className="font-medium">{req.employeeName}</p>
                  <p className="text-xs text-gray-500">{req.fromDate} to {req.toDate}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${req.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {req.status === 'approved' ? 'Approved' : 'Rejected'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaveRequests;