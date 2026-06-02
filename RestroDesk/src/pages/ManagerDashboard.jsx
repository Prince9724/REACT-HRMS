import { useEffect, useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchEmployees } from '../features/employees/employeeSlice';
import { fetchAllOrders } from '../features/orders/orderSlice';
import { fetchMenu } from '../features/menu/menuSlice';
import { fetchTables } from '../features/tables/tablesSlice';  // ✅ Added
import { logout } from '../features/auth/authSlice';
import Spinner from '../components/Common/Spinner';
import EmployeeManagement from './EmployeeManagement';
import MenuManagement from './MenuManagement';
import OrdersPage from './OrdersPage';
import TableManagement from './TableManagement';  // ✅ Added
import { usePolling } from '../app/hooks';
import { 
  UsersIcon, ShoppingBagIcon, CurrencyRupeeIcon, CakeIcon, 
  CalendarIcon, TableCellsIcon, ChartBarIcon 
} from '@heroicons/react/24/outline';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

const DashboardHome = () => {
  const dispatch = useAppDispatch();
  const { allOrders } = useAppSelector(state => state.orders);
  const { list: employees } = useAppSelector(state => state.employees);
  const { items: menu } = useAppSelector(state => state.menu);
  const { list: tables } = useAppSelector(state => state.tables);  // ✅ Tables for summary
  
  const [filter, setFilter] = useState('today');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [dailySales, setDailySales] = useState([]);
  
  useEffect(() => {
    dispatch(fetchAllOrders());
    dispatch(fetchEmployees());
    dispatch(fetchMenu());
    dispatch(fetchTables());  // ✅ Fetch tables
  }, [dispatch]);

  usePolling(() => {
    dispatch(fetchAllOrders());
    dispatch(fetchEmployees());
    dispatch(fetchMenu());
    dispatch(fetchTables());
  }, 5000);

  const getFilteredOrders = () => {
    if (filter === 'today') {
      const today = new Date().toISOString().split('T')[0];
      return allOrders.filter(order => order.createdAt.startsWith(today));
    } else {
      return allOrders.filter(order => order.createdAt.startsWith(selectedDate));
    }
  };
  
  const filteredOrders = getFilteredOrders();
  const totalSales = filteredOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalOrders = filteredOrders.length;
  
  // ✅ Prepare daily sales chart data (last 7 days)
  useEffect(() => {
    const last7Days = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toISOString().split('T')[0];
    });
    
    const salesData = last7Days.map(date => ({
      date: date.slice(5),
      sales: allOrders.filter(o => o.createdAt.startsWith(date)).reduce((sum, o) => sum + o.totalAmount, 0)
    }));
    setDailySales(salesData);
  }, [allOrders]);
  
  const dishCount = {};
  filteredOrders.forEach(order => {
    order.items.forEach(item => {
      const name = item.name;
      dishCount[name] = (dishCount[name] || 0) + item.quantity;
    });
  });
  const topDishes = Object.entries(dishCount)
    .map(([name, count]) => ({ name, count }))
    .sort((a,b) => b.count - a.count)
    .slice(0,5);
  
  // ✅ Calculate active and on-leave employees
  const activeEmployees = employees.filter(e => e.role === 'employee' && !e.isOnLeave).length;
  const onLeaveEmployees = employees.filter(e => e.role === 'employee' && e.isOnLeave).length;
  
  return (
    <div>
      {/* Modern Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-5 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm opacity-90">Total Employees</div>
              <div className="text-3xl font-bold">{employees.length}</div>
              <div className="text-xs mt-1">Active: {activeEmployees} | Leave: {onLeaveEmployees}</div>
            </div>
            <UsersIcon className="w-10 h-10 opacity-80" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-5 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm opacity-90">Total Tables</div>
              <div className="text-3xl font-bold">{tables.length}</div>
              <div className="text-xs mt-1">Assigned: {tables.filter(t => t.assignedTo).length}</div>
            </div>
            <TableCellsIcon className="w-10 h-10 opacity-80" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white p-5 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm opacity-90">Orders ({filter === 'today' ? 'Today' : selectedDate})</div>
              <div className="text-3xl font-bold">{totalOrders}</div>
            </div>
            <ShoppingBagIcon className="w-10 h-10 opacity-80" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-5 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm opacity-90">Sales</div>
              <div className="text-3xl font-bold">₹{Math.floor(totalSales)}</div>
            </div>
            <CurrencyRupeeIcon className="w-10 h-10 opacity-80" />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-4 mb-6 border-b pb-2">
        <button onClick={() => setFilter('today')} className={`px-4 py-2 font-semibold rounded-t-lg ${filter === 'today' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}>
          Today's Report
        </button>
        <button onClick={() => setFilter('history')} className={`px-4 py-2 font-semibold rounded-t-lg ${filter === 'history' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}>
          History
        </button>
      </div>
      
      {filter === 'history' && (
        <div className="mb-6 flex items-center gap-2 bg-white p-3 rounded-xl shadow">
          <CalendarIcon className="w-5 h-5 text-gray-500" />
          <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} className="border rounded-lg p-2" />
          <span className="text-sm text-gray-500">Select date to view report</span>
        </div>
      )}
      
      {/* Daily Sales Chart */}
      <div className="bg-white rounded-2xl shadow-lg p-5 mb-8">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <ChartBarIcon className="w-5 h-5" /> Daily Sales (Last 7 Days)
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={dailySales}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip formatter={(value) => `₹${value}`} />
            <Bar dataKey="sales" fill="#3b82f6" radius={[8,8,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Selling Dishes */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <CakeIcon className="w-5 h-5" /> Top Selling Dishes
          </h3>
          {topDishes.length > 0 ? (
            <table className="min-w-full">
              <thead className="border-b">
                <tr><th className="text-left py-2">Dish</th><th className="text-right">Orders</th></tr>
              </thead>
              <tbody>
                {topDishes.map((d, idx) => (
                  <tr key={d.name} className="border-b">
                    <td className="py-2">#{idx+1} {d.name}</td>
                    <td className="text-right font-semibold">{d.count} plates</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500">No orders found for selected date.</p>
          )}
        </div>
        
        {/* Quick Stats */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4">📊 Quick Stats</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center border-b pb-2">
              <span>Menu Items</span>
              <span className="font-bold">{menu.length}</span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <span>Unassigned Tables</span>
              <span className="font-bold text-orange-600">{tables.filter(t => !t.assignedTo).length}</span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <span>Pending Orders</span>
              <span className="font-bold text-yellow-600">{allOrders.filter(o => o.status === 'Pending').length}</span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <span>Completed Orders</span>
              <span className="font-bold text-green-600">{allOrders.filter(o => o.status === 'Completed').length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ManagerDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const handleLogout = () => { dispatch(logout()); navigate('/login'); };
  
  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-72 bg-white shadow-xl flex flex-col">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Manager Panel
          </h2>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link to="/manager" className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 transition">
            <ChartBarIcon className="w-5 h-5" /> Dashboard
          </Link>
          <Link to="/manager/employees" className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 transition">
            <UsersIcon className="w-5 h-5" /> Employees
          </Link>
          <Link to="/manager/menu" className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 transition">
            <CakeIcon className="w-5 h-5" /> Menu
          </Link>
          <Link to="/manager/tables" className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 transition">
            <TableCellsIcon className="w-5 h-5" /> Tables
          </Link>
          <Link to="/manager/orders" className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 transition">
            <ShoppingBagIcon className="w-5 h-5" /> All Orders
          </Link>
        </nav>
        <div className="p-4 border-t">
          <button onClick={handleLogout} className="flex items-center gap-3 w-full p-3 text-red-600 hover:bg-red-50 rounded-xl transition">
            Logout
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6">
        <Routes>
          <Route path="/" element={<DashboardHome />} />
          <Route path="/employees/*" element={<EmployeeManagement />} />
          <Route path="/menu/*" element={<MenuManagement />} />
          <Route path="/tables/*" element={<TableManagement />} />
          <Route path="/orders/*" element={<OrdersPage />} />
        </Routes>
      </div>
    </div>
  );
};

export default ManagerDashboard;