import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import { useAuth } from '../../contexts/AuthContext';
import { productService } from '../../services/productService';
import { FiPackage, FiEye, FiCheckCircle, FiClock, FiTruck } from 'react-icons/fi';

const SellerOrdersPage = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchSellerOrders();
  }, []);

  const fetchSellerOrders = async () => {
    try {
      // Get seller's products first
      const productsResult = await productService.getProductsBySeller(user?.id);
      const sellerProducts = productsResult.success ? productsResult.data : [];
      const sellerProductIds = sellerProducts.map(p => p.id);
      
      // Get all orders
      const ordersRes = await fetch('http://localhost:5000/orders');
      const allOrders = await ordersRes.json();
      
      // Filter orders that contain seller's products
      const sellerOrders = allOrders.filter(order =>
        order.items?.some(item => sellerProductIds.includes(item.productId))
      );
      
      // Add product details to each order item
      const enrichedOrders = sellerOrders.map(order => ({
        ...order,
        items: order.items.map(item => ({
          ...item,
          productDetails: sellerProducts.find(p => p.id === item.productId)
        }))
      }));
      
      setOrders(enrichedOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
    setLoading(false);
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (response.ok) {
        setMessage(`Order status updated to ${newStatus}!`);
        fetchSellerOrders();
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: FiClock, text: 'Pending' },
      accepted: { color: 'bg-blue-100 text-blue-800', icon: FiCheckCircle, text: 'Accepted' },
      packed: { color: 'bg-purple-100 text-purple-800', icon: FiPackage, text: 'Packed' },
      shipped: { color: 'bg-indigo-100 text-indigo-800', icon: FiTruck, text: 'Shipped' },
      delivered: { color: 'bg-green-100 text-green-800', icon: FiCheckCircle, text: 'Delivered' }
    };
    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${config.color}`}>
        <Icon size={12} /> {config.text}
      </span>
    );
  };

  const getNextStatusOptions = (currentStatus) => {
    const statusFlow = ['pending', 'accepted', 'packed', 'shipped', 'delivered'];
    const currentIndex = statusFlow.indexOf(currentStatus);
    if (currentIndex === -1 || currentIndex === statusFlow.length - 1) return [];
    return statusFlow.slice(currentIndex + 1);
  };

  const formatPrice = (price) => {
    return `₹${Number(price).toLocaleString('en-IN')}`;
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
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Orders</h1>
            <p className="text-gray-600 mt-1">Manage orders for your products</p>
          </div>
        </div>

        {message && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6">
            {message}
          </div>
        )}

        {orders.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow">
            <FiPackage size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">No orders yet for your products</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map(order => (
              <div key={order.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                {/* Order Header */}
                <div className="bg-gray-50 px-6 py-4 border-b flex flex-wrap justify-between items-center gap-2">
                  <div>
                    <p className="text-sm text-gray-500">Order ID: <span className="font-medium text-gray-800">{order.orderId}</span></p>
                    <p className="text-sm text-gray-500">Customer: {order.customerName}</p>
                    <p className="text-sm text-gray-500">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusBadge(order.status)}
                  </div>
                </div>
                
                {/* Order Items */}
                <div className="p-6">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex gap-4 py-3 border-b last:border-0">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={item.productDetails?.images?.[0] || `https://picsum.photos/80/80?random=${item.productId}`}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">{item.name}</p>
                        <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                        <p className="text-primary font-bold">{formatPrice(item.price)}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">Total</p>
                        <p className="text-primary">{formatPrice(item.price * item.quantity)}</p>
                      </div>
                    </div>
                  ))}
                  
                  {/* Order Total */}
                  <div className="flex justify-end pt-4">
                    <div className="text-right">
                      <p className="text-gray-500">Total Amount</p>
                      <p className="text-xl font-bold text-primary">{formatPrice(order.total)}</p>
                    </div>
                  </div>
                  
                  {/* Status Update - Seller can update */}
                  {order.status !== 'delivered' && (
                    <div className="mt-4 pt-4 border-t">
                      <p className="font-semibold mb-2">Update Order Status:</p>
                      <div className="flex flex-wrap gap-2">
                        {getNextStatusOptions(order.status).map(status => (
                          <button
                            key={status}
                            onClick={() => updateOrderStatus(order.id, status)}
                            className="px-4 py-2 bg-primary text-white rounded-lg text-sm hover:bg-orange-600 transition"
                          >
                            Mark as {status.charAt(0).toUpperCase() + status.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Customer Details */}
                  <button
                    onClick={() => setSelectedOrder(selectedOrder === order ? null : order)}
                    className="mt-4 text-primary hover:text-orange-600 text-sm"
                  >
                    {selectedOrder === order ? 'Hide Customer Details' : 'View Customer Details'}
                  </button>
                  
                  {selectedOrder === order && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <h3 className="font-semibold mb-2">Customer Information</h3>
                      <p><span className="text-gray-500">Name:</span> {order.customerName}</p>
                      <p><span className="text-gray-500">Email:</span> {order.customerEmail}</p>
                      <p><span className="text-gray-500">Mobile:</span> {order.customerMobile}</p>
                      {order.shippingAddress && (
                        <>
                          <p className="font-semibold mt-2">Shipping Address:</p>
                          <p className="text-gray-600">
                            {order.shippingAddress.address}<br />
                            {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                          </p>
                        </>
                      )}
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

export default SellerOrdersPage;