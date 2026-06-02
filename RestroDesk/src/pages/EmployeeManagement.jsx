import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchEmployees, addEmployee, updateEmployee, deleteEmployee } from '../features/employees/employeeSlice';
import Spinner from '../components/Common/Spinner';

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
    <div className="space-y-6 p-2 md:p-4">
      {/* Header */}
      <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Employee Management
            </h1>
            <p className="text-gray-500 mt-1">
              Manage restaurant staff and employee records
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full xl:w-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search employees..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full sm:w-80 pl-4 pr-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all bg-gray-50"
              />
            </div>

            <button
              onClick={() => setShowForm(true)}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
            >
              + Add Employee
            </button>
          </div>
        </div>

        <div className="mt-4 inline-flex items-center px-4 py-2 rounded-full bg-orange-100 text-orange-700 font-medium text-sm">
          {list.length} Total Employees
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-all">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm font-medium">
                Total Employees
              </p>
              <h2 className="text-3xl font-bold text-gray-900 mt-2">
                {list.length}
              </h2>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-orange-100 flex items-center justify-center text-2xl">
              👥
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-all">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm font-medium">
                Active Employees
              </p>
              <h2 className="text-3xl font-bold text-green-600 mt-2">
                {activeEmployees}
              </h2>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center text-2xl">
              ✅
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-all">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm font-medium">
                Employees On Leave
              </p>
              <h2 className="text-3xl font-bold text-red-600 mt-2">
                {leaveEmployees}
              </h2>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center text-2xl">
              🌴
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6">
              <h3 className="text-2xl font-bold text-white">
                {editing ? '✏️ Edit Employee' : '➕ Add Employee'}
              </h3>
              <p className="text-orange-100 mt-1">
                Fill employee information below
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={e =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full border border-gray-200 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-orange-500 outline-none"
                  required
                />

                <input
                  type="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={e =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full border border-gray-200 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-orange-500 outline-none"
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={e =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full border border-gray-200 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-orange-500 outline-none"
                  required
                />

                <input
                  type="tel"
                  placeholder="Contact Number"
                  value={formData.contact}
                  onChange={e => {
                    const val = e.target.value.replace(/\D/g, '');
                    if (val.length <= 10)
                      setFormData({ ...formData, contact: val });
                  }}
                  className="w-full border border-gray-200 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-orange-500 outline-none"
                />
              </div>

              <input
                type="number"
                placeholder="Salary (₹)"
                value={formData.salary}
                onChange={e =>
                  setFormData({ ...formData, salary: e.target.value })
                }
                className="w-full border border-gray-200 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-orange-500 outline-none"
              />

              <label className="flex items-center gap-3 bg-orange-50 border border-orange-100 rounded-2xl p-4 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isOnLeave || false}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      isOnLeave: e.target.checked,
                    })
                  }
                  className="w-5 h-5 accent-orange-500"
                />
                <span className="font-medium text-gray-700">
                  Employee is currently on leave
                </span>
              </label>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 rounded-2xl bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition-all"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-6 py-3 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-semibold shadow-lg transition-all"
                >
                  {editing ? 'Update Employee' : 'Add Employee'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-900 text-white">
              <tr>
                <th className="p-4 text-left">Employee</th>
                <th className="p-4 text-left">Email</th>
                <th className="p-4 text-left">Contact</th>
                <th className="p-4 text-left">Salary</th>
                <th className="p-4 text-left">Password</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Joining Date</th>
                <th className="p-4 text-left">Joining Time</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredEmployees.map(emp => (
                <tr
                  key={emp.id}
                  className="border-b border-gray-100 hover:bg-orange-50 transition-all"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full bg-orange-100 text-orange-600 font-bold flex items-center justify-center">
                        {emp.name?.charAt(0)?.toUpperCase()}
                      </div>

                      <div>
                        <p className="font-semibold text-gray-900">
                          {emp.name}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="p-4 text-gray-600">{emp.email}</td>

                  <td className="p-4 text-gray-600">
                    {emp.contact || '—'}
                  </td>

                  <td className="p-4">
                    <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-700 font-semibold text-sm">
                      ₹{emp.salary}
                    </span>
                  </td>

                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {showPasswordFor === emp.id
                          ? emp.password
                          : '••••••'}
                      </span>

                      <button
                        onClick={() =>
                          setShowPasswordFor(
                            showPasswordFor === emp.id ? null : emp.id
                          )
                        }
                        className="px-3 py-1 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-medium transition-all"
                      >
                        {showPasswordFor === emp.id ? 'Hide' : 'Show'}
                      </button>
                    </div>
                  </td>

                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        emp.isOnLeave
                          ? 'bg-red-100 text-red-700'
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {emp.isOnLeave ? 'On Leave' : 'Active'}
                    </span>
                  </td>

                  <td className="p-4 text-gray-600">
                    {emp.joiningDate || '—'}
                  </td>

                  <td className="p-4 text-gray-600">
                    {emp.joiningTime || '—'}
                  </td>

                  <td className="p-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditing(emp);
                          setFormData({
                            ...emp,
                            password: emp.password || '123',
                          });
                          setShowForm(true);
                        }}
                        className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-sm font-medium transition-all"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(emp.id)}
                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-medium transition-all"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredEmployees.length === 0 && (
                <tr>
                  <td colSpan="9">
                    <div className="py-20 flex flex-col items-center justify-center text-center">
                      <div className="text-6xl mb-4">👥</div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">
                        No Employees Found
                      </h3>
                      <p className="text-gray-500 max-w-sm">
                        No employee records match your search. Try another
                        keyword or add a new employee.
                      </p>
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