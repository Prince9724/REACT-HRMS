import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import { useAuth } from '../../contexts/AuthContext';
import { FiUsers, FiShoppingBag, FiPackage, FiDollarSign, FiClock, FiCheckCircle } from 'react-icons/fi';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalSellers: 0,
    totalCustomers: 0,
    totalProducts: 0,
    pendingProducts: 0,
    totalOrders: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    
    try {
      // ✅ 1. USERS - Real data fetch karo
      const usersRes = await fetch('http://localhost:5000/users');
      const users = await usersRes.json();
      
      const totalUsers = users.length;
      const totalSellers = users.filter(u => u.role === 'seller').length;
      const totalCustomers = users.filter(u => u.role === 'customer').length;
      
      // ✅ 2. PRODUCTS - Real data fetch karo
      const productsRes = await fetch('http://localhost:5000/products');
      const products = await productsRes.json();
      
      const totalProducts = products.length;
      const pendingProducts = products.filter(p => p.status === 'pending').length;
      
      // ✅ 3. ORDERS - Real data fetch karo
      const ordersRes = await fetch('http://localhost:5000/orders');
      const orders = await ordersRes.json();
      
      const totalOrders = orders.length;
      const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
      
      setStats({
        totalUsers,
        totalSellers,
        totalCustomers,
        totalProducts,
        pendingProducts,
        totalOrders,
        totalRevenue
      });
      
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
    
    setLoading(false);
  };

  const statCards = [
    { 
      icon: FiUsers, 
      label: 'Total Users', 
      value: stats.totalUsers, 
      color: 'bg-blue-500', 
      link: '/admin/users' 
    },
    { 
      icon: FiShoppingBag, 
      label: 'Total Sellers', 
      value: stats.totalSellers, 
      color: 'bg-green-500', 
      link: '/admin/sellers' 
    },
    { 
      icon: FiPackage, 
      label: 'Total Products', 
      value: stats.totalProducts, 
      color: 'bg-purple-500', 
      link: '/admin/products' 
    },
    { 
      icon: FiClock, 
      label: 'Pending Products', 
      value: stats.pendingProducts, 
      color: 'bg-yellow-500', 
      link: '/admin/pending-products' 
    },
    { 
      icon: FiDollarSign, 
      label: 'Total Revenue', 
      value: `₹${stats.totalRevenue}`, 
      color: 'bg-primary', 
      link: '#' 
    },
    { 
      icon: FiCheckCircle, 
      label: 'Total Orders', 
      value: stats.totalOrders, 
      color: 'bg-teal-500', 
      link: '/admin/orders' 
    },
  ];

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8 min-h-screen">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back, {user?.fullName}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {statCards.map((stat, index) => (
            <Link
              key={index}
              to={stat.link}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-full text-white group-hover:scale-110 transition`}>
                  <stat.icon size={24} />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-12">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              to="/admin/pending-products"
              className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center justify-between hover:bg-yellow-100 transition"
            >
              <div>
                <p className="font-semibold">Review Pending Products</p>
                <p className="text-sm text-gray-600">{stats.pendingProducts} products waiting for approval</p>
              </div>
              <FiClock className="text-yellow-500" size={24} />
            </Link>
            <Link
              to="/admin/users"
              className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between hover:bg-blue-100 transition"
            >
              <div>
                <p className="font-semibold">Manage Users</p>
                <p className="text-sm text-gray-600">View and manage all users</p>
              </div>
              <FiUsers className="text-blue-500" size={24} />
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AdminDashboard;