import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchEmployees, addEmployee, updateEmployee, deleteEmployee } from '../features/employees/employeeSlice';
import Spinner from '../components/Common/Spinner';

const EmployeeManagement = () => {
  const dispatch = useAppDispatch();
  const { list, isLoading } = useAppSelector(state => state.employees);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', password: '123', role: 'employee', contact: '', salary: '' });

  useEffect(() => { dispatch(fetchEmployees()); }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editing) {
      await dispatch(updateEmployee({ id: editing.id, updates: formData }));
    } else {
      await dispatch(addEmployee(formData));
    }
    resetForm();
    dispatch(fetchEmployees());
  };

  const resetForm = () => { setShowForm(false); setEditing(null); setFormData({ name: '', email: '', password: '123', role: 'employee', contact: '', salary: '' }); };
  const handleDelete = async (id) => { if (window.confirm('Delete this employee?')) { await dispatch(deleteEmployee(id)); dispatch(fetchEmployees()); } };

  if (isLoading) return <Spinner />;
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">👥 Employees <span className="text-sm font-normal bg-gray-200 px-2 py-1 rounded-full">{list.length} total</span></h2>
        <button onClick={() => setShowForm(true)} className="bg-green-600 text-white px-5 py-2 rounded-xl shadow hover:bg-green-700 transition flex items-center gap-2">
          <span>+</span> Add Employee
        </button>
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-xl font-bold mb-4">{editing ? '✏️ Edit Employee' : '➕ Add Employee'}</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input type="text" placeholder="Full Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border rounded-lg p-2" required />
              <input type="email" placeholder="Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full border rounded-lg p-2" required />
              {!editing && <input type="password" placeholder="Password (default 123)" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full border rounded-lg p-2" required />}
              <input type="tel" placeholder="Contact Number" value={formData.contact} onChange={e => setFormData({...formData, contact: e.target.value})} className="w-full border rounded-lg p-2" />
              <input type="number" placeholder="Salary (₹)" value={formData.salary} onChange={e => setFormData({...formData, salary: e.target.value})} className="w-full border rounded-lg p-2" />
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={resetForm} className="bg-gray-400 text-white px-4 py-2 rounded-lg">Cancel</button>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg">{editing ? 'Update' : 'Add'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Employees Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Name</th><th>Email</th><th>Contact</th><th>Salary</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.map(emp => (
              <tr key={emp.id} className="border-t hover:bg-gray-50">
                <td className="p-3 font-medium">{emp.name}</td>
                <td className="p-3">{emp.email}</td>
                <td className="p-3">{emp.contact || '—'}</td>
                <td className="p-3">₹{emp.salary}</td>
                <td className="p-3 space-x-2">
                  <button onClick={() => { setEditing(emp); setFormData(emp); setShowForm(true); }} className="bg-yellow-500 text-white px-3 py-1 rounded-lg text-sm">Edit</button>
                  <button onClick={() => handleDelete(emp.id)} className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm">Delete</button>
                </td>
              </tr>
            ))}
            {list.length === 0 && <tr><td colSpan="5" className="p-6 text-center text-gray-500">No employees found. Click "Add Employee" to create one.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default EmployeeManagement;