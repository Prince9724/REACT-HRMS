import { useEffect, useState, useCallback, useRef } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
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
import GroupAnalytics from './GroupAnalytics';
import { ChartPieIcon, TagIcon } from '@heroicons/react/24/outline';
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
  FireIcon,
  StarIcon,
  HandThumbUpIcon,
  ArrowRightStartOnRectangleIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  UserGroupIcon,
  TrophyIcon
} from '@heroicons/react/24/outline';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const DashboardHome = () => {
  const dispatch = useAppDispatch();
  const { allOrders } = useAppSelector(state => state.orders);
  const { list: employees } = useAppSelector(state => state.employees);
  const { items: menu } = useAppSelector(state => state.menu);
  const { list: tables } = useAppSelector(state => state.tables);

  const [filter, setFilter] = useState('today');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [dailySales, setDailySales] = useState([]);
  const [categoryData, setCategoryData] = useState([]);

  const isFirstRender = useRef(true);

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

  const getFilteredOrders = useCallback(() => {
    if (filter === 'today') {
      const today = new Date().toISOString().split('T')[0];
      return allOrders.filter(order => order.createdAt.startsWith(today));
    } else {
      return allOrders.filter(order => order.createdAt.startsWith(selectedDate));
    }
  }, [filter, selectedDate, allOrders]);

  const filteredOrders = getFilteredOrders();
  const totalSales = filteredOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalOrders = filteredOrders.length;

  // ✅ Discount Statistics
  const ordersWithDiscount = filteredOrders.filter(o => o.discount > 0);
  const totalDiscountGiven = ordersWithDiscount.reduce((sum, o) => sum + (o.discount || 0), 0);
  const avgDiscountPerOrder = ordersWithDiscount.length > 0 
    ? (totalDiscountGiven / ordersWithDiscount.length).toFixed(0) 
    : 0;

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
      sales: Math.floor(allOrders.filter(o => o.createdAt.startsWith(date)).reduce((sum, o) => sum + o.totalAmount, 0)),
      orders: allOrders.filter(o => o.createdAt.startsWith(date)).length
    }));
    setDailySales(salesData);
  }, [allOrders]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const categories = {
      'Main': 0, 'Starter': 0, 'Bread': 0, 'Dessert': 0, 'Beverage': 0
    };

    filteredOrders.forEach(order => {
      order.items.forEach(item => {
        const menuItem = menu.find(m => m.id === item.menuItemId);
        if (menuItem && categories[menuItem.category] !== undefined) {
          categories[menuItem.category] += item.quantity;
        }
      });
    });

    const newCategoryData = Object.entries(categories)
      .filter(([_, value]) => value > 0)
      .map(([name, value]) => ({ name, value }));

    if (JSON.stringify(newCategoryData) !== JSON.stringify(categoryData)) {
      setCategoryData(newCategoryData);
    }
  }, [filteredOrders, menu]);

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

  const allWaiters = employees.filter(e => e.role === 'employee');
  const activeWaiters = allWaiters.filter(w => !w.isOnLeave);
  const onLeaveWaiters = allWaiters.filter(w => w.isOnLeave);

  const waiterPerformance = allWaiters.map(waiter => {
    const waiterOrders = filteredOrders.filter(o => o.createdBy === waiter.id);
    return {
      id: waiter.id,
      name: waiter.name,
      ordersCount: waiterOrders.length,
      totalSales: waiterOrders.reduce((sum, o) => sum + o.totalAmount, 0),
      isOnLeave: waiter.isOnLeave || false
    };
  }).sort((a, b) => b.ordersCount - a.ordersCount).slice(0, 5);

  const pendingOrders = filteredOrders.filter(o => o.status === 'Pending').length;
  const inProgressOrders = filteredOrders.filter(o => o.status === 'In Progress').length;
  const servedOrders = filteredOrders.filter(o => o.status === 'Served').length;
  const completedOrders = filteredOrders.filter(o => o.status === 'Completed').length;

  const orderStatusData = [
    { name: 'Pending', value: pendingOrders },
    { name: 'In Progress', value: inProgressOrders },
    { name: 'Served', value: servedOrders },
    { name: 'Completed', value: completedOrders }
  ];

  const COLORS = ['#f59e0b', '#3b82f6', '#10b981', '#6b7280'];

  const getDishIcon = (index) => {
    if (index === 0) return <TrophyIcon className="w-5 h-5 text-yellow-500" />;
    if (index === 1) return <StarIcon className="w-5 h-5 text-blue-500" />;
    if (index === 2) return <FireIcon className="w-5 h-5 text-orange-500" />;
    return <HandThumbUpIcon className="w-5 h-5 text-green-500" />;
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-[#1a237e] via-[#283593] to-[#4a148c] rounded-2xl shadow-xl p-6 text-white">
        <div className="flex flex-wrap justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Dashboard Overview</h1>
            <p className="text-blue-100 mt-1">Welcome back! Here's your restaurant performance summary</p>
          </div>
          <div className="flex items-center gap-2 bg-white/20 rounded-xl px-4 py-2">
            <CalendarIcon className="w-5 h-5" />
            <span className="text-sm">{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </div>
      </div>

      {/* Main KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-2xl shadow-lg p-5 border-l-4 border-blue-500 hover:shadow-xl transition-all">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Revenue</p>
              <p className="text-3xl font-bold text-gray-800">₹{Math.floor(totalSales)}</p>
              <div className="flex items-center gap-1 mt-2">
                <ArrowTrendingUpIcon className="w-4 h-4 text-green-500" />
                <span className="text-green-600 text-xs font-semibold">+{Math.floor(salesIncrease)}%</span>
                <span className="text-gray-400 text-xs">vs last period</span>
              </div>
            </div>
            <div className="bg-blue-100 rounded-xl p-3">
              <CurrencyRupeeIcon className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-5 border-l-4 border-green-500 hover:shadow-xl transition-all">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Orders</p>
              <p className="text-3xl font-bold text-gray-800">{totalOrders}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-yellow-600 text-xs">{pendingOrders} pending</span>
                <span className="text-green-600 text-xs">{completedOrders} completed</span>
              </div>
            </div>
            <div className="bg-green-100 rounded-xl p-3">
              <ShoppingBagIcon className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-5 border-l-4 border-purple-500 hover:shadow-xl transition-all">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Employees</p>
              <p className="text-3xl font-bold text-gray-800">{employees.length}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-green-600 text-xs">{activeWaiters.length} active</span>
                <span className="text-red-600 text-xs">{onLeaveWaiters.length} on leave</span>
              </div>
            </div>
            <div className="bg-purple-100 rounded-xl p-3">
              <UsersIcon className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-5 border-l-4 border-orange-500 hover:shadow-xl transition-all">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm font-medium">Menu Items</p>
              <p className="text-3xl font-bold text-gray-800">{menu.length}</p>
              <div className="mt-2">
                <span className="text-green-600 text-xs">{menu.filter(m => m.available).length} available</span>
              </div>
            </div>
            <div className="bg-orange-100 rounded-xl p-3">
              <CakeIcon className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Discount Statistics Card */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl shadow-lg p-5 border border-green-200">
        <div className="flex items-center gap-2 mb-3">
          <TagIcon className="w-5 h-5 text-green-600" />
          <h3 className="text-lg font-bold text-gray-800">Discount Summary</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-gray-500">Total Discount Given</p>
            <p className="text-2xl font-bold text-green-600">₹{Math.floor(totalDiscountGiven)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Orders with Discount</p>
            <p className="text-2xl font-bold text-gray-800">{ordersWithDiscount.length}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Avg Discount per Order</p>
            <p className="text-2xl font-bold text-blue-600">₹{avgDiscountPerOrder}</p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-2xl shadow-lg p-4">
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setFilter('today')}
            className={`px-5 py-2.5 rounded-xl font-semibold transition flex items-center gap-2 ${filter === 'today'
                ? 'bg-gradient-to-r from-[#1a237e] to-[#4a148c] text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            <CalendarIcon className="w-4 h-4" /> Today's Report
          </button>
          <button
            onClick={() => setFilter('history')}
            className={`px-5 py-2.5 rounded-xl font-semibold transition flex items-center gap-2 ${filter === 'history'
                ? 'bg-gradient-to-r from-[#1a237e] to-[#4a148c] text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            <CalendarIcon className="w-4 h-4" /> History
          </button>
          {filter === 'history' && (
            <div className="flex items-center gap-2 ml-auto">
              <CalendarIcon className="w-4 h-4 text-gray-500" />
              <input
                type="date"
                value={selectedDate}
                onChange={e => setSelectedDate(e.target.value)}
                className="border rounded-xl px-3 py-2 focus:ring-2 focus:ring-[#1a237e] outline-none"
              />
            </div>
          )}
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <ChartBarIcon className="w-5 h-5 text-blue-600" /> Daily Sales Trend
            </h3>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-xs text-gray-500">Revenue (₹)</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dailySales}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="date" stroke="#666" fontSize={12} />
              <YAxis stroke="#666" fontSize={12} tickFormatter={(value) => `₹${Math.floor(value)}`} />
              <Tooltip
                formatter={(value) => [`₹${Math.floor(value)}`, 'Revenue']}
                contentStyle={{ backgroundColor: 'white', borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Bar dataKey="sales" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-5">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <ClockIcon className="w-5 h-5 text-purple-600" /> Order Status Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={orderStatusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {orderStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} orders`, 'Count']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Distribution & Top Dishes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-5">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <CakeIcon className="w-5 h-5 text-orange-600" /> Category Distribution
          </h3>
          <div className="space-y-3">
            {categoryData.length > 0 ? (
              categoryData.map((cat) => {
                const maxValue = Math.max(...categoryData.map(c => c.value), 1);
                return (
                  <div key={cat.name}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">{cat.name}</span>
                      <span className="font-semibold text-gray-800">{cat.value} items sold</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(cat.value / maxValue) * 100}%` }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-500 text-center py-8">No data available</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-5">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <TrophyIcon className="w-5 h-5 text-yellow-600" /> Top Selling Dishes
          </h3>
          {topDishes.length > 0 ? (
            <div className="space-y-3">
              {topDishes.map((dish, idx) => (
                <div key={dish.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#1a237e] to-[#4a148c] text-white flex items-center justify-center font-bold text-sm">
                      {idx + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{dish.name}</p>
                      <p className="text-xs text-gray-500">{dish.count} orders</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {getDishIcon(idx)}
                    <span className="text-lg font-bold text-green-600">{dish.count}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No orders found for selected date</p>
          )}
        </div>
      </div>

      {/* Waiter Performance Table */}
      <div className="bg-white rounded-2xl shadow-lg p-5">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <UserGroupIcon className="w-5 h-5 text-green-600" /> Waiter Performance
        </h3>
        {waiterPerformance.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No waiter performance data available</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50 rounded-xl">
                <tr>
                  <th className="p-4 text-left text-gray-700 font-semibold">Waiter</th>
                  <th className="p-4 text-center text-gray-700 font-semibold">Orders</th>
                  <th className="p-4 text-right text-gray-700 font-semibold">Total Sales</th>
                  <th className="p-4 text-center text-gray-700 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {waiterPerformance.map((waiter) => (
                  <tr key={waiter.id} className="border-b hover:bg-gray-50 transition">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#1a237e] to-[#4a148c] text-white flex items-center justify-center font-bold">
                          {waiter.name?.charAt(0)?.toUpperCase()}
                        </div>
                        <span className="font-semibold text-gray-800">{waiter.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <span className="font-semibold text-blue-600">{waiter.ordersCount}</span>
                    </td>
                    <td className="p-4 text-right">
                      <span className="font-semibold text-green-600">₹{Math.floor(waiter.totalSales)}</span>
                    </td>
                    <td className="p-4 text-center">
                      {waiter.isOnLeave ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-red-100 text-red-700 text-xs">
                          <XCircleIcon className="w-3 h-3" /> Leave
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs">
                          <CheckCircleIcon className="w-3 h-3" /> Active
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Stats Footer - 3 Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-md p-4 flex items-center gap-3">
          <div className="bg-blue-100 rounded-xl p-3">
            <TableCellsIcon className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Total Tables</p>
            <p className="text-xl font-bold text-gray-800">{tables.length}</p>
            <p className="text-xs text-green-600">{tables.filter(t => t.assignedTo).length} assigned</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-4 flex items-center gap-3">
          <div className="bg-yellow-100 rounded-xl p-3">
            <ClockIcon className="w-6 h-6 text-yellow-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Pending Orders</p>
            <p className="text-xl font-bold text-yellow-600">{pendingOrders}</p>
            <p className="text-xs text-gray-500">Awaiting action</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-4 flex items-center gap-3">
          <div className="bg-green-100 rounded-xl p-3">
            <CheckCircleIcon className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Completed Orders</p>
            <p className="text-xl font-bold text-green-600">{completedOrders}</p>
            <p className="text-xs text-gray-500">Successfully delivered</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const ManagerDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const location = useLocation();
  const handleLogout = () => { dispatch(logout()); navigate('/login'); };

  const isActive = (path) => {
    if (path === '/manager' && location.pathname === '/manager') return true;
    if (path !== '/manager' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-72 bg-white shadow-xl flex flex-col">
        <div className="p-6 border-b bg-gradient-to-r from-[#1a237e] to-[#4a148c]">
          <h2 className="text-xl font-bold text-white">Manager Panel</h2>
          <p className="text-blue-100 text-sm mt-1">Restaurant Dashboard</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <Link
            to="/manager"
            className={`flex items-center gap-3 p-3 rounded-xl transition group ${isActive('/manager')
                ? 'bg-gradient-to-r from-[#1a237e] to-[#4a148c] text-white shadow-md'
                : 'text-gray-700 hover:bg-gray-100'
              }`}
          >
            <HomeIcon className={`w-5 h-5 ${isActive('/manager') ? 'text-white' : 'text-gray-500 group-hover:text-blue-600'}`} />
            <span>Dashboard</span>
          </Link>
          <Link
            to="/manager/employees"
            className={`flex items-center gap-3 p-3 rounded-xl transition group ${isActive('/manager/employees')
                ? 'bg-gradient-to-r from-[#1a237e] to-[#4a148c] text-white shadow-md'
                : 'text-gray-700 hover:bg-gray-100'
              }`}
          >
            <UsersIcon className={`w-5 h-5 ${isActive('/manager/employees') ? 'text-white' : 'text-gray-500 group-hover:text-blue-600'}`} />
            <span>Employees</span>
          </Link>
          <Link
            to="/manager/menu"
            className={`flex items-center gap-3 p-3 rounded-xl transition group ${isActive('/manager/menu')
                ? 'bg-gradient-to-r from-[#1a237e] to-[#4a148c] text-white shadow-md'
                : 'text-gray-700 hover:bg-gray-100'
              }`}
          >
            <CakeIcon className={`w-5 h-5 ${isActive('/manager/menu') ? 'text-white' : 'text-gray-500 group-hover:text-blue-600'}`} />
            <span>Menu</span>
          </Link>
          <Link
            to="/manager/tables"
            className={`flex items-center gap-3 p-3 rounded-xl transition group ${isActive('/manager/tables')
                ? 'bg-gradient-to-r from-[#1a237e] to-[#4a148c] text-white shadow-md'
                : 'text-gray-700 hover:bg-gray-100'
              }`}
          >
            <TableCellsIcon className={`w-5 h-5 ${isActive('/manager/tables') ? 'text-white' : 'text-gray-500 group-hover:text-blue-600'}`} />
            <span>Tables</span>
          </Link>
          <Link
            to="/manager/orders"
            className={`flex items-center gap-3 p-3 rounded-xl transition group ${isActive('/manager/orders')
                ? 'bg-gradient-to-r from-[#1a237e] to-[#4a148c] text-white shadow-md'
                : 'text-gray-700 hover:bg-gray-100'
              }`}
          >
            <ShoppingBagIcon className={`w-5 h-5 ${isActive('/manager/orders') ? 'text-white' : 'text-gray-500 group-hover:text-blue-600'}`} />
            <span>All Orders</span>
          </Link>
          <Link
            to="/manager/leave"
            className={`flex items-center gap-3 p-3 rounded-xl transition group ${isActive('/manager/leave')
                ? 'bg-gradient-to-r from-[#1a237e] to-[#4a148c] text-white shadow-md'
                : 'text-gray-700 hover:bg-gray-100'
              }`}
          >
            <CalendarIcon className={`w-5 h-5 ${isActive('/manager/leave') ? 'text-white' : 'text-gray-500 group-hover:text-blue-600'}`} />
            <span>Leave Requests</span>
          </Link>
          <Link
            to="/manager/analytics"
            className={`flex items-center gap-3 p-3 rounded-xl transition group ${isActive('/manager/analytics')
                ? 'bg-gradient-to-r from-[#1a237e] to-[#4a148c] text-white shadow-md'
                : 'text-gray-700 hover:bg-gray-100'
              }`}
          >
            <ChartPieIcon className={`w-5 h-5 ${isActive('/manager/analytics') ? 'text-white' : 'text-gray-500 group-hover:text-blue-600'}`} />
            <span>Group Analytics</span>
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
          <Route path="/analytics" element={<GroupAnalytics />} />
        </Routes>
      </div>
    </div>
  );
};

export default ManagerDashboard;