import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchMenu } from '../features/menu/menuSlice';
import { createOrder, fetchMyOrders } from '../features/orders/orderSlice';
import Cart from '../components/Orders/Cart';
import Spinner from '../components/Common/Spinner';

const EmployeeDashboard = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);
  const { items: menuItems, isLoading: menuLoading } = useAppSelector(state => state.menu);
  const { myOrders, isLoading: ordersLoading } = useAppSelector(state => state.orders);
  const [cartItems, setCartItems] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [customerMobile, setCustomerMobile] = useState('');
  const [tableNumber, setTableNumber] = useState('');

  useEffect(() => {
    dispatch(fetchMenu());
    if (user) dispatch(fetchMyOrders(user.id));
  }, [dispatch, user]);

  const handlePlaceOrder = async () => {
    if (!customerName || !customerMobile || cartItems.length === 0)
      return alert('Please fill customer name, mobile and add items');
    
    let subtotal = 0, gst = 0;
    cartItems.forEach(item => {
      const itemTotal = item.price * item.quantity;
      subtotal += itemTotal;
      gst += (itemTotal * (item.taxRate || 5)) / 100;
    });
    const serviceCharge = subtotal * 0.05;
    const totalAmount = subtotal + gst + serviceCharge;
    
    const orderData = {
      customerName, customerMobile, tableNumber: parseInt(tableNumber),
      items: cartItems.map(({ id, name, price, quantity, taxRate }) => ({ menuItemId: id, name, quantity, price, taxRate })),
      subtotal, gst, serviceCharge, discount: 0, totalAmount,
      status: 'Pending', paymentMethod: 'Cash', createdBy: user.id,
    };
    await dispatch(createOrder(orderData));
    setCartItems([]); setCustomerName(''); setCustomerMobile(''); setTableNumber('');
    dispatch(fetchMyOrders(user.id));
  };

  if (menuLoading || ordersLoading) return <Spinner />;
  
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">🧑‍🍳 Waiter Panel</h1>
            <p className="text-gray-600">Welcome back, {user?.name}</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Today's Date</div>
            <div className="font-semibold">{new Date().toLocaleDateString()}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Menu Section */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-5">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">📋 Menu</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {menuItems.filter(i => i.available).map(item => (
                <div key={item.id} className="border rounded-xl p-3 flex gap-3 hover:shadow-lg transition-all hover:-translate-y-1 bg-white">
                  <img 
                    src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&h=100&fit=crop'} 
                    alt={item.name} 
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{item.name}</h3>
                    <p className="text-xs text-gray-500">{item.category}</p>
                    <p className="text-green-600 font-bold mt-1">₹{item.price}</p>
                    <button 
                      onClick={() => setCartItems([...cartItems, { ...item, quantity: 1 }])} 
                      className="mt-2 bg-blue-600 text-white px-3 py-1 rounded-full text-sm hover:bg-blue-700 transition"
                    >
                      + Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cart & Order Form */}
          <div className="bg-white rounded-xl shadow-lg p-5">
            <Cart cartItems={cartItems} setCartItems={setCartItems} />
            <div className="mt-6 space-y-3">
              <input 
                type="text" 
                placeholder="Customer Name *" 
                value={customerName} 
                onChange={e => setCustomerName(e.target.value)} 
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-400"
              />
              <input 
                type="tel" 
                placeholder="Mobile Number *" 
                value={customerMobile} 
                onChange={e => setCustomerMobile(e.target.value)} 
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-400"
              />
              <input 
                type="number" 
                placeholder="Table Number" 
                value={tableNumber} 
                onChange={e => setTableNumber(e.target.value)} 
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-400"
              />
              <button 
                onClick={handlePlaceOrder} 
                className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition"
              >
                Place Order
              </button>
            </div>
          </div>
        </div>

        {/* Order History */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-5">
          <h2 className="text-2xl font-bold mb-3">📜 My Order History</h2>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {myOrders.map(order => (
              <div key={order.id} className="border-b pb-2 flex justify-between items-center hover:bg-gray-50 p-2 rounded">
                <div>
                  <p className="font-medium">
                    <span className="font-mono text-xs">#{order.id.slice(0,8)}</span> - {order.customerName} 
                    <span className="text-gray-500 text-sm ml-2">({order.customerMobile})</span>
                  </p>
                  <p className="text-xs text-gray-500">Table {order.tableNumber} | {order.status}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">₹{order.totalAmount}</p>
                  <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleTimeString()}</p>
                </div>
              </div>
            ))}
            {myOrders.length === 0 && <p className="text-gray-500 text-center py-4">No orders yet. Start by placing an order!</p>}
          </div>
        </div>
      </div>
    </div>
  );
};
export default EmployeeDashboard;