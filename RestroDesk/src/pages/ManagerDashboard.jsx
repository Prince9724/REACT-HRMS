import { useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchEmployees } from '../features/employees/employeeSlice';
import { fetchAllOrders } from '../features/orders/orderSlice';
import { fetchMenu } from '../features/menu/menuSlice';
import { getSalesReport } from '../features/reports/reportSlice';
import { logout } from '../features/auth/authSlice';
import Spinner from '../components/Common/Spinner';
import EmployeeManagement from './EmployeeManagement';
import MenuManagement from './MenuManagement';
import OrdersPage from './OrdersPage';

const DashboardHome = () => {
  const dispatch = useAppDispatch();
  const { allOrders } = useAppSelector(state => state.orders);
  const { list: employees } = useAppSelector(state => state.employees);
  const { items: menu } = useAppSelector(state => state.menu);
  const { topDishes, loading } = useAppSelector(state => state.reports);

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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-5 rounded-2xl shadow-lg">
          <div className="text-3xl mb-2">👥</div>
          <div className="text-sm opacity-90">Total Employees</div>
          <div className="text-3xl font-bold">{employees.length}</div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-5 rounded-2xl shadow-lg">
          <div className="text-3xl mb-2">📦</div>
          <div className="text-sm opacity-90">Total Orders</div>
          <div className="text-3xl font-bold">{allOrders.length}</div>
        </div>
        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white p-5 rounded-2xl shadow-lg">
          <div className="text-3xl mb-2">💰</div>
          <div className="text-sm opacity-90">Total Sales</div>
          <div className="text-3xl font-bold">₹{totalSales}</div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-5 rounded-2xl shadow-lg">
          <div className="text-3xl mb-2">🍕</div>
          <div className="text-sm opacity-90">Menu Items</div>
          <div className="text-3xl font-bold">{menu.length}</div>
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">🔥 Top Selling Dishes</h3>
        {topDishes?.length > 0 ? (
          <ul className="divide-y">
            {topDishes.map((d, idx) => (
              <li key={d.name} className="py-2 flex justify-between items-center">
                <span className="flex items-center gap-2">
                  <span className="w-6 text-center font-bold text-gray-400">#{idx+1}</span>
                  <span>{d.name}</span>
                </span>
                <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm">{d.count} sold</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No data yet. Place some orders first.</p>
        )}
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
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            📊 Manager Panel
          </h2>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link to="/manager" className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 transition group">
            <span className="text-xl">🏠</span> <span className="font-medium">Dashboard</span>
          </Link>
          <Link to="/manager/employees" className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 transition group">
            <span className="text-xl">👥</span> <span className="font-medium">Employees</span>
          </Link>
          <Link to="/manager/menu" className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 transition group">
            <span className="text-xl">🍔</span> <span className="font-medium">Menu</span>
          </Link>
          <Link to="/manager/orders" className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 transition group">
            <span className="text-xl">📋</span> <span className="font-medium">All Orders</span>
          </Link>
        </nav>
        <div className="p-4 border-t">
          <button onClick={handleLogout} className="flex items-center gap-3 w-full p-3 text-red-600 hover:bg-red-50 rounded-xl transition">
            <span className="text-xl">🚪</span> <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 overflow-y-auto p-6">
        <Routes>
          <Route path="/" element={<DashboardHome />} />
          <Route path="/employees/*" element={<EmployeeManagement />} />
          <Route path="/menu/*" element={<MenuManagement />} />
          <Route path="/orders/*" element={<OrdersPage />} />
        </Routes>
      </div>
    </div>
  );
};
export default ManagerDashboard;