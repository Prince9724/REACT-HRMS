import { useEffect, useState, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchMenu } from '../features/menu/menuSlice';
import { createOrder, fetchMyOrders, updateOrder } from '../features/orders/orderSlice';
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
  ExclamationTriangleIcon
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

  // Leave modal states
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [leaveFromDate, setLeaveFromDate] = useState('');
  const [leaveToDate, setLeaveToDate] = useState('');
  const [leaveReason, setLeaveReason] = useState('');

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
      <html><head><title>Invoice ${order.id.slice(0, 8)}</title>
      <style>body{font-family:Arial;padding:20px} table{border-collapse:collapse;width:100%} th,td{border:1px solid #ddd;padding:8px} .total{font-weight:bold;margin-top:20px}</style>
      </head><body>
      <h2>Restaurant POS</h2>
      <p>Order #${order.id.slice(0, 8)}<br>Date: ${new Date(order.createdAt).toLocaleString()}</p>
      <p>Customer: ${order.customerName} (${order.customerMobile})<br>Table: ${order.tableNumber}</p>
      ${order.notes ? `<p>Instructions: ${order.notes}</p>` : ''}
      <table border="1" cellpadding="8" cellspacing="0" style="width:100%;border-collapse:collapse">
        <thead><tr><th>Item</th><th>Qty</th><th>Price</th><th>Total</th></tr></thead>
        <tbody>
          ${order.items.map(item => `<tr><td>${item.name}</td><td>${item.quantity}</td><td>₹${item.price}</td><td>₹${item.price * item.quantity}</td></tr>`).join('')}
        </tbody>
      </table>
      <div class="total"><strong>Total: ₹${Math.floor(order.totalAmount)}</strong></div>
      <p>Thank you!</p>
      </body></html>
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
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6 flex flex-wrap justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <UserCircleIcon className="w-6 h-6" /> Waiter Panel
            </h1>
            <p className="text-gray-600">Welcome, {user?.name}</p>
          </div>
          <div className="flex gap-6 items-center flex-wrap">
            <div className="text-center">
              <div className="text-sm text-gray-500">Today's Orders</div>
              <div className="font-bold text-xl">{todaysCount}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-500">Today's Sales</div>
              <div className="font-bold text-green-600 text-xl flex items-center gap-1">
                <CurrencyRupeeIcon className="w-4 h-4" />{Math.floor(todaysTotal)}
              </div>
            </div>
            <button
              onClick={() => setShowHistory(!showHistory)}
              className={`px-4 py-2 rounded-lg transition flex items-center gap-2 ${showHistory ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              <CalendarIcon className="w-4 h-4" />
              {showHistory ? 'Show Today' : 'History'}
            </button>
            <button
              onClick={() => setShowLeaveModal(true)}
              className="px-4 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600 flex items-center gap-2"
            >
              <CalendarIcon className="w-4 h-4" /> Request Leave
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Menu Section */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-5">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <BookOpenIcon className="w-6 h-6" /> Menu
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {menuItems.filter(i => i.available).map(item => (
                <div key={item.id} className="border rounded-xl p-3 flex gap-3 hover:shadow-lg transition">
                  <img src={item.image || 'https://via.placeholder.com/100'} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
                  <div className="flex-1">
                    <h3 className="font-bold">{item.name}</h3>
                    <p className="text-xs text-gray-500">{item.category}</p>
                    <p className="text-green-600 font-bold">₹{item.price}</p>
                    <button
                      onClick={() => setCartItems([...cartItems, { ...item, quantity: 1 }])}
                      className="mt-2 bg-blue-600 text-white px-3 py-1 rounded-full text-sm hover:bg-blue-700 flex items-center gap-1"
                    >
                      <PlusCircleIcon className="w-3 h-3" /> Add
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
              <input type="text" placeholder="Customer Name *" value={customerName} onChange={e => setCustomerName(e.target.value)} className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-400" />
              <input type="tel" placeholder="Mobile (10 digits) *" value={customerMobile} onChange={e => { const val = e.target.value.replace(/\D/g, ''); if (val.length <= 10) setCustomerMobile(val); }} className="w-full border rounded-lg p-2" />

              <select value={tableNumber} onChange={e => setTableNumber(e.target.value)} className="w-full border rounded-lg p-2" required>
                <option value="">-- Select Table --</option>
                {myTables.map(t => (
                  <option key={t.id} value={t.number} disabled={isTableBusy(t.number)}>
                    Table {t.number} {isTableBusy(t.number) ? '(Busy)' : '(Available)'}
                  </option>
                ))}
              </select>

              <textarea placeholder="Special instructions (less salt, extra spicy, etc.)" rows="2" value={notes} onChange={e => setNotes(e.target.value)} className="w-full border rounded-lg p-2 text-sm" />
              <button onClick={handlePlaceOrder} className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2">
                <CheckCircleIcon className="w-4 h-4" />
                {editingOrder ? 'Update Order' : 'Place Order'}
              </button>
              {editingOrder && (
                <button onClick={() => { setEditingOrder(null); setCartItems([]); setCustomerName(''); setCustomerMobile(''); setTableNumber(''); setNotes(''); }} className="w-full bg-gray-400 text-white py-2 rounded-lg hover:bg-gray-500 transition flex items-center justify-center gap-2">
                  <XCircleIcon className="w-4 h-4" /> Cancel Edit
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Orders History */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-5">
          <div className="flex flex-wrap justify-between items-center mb-4 gap-3">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <ClipboardDocumentListIcon className="w-6 h-6" />
              {showHistory ? 'Order History' : "Today's Orders"}
            </h2>
            <div className="flex gap-3">
              {showHistory && (
                <div className="flex items-center gap-2 border rounded-lg p-1 px-2">
                  <CalendarIcon className="w-4 h-4 text-gray-500" />
                  <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} className="outline-none" />
                </div>
              )}
              <div className="flex items-center gap-2 border rounded-lg p-1 px-2">
                <MagnifyingGlassIcon className="w-4 h-4 text-gray-500" />
                <input type="text" placeholder="Search by name/mobile" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="outline-none w-40" />
              </div>
            </div>
          </div>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {displayedOrders.length === 0 && (
              <p className="text-center text-gray-500 py-8">No orders found.</p>
            )}
            {displayedOrders.map(order => (
              <div key={order.id} className="border rounded-lg p-3 hover:bg-gray-50 transition">
                <div className="flex flex-wrap justify-between items-start">
                  <div className="flex-1">
                    <p className="font-mono text-xs text-gray-500">#{order.id.slice(0, 8)}</p>
                    <p className="font-semibold">{order.customerName} <span className="text-sm text-gray-500">({order.customerMobile})</span></p>
                    <p className="text-xs text-gray-500">Table {order.tableNumber} | Status: <span className={`font-semibold ${order.status === 'Completed' ? 'text-green-600' : order.status === 'Pending' ? 'text-yellow-600' : 'text-blue-600'}`}>{order.status}</span></p>
                    {order.notes && <p className="text-xs text-orange-600 mt-1">Note: {order.notes}</p>}
                    <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-2 mt-2 sm:mt-0">
                    <p className="font-bold text-green-600 text-lg flex items-center gap-1">
                      <CurrencyRupeeIcon className="w-4 h-4" />{Math.floor(order.totalAmount)}
                    </p>
                    {order.status !== 'Completed' && (
                      <button onClick={() => editOrder(order)} className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600 flex items-center gap-1">
                        <PencilIcon className="w-3 h-3" /> Edit
                      </button>
                    )}
                    <button onClick={() => printBill(order)} className="bg-gray-500 text-white px-2 py-1 rounded text-xs hover:bg-gray-600 flex items-center gap-1">
                      <PrinterIcon className="w-3 h-3" /> Print
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ✅ Leave Modal - Now inside return */}
      {showLeaveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <CalendarIcon className="w-5 h-5" /> Request Leave
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">From Date</label>
                <input
                  type="date"
                  value={leaveFromDate}
                  onChange={e => setLeaveFromDate(e.target.value)}
                  className="w-full border rounded-lg p-2"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">To Date</label>
                <input
                  type="date"
                  value={leaveToDate}
                  onChange={e => setLeaveToDate(e.target.value)}
                  className="w-full border rounded-lg p-2"
                  min={leaveFromDate || new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Reason (Optional)</label>
                <textarea
                  rows="2"
                  value={leaveReason}
                  onChange={e => setLeaveReason(e.target.value)}
                  className="w-full border rounded-lg p-2"
                  placeholder="Family function, medical, etc."
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setShowLeaveModal(false)}
                  className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRequestLeave}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
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