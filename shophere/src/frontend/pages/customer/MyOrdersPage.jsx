import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import { useAuth } from '../../contexts/AuthContext';
import { FiPackage, FiEye, FiTruck, FiCheckCircle, FiClock, FiXCircle } from 'react-icons/fi';

const MyOrdersPage = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch(`http://localhost:5000/orders?userId=${user?.id}`);
      const data = await response.json();
      // Sort by newest first
      const sortedOrders = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setOrders(sortedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
    setLoading(false);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: FiClock, text: 'Pending' },
      accepted: { color: 'bg-blue-100 text-blue-800', icon: FiCheckCircle, text: 'Accepted' },
      packed: { color: 'bg-purple-100 text-purple-800', icon: FiPackage, text: 'Packed' },
      shipped: { color: 'bg-indigo-100 text-indigo-800', icon: FiTruck, text: 'Shipped' },
      delivered: { color: 'bg-green-100 text-green-800', icon: FiCheckCircle, text: 'Delivered' },
      cancelled: { color: 'bg-red-100 text-red-800', icon: FiXCircle, text: 'Cancelled' }
    };
    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${config.color}`}>
        <Icon size={12} /> {config.text}
      </span>
    );
  };

  // ✅ FIXED: Image URL function
  const getImageUrl = (item) => {
    // Agar item mein image hai toh use karo
    if (item.image && item.image.startsWith('http')) {
      return item.image;
    }
    
    // Product ID based consistent image (fallback)
    return `https://picsum.photos/80/80?random=${item.productId || 1}`;
  };

  const formatPrice = (price) => {
    return `₹${Number(price).toLocaleString('en-IN')}`;
  };

  const getStatusSteps = (currentStatus) => {
    const steps = [
      { key: 'pending', label: 'Order Placed', icon: FiClock },
      { key: 'accepted', label: 'Confirmed', icon: FiCheckCircle },
      { key: 'packed', label: 'Packed', icon: FiPackage },
      { key: 'shipped', label: 'Shipped', icon: FiTruck },
      { key: 'delivered', label: 'Delivered', icon: FiCheckCircle }
    ];
    
    const currentIndex = steps.findIndex(s => s.key === currentStatus);
    
    return steps.map((step, idx) => {
      const isCompleted = idx <= currentIndex;
      const Icon = step.icon;
      return { ...step, isCompleted, Icon };
    });
  };

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
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">My Orders</h1>
        
        {orders.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow">
            <FiPackage size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 mb-4">You haven't placed any orders yet.</p>
            <Link to="/products" className="bg-primary text-white px-6 py-2 rounded-lg inline-block">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map(order => (
              <div key={order.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                {/* Order Header */}
                <div className="bg-gray-50 px-6 py-4 border-b flex flex-wrap justify-between items-center gap-2">
                  <div>
                    <p className="text-sm text-gray-500">Order ID: <span className="font-medium text-gray-800">{order.orderId}</span></p>
                    <p className="text-sm text-gray-500">Placed on: {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  </div>
                  <div>
                    {getStatusBadge(order.status)}
                  </div>
                </div>
                
                {/* Order Items */}
                <div className="p-6">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex gap-4 py-3 border-b last:border-0">
                      {/* Product Image */}
                      <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={getImageUrl(item)}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = `https://picsum.photos/80/80?random=${item.productId || 1}`;
                          }}
                        />
                      </div>
                      
                      {/* Product Details */}
                      <div className="flex-1">
                        <Link to={`/product/${item.productId}`} className="font-semibold text-gray-800 hover:text-primary">
                          {item.name}
                        </Link>
                        <p className="text-sm text-gray-500 mt-1">Quantity: {item.quantity}</p>
                        <p className="text-primary font-bold mt-1">{formatPrice(item.price)}</p>
                      </div>
                      
                      {/* Item Total */}
                      <div className="text-right">
                        <p className="font-semibold text-gray-800">Total</p>
                        <p className="text-primary font-bold">{formatPrice(item.price * item.quantity)}</p>
                      </div>
                    </div>
                  ))}
                  
                  {/* Order Total */}
                  <div className="flex justify-between items-center pt-4 mt-2 border-t">
                    <span className="font-semibold text-gray-800">Total Amount</span>
                    <span className="font-bold text-xl text-primary">{formatPrice(order.total)}</span>
                  </div>
                  
                  {/* Shipping Address */}
                  {order.shippingAddress && (
                    <div className="mt-4 pt-3 border-t text-sm">
                      <p className="font-semibold text-gray-700">Delivery Address:</p>
                      <p className="text-gray-600">
                        {order.customerName}<br />
                        {order.shippingAddress.address}<br />
                        {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}<br />
                        Mobile: {order.customerMobile}
                      </p>
                    </div>
                  )}
                  
                  {/* View Details Button */}
                  <button
                    onClick={() => setSelectedOrder(selectedOrder === order ? null : order)}
                    className="mt-4 text-primary hover:text-orange-600 flex items-center gap-1 text-sm"
                  >
                    <FiEye size={14} /> {selectedOrder === order ? 'Hide Details' : 'View Order Details'}
                  </button>
                  
                  {/* Order Status Tracker */}
                  {selectedOrder === order && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <h3 className="font-semibold text-gray-800 mb-4">Order Status</h3>
                      <div className="flex flex-wrap justify-between items-center">
                        {getStatusSteps(order.status).map((step, idx) => (
                          <div key={idx} className="flex-1 text-center relative">
                            <div className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center ${
                              step.isCompleted ? 'bg-primary text-white' : 'bg-gray-200 text-gray-400'
                            }`}>
                              <step.Icon size={20} />
                            </div>
                            <p className={`text-xs mt-2 font-medium ${step.isCompleted ? 'text-primary' : 'text-gray-400'}`}>
                              {step.label}
                            </p>
                            {idx < 4 && (
                              <div className={`absolute top-5 left-1/2 w-full h-0.5 ${
                                step.isCompleted && getStatusSteps(order.status)[idx + 1]?.isCompleted ? 'bg-primary' : 'bg-gray-200'
                              } hidden md:block`} />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default MyOrdersPage;