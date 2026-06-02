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
import { usePolling } from '../app/hooks';
import LeaveRequests from './LeaveRequests';
import {
  UsersIcon, ShoppingBagIcon, CurrencyRupeeIcon, CakeIcon,
  CalendarIcon, TableCellsIcon, ChartBarIcon, UserGroupIcon,
  CheckCircleIcon, XCircleIcon, UserIcon
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
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // ✅ Waiters Data
  const allWaiters = employees.filter(e => e.role === 'employee');
  const activeWaiters = allWaiters.filter(w => !w.isOnLeave);
  const onLeaveWaiters = allWaiters.filter(w => w.isOnLeave);

  // ✅ Performance data per waiter (today's orders count and sales)
  const todayStr = new Date().toISOString().split('T')[0];
  const todaysOrders = allOrders.filter(o => o.createdAt.startsWith(todayStr));

  const waiterPerformance = allWaiters.map(waiter => {
    const waiterOrders = todaysOrders.filter(o => o.createdBy === waiter.id);
    return {
      id: waiter.id,
      name: waiter.name,
      ordersCount: waiterOrders.length,
      totalSales: waiterOrders.reduce((sum, o) => sum + o.totalAmount, 0),
      isOnLeave: waiter.isOnLeave || false
    };
  }).sort((a, b) => b.ordersCount - a.ordersCount);

  return (
    <div>
      {/* Modern Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-5 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm opacity-90">Total Waiters</div>
              <div className="text-3xl font-bold">{allWaiters.length}</div>
              <div className="text-xs mt-1">
                Active: <span className="font-bold">{activeWaiters.length}</span> |
                Leave: <span className="font-bold text-yellow-200">{onLeaveWaiters.length}</span>
              </div>
            </div>
            <UserGroupIcon className="w-10 h-10 opacity-80" />
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
              <div className="text-sm opacity-90">Menu Items</div>
              <div className="text-3xl font-bold">{menu.length}</div>
            </div>
            <CakeIcon className="w-10 h-10 opacity-80" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-5 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm opacity-90">Total Sales</div>
              <div className="text-3xl font-bold">₹{Math.floor(totalSales)}</div>
            </div>
            <CurrencyRupeeIcon className="w-10 h-10 opacity-80" />
          </div>
        </div>
      </div>

      {/* ✅ Waiters Status Card - Active vs On Leave */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Active Waiters */}
        <div className="bg-white rounded-2xl shadow-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold flex items-center gap-2 text-green-600">
              <CheckCircleIcon className="w-5 h-5" /> Active Waiters ({activeWaiters.length})
            </h3>
            <UserIcon className="w-6 h-6 text-green-500" />
          </div>
          {activeWaiters.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No active waiters</p>
          ) : (
            <div className="space-y-2">
              {activeWaiters.map(waiter => {
                const perf = waiterPerformance.find(p => p.id === waiter.id);
                return (
                  <div key={waiter.id} className="flex justify-between items-center border-b pb-2">
                    <div>
                      <span className="font-semibold">{waiter.name}</span>
                      <span className="text-xs text-gray-500 ml-2">({waiter.email})</span>
                    </div>
                    <div className="flex gap-4 text-sm">
                      <span className="text-blue-600">📊 {perf?.ordersCount || 0} orders</span>
                      <span className="text-green-600">💰 ₹{Math.floor(perf?.totalSales || 0)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* On Leave Waiters */}
        <div className="bg-white rounded-2xl shadow-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold flex items-center gap-2 text-red-600">
              <XCircleIcon className="w-5 h-5" /> On Leave ({onLeaveWaiters.length})
            </h3>
          </div>
          {onLeaveWaiters.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No waiters on leave</p>
          ) : (
            <div className="space-y-2">
              {onLeaveWaiters.map(waiter => (
                <div key={waiter.id} className="flex justify-between items-center border-b pb-2">
                  <div>
                    <span className="font-semibold">{waiter.name}</span>
                    <span className="text-xs text-gray-500 ml-2">({waiter.email})</span>
                  </div>
                  <div className="text-red-500 text-sm flex items-center gap-1">
                    <XCircleIcon className="w-4 h-4" /> On Leave
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-4 mb-6 border-b pb-2">
        <button onClick={() => setFilter('today')} className={`px-4 py-2 font-semibold rounded-t-lg flex items-center gap-2 ${filter === 'today' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}>
          <CalendarIcon className="w-4 h-4" /> Today's Report
        </button>
        <button onClick={() => setFilter('history')} className={`px-4 py-2 font-semibold rounded-t-lg flex items-center gap-2 ${filter === 'history' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}>
          <CalendarIcon className="w-4 h-4" /> History
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
            <Bar dataKey="sales" fill="#3b82f6" radius={[8, 8, 0, 0]} />
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
                    <td className="py-2">#{idx + 1} {d.name}</td>
                    <td className="text-right font-semibold">{d.count} plates</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500">No orders found for selected date.</p>
          )}
        </div>

        {/* Waiters Performance Table */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <UserGroupIcon className="w-5 h-5" /> Waiters Performance (Today)
          </h3>
          {waiterPerformance.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No waiters data available</p>
          ) : (
            <table className="min-w-full">
              <thead className="border-b">
                <tr><th className="text-left py-2">Waiter</th><th className="text-center">Orders</th><th className="text-right">Sales</th><th className="text-center">Status</th></tr>
              </thead>
              <tbody>
                {waiterPerformance.map(waiter => (
                  <tr key={waiter.id} className="border-b">
                    <td className="py-2 font-medium">{waiter.name}</td>
                    <td className="text-center">{waiter.ordersCount}</td>
                    <td className="text-right text-green-600">₹{Math.floor(waiter.totalSales)}</td>
                    <td className="text-center">
                      {waiter.isOnLeave ? (
                        <span className="text-red-500 text-xs flex items-center justify-center gap-1"><XCircleIcon className="w-3 h-3" /> Leave</span>
                      ) : (
                        <span className="text-green-500 text-xs flex items-center justify-center gap-1"><CheckCircleIcon className="w-3 h-3" /> Active</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
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
          <Link to="/manager/leave" className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 transition">
            <CalendarIcon className="w-5 h-5" /> Leave Requests
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
          <Route path="/leave/*" element={<LeaveRequests />} />
        </Routes>
      </div>
    </div>
  );
};

export default ManagerDashboard;