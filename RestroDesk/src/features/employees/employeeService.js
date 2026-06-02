import axios from '../../services/axiosInstance';

const fetchEmployees = async () => {
  const response = await axios.get('/users?role=employee');
  return response.data;
};

const addEmployee = async (empData) => {
  // ✅ Auto add joining date and time
  const now = new Date();
  const newEmp = { 
    ...empData, 
    role: 'employee',
    joiningDate: now.toISOString().split('T')[0],  // YYYY-MM-DD
    joiningTime: now.toLocaleTimeString('en-IN')   // HH:MM:SS
  };
  const response = await axios.post('/users', newEmp);
  return response.data;
};

const updateEmployee = async (id, updates) => {
  const response = await axios.patch(`/users/${id}`, updates);
  return response.data;
};

const deleteEmployee = async (id) => {
  await axios.delete(`/users/${id}`);
  return id;
};

export default { fetchEmployees, addEmployee, updateEmployee, deleteEmployee };