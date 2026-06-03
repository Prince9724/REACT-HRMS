import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchAllOrders, updateOrderStatus } from '../features/orders/orderSlice';
import Spinner from '../components/Common/Spinner';
import { 
  ClipboardDocumentListIcon, 
  CalendarIcon, 
  MagnifyingGlassIcon,
  PrinterIcon,
  EyeIcon,
  CurrencyRupeeIcon,
  UserIcon,
  TableCellsIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

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

  // Silent polling
  useEffect(() => {
    if (!initialLoadDone) return;
    const interval = setInterval(() => {
      dispatch(fetchAllOrders());
    }, 10000);
    return () => clearInterval(interval);
  }, [dispatch, initialLoadDone]);

  if (!initialLoadDone && isLoading) return <Spinner />;

  // Filter orders
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

  // Newest first
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

  const statusIcons = {
    Pending: <ClockIcon className="w-3 h-3" />,
    'In Progress': <ArrowPathIcon className="w-3 h-3" />,
    Served: <CheckCircleIcon className="w-3 h-3" />,
    Completed: <CheckCircleIcon className="w-3 h-3" />
  };

  const printBill = (order) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html><head><title>Invoice ${order.id.slice(0,8)}</title>
      <style>
        body{font-family:Arial;padding:20px} 
        table{border-collapse:collapse;width:100%} 
        th,td{border:1px solid #ddd;padding:8px;text-align:left} 
        .total{font-weight:bold;margin-top:20px;font-size:1.2em}
        .header{text-align:center;margin-bottom:30px}
        .footer{text-align:center;margin-top:30px;font-size:12px;color:#666}
      </style>
      </head><body>
      <div class="header">
        <h2>Restaurant POS</h2>
        <p>Order #${order.id.slice(0,8)} | Date: ${new Date(order.createdAt).toLocaleString()}</p>
      </div>
      <p><strong>Customer:</strong> ${order.customerName} (${order.customerMobile})</p>
      <p><strong>Table:</strong> ${order.tableNumber} | <strong>Waiter ID:</strong> ${order.createdBy}</p>
      ${order.notes ? `<p><strong>Special Instructions:</strong> ${order.notes}</p>` : ''}
      <table>
        <thead><tr><th>Item</th><th>Qty</th><th>Price</th><th>Total</th></tr></thead>
        <tbody>
          ${order.items.map(item => `<tr><td>${item.name}</td><td>${item.quantity}</td><td>₹${item.price}</td><td>₹${item.price * item.quantity}</td>`).join('')}
        </tbody>
       </td>
      <div class="total">Total Amount: ₹${Math.floor(order.totalAmount)}</div>
      <div class="footer">Thank you! Visit again</div>
      </body></html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  // Statistics
  const totalOrdersCount = filteredOrders.length;
  const totalSales = filteredOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const pendingCount = filteredOrders.filter(o => o.status === 'Pending').length;
  const completedCount = filteredOrders.filter(o => o.status === 'Completed').length;

  return (
    <div className="space-y-6">
      {/* Header with Stats - Matching Manager Dashboard Colors */}
      <div className="bg-gradient-to-r from-[#1a237e] to-[#4a148c] rounded-2xl shadow-lg p-6 text-white">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <ClipboardDocumentListIcon className="w-8 h-8" />
            <div>
              <h2 className="text-2xl font-bold">Order Management</h2>
              <p className="text-indigo-100 text-sm">Manage and track all customer orders</p>
            </div>
          </div>
          <div className="flex gap-4 text-center">
            <div className="bg-white/20 rounded-xl px-4 py-2">
              <div className="text-xs opacity-80">Total Orders</div>
              <div className="text-2xl font-bold">{totalOrdersCount}</div>
            </div>
            <div className="bg-white/20 rounded-xl px-4 py-2">
              <div className="text-xs opacity-80">Total Sales</div>
              <div className="text-2xl font-bold">₹{Math.floor(totalSales)}</div>
            </div>
            <div className="bg-white/20 rounded-xl px-4 py-2">
              <div className="text-xs opacity-80">Pending</div>
              <div className="text-2xl font-bold">{pendingCount}</div>
            </div>
            <div className="bg-white/20 rounded-xl px-4 py-2">
              <div className="text-xs opacity-80">Completed</div>
              <div className="text-2xl font-bold">{completedCount}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-lg p-5">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div className="flex gap-3">
            <button 
              onClick={() => setShowHistory(false)} 
              className={`px-5 py-2 rounded-xl font-semibold transition flex items-center gap-2 ${!showHistory ? 'bg-gradient-to-r from-[#1a237e] to-[#4a148c] text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              <CalendarIcon className="w-4 h-4" /> Today's Orders
            </button>
            <button 
              onClick={() => setShowHistory(true)} 
              className={`px-5 py-2 rounded-xl font-semibold transition flex items-center gap-2 ${showHistory ? 'bg-gradient-to-r from-[#1a237e] to-[#4a148c] text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              <CalendarIcon className="w-4 h-4" /> History
            </button>
          </div>
          
          <div className="flex gap-3">
            {showHistory && (
              <div className="flex items-center gap-2 border rounded-xl px-3 py-2 bg-gray-50">
                <CalendarIcon className="w-4 h-4 text-gray-500" />
                <input 
                  type="date" 
                  value={selectedDate} 
                  onChange={e => setSelectedDate(e.target.value)} 
                  className="outline-none bg-transparent"
                />
              </div>
            )}
            <div className="flex items-center gap-2 border rounded-xl px-3 py-2 bg-gray-50">
              <MagnifyingGlassIcon className="w-4 h-4 text-gray-500" />
              <input 
                type="text" 
                placeholder="Search by name, mobile or order ID" 
                value={searchTerm} 
                onChange={e => setSearchTerm(e.target.value)} 
                className="outline-none bg-transparent w-64"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 && (
          <div className="bg-white rounded-2xl p-12 text-center">
            <ClipboardDocumentListIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No orders found</p>
            <p className="text-gray-400 text-sm">Try changing your search or filter criteria</p>
          </div>
        )}
        
        {filteredOrders.map(order => (
          <div key={order.id} className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
            <div className="p-5">
              {/* Order Header */}
              <div className="flex flex-wrap justify-between items-start border-b pb-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-r from-[#1a237e] to-[#4a148c] rounded-xl px-3 py-2">
                    <span className="font-mono text-sm font-bold text-white">#{order.id.slice(0,8)}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <UserIcon className="w-4 h-4 text-gray-500" />
                      <span className="font-semibold text-lg">{order.customerName}</span>
                      <span className="text-sm text-gray-500">({order.customerMobile})</span>
                    </div>
                    <div className="flex gap-4 mt-1 text-sm text-gray-500">
                      <span className="flex items-center gap-1"><TableCellsIcon className="w-3 h-3" /> Table {order.tableNumber}</span>
                      <span>Waiter ID: {order.createdBy}</span>
                      <span className="flex items-center gap-1"><ClockIcon className="w-3 h-3" /> {new Date(order.createdAt).toLocaleString()}</span>
                    </div>
                    {order.notes && (
                      <p className="text-sm text-orange-600 mt-2 flex items-center gap-1">
                        Note: {order.notes}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-3 mt-3 sm:mt-0">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${statusColors[order.status]}`}>
                    {statusIcons[order.status]} {order.status}
                  </span>
                  <select 
                    value={order.status} 
                    onChange={e => handleStatusChange(order.id, e.target.value)} 
                    className="border rounded-lg p-2 text-sm bg-white cursor-pointer hover:border-[#1a237e] focus:outline-none focus:ring-2 focus:ring-[#1a237e]"
                  >
                    <option>Pending</option>
                    <option>In Progress</option>
                    <option>Served</option>
                    <option>Completed</option>
                  </select>
                  <button 
                    onClick={() => printBill(order)} 
                    className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded-lg text-sm transition flex items-center gap-2"
                  >
                    <PrinterIcon className="w-4 h-4" /> Print
                  </button>
                </div>
              </div>
              
              {/* Order Items */}
              <details className="group">
                <summary className="cursor-pointer text-[#1a237e] text-sm font-semibold flex items-center gap-2 hover:text-[#4a148c] transition">
                  <EyeIcon className="w-4 h-4" /> View Order Items
                </summary>
                <div className="mt-3 bg-gray-50 rounded-xl p-4">
                  <table className="w-full">
                    <thead className="border-b">
                      <tr className="text-left text-sm text-gray-600">
                        <th className="pb-2">Item</th>
                        <th className="pb-2 text-center">Qty</th>
                        <th className="pb-2 text-right">Price</th>
                        <th className="pb-2 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.items.map((item, idx) => (
                        <tr key={idx} className="border-b last:border-0">
                          <td className="py-2 text-sm">{item.name}</td>
                          <td className="py-2 text-center text-sm">×{item.quantity}</td>
                          <td className="py-2 text-right text-sm">₹{item.price}</td>
                          <td className="py-2 text-right text-sm font-medium">₹{item.price * item.quantity}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="border-t pt-2">
                      <tr>
                        <td colSpan="3" className="text-right font-semibold pt-2">Total Amount:</td>
                        <td className="text-right font-bold text-green-600 text-lg pt-2">
                          ₹{Math.floor(order.totalAmount)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </details>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersPage;