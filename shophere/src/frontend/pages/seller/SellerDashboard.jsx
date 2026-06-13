import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import { useAuth } from '../../contexts/AuthContext';
import { productService } from '../../services/productService';
import { FiPackage, FiShoppingBag, FiDollarSign, FiClock } from 'react-icons/fi';

const SellerDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalSales: 0,
    pendingOrders: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSellerStats();
  }, []);

  const fetchSellerStats = async () => {
    setLoading(true);
    
    // Fetch seller's products
    const productsResult = await productService.getProductsBySeller(user?.id);
    const sellerProducts = productsResult.success ? productsResult.data : [];
    
    // Fetch all orders
    const ordersRes = await fetch('http://localhost:5000/orders');
    const allOrders = await ordersRes.json();
    
    // Filter orders for seller's products
    const sellerProductIds = sellerProducts.map(p => p.id);
    const sellerOrders = allOrders.filter(order =>
      order.items?.some(item => sellerProductIds.includes(item.productId))
    );
    
    // Calculate stats
    const totalSales = sellerOrders.reduce((sum, order) => sum + order.total, 0);
    const pendingOrders = sellerOrders.filter(order => order.status === 'pending').length;
    
    setStats({
      totalProducts: sellerProducts.length,
      totalOrders: sellerOrders.length,
      totalSales: totalSales,
      pendingOrders: pendingOrders
    });
    
    setLoading(false);
  };

  const statCards = [
    { icon: FiPackage, label: 'Total Products', value: stats.totalProducts, color: '#ff6b35', link: '/seller/products' },
    { icon: FiShoppingBag, label: 'Total Orders', value: stats.totalOrders, color: '#28a745', link: '/seller/orders' },
    { icon: FiDollarSign, label: 'Total Sales', value: `$${stats.totalSales}`, color: '#17a2b8', link: '/seller/orders' },
    { icon: FiClock, label: 'Pending Orders', value: stats.pendingOrders, color: '#ffc107', link: '/seller/orders' }
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
          <h1 className="text-3xl font-bold text-gray-800">Seller Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back, {user?.fullName}</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => (
            <Link
              key={index}
              to={stat.link}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition group cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                </div>
                <div className="p-3 rounded-full" style={{ backgroundColor: `${stat.color}20` }}>
                  <stat.icon size={24} color={stat.color} />
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
              to="/seller/add-product"
              className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between hover:bg-blue-100 transition"
            >
              <div>
                <p className="font-semibold">Add New Product</p>
                <p className="text-sm text-gray-600">List a new product for sale</p>
              </div>
              <FiPackage className="text-blue-500" size={24} />
            </Link>
            <Link
              to="/seller/products"
              className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center justify-between hover:bg-green-100 transition"
            >
              <div>
                <p className="font-semibold">Manage Products</p>
                <p className="text-sm text-gray-600">Edit or update your products</p>
              </div>
              <FiShoppingBag className="text-green-500" size={24} />
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SellerDashboard;