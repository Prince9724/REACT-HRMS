import { useEffect, useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchEmployees } from '../features/employees/employeeSlice';
import { fetchAllOrders } from '../features/orders/orderSlice';
import { fetchMenu } from '../features/menu/menuSlice';
import { fetchTables } from '../features/tables/tablesSlice';
import { logout } from '../features/auth/authSlice';
import Spinner from '../components/Common/Spinner';
import EmployeeManagement from './EmployeeManagement';
import MenuManagement from './MenuManagement';
import OrdersPage from './OrdersPage';
import TableManagement from './TableManagement';
import LeaveRequests from './LeaveRequests';
import { usePolling } from '../app/hooks';
import { 
  UsersIcon, 
  ShoppingBagIcon, 
  CurrencyRupeeIcon, 
  CakeIcon, 
  CalendarIcon, 
  TableCellsIcon, 
  ChartBarIcon, 
  HomeIcon,
  ArrowTrendingUpIcon,
  DocumentTextIcon,
  FireIcon,
  StarIcon,
  HandThumbUpIcon,
  ArrowRightStartOnRectangleIcon
} from '@heroicons/react/24/outline';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

const DashboardHome = () => {
  const dispatch = useAppDispatch();
  const { allOrders } = useAppSelector(state => state.orders);
  const { list: employees } = useAppSelector(state => state.employees);
  const { items: menu } = useAppSelector(state => state.menu);
  const { list: tables } = useAppSelector(state => state.tables);
  
  const [filter, setFilter] = useState('today');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [dailySales, setDailySales] = useState([]);
  
  useEffect(() => {
    dispatch(fetchAllOrders());
    dispatch(fetchEmployees());
    dispatch(fetchMenu());
    dispatch(fetchTables());
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
  
  const previousPeriodSales = totalSales * 0.6;
  const salesIncrease = ((totalSales - previousPeriodSales) / previousPeriodSales) * 100;
  
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
  
  const allWaiters = employees.filter(e => e.role === 'employee');
  const activeWaiters = allWaiters.filter(w => !w.isOnLeave);
  
  const getDishIcon = (index) => {
    if (index === 0) return <FireIcon className="w-4 h-4 text-orange-500" />;
    if (index === 1) return <StarIcon className="w-4 h-4 text-yellow-500" />;
    if (index === 2) return <HandThumbUpIcon className="w-4 h-4 text-blue-500" />;
    return null;
  };
  
  return (
    <div className="space-y-6">
      {/* Main Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Total Income Card - Dark Blue */}
        <div className="bg-[#1a237e] rounded-2xl shadow-xl p-6 text-white">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-blue-200 text-sm mb-1">Total Income</p>
              <p className="text-4xl font-bold">₹{Math.floor(totalSales)}</p>
              <div className="flex items-center gap-2 mt-2">
                <ArrowTrendingUpIcon className="w-4 h-4 text-green-400" />
                <span className="text-green-400 text-sm">+{Math.floor(salesIncrease)}% Increase</span>
              </div>
            </div>
            <div className="bg-blue-400/20 rounded-xl p-3">
              <CurrencyRupeeIcon className="w-8 h-8 text-blue-300" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-blue-400/30">
            <div className="flex justify-between text-sm text-blue-200">
              <span>Food: ₹{Math.floor(totalSales * 0.6)}</span>
              <span>Beverage: ₹{Math.floor(totalSales * 0.25)}</span>
              <span>Others: ₹{Math.floor(totalSales * 0.15)}</span>
            </div>
          </div>
        </div>

        {/* Total Balance Card - Purple */}
        <div className="bg-[#4a148c] rounded-2xl shadow-xl p-6 text-white">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-purple-200 text-sm mb-1">Total Balance</p>
              <p className="text-4xl font-bold">₹{Math.floor(totalSales)}</p>
              <div className="flex items-center gap-2 mt-2">
                <ArrowTrendingUpIcon className="w-4 h-4 text-green-400" />
                <span className="text-green-400 text-sm">+{Math.floor(salesIncrease)}% from last period</span>
              </div>
            </div>
            <div className="bg-purple-400/20 rounded-xl p-3">
              <DocumentTextIcon className="w-8 h-8 text-purple-300" />
            </div>
          </div>
        </div>
      </div>

      {/* Small Stats Cards - No Expense Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-green-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm">Total Income</p>
              <p className="text-2xl font-bold text-gray-800">₹{Math.floor(totalSales)}</p>
              <p className="text-green-600 text-xs mt-1">+{Math.floor(salesIncrease)}% Increase</p>
            </div>
            <div className="bg-green-100 rounded-lg p-2">
              <ArrowTrendingUpIcon className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-blue-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm">Total Orders</p>
              <p className="text-2xl font-bold text-gray-800">{totalOrders}</p>
            </div>
            <div className="bg-blue-100 rounded-lg p-2">
              <ShoppingBagIcon className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-purple-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm">Total Employees</p>
              <p className="text-2xl font-bold text-gray-800">{employees.length}</p>
              <p className="text-xs text-gray-500">Active: {activeWaiters.length}</p>
            </div>
            <div className="bg-purple-100 rounded-lg p-2">
              <UsersIcon className="w-5 h-5 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-xl shadow-md p-4">
        <div className="flex gap-4 border-b pb-2">
          <button 
            onClick={() => setFilter('today')}
            className={`px-4 py-2 font-semibold rounded-t-lg transition flex items-center gap-2 ${filter === 'today' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            <CalendarIcon className="w-4 h-4" /> Today's Report
          </button>
          <button 
            onClick={() => setFilter('history')}
            className={`px-4 py-2 font-semibold rounded-t-lg transition flex items-center gap-2 ${filter === 'history' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            <CalendarIcon className="w-4 h-4" /> History
          </button>
        </div>
        
        {filter === 'history' && (
          <div className="mt-4 flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-gray-500" />
            <input 
              type="date" 
              value={selectedDate} 
              onChange={e => setSelectedDate(e.target.value)}
              className="border rounded-lg p-2 focus:ring-2 focus:ring-blue-400 outline-none"
            />
            <span className="text-sm text-gray-500">Select date to view report</span>
          </div>
        )}
      </div>

      {/* Daily Selling Chart */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <ChartBarIcon className="w-5 h-5 text-blue-600" /> Daily Selling
          </h3>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-sm text-gray-500">Sales (₹)</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={dailySales}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey="date" stroke="#666" />
            <YAxis stroke="#666" />
            <Tooltip 
              formatter={(value) => [`₹${value}`, 'Sales']}
              contentStyle={{ backgroundColor: 'white', borderRadius: '8px', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
            />
            <Bar dataKey="sales" fill="#3b82f6" radius={[8,8,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Best Dishes Table */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <CakeIcon className="w-5 h-5 text-orange-500" /> Best Dishes
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 rounded-lg">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-gray-600">Dishes</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-600">Orders</th>
              </tr>
            </thead>
            <tbody>
              {topDishes.length > 0 ? (
                topDishes.map((dish, idx) => (
                  <tr key={dish.name} className="border-b hover:bg-gray-50 transition">
                    <td className="py-3 px-4 font-medium text-gray-800 flex items-center gap-2">
                      {getDishIcon(idx)}
                      {dish.name}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-semibold">
                        {dish.count} orders
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2" className="py-8 text-center text-gray-500">No orders found for selected date</td>
                </tr>
              )}
            </tbody>
          </table>
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
      {/* Sidebar */}
      <div className="w-72 bg-white shadow-xl flex flex-col">
        <div className="p-6 border-b bg-gradient-to-r from-blue-600 to-purple-600">
          <h2 className="text-xl font-bold text-white">Manager Panel</h2>
          <p className="text-blue-100 text-sm mt-1">Restaurant Dashboard</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <Link to="/manager" className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 transition group">
            <HomeIcon className="w-5 h-5 text-gray-500 group-hover:text-blue-600" /> 
            <span className="text-gray-700 group-hover:text-blue-600">Dashboard</span>
          </Link>
          <Link to="/manager/employees" className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 transition group">
            <UsersIcon className="w-5 h-5 text-gray-500 group-hover:text-blue-600" /> 
            <span className="text-gray-700 group-hover:text-blue-600">Employees</span>
          </Link>
          <Link to="/manager/menu" className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 transition group">
            <CakeIcon className="w-5 h-5 text-gray-500 group-hover:text-blue-600" /> 
            <span className="text-gray-700 group-hover:text-blue-600">Menu</span>
          </Link>
          <Link to="/manager/tables" className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 transition group">
            <TableCellsIcon className="w-5 h-5 text-gray-500 group-hover:text-blue-600" /> 
            <span className="text-gray-700 group-hover:text-blue-600">Tables</span>
          </Link>
          <Link to="/manager/orders" className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 transition group">
            <ShoppingBagIcon className="w-5 h-5 text-gray-500 group-hover:text-blue-600" /> 
            <span className="text-gray-700 group-hover:text-blue-600">All Orders</span>
          </Link>
          <Link to="/manager/leave" className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 transition group">
            <CalendarIcon className="w-5 h-5 text-gray-500 group-hover:text-blue-600" /> 
            <span className="text-gray-700 group-hover:text-blue-600">Leave Requests</span>
          </Link>
        </nav>
        <div className="p-4 border-t">
          <button onClick={handleLogout} className="flex items-center gap-3 w-full p-3 text-red-600 hover:bg-red-50 rounded-xl transition">
            <ArrowRightStartOnRectangleIcon className="w-5 h-5" /> Logout
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
          <Route path="/leave/*" element={<LeaveRequests />} />
        </Routes>
      </div>
    </div>
  );
};

export default ManagerDashboard;