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
  FunnelIcon,
  ClockIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

const LeaveRequests = () => {
  const dispatch = useAppDispatch();
  const { allRequests, isLoading } = useAppSelector(state => state.leave);
  const { list: employees } = useAppSelector(state => state.employees);

  const [searchTerm, setSearchTerm] = useState('');
  const [historyFilter, setHistoryFilter] = useState('all');
  const [historyDateFilter, setHistoryDateFilter] = useState('');
  const [activeTab, setActiveTab] = useState('pending');

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
    }
  };

  let pendingRequests = allRequests.filter(r => r.status === 'pending');
  if (searchTerm.trim()) {
    const term = searchTerm.toLowerCase();
    pendingRequests = pendingRequests.filter(req =>
      req.employeeName.toLowerCase().includes(term) ||
      req.reason?.toLowerCase().includes(term)
    );
  }

  let employeesOnLeave = employees.filter(e => e.role === 'employee' && e.isOnLeave);
  if (searchTerm.trim()) {
    const term = searchTerm.toLowerCase();
    employeesOnLeave = employeesOnLeave.filter(emp =>
      emp.name.toLowerCase().includes(term) ||
      emp.email.toLowerCase().includes(term)
    );
  }

  let historyRequests = allRequests.filter(r => r.status !== 'pending');
  if (historyFilter !== 'all') {
    historyRequests = historyRequests.filter(r => r.status === historyFilter);
  }
  if (historyDateFilter) {
    historyRequests = historyRequests.filter(r => {
      const requestDate = new Date(r.requestedAt).toISOString().split('T')[0];
      return requestDate === historyDateFilter;
    });
  }
  if (searchTerm.trim()) {
    const term = searchTerm.toLowerCase();
    historyRequests = historyRequests.filter(req =>
      req.employeeName.toLowerCase().includes(term) ||
      req.reason?.toLowerCase().includes(term)
    );
  }
  historyRequests = [...historyRequests].sort((a, b) => new Date(b.requestedAt) - new Date(a.requestedAt));

  if (isLoading) return <Spinner />;

  return (
    <div className="space-y-6">
      {/* Header Stats Cards - White Background with Shadow & Hover */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {/* Pending Requests Card */}
        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-5 border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm mb-1">Pending Requests</p>
              <p className="text-3xl font-bold text-gray-800">{pendingRequests.length}</p>
            </div>
            <div className="bg-blue-100 rounded-xl p-3">
              <ClockIcon className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>

        {/* On Leave Card */}
        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-5 border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm mb-1">On Leave</p>
              <p className="text-3xl font-bold text-yellow-600">{employeesOnLeave.length}</p>
            </div>
            <div className="bg-yellow-100 rounded-xl p-3">
              <UserGroupIcon className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
        </div>

        {/* Approved Card */}
        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-5 border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm mb-1">Approved</p>
              <p className="text-3xl font-bold text-green-600">{allRequests.filter(r => r.status === 'approved').length}</p>
            </div>
            <div className="bg-green-100 rounded-xl p-3">
              <CheckCircleIcon className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>

        {/* Rejected Card */}
        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-5 border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm mb-1">Rejected</p>
              <p className="text-3xl font-bold text-red-600">{allRequests.filter(r => r.status === 'rejected').length}</p>
            </div>
            <div className="bg-red-100 rounded-xl p-3">
              <XCircleIcon className="w-8 h-8 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl shadow-lg p-5">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-[250px] flex items-center gap-3 border rounded-xl px-4 py-2.5 bg-gray-50 focus-within:ring-2 focus-within:ring-[#1a237e] focus-within:border-transparent">
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by employee name or reason..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="flex-1 outline-none bg-transparent text-gray-700"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="text-gray-400 hover:text-gray-600">
                <XCircleIcon className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('pending')}
            className={`flex-1 px-6 py-4 text-center font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
              activeTab === 'pending'
                ? 'bg-gradient-to-r from-[#1a237e] to-[#4a148c] text-white'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <ClockIcon className="w-5 h-5" /> Pending Requests
            {pendingRequests.length > 0 && (
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                activeTab === 'pending' ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'
              }`}>
                {pendingRequests.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('onleave')}
            className={`flex-1 px-6 py-4 text-center font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
              activeTab === 'onleave'
                ? 'bg-gradient-to-r from-[#1a237e] to-[#4a148c] text-white'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <UserGroupIcon className="w-5 h-5" /> On Leave
            {employeesOnLeave.length > 0 && (
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                activeTab === 'onleave' ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'
              }`}>
                {employeesOnLeave.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 px-6 py-4 text-center font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
              activeTab === 'history'
                ? 'bg-gradient-to-r from-[#1a237e] to-[#4a148c] text-white'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <FunnelIcon className="w-5 h-5" /> History
          </button>
        </div>

        {/* Pending Requests Tab */}
        {activeTab === 'pending' && (
          <div className="p-5">
            {pendingRequests.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircleIcon className="w-16 h-16 text-green-300 mx-auto mb-3" />
                <p className="text-gray-500 text-lg">No pending leave requests</p>
                <p className="text-gray-400 text-sm">All requests have been processed</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingRequests.map(req => (
                  <div key={req.id} className="border rounded-xl p-5 hover:shadow-lg transition-all duration-200 bg-white">
                    <div className="flex flex-wrap justify-between items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#1a237e] to-[#4a148c] text-white font-bold flex items-center justify-center text-lg">
                            {req.employeeName?.charAt(0)?.toUpperCase()}
                          </div>
                          <div>
                            <h3 className="font-semibold text-xl text-gray-800">{req.employeeName}</h3>
                            <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                              <span className="flex items-center gap-1">
                                <CalendarIcon className="w-4 h-4" />
                                {req.fromDate} → {req.toDate}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="ml-15 space-y-1">
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Reason:</span> {req.reason}
                          </p>
                          <p className="text-xs text-gray-400 flex items-center gap-1">
                            <ClockIcon className="w-3 h-3" />
                            Requested: {new Date(req.requestedAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleApprove(req)}
                          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-xl font-semibold transition flex items-center gap-2 shadow-md"
                        >
                          <CheckCircleIcon className="w-5 h-5" /> Approve
                        </button>
                        <button
                          onClick={() => handleReject(req.id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-xl font-semibold transition flex items-center gap-2 shadow-md"
                        >
                          <XCircleIcon className="w-5 h-5" /> Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* On Leave Tab */}
        {activeTab === 'onleave' && (
          <div className="p-5">
            {employeesOnLeave.length === 0 ? (
              <div className="text-center py-12">
                <UserGroupIcon className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-lg">No employees on leave</p>
                <p className="text-gray-400 text-sm">All employees are currently active</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {employeesOnLeave.map(emp => (
                  <div key={emp.id} className="border rounded-xl p-5 hover:shadow-lg transition-all duration-200 bg-white">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-r from-red-500 to-red-600 text-white font-bold flex items-center justify-center text-xl flex-shrink-0">
                        {emp.name?.charAt(0)?.toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-gray-800">{emp.name}</h3>
                        <div className="space-y-1 mt-2">
                          <p className="text-sm text-gray-500 flex items-center gap-1">
                            <EnvelopeIcon className="w-4 h-4" /> {emp.email}
                          </p>
                          <p className="text-sm text-gray-500 flex items-center gap-1">
                            <PhoneIcon className="w-4 h-4" /> {emp.contact || 'N/A'}
                          </p>
                        </div>
                        <button
                          onClick={() => handleMarkBack(emp.id, emp.name)}
                          className="mt-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2"
                        >
                          <ArrowPathIcon className="w-4 h-4" /> Mark Back from Leave
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="p-5">
            <div className="flex flex-wrap justify-between items-center mb-5 gap-3">
              <div className="flex gap-3">
                <select
                  value={historyFilter}
                  onChange={e => setHistoryFilter(e.target.value)}
                  className="border border-gray-200 rounded-xl px-4 py-2 text-sm bg-white focus:ring-2 focus:ring-[#1a237e]"
                >
                  <option value="all">All Status</option>
                  <option value="approved">Approved Only</option>
                  <option value="rejected">Rejected Only</option>
                </select>
                <input
                  type="date"
                  value={historyDateFilter}
                  onChange={e => setHistoryDateFilter(e.target.value)}
                  className="border border-gray-200 rounded-xl px-4 py-2 text-sm bg-white focus:ring-2 focus:ring-[#1a237e]"
                />
                {(historyFilter !== 'all' || historyDateFilter) && (
                  <button
                    onClick={() => {
                      setHistoryFilter('all');
                      setHistoryDateFilter('');
                    }}
                    className="text-red-600 hover:text-red-700 text-sm font-medium px-3"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
              <div className="text-sm text-gray-500">
                Total: {historyRequests.length} records
              </div>
            </div>

            {historyRequests.length === 0 ? (
              <div className="text-center py-12">
                <FunnelIcon className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-lg">No leave history found</p>
                <p className="text-gray-400 text-sm">Try changing your filters</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50 rounded-xl">
                    <tr>
                      <th className="p-4 text-left text-gray-700 font-semibold">Employee</th>
                      <th className="p-4 text-left text-gray-700 font-semibold">Leave Period</th>
                      <th className="p-4 text-left text-gray-700 font-semibold hidden md:table-cell">Reason</th>
                      <th className="p-4 text-left text-gray-700 font-semibold">Requested On</th>
                      <th className="p-4 text-center text-gray-700 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historyRequests.map(req => (
                      <tr key={req.id} className="border-b hover:bg-gray-50 transition">
                        <td className="p-4">
                          <div>
                            <p className="font-semibold text-gray-800">{req.employeeName}</p>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <CalendarIcon className="w-4 h-4 text-gray-400" />
                            {req.fromDate} → {req.toDate}
                          </div>
                        </td>
                        <td className="p-4 text-sm text-gray-600 hidden md:table-cell">
                          {req.reason || '—'}
                        </td>
                        <td className="p-4 text-sm text-gray-500">
                          {new Date(req.requestedAt).toLocaleDateString()}
                        </td>
                        <td className="p-4 text-center">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${
                            req.status === 'approved' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {req.status === 'approved' ? (
                              <CheckCircleIcon className="w-4 h-4" />
                            ) : (
                              <XCircleIcon className="w-4 h-4" />
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
        )}
      </div>
    </div>
  );
};

export default LeaveRequests;