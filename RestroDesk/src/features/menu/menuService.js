import axios from '../../services/axiosInstance';

const getMenu = async () => {
  const response = await axios.get('/menu');
  return response.data;
};

const addMenuItem = async (itemData) => {
  const response = await axios.post('/menu', itemData);
  return response.data;
};

const updateMenuItem = async (id, updates) => {
  const response = await axios.patch(`/menu/${id}`, updates);
  return response.data;
};

const deleteMenuItem = async (id) => {
  await axios.delete(`/menu/${id}`);
  return id;
};

export default { getMenu, addMenuItem, updateMenuItem, deleteMenuItem };