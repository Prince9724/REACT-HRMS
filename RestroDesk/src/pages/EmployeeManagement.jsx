import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchEmployees, addEmployee, updateEmployee, deleteEmployee } from '../features/employees/employeeSlice';
import Spinner from '../components/Common/Spinner';
import { 
  UsersIcon, 
  UserPlusIcon, 
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  EyeSlashIcon,
  XMarkIcon,
  CheckCircleIcon,
  XCircleIcon,
  UserCircleIcon,
  CurrencyRupeeIcon,
  EnvelopeIcon,
  PhoneIcon,
  KeyIcon
} from '@heroicons/react/24/outline';

const EmployeeManagement = () => {
  const dispatch = useAppDispatch();
  const { list, isLoading } = useAppSelector(state => state.employees);

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '123',
    role: 'employee',
    contact: '',
    salary: '',
    isOnLeave: false,
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [showPasswordFor, setShowPasswordFor] = useState(null);

  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);

  const filteredEmployees = list.filter(
    emp =>
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (emp.contact && emp.contact.includes(searchTerm))
  );

  const handleSubmit = async e => {
    e.preventDefault();

    if (formData.contact && formData.contact.length !== 10) {
      alert('Contact number must be exactly 10 digits');
      return;
    }

    if (editing) {
      await dispatch(updateEmployee({ id: editing.id, updates: formData }));
    } else {
      await dispatch(addEmployee(formData));
    }

    resetForm();
    dispatch(fetchEmployees());
  };

  const resetForm = () => {
    setShowForm(false);
    setEditing(null);
    setFormData({
      name: '',
      email: '',
      password: '123',
      role: 'employee',
      contact: '',
      salary: '',
      isOnLeave: false,
    });
  };

  const handleDelete = async id => {
    if (window.confirm('Delete this employee?')) {
      await dispatch(deleteEmployee(id));
      dispatch(fetchEmployees());
    }
  };

  if (isLoading) return <Spinner />;

  const activeEmployees = list.filter(emp => !emp.isOnLeave).length;
  const leaveEmployees = list.filter(emp => emp.isOnLeave).length;

  return (
    <div className="space-y-6 p-4">
      {/* Header Stats Cards - White Background with Shadow & Hover */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Employees Card */}
        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-5 border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm mb-1">Total Employees</p>
              <p className="text-3xl font-bold text-gray-800">{list.length}</p>
            </div>
            <div className="bg-blue-100 rounded-xl p-3">
              <UsersIcon className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Active Employees Card */}
        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-5 border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm mb-1">Active Employees</p>
              <p className="text-3xl font-bold text-green-600">{activeEmployees}</p>
            </div>
            <div className="bg-green-100 rounded-xl p-3">
              <CheckCircleIcon className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>

        {/* On Leave Employees Card */}
        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-5 border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm mb-1">On Leave</p>
              <p className="text-3xl font-bold text-red-600">{leaveEmployees}</p>
            </div>
            <div className="bg-red-100 rounded-xl p-3">
              <XCircleIcon className="w-8 h-8 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Add Button */}
      <div className="bg-white rounded-2xl shadow-lg p-5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <UsersIcon className="w-6 h-6 text-[#1a237e]" /> Employee Directory
            </h2>
            <p className="text-gray-500 text-sm mt-1">Manage restaurant staff records</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-2 border rounded-xl px-3 py-2 bg-gray-50">
              <MagnifyingGlassIcon className="w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search employees..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="outline-none bg-transparent w-56 text-sm"
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} className="text-gray-400 hover:text-gray-600">
                  <XMarkIcon className="w-4 h-4" />
                </button>
              )}
            </div>
            
            <button
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-[#1a237e] to-[#4a148c] hover:from-[#1a237e]/90 hover:to-[#4a148c]/90 text-white px-5 py-2 rounded-xl font-semibold transition flex items-center justify-center gap-2 shadow-md"
            >
              <UserPlusIcon className="w-5 h-5" /> Add Employee
            </button>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-[#1a237e] to-[#4a148c] p-5 sticky top-0">
              <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                <UserPlusIcon className="w-6 h-6" />
                {editing ? 'Edit Employee' : 'Add New Employee'}
              </h3>
              <p className="text-blue-100 text-sm mt-1">Fill in the employee details below</p>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="relative">
                  <UserCircleIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1a237e] focus:border-[#1a237e] outline-none transition"
                    required
                  />
                </div>

                <div className="relative">
                  <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1a237e] focus:border-[#1a237e] outline-none transition"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="relative">
                  <KeyIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1a237e] focus:border-[#1a237e] outline-none transition"
                    required
                  />
                </div>

                <div className="relative">
                  <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    placeholder="Contact Number (10 digits)"
                    value={formData.contact}
                    onChange={e => {
                      const val = e.target.value.replace(/\D/g, '');
                      if (val.length <= 10) setFormData({ ...formData, contact: val });
                    }}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1a237e] focus:border-[#1a237e] outline-none transition"
                  />
                </div>
              </div>

              <div className="relative">
                <CurrencyRupeeIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  placeholder="Salary (₹)"
                  value={formData.salary}
                  onChange={e => setFormData({ ...formData, salary: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1a237e] focus:border-[#1a237e] outline-none transition"
                />
              </div>

              <label className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl p-4 cursor-pointer hover:bg-gray-100 transition">
                <input
                  type="checkbox"
                  checked={formData.isOnLeave || false}
                  onChange={e => setFormData({ ...formData, isOnLeave: e.target.checked })}
                  className="w-5 h-5 accent-[#1a237e]"
                />
                <span className="font-medium text-gray-700">Employee is currently on leave</span>
              </label>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2.5 rounded-xl bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition flex items-center gap-2"
                >
                  <XMarkIcon className="w-4 h-4" /> Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#1a237e] to-[#4a148c] hover:from-[#1a237e]/90 hover:to-[#4a148c]/90 text-white font-semibold transition flex items-center gap-2 shadow-md"
                >
                  <UserPlusIcon className="w-4 h-4" />
                  {editing ? 'Update Employee' : 'Add Employee'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Employees Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gradient-to-r from-[#1a237e] to-[#4a148c]">
              <tr>
                <th className="p-4 text-left text-white font-semibold">Employee</th>
                <th className="p-4 text-left text-white font-semibold hidden sm:table-cell">Email</th>
                <th className="p-4 text-left text-white font-semibold">Contact</th>
                <th className="p-4 text-left text-white font-semibold hidden md:table-cell">Salary</th>
                <th className="p-4 text-left text-white font-semibold hidden lg:table-cell">Password</th>
                <th className="p-4 text-left text-white font-semibold">Status</th>
                <th className="p-4 text-left text-white font-semibold hidden xl:table-cell">Joining Date</th>
                <th className="p-4 text-left text-white font-semibold hidden xl:table-cell">Joining Time</th>
                <th className="p-4 text-left text-white font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredEmployees.map(emp => (
                <tr key={emp.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#1a237e] to-[#4a148c] text-white font-bold flex items-center justify-center flex-shrink-0">
                        {emp.name?.charAt(0)?.toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 max-w-[150px] truncate" title={emp.name}>
                          {emp.name}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="p-4 text-gray-600 hidden sm:table-cell">
                    <span className="max-w-[150px] truncate block" title={emp.email}>
                      {emp.email}
                    </span>
                  </td>

                  <td className="p-4 text-gray-600">{emp.contact || '—'}</td>

                  <td className="p-4 hidden md:table-cell">
                    <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm flex items-center gap-1 w-fit">
                      <CurrencyRupeeIcon className="w-3 h-3" /> {emp.salary}
                    </span>
                  </td>

                  <td className="p-4 hidden lg:table-cell">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm">
                        {showPasswordFor === emp.id ? emp.password : '••••••'}
                      </span>
                      <button
                        onClick={() => setShowPasswordFor(showPasswordFor === emp.id ? null : emp.id)}
                        className="p-1 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
                      >
                        {showPasswordFor === emp.id ? (
                          <EyeSlashIcon className="w-4 h-4 text-gray-600" />
                        ) : (
                          <EyeIcon className="w-4 h-4 text-gray-600" />
                        )}
                      </button>
                    </div>
                  </td>

                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 w-fit ${
                      emp.isOnLeave
                        ? 'bg-red-100 text-red-700'
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {emp.isOnLeave ? (
                        <XCircleIcon className="w-3 h-3" />
                      ) : (
                        <CheckCircleIcon className="w-3 h-3" />
                      )}
                      {emp.isOnLeave ? 'On Leave' : 'Active'}
                    </span>
                  </td>

                  <td className="p-4 text-gray-600 hidden xl:table-cell">{emp.joiningDate || '—'}</td>
                  <td className="p-4 text-gray-600 hidden xl:table-cell">{emp.joiningTime || '—'}</td>

                  <td className="p-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditing(emp);
                          setFormData({ ...emp, password: emp.password || '123' });
                          setShowForm(true);
                        }}
                        className="p-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition"
                        title="Edit"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(emp.id)}
                        className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
                        title="Delete"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredEmployees.length === 0 && (
                <tr>
                  <td colSpan="9" className="p-6 text-center">
                    <div className="py-16 flex flex-col items-center justify-center text-center">
                      <UsersIcon className="w-16 h-16 text-gray-300 mb-3" />
                      <h3 className="text-xl font-bold text-gray-800 mb-1">No Employees Found</h3>
                      <p className="text-gray-500">Try adjusting your search or add a new employee.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EmployeeManagement;