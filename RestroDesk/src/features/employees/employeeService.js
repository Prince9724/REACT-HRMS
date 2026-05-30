import axios from '../../services/axiosInstance';

const fetchEmployees = async () => {
  const response = await axios.get('/users?role=employee');
  return response.data;
};

const addEmployee = async (empData) => {
  const response = await axios.post('/users', { ...empData, role: 'employee' });
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