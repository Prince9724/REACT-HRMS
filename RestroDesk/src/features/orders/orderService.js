import axios from '../../services/axiosInstance';
import { v4 as uuidv4 } from 'uuid';

const createOrder = async (orderData) => {
  const newOrder = { id: uuidv4(), ...orderData, createdAt: new Date().toISOString() };
  const response = await axios.post('/orders', newOrder);
  return response.data;
};

const fetchAllOrders = async () => {
  const response = await axios.get('/orders');
  return response.data;
};

const fetchOrdersByEmployee = async (employeeId) => {
  const response = await axios.get(`/orders?createdBy=${employeeId}`);
  return response.data;
};

const updateOrderStatus = async (id, status) => {
  const response = await axios.patch(`/orders/${id}`, { status });
  return response.data;
};

export default { createOrder, fetchAllOrders, fetchOrdersByEmployee, updateOrderStatus };