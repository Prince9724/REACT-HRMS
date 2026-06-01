import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchAllOrders, updateOrderStatus } from '../features/orders/orderSlice';
import Spinner from '../components/Common/Spinner';

const OrdersPage = () => {
  const dispatch = useAppDispatch();
  const { allOrders, isLoading } = useAppSelector(state => state.orders);
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => { dispatch(fetchAllOrders()); }, [dispatch]);

  const filteredOrders = statusFilter === 'All' ? allOrders : allOrders.filter(o => o.status === statusFilter);
  const handleStatusChange = async (id, newStatus) => { await dispatch(updateOrderStatus({ id, status: newStatus })); dispatch(fetchAllOrders()); };

  const statusColors = { Pending: 'bg-yellow-100 text-yellow-800', 'In Progress': 'bg-blue-100 text-blue-800', Served: 'bg-green-100 text-green-800', Completed: 'bg-gray-100 text-gray-800' };

  if (isLoading) return <Spinner />;
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">📋 All Orders</h2>
      <div className="mb-5 flex flex-wrap gap-3 items-center">
        <label className="font-medium">Filter by Status:</label>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="border rounded-lg p-2 bg-white">
          <option>All</option><option>Pending</option><option>In Progress</option><option>Served</option><option>Completed</option>
        </select>
        <span className="text-sm text-gray-500">Total: {filteredOrders.length} orders</span>
      </div>
      <div className="space-y-4">
        {filteredOrders.map(order => (
          <div key={order.id} className="bg-white rounded-2xl shadow-md p-5 hover:shadow-lg transition">
            <div className="flex flex-wrap justify-between items-start border-b pb-3 mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">#{order.id.slice(0,8)}</span>
                  <span className="font-semibold text-lg">{order.customerName}</span>
                  <span className="text-sm text-gray-500">({order.customerMobile || 'N/A'})</span>
                </div>
                <div className="flex gap-4 mt-1 text-sm">
                  <span>Table {order.tableNumber}</span>
                  <span>Waiter ID: {order.createdBy}</span>
                  <span>{new Date(order.createdAt).toLocaleString()}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[order.status] || 'bg-gray-100'}`}>{order.status}</span>
                <select value={order.status} onChange={e => handleStatusChange(order.id, e.target.value)} className="border rounded-lg p-1 text-sm">
                  <option>Pending</option><option>In Progress</option><option>Served</option><option>Completed</option>
                </select>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <details className="text-sm">
                  <summary className="cursor-pointer text-blue-600">View items</summary>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    {order.items.map((item, idx) => <li key={idx}>{item.name} x {item.quantity} = ₹{item.price * item.quantity}</li>)}
                  </ul>
                </details>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">Total Amount</div>
                <div className="text-2xl font-bold text-green-600">₹{order.totalAmount}</div>
              </div>
            </div>
          </div>
        ))}
        {filteredOrders.length === 0 && <div className="bg-white rounded-2xl p-10 text-center text-gray-500">No orders found for the selected filter.</div>}
      </div>
    </div>
  );
};
export default OrdersPage;