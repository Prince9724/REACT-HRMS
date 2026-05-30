import axios from '../../services/axiosInstance';

export const fetchSalesReport = async (startDate, endDate) => {
  const ordersRes = await axios.get('/orders');
  const menuRes = await axios.get('/menu');
  let orders = ordersRes.data;
  if (startDate && endDate) {
    orders = orders.filter(o => new Date(o.createdAt) >= new Date(startDate) && new Date(o.createdAt) <= new Date(endDate));
  }
  const totalSales = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalOrders = orders.length;
  // top dishes
  const dishCount = {};
  orders.forEach(order => {
    order.items.forEach(item => {
      const name = item.name;
      dishCount[name] = (dishCount[name] || 0) + item.quantity;
    });
  });
  const topDishes = Object.entries(dishCount).map(([name, count]) => ({ name, count })).sort((a,b) => b.count - a.count).slice(0,5);
  return { totalSales, totalOrders, topDishes };
};