// src/pages/OrdersPage.jsx
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchAllOrders, updateOrderStatus } from '../features/orders/orderSlice';
import Spinner from '../components/Common/Spinner';

const OrdersPage = () => {
  const dispatch = useAppDispatch();
  const { allOrders, isLoading } = useAppSelector(state => state.orders);
  const [showHistory, setShowHistory] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  useEffect(() => {
    const load = async () => {
      await dispatch(fetchAllOrders());
      setInitialLoadDone(true);
    };
    load();
  }, [dispatch]);

  // Silent polling for manager
  useEffect(() => {
    if (!initialLoadDone) return;
    const interval = setInterval(() => {
      dispatch(fetchAllOrders());
    }, 10000);
    return () => clearInterval(interval);
  }, [dispatch, initialLoadDone]);

  if (!initialLoadDone && isLoading) return <Spinner />;

  // Filter orders: today or selected date
  let filteredOrders = showHistory
    ? allOrders.filter(o => o.createdAt.startsWith(selectedDate))
    : allOrders.filter(o => o.createdAt.startsWith(new Date().toISOString().split('T')[0]));

  // Search
  if (searchTerm.trim()) {
    const term = searchTerm.toLowerCase();
    filteredOrders = filteredOrders.filter(o =>
      o.customerName.toLowerCase().includes(term) ||
      o.customerMobile.includes(term) ||
      o.id.toLowerCase().includes(term)
    );
  }

  // Newest first (unshift effect)
  filteredOrders = [...filteredOrders].sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));

  const handleStatusChange = async (id, newStatus) => {
    await dispatch(updateOrderStatus({ id, status: newStatus }));
    dispatch(fetchAllOrders());
  };

  const statusColors = {
    Pending: 'bg-yellow-100 text-yellow-800',
    'In Progress': 'bg-blue-100 text-blue-800',
    Served: 'bg-green-100 text-green-800',
    Completed: 'bg-gray-100 text-gray-800'
  };

  const printBill = (order) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html><head><title>Invoice ${order.id.slice(0,8)}</title>
      <style>body{font-family:Arial;padding:20px} table{border-collapse:collapse;width:100%} th,td{border:1px solid #ddd;padding:8px} .total{font-weight:bold;margin-top:20px}</style>
      </head><body>
      <h2>Restaurant POS</h2>
      <p>Order #${order.id.slice(0,8)}<br>Date: ${new Date(order.createdAt).toLocaleString()}</p>
      <p>Customer: ${order.customerName} (${order.customerMobile})<br>Table: ${order.tableNumber}</p>
      ${order.notes ? `<p>Instructions: ${order.notes}</p>` : ''}
      <table><tr><th>Item</th><th>Qty</th><th>Price</th><th>Total</th></tr>
      ${order.items.map(item => `<tr><td>${item.name}</td><td>${item.quantity}</td><td>₹${item.price}</td><td>₹${item.price * item.quantity}</td></tr>`).join('')}
      </table>
      <div class="total">Total: ₹${Math.floor(order.totalAmount)}</div>
      <p>Thank you!</p>
      </body></html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
        <h2 className="text-2xl font-bold">📋 All Orders</h2>
        <div className="flex gap-3">
          <button onClick={() => setShowHistory(false)} className={`px-4 py-2 rounded-lg ${!showHistory ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>Today's Orders</button>
          <button onClick={() => setShowHistory(true)} className={`px-4 py-2 rounded-lg ${showHistory ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>History</button>
          {showHistory && <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} className="border rounded-lg p-2" />}
          <input type="text" placeholder="Search" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="border rounded-lg p-2 w-48" />
        </div>
      </div>
      <div className="space-y-4">
        {filteredOrders.map(order => (
          <div key={order.id} className="bg-white rounded-2xl shadow-md p-5 hover:shadow-lg">
            <div className="flex flex-wrap justify-between items-start border-b pb-3 mb-3">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">#{order.id.slice(0,8)}</span>
                  <span className="font-semibold text-lg">{order.customerName}</span>
                  <span className="text-sm text-gray-500">({order.customerMobile})</span>
                </div>
                <div className="flex gap-4 mt-1 text-sm">
                  <span>Table {order.tableNumber}</span>
                  <span>Waiter ID: {order.createdBy}</span>
                  <span>{new Date(order.createdAt).toLocaleString()}</span>
                </div>
                {order.notes && <p className="text-sm text-orange-600 mt-1">📝 {order.notes}</p>}
              </div>
              <div className="flex items-center gap-3 mt-2 sm:mt-0">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[order.status]}`}>{order.status}</span>
                <select value={order.status} onChange={e => handleStatusChange(order.id, e.target.value)} className="border rounded-lg p-1 text-sm">
                  <option>Pending</option><option>In Progress</option><option>Served</option><option>Completed</option>
                </select>
                <button onClick={() => printBill(order)} className="bg-gray-500 text-white px-2 py-1 rounded text-sm">Print</button>
              </div>
            </div>
            <details>
              <summary className="cursor-pointer text-blue-600 text-sm">View items</summary>
              <ul className="list-disc pl-5 mt-2 text-sm">
                {order.items.map((item, idx) => <li key={idx}>{item.name} x {item.quantity} = ₹{item.price * item.quantity}</li>)}
              </ul>
            </details>
            <div className="text-right mt-2">
              <div className="text-2xl font-bold text-green-600">₹{order.totalAmount}</div>
            </div>
          </div>
        ))}
        {filteredOrders.length === 0 && <div className="bg-white rounded-2xl p-10 text-center text-gray-500">No orders found.</div>}
      </div>
    </div>
  );
};

export default OrdersPage;