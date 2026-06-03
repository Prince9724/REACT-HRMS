import { useEffect, useState, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchMenu } from '../features/menu/menuSlice';
import { createOrder, fetchMyOrders, updateOrder, updateOrderStatus } from '../features/orders/orderSlice';
import { fetchTables } from '../features/tables/tablesSlice';
import Cart from '../components/Orders/Cart';
import Spinner from '../components/Common/Spinner';
import { requestLeave } from '../features/leave/leaveSlice';
import {
  UserCircleIcon,
  BookOpenIcon,
  CalendarIcon,
  MagnifyingGlassIcon,
  PrinterIcon,
  PencilIcon,
  CheckCircleIcon,
  XCircleIcon,
  PlusCircleIcon,
  CurrencyRupeeIcon,
  ClipboardDocumentListIcon,
  ExclamationTriangleIcon,
  ShoppingBagIcon,
  ClockIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';

const EmployeeDashboard = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);
  const { items: menuItems } = useAppSelector(state => state.menu);
  const { myOrders } = useAppSelector(state => state.orders);
  const { list: tables } = useAppSelector(state => state.tables);

  const [cartItems, setCartItems] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [customerMobile, setCustomerMobile] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [editingOrder, setEditingOrder] = useState(null);

  const [showHistory, setShowHistory] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [initialLoadDone, setInitialLoadDone] = useState(false);
  const isFirstLoad = useRef(true);

  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [leaveFromDate, setLeaveFromDate] = useState('');
  const [leaveToDate, setLeaveToDate] = useState('');
  const [leaveReason, setLeaveReason] = useState('');

  const addToCart = (item) => {
    setCartItems(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        return [...prevCart, { ...item, quantity: 1 }];
      }
    });
  };

  // ✅ Function to complete order (employee can mark order as Completed)
  const handleCompleteOrder = async (order) => {
    if (order.status === 'Completed') {
      alert('Order is already completed');
      return;
    }
    if (window.confirm(`Mark order #${order.id.slice(0, 8)} as Completed? This will free up the table.`)) {
      await dispatch(updateOrderStatus({ id: order.id, status: 'Completed' }));
      await dispatch(fetchMyOrders(user.id));
      await dispatch(fetchTables());
      alert('Order completed successfully! Table is now available.');
    }
  };

  const handleRequestLeave = async () => {
    if (!leaveFromDate || !leaveToDate) {
      alert('Please select dates');
      return;
    }
    await dispatch(requestLeave({
      employeeId: user.id,
      employeeName: user.name,
      fromDate: leaveFromDate,
      toDate: leaveToDate,
      reason: leaveReason || 'Not specified'
    }));
    setShowLeaveModal(false);
    setLeaveFromDate('');
    setLeaveToDate('');
    setLeaveReason('');
    alert('Leave request sent to manager');
  };

  useEffect(() => {
    const load = async () => {
      await Promise.all([
        dispatch(fetchMenu()),
        dispatch(fetchTables()),
        user && dispatch(fetchMyOrders(user.id))
      ]);
      setInitialLoadDone(true);
      isFirstLoad.current = false;
    };
    load();
  }, [dispatch, user]);

  useEffect(() => {
    if (!initialLoadDone) return;
    const interval = setInterval(async () => {
      if (user) {
        await dispatch(fetchMyOrders(user.id));
      }
      await dispatch(fetchMenu());
      await dispatch(fetchTables());
    }, 10000);
    return () => clearInterval(interval);
  }, [dispatch, user, initialLoadDone]);

  if (!initialLoadDone) {
    return <Spinner />;
  }

  const myTables = tables.filter(t => t.assignedTo === user?.id);
  const activeOrderTables = myOrders
    .filter(o => o.status !== 'Completed' && o.id !== editingOrder?.id)
    .map(o => o.tableNumber);
  const isTableBusy = (tableNo) => activeOrderTables.includes(parseInt(tableNo));

  const todayStr = new Date().toISOString().split('T')[0];
  const todaysOrders = myOrders.filter(o => o.createdAt.startsWith(todayStr));
  const todaysTotal = todaysOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const todaysCount = todaysOrders.length;

  let displayedOrders = showHistory
    ? myOrders.filter(o => o.createdAt.startsWith(selectedDate))
    : todaysOrders;

  if (searchTerm.trim()) {
    const term = searchTerm.toLowerCase();
    displayedOrders = displayedOrders.filter(o =>
      o.customerName.toLowerCase().includes(term) ||
      o.customerMobile.includes(term)
    );
  }
  displayedOrders = [...displayedOrders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const editOrder = (order) => {
    if (order.status === 'Completed') {
      alert('Completed orders cannot be modified');
      return;
    }
    const cart = order.items.map(item => ({
      id: item.menuItemId,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      taxRate: item.taxRate
    }));
    setCartItems(cart);
    setCustomerName(order.customerName);
    setCustomerMobile(order.customerMobile);
    setTableNumber(order.tableNumber);
    setNotes(order.notes || '');
    setEditingOrder(order);
  };

  const handlePlaceOrder = async () => {
    if (!customerName || !customerMobile || cartItems.length === 0)
      return alert('Please fill all fields');

    if (!/^\d{10}$/.test(customerMobile)) {
      return alert('Mobile number must be exactly 10 digits');
    }

    if (!tableNumber) {
      return alert('Please select a table');
    }

    if (isTableBusy(tableNumber)) {
      return alert('This table is currently busy with an active order. Please wait until order is completed.');
    }

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
      customerMobile,
      tableNumber: parseInt(tableNumber),
      notes,
      items: cartItems.map(({ id, name, price, quantity, taxRate }) => ({
        menuItemId: id,
        name,
        quantity,
        price,
        taxRate
      })),
      subtotal,
      gst,
      serviceCharge,
      discount: 0,
      totalAmount,
      status: 'Pending',
      paymentMethod: 'Cash',
      createdBy: user.id,
    };

    if (editingOrder) {
      await dispatch(updateOrder({ id: editingOrder.id, updates: orderData }));
      setEditingOrder(null);
    } else {
      await dispatch(createOrder(orderData));
    }
    setCartItems([]);
    setCustomerName('');
    setCustomerMobile('');
    setTableNumber('');
    setNotes('');
    await dispatch(fetchMyOrders(user.id));
  };

  const printBill = (order) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
    <html>
      <head>
        <title>Invoice ${order.id.slice(0, 8)}</title>
        <style>
          body {
            font-family: 'Arial', sans-serif;
            padding: 20px;
            max-width: 400px;
            margin: 0 auto;
          }
          .header {
            text-align: center;
            border-bottom: 2px solid #333;
            padding-bottom: 10px;
            margin-bottom: 20px;
          }
          .header h2 {
            margin: 0;
            color: #1a237e;
          }
          .header p {
            margin: 5px 0;
            color: #666;
            font-size: 12px;
          }
          .customer-info {
            margin-bottom: 20px;
            padding: 10px;
            background: #f5f5f5;
            border-radius: 8px;
          }
          .customer-info p {
            margin: 5px 0;
            font-size: 14px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
          }
          th {
            background-color: #f2f2f2;
          }
          .totals {
            text-align: right;
            margin-top: 10px;
          }
          .totals p {
            margin: 5px 0;
          }
          .grand-total {
            font-size: 18px;
            font-weight: bold;
            color: #1a237e;
            border-top: 2px solid #333;
            padding-top: 10px;
            margin-top: 10px;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 10px;
            border-top: 1px solid #ddd;
            font-size: 12px;
            color: #666;
          }
          .note {
            font-size: 12px;
            color: #888;
            margin-top: 10px;
            font-style: italic;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h2>🍽️ Restaurant POS</h2>
          <p>Order #${order.id.slice(0, 8)}</p>
          <p>Date: ${new Date(order.createdAt).toLocaleString()}</p>
        </div>
        
        <div class="customer-info">
          <p><strong>Customer:</strong> ${order.customerName}</p>
          <p><strong>Mobile:</strong> ${order.customerMobile}</p>
          <p><strong>Table:</strong> ${order.tableNumber}</p>
          <p><strong>Waiter ID:</strong> ${order.createdBy}</p>
          ${order.notes ? `<p><strong>Instructions:</strong> ${order.notes}</p>` : ''}
        </div>
        
        <table>
          <thead>
            <tr><th>Item</th><th>Qty</th><th>Price</th><th>Total</th></tr>
          </thead>
          <tbody>
            ${order.items.map(item => `
              <tr>
                <td>${item.name}</td>
                <td style="text-align:center">${item.quantity}</td>
                <td>₹${item.price}</td>
                <td>₹${item.price * item.quantity}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div class="totals">
          <p><strong>Subtotal:</strong> ₹${Math.floor(order.subtotal)}</p>
          <p><strong>GST (5%):</strong> ₹${Math.floor(order.gst)}</p>
          <p><strong>Service Charge (5%):</strong> ₹${Math.floor(order.serviceCharge)}</p>
          ${order.discount > 0 ? `<p><strong>Discount:</strong> -₹${Math.floor(order.discount)}</p>` : ''}
          <div class="grand-total">
            <strong>Total Amount: ₹${Math.floor(order.totalAmount)}</strong>
          </div>
        </div>
        
        <div class="footer">
          <p>Thank you for dining with us!</p>
          <p>Visit again 😊</p>
        </div>
      </body>
    </html>
  `);
    printWindow.document.close();
    printWindow.print();
  };

  if (myTables.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <ExclamationTriangleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-600 mb-4">No Tables Assigned</h2>
          <p className="text-gray-600">You have not been assigned any tables yet.</p>
          <p className="text-gray-500 text-sm mt-2">Please contact the manager to assign tables to you.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header with Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-xl p-6 text-white">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-blue-200 text-sm mb-1">Today's Performance</p>
                <p className="text-3xl font-bold">{todaysCount} Orders</p>
                <div className="flex items-center gap-2 mt-2">
                  <ArrowTrendingUpIcon className="w-4 h-4 text-green-400" />
                  <span className="text-green-400 text-sm">Active Today</span>
                </div>
              </div>
              <div className="bg-blue-400/20 rounded-xl p-3">
                <ShoppingBagIcon className="w-8 h-8 text-blue-300" />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-blue-400/30">
              <div className="flex justify-between text-sm text-blue-200">
                <span>Total Sales: ₹{Math.floor(todaysTotal)}</span>
                <span>Tables: {myTables.length}</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl shadow-xl p-6 text-white">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-purple-200 text-sm mb-1">Welcome Back</p>
                <p className="text-2xl font-bold">{user?.name}</p>
                <div className="flex items-center gap-2 mt-2">
                  <ClockIcon className="w-4 h-4 text-purple-300" />
                  <span className="text-purple-200 text-sm">{new Date().toLocaleDateString()}</span>
                </div>
              </div>
              <div className="bg-purple-400/20 rounded-xl p-3">
                <UserCircleIcon className="w-8 h-8 text-purple-300" />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-purple-400/30">
              <div className="flex justify-between text-sm text-purple-200">
                <span>Role: Waiter</span>
                <button
                  onClick={() => setShowLeaveModal(true)}
                  className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded-lg text-sm transition flex items-center gap-1"
                >
                  <CalendarIcon className="w-3 h-3" /> Request Leave
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-xl shadow-md p-4">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div className="flex gap-3">
              <button
                onClick={() => setShowHistory(false)}
                className={`px-5 py-2 rounded-xl font-semibold transition flex items-center gap-2 ${!showHistory ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                <CalendarIcon className="w-4 h-4" /> Today's Orders
              </button>
              <button
                onClick={() => setShowHistory(true)}
                className={`px-5 py-2 rounded-xl font-semibold transition flex items-center gap-2 ${showHistory ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
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
                  placeholder="Search by name/mobile"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="outline-none bg-transparent w-48"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Menu Section */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-5">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800">
              <BookOpenIcon className="w-5 h-5 text-blue-600" /> Menu
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {menuItems.filter(i => i.available).map(item => (
                <div key={item.id} className="border rounded-xl p-3 flex gap-3 hover:shadow-lg transition-all hover:-translate-y-1 bg-white">
                  <img
                    src={item.image || "https://media.istockphoto.com/id/1182393436/vector/fast-food-seamless-pattern-with-vector-line-icons-of-hamburger-pizza-hot-dog-beverage.jpg?s=612x612&w=0&k=20&c=jlj-n_CNsrd13tkHwC7MVo0cGUyyc8YP6wJQdCvMUGw="}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800">{item.name}</h3>
                    <p className="text-xs text-gray-500">{item.category}</p>
                    <p className="text-green-600 font-bold mt-1">₹{item.price}</p>
                    <button
                      onClick={() => addToCart(item)}
                      className="mt-2 bg-blue-600 text-white px-3 py-1 rounded-full text-sm hover:bg-blue-700 flex items-center gap-1"
                    >
                      <PlusCircleIcon className="w-3 h-3" /> Add
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cart Section */}
          <div className="bg-white rounded-2xl shadow-lg p-5">
            <Cart cartItems={cartItems} setCartItems={setCartItems} />
            <div className="mt-6 space-y-3">
              <input
                type="text"
                placeholder="Customer Name *"
                value={customerName}
                onChange={e => setCustomerName(e.target.value)}
                className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-blue-400 outline-none"
              />
              <input
                type="tel"
                placeholder="Mobile (10 digits) *"
                value={customerMobile}
                onChange={e => { const val = e.target.value.replace(/\D/g, ''); if (val.length <= 10) setCustomerMobile(val); }}
                className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-blue-400 outline-none"
              />

              <select
                value={tableNumber}
                onChange={e => setTableNumber(e.target.value)}
                className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-blue-400 outline-none"
                required
              >
                <option value="">-- Select Table --</option>
                {myTables.map(t => (
                  <option key={t.id} value={t.number} disabled={isTableBusy(t.number)}>
                    Table {t.number} {isTableBusy(t.number) ? '(Busy)' : '(Available)'}
                  </option>
                ))}
              </select>

              <textarea
                placeholder="Special instructions (less salt, extra spicy, etc.)"
                rows="2"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                className="w-full border rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
              />

              <button
                onClick={handlePlaceOrder}
                className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2"
              >
                <CheckCircleIcon className="w-5 h-5" />
                {editingOrder ? 'Update Order' : 'Place Order'}
              </button>

              {editingOrder && (
                <button
                  onClick={() => { setEditingOrder(null); setCartItems([]); setCustomerName(''); setCustomerMobile(''); setTableNumber(''); setNotes(''); }}
                  className="w-full bg-gray-400 text-white py-3 rounded-xl font-semibold hover:bg-gray-500 transition flex items-center justify-center gap-2"
                >
                  <XCircleIcon className="w-5 h-5" /> Cancel Edit
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Orders History - Added Complete Order Button */}
        <div className="bg-white rounded-2xl shadow-lg p-5">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800">
            <ClipboardDocumentListIcon className="w-5 h-5 text-blue-600" />
            {showHistory ? 'Order History' : "Today's Orders"}
          </h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {displayedOrders.length === 0 && (
              <div className="text-center py-12">
                <ShoppingBagIcon className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No orders found</p>
              </div>
            )}
            {displayedOrders.map(order => (
              <div key={order.id} className="border rounded-xl p-4 hover:bg-gray-50 transition">
                <div className="flex flex-wrap justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">#{order.id.slice(0, 8)}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${order.status === 'Completed' ? 'bg-green-100 text-green-700' :
                          order.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="font-semibold text-gray-800">{order.customerName} <span className="text-sm text-gray-500">({order.customerMobile})</span></p>
                    <p className="text-xs text-gray-500">Table {order.tableNumber}</p>
                    {order.notes && <p className="text-xs text-orange-600 mt-1">Note: {order.notes}</p>}
                    <p className="text-xs text-gray-400 mt-1">{new Date(order.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-2 mt-3 sm:mt-0 flex-wrap">
                    <p className="font-bold text-green-600 text-lg flex items-center gap-1">
                      <CurrencyRupeeIcon className="w-4 h-4" />{Math.floor(order.totalAmount)}
                    </p>
                    {order.status !== 'Completed' && (
                      <>
                        <button
                          onClick={() => editOrder(order)}
                          className="bg-blue-500 text-white px-3 py-1.5 rounded-lg text-xs hover:bg-blue-600 flex items-center gap-1"
                        >
                          <PencilIcon className="w-3 h-3" /> Edit
                        </button>
                        {/* ✅ Complete Order Button - Employee can mark order as Completed */}
                        <button
                          onClick={() => handleCompleteOrder(order)}
                          className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs hover:bg-green-700 flex items-center gap-1"
                        >
                          <CheckCircleIcon className="w-3 h-3" /> Complete
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => printBill(order)}
                      className="bg-gray-500 text-white px-3 py-1.5 rounded-lg text-xs hover:bg-gray-600 flex items-center gap-1"
                    >
                      <PrinterIcon className="w-3 h-3" /> Print
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Leave Modal */}
      {showLeaveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-orange-500" /> Request Leave
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">From Date</label>
                <input
                  type="date"
                  value={leaveFromDate}
                  onChange={e => setLeaveFromDate(e.target.value)}
                  className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-blue-400 outline-none"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">To Date</label>
                <input
                  type="date"
                  value={leaveToDate}
                  onChange={e => setLeaveToDate(e.target.value)}
                  className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-blue-400 outline-none"
                  min={leaveFromDate || new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Reason (Optional)</label>
                <textarea
                  rows="2"
                  value={leaveReason}
                  onChange={e => setLeaveReason(e.target.value)}
                  className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-blue-400 outline-none"
                  placeholder="Family function, medical, etc."
                />
              </div>
              <div className="flex justify-end gap-3 pt-3">
                <button
                  onClick={() => setShowLeaveModal(false)}
                  className="bg-gray-400 text-white px-5 py-2 rounded-xl hover:bg-gray-500 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRequestLeave}
                  className="bg-blue-600 text-white px-5 py-2 rounded-xl hover:bg-blue-700 transition"
                >
                  Submit Request
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeDashboard;