import axios from '../../services/axiosInstance';

const getMenu = async () => {
  const response = await axios.get('/menu');
  return response.data;
};

const addItem = async (itemData) => {
  const response = await axios.post('/menu', itemData);
  return response.data;
};

export default { getMenu, addItem };