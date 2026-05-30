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
  const [tableNumber, setTableNumber] = useState('');

  useEffect(() => {
    dispatch(fetchMenu());
    if (user) dispatch(fetchMyOrders(user.id));
  }, [dispatch, user]);

  const handlePlaceOrder = async () => {
    if (!customerName || cartItems.length === 0) return alert('Fill details');
    // calculate totals
    let subtotal = 0, gst = 0;
    cartItems.forEach(item => {
      const itemTotal = item.price * item.quantity;
      subtotal += itemTotal;
      gst += (itemTotal * (item.taxRate || 5)) / 100;
    });
    const serviceCharge = subtotal * 0.05;
    const totalAmount = subtotal + gst + serviceCharge;
    const orderData = {
      customerName,
      tableNumber: parseInt(tableNumber),
      items: cartItems.map(({ id, name, price, quantity, taxRate }) => ({ menuItemId: id, name, quantity, price, taxRate })),
      subtotal,
      gst,
      serviceCharge,
      discount: 0,
      totalAmount,
      status: 'Pending',
      paymentMethod: 'Cash',
      createdBy: user.id,
    };
    await dispatch(createOrder(orderData));
    setCartItems([]);
    setCustomerName('');
    setTableNumber('');
    dispatch(fetchMyOrders(user.id));
  };

  if (menuLoading || ordersLoading) return <Spinner />;
  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Waiter Dashboard - {user?.name}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h2 className="text-xl">Menu</h2>
          <div className="grid grid-cols-1 gap-2 mt-2">
            {menuItems.filter(i => i.available).map(item => (
              <div key={item.id} className="border p-2 rounded flex justify-between">
                <span>{item.name} - ₹{item.price}</span>
                <button onClick={() => setCartItems([...cartItems, { ...item, quantity: 1 }])} className="bg-green-500 text-white px-2 rounded">Add</button>
              </div>
            ))}
          </div>
        </div>
        <div>
          <Cart cartItems={cartItems} setCartItems={setCartItems} />
          <div className="mt-4">
            <input type="text" placeholder="Customer Name" value={customerName} onChange={e => setCustomerName(e.target.value)} className="border p-2 w-full mb-2" />
            <input type="number" placeholder="Table Number" value={tableNumber} onChange={e => setTableNumber(e.target.value)} className="border p-2 w-full mb-2" />
            <button onClick={handlePlaceOrder} className="bg-blue-600 text-white w-full py-2 rounded">Place Order</button>
          </div>
        </div>
      </div>
      <div className="mt-8">
        <h2 className="text-xl">My Orders History</h2>
        {myOrders.map(order => (
          <div key={order.id} className="border p-2 my-2 rounded">
            <p>Order #{order.id} | {order.customerName} | ₹{order.totalAmount} | {order.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
export default EmployeeDashboard;