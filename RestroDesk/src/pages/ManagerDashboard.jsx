import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchEmployees } from '../features/employees/employeeSlice';
import { fetchAllOrders } from '../features/orders/orderSlice';
import { fetchMenu } from '../features/menu/menuSlice';
import { getSalesReport } from '../features/reports/reportSlice';
import { Link, Routes, Route } from 'react-router-dom';
import Spinner from '../components/Common/Spinner';

const DashboardHome = () => {
  const dispatch = useAppDispatch();
  const { allOrders } = useAppSelector(state => state.orders);
  const { list: employees } = useAppSelector(state => state.employees);
  const { items: menu } = useAppSelector(state => state.menu);
  const { sales, totalOrders, topDishes, loading } = useAppSelector(state => state.reports);

  useEffect(() => {
    dispatch(fetchAllOrders());
    dispatch(fetchEmployees());
    dispatch(fetchMenu());
    dispatch(getSalesReport({}));
  }, [dispatch]);

  if (loading) return <Spinner />;
  const totalSales = allOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-100 p-4 rounded">Employees: {employees.length}</div>
        <div className="bg-green-100 p-4 rounded">Orders: {allOrders.length}</div>
        <div className="bg-yellow-100 p-4 rounded">Total Sales: ₹{totalSales}</div>
        <div className="bg-purple-100 p-4 rounded">Menu Items: {menu.length}</div>
      </div>
      <h3 className="text-xl">Top Dishes</h3>
      <ul>{topDishes?.map(d => <li key={d.name}>{d.name} - {d.count} sold</li>)}</ul>
    </div>
  );
};

const ManagerDashboard = () => {
  return (
    <div className="flex">
      <div className="w-64 bg-gray-800 text-white min-h-screen p-4">
        <h2 className="text-xl mb-4">Manager Panel</h2>
        <ul>
          <li><Link to="/manager" className="block py-2">Dashboard</Link></li>
          <li><Link to="/manager/employees" className="block py-2">Employees</Link></li>
          <li><Link to="/manager/menu" className="block py-2">Menu</Link></li>
          <li><Link to="/manager/orders" className="block py-2">All Orders</Link></li>
        </ul>
      </div>
      <div className="flex-1 p-6">
        <Routes>
          <Route path="/" element={<DashboardHome />} />
          <Route path="/employees" element={<div>Employee Management Component (CRUD)</div>} />
          <Route path="/menu" element={<div>Menu Management Component (CRUD)</div>} />
          <Route path="/orders" element={<div>All Orders List</div>} />
        </Routes>
      </div>
    </div>
  );
};
export default ManagerDashboard;