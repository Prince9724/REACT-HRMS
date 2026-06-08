import { useEffect, useState } from 'react';
import { useAppSelector } from '../app/hooks';
import { 
  ChartBarIcon, 
  CalendarIcon, 
  UserGroupIcon, 
  UserIcon, 
  UsersIcon,
  ChartPieIcon,
  ArrowTrendingUpIcon,
  SunIcon,
  MoonIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const GroupAnalytics = () => {
  const { allOrders } = useAppSelector(state => state.orders);
  const [viewMode, setViewMode] = useState('current');
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [selectedDate, setSelectedDate] = useState('');
  const [viewType, setViewType] = useState('monthly');
  
  const currentMonth = new Date().toISOString().slice(0, 7);
  
  const getGroupType = (people) => {
    if (people === 1) return 'Single';
    if (people === 2) return 'Couple';
    if (people === 3 || people === 4) return 'Small Group';
    if (people >= 5) return 'Large Group';
    return 'Unknown';
  };
  
  let filteredOrders = allOrders.filter(order => order.numberOfPeople);
  
  if (viewMode === 'current') {
    filteredOrders = filteredOrders.filter(order => 
      order.createdAt?.startsWith(currentMonth)
    );
  } else {
    filteredOrders = filteredOrders.filter(order => 
      order.createdAt?.startsWith(selectedMonth)
    );
  }
  
  if (selectedDate) {
    filteredOrders = filteredOrders.filter(order => 
      order.createdAt?.startsWith(selectedDate)
    );
  }
  
  const groupDistribution = [
    { name: 'Single', value: filteredOrders.filter(o => getGroupType(o.numberOfPeople) === 'Single').length },
    { name: 'Couple', value: filteredOrders.filter(o => getGroupType(o.numberOfPeople) === 'Couple').length },
    { name: 'Small Group', value: filteredOrders.filter(o => getGroupType(o.numberOfPeople) === 'Small Group').length },
    { name: 'Large Group', value: filteredOrders.filter(o => getGroupType(o.numberOfPeople) === 'Large Group').length },
  ].filter(g => g.value > 0);
  
  const getDayData = (date) => {
    const dayOrders = allOrders.filter(o => o.createdAt?.startsWith(date) && o.numberOfPeople);
    return {
      date,
      Single: dayOrders.filter(o => getGroupType(o.numberOfPeople) === 'Single').length,
      Couple: dayOrders.filter(o => getGroupType(o.numberOfPeople) === 'Couple').length,
      Small: dayOrders.filter(o => getGroupType(o.numberOfPeople) === 'Small Group').length,
      Large: dayOrders.filter(o => getGroupType(o.numberOfPeople) === 'Large Group').length,
      total: dayOrders.length,
    };
  };
  
  const last7Days = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().split('T')[0];
  }).reverse();
  
  const weeklyData = last7Days.map(date => getDayData(date));
  
  const months = ['2026-04', '2026-05', '2026-06'];
  const monthlyTrends = months.map(month => {
    const monthOrders = allOrders.filter(o => o.createdAt?.startsWith(month) && o.numberOfPeople);
    return {
      month: month.slice(5),
      Single: monthOrders.filter(o => getGroupType(o.numberOfPeople) === 'Single').length,
      Couple: monthOrders.filter(o => getGroupType(o.numberOfPeople) === 'Couple').length,
      Small: monthOrders.filter(o => getGroupType(o.numberOfPeople) === 'Small Group').length,
      Large: monthOrders.filter(o => getGroupType(o.numberOfPeople) === 'Large Group').length,
      total: monthOrders.length,
    };
  });
  
  const getDayType = (date) => {
    const day = new Date(date).getDay();
    return (day === 0 || day === 6) ? 'Weekend' : 'Weekday';
  };
  
  const weekdayData = [
    { name: 'Weekday', Single: 0, Couple: 0, Small: 0, Large: 0 },
    { name: 'Weekend', Single: 0, Couple: 0, Small: 0, Large: 0 },
  ];
  
  filteredOrders.forEach(order => {
    const dayType = getDayType(order.createdAt);
    const groupType = getGroupType(order.numberOfPeople);
    const idx = dayType === 'Weekday' ? 0 : 1;
    if (groupType === 'Single') weekdayData[idx].Single++;
    else if (groupType === 'Couple') weekdayData[idx].Couple++;
    else if (groupType === 'Small Group') weekdayData[idx].Small++;
    else if (groupType === 'Large Group') weekdayData[idx].Large++;
  });
  
  const totalOrders = filteredOrders.length;
  const peakGroup = groupDistribution.reduce((max, g) => g.value > max.value ? g : max, { value: 0, name: 'No Data' });
  const weekdayTotal = weekdayData[0].Single + weekdayData[0].Couple + weekdayData[0].Small + weekdayData[0].Large;
  const weekendTotal = weekdayData[1].Single + weekdayData[1].Couple + weekdayData[1].Small + weekdayData[1].Large;
  const avgPeople = totalOrders > 0 
    ? (filteredOrders.reduce((sum, o) => sum + (o.numberOfPeople || 1), 0) / totalOrders).toFixed(1) 
    : 0;
  
  const uniqueDates = [...new Set(filteredOrders.map(o => o.createdAt?.split('T')[0]))].sort();
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-5">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <ChartBarIcon className="w-6 h-6 text-blue-600" />
            <h3 className="text-xl font-bold text-gray-800">Group Analytics Dashboard</h3>
          </div>
          
          <div className="flex gap-2 bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => {
                setViewMode('current');
                setSelectedDate('');
              }}
              className={`px-4 py-2 rounded-lg font-semibold transition flex items-center gap-2 ${
                viewMode === 'current' 
                  ? 'bg-gradient-to-r from-[#1a237e] to-[#4a148c] text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              <ClockIcon className="w-4 h-4" /> Current Month (June 2026)
            </button>
            <button
              onClick={() => {
                setViewMode('history');
                setSelectedDate('');
              }}
              className={`px-4 py-2 rounded-lg font-semibold transition flex items-center gap-2 ${
                viewMode === 'history' 
                  ? 'bg-gradient-to-r from-[#1a237e] to-[#4a148c] text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              <CalendarIcon className="w-4 h-4" /> History
            </button>
          </div>
        </div>
        
        {viewMode === 'history' && (
          <div className="mt-4 flex items-center gap-3">
            <div className="flex items-center gap-2 border rounded-xl px-3 py-2 bg-gray-50">
              <CalendarIcon className="w-4 h-4 text-gray-500" />
              <input 
                type="month" 
                value={selectedMonth} 
                onChange={e => setSelectedMonth(e.target.value)}
                className="outline-none bg-transparent"
              />
            </div>
            <div className="flex items-center gap-2 border rounded-xl px-3 py-2 bg-gray-50">
              <MagnifyingGlassIcon className="w-4 h-4 text-gray-500" />
              <input 
                type="date" 
                value={selectedDate} 
                onChange={e => setSelectedDate(e.target.value)}
                className="outline-none bg-transparent"
                placeholder="Filter by date"
              />
              {selectedDate && (
                <button onClick={() => setSelectedDate('')} className="text-gray-400 hover:text-gray-600">
                  <XMarkIcon className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}
        
        <div className="flex gap-3 mt-4 border-b pb-2">
          <button 
            onClick={() => setViewType('monthly')}
            className={`px-4 py-2 rounded-t-lg font-semibold transition ${viewType === 'monthly' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            {viewMode === 'current' ? 'Daily View' : 'Monthly View'}
          </button>
          {viewMode === 'current' && (
            <button 
              onClick={() => setViewType('weekly')}
              className={`px-4 py-2 rounded-t-lg font-semibold transition ${viewType === 'weekly' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
            >
              Weekly View
            </button>
          )}
          <button 
            onClick={() => setViewType('daily')}
            className={`px-4 py-2 rounded-t-lg font-semibold transition ${viewType === 'daily' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            {viewMode === 'current' ? 'Daily Breakdown' : 'Date Wise'}
          </button>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-blue-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">Total Orders</p>
              <p className="text-2xl font-bold text-gray-800">{totalOrders}</p>
              {viewMode === 'current' && <p className="text-xs text-green-600">June 2026</p>}
              {viewMode === 'history' && <p className="text-xs text-blue-500">{selectedMonth}</p>}
            </div>
            <div className="bg-blue-100 rounded-lg p-2">
              <ChartBarIcon className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-green-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">Peak Group</p>
              <p className="text-2xl font-bold text-green-600">{peakGroup.name}</p>
            </div>
            <div className="bg-green-100 rounded-lg p-2">
              <UserGroupIcon className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-purple-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">Most Orders Day</p>
              <p className="text-2xl font-bold text-purple-600">
                {weekdayTotal >= weekendTotal ? 'Weekday' : 'Weekend'}
              </p>
            </div>
            <div className="bg-purple-100 rounded-lg p-2">
              {weekdayTotal >= weekendTotal ? <SunIcon className="w-5 h-5 text-purple-600" /> : <MoonIcon className="w-5 h-5 text-purple-600" />}
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-orange-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">Avg People/Order</p>
              <p className="text-2xl font-bold text-orange-600">{avgPeople}</p>
            </div>
            <div className="bg-orange-100 rounded-lg p-2">
              <UsersIcon className="w-5 h-5 text-orange-600" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Current Month - Daily View Table */}
      {viewMode === 'current' && viewType === 'monthly' && (
        <div className="bg-white rounded-2xl shadow-lg p-5">
          <div className="flex items-center gap-2 mb-4">
            <CalendarIcon className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-bold text-gray-800">June 2026 - Daily Orders</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-2 text-left">Date</th>
                  <th className="p-2 text-center">Single</th>
                  <th className="p-2 text-center">Couple</th>
                  <th className="p-2 text-center">Small Group</th>
                  <th className="p-2 text-center">Large Group</th>
                  <th className="p-2 text-center">Total</th>
                </tr>
              </thead>
              <tbody>
                {uniqueDates.map(date => {
                  const dayData = getDayData(date);
                  return (
                    <tr key={date} className="border-b">
                      <td className="p-2 font-medium">{new Date(date).toLocaleDateString()}</td>
                      <td className="p-2 text-center">{dayData.Single}</td>
                      <td className="p-2 text-center">{dayData.Couple}</td>
                      <td className="p-2 text-center">{dayData.Small}</td>
                      <td className="p-2 text-center">{dayData.Large}</td>
                      <td className="p-2 text-center font-bold">{dayData.total}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {/* Weekly Chart */}
      {viewMode === 'current' && viewType === 'weekly' && (
        <div className="bg-white rounded-2xl shadow-lg p-5">
          <div className="flex items-center gap-2 mb-4">
            <ArrowTrendingUpIcon className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-bold text-gray-800">Last 7 Days - Daily Orders</h3>
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={weeklyData}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value, name) => [`${value} orders`, name]} />
              <Legend />
              <Bar dataKey="Single" fill="#3b82f6" name="Single" />
              <Bar dataKey="Couple" fill="#10b981" name="Couple" />
              <Bar dataKey="Small" fill="#f59e0b" name="Small Group" />
              <Bar dataKey="Large" fill="#ef4444" name="Large Group" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
      
      {/* Daily Breakdown Cards */}
      {viewMode === 'current' && viewType === 'daily' && uniqueDates.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-5">
          <div className="flex items-center gap-2 mb-4">
            <CalendarIcon className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-bold text-gray-800">Daily Breakdown - June 2026</h3>
          </div>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {uniqueDates.map(date => {
              const dayData = getDayData(date);
              return (
                <div key={date} className="border rounded-xl p-4 hover:bg-gray-50 transition">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-bold text-gray-800">{new Date(date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h4>
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">Total: {dayData.total} orders</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2">
                    <div className="text-center p-2 bg-blue-50 rounded-lg">
                      <UserIcon className="w-5 h-5 text-blue-600 mx-auto" />
                      <p className="text-sm text-gray-600">Single</p>
                      <p className="font-bold text-blue-600">{dayData.Single}</p>
                    </div>
                    <div className="text-center p-2 bg-green-50 rounded-lg">
                      <UsersIcon className="w-5 h-5 text-green-600 mx-auto" />
                      <p className="text-sm text-gray-600">Couple</p>
                      <p className="font-bold text-green-600">{dayData.Couple}</p>
                    </div>
                    <div className="text-center p-2 bg-yellow-50 rounded-lg">
                      <UserGroupIcon className="w-5 h-5 text-yellow-600 mx-auto" />
                      <p className="text-sm text-gray-600">Small Group</p>
                      <p className="font-bold text-yellow-600">{dayData.Small}</p>
                    </div>
                    <div className="text-center p-2 bg-red-50 rounded-lg">
                      <UserGroupIcon className="w-5 h-5 text-red-600 mx-auto" />
                      <p className="text-sm text-gray-600">Large Group</p>
                      <p className="font-bold text-red-600">{dayData.Large}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      {/* History Mode - Monthly Trend */}
      {viewMode === 'history' && viewType === 'monthly' && (
        <div className="bg-white rounded-2xl shadow-lg p-5">
          <div className="flex items-center gap-2 mb-4">
            <CalendarIcon className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-bold text-gray-800">Monthly Trend (April - June 2026)</h3>
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={monthlyTrends}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value, name) => [`${value} orders`, name]} />
              <Legend />
              <Bar dataKey="Single" fill="#3b82f6" name="Single" />
              <Bar dataKey="Couple" fill="#10b981" name="Couple" />
              <Bar dataKey="Small" fill="#f59e0b" name="Small Group" />
              <Bar dataKey="Large" fill="#ef4444" name="Large Group" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
      
      {/* History Mode - Date Wise */}
      {viewMode === 'history' && viewType === 'daily' && uniqueDates.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-5">
          <div className="flex items-center gap-2 mb-4">
            <CalendarIcon className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-bold text-gray-800">Date Wise Breakdown - {selectedMonth}</h3>
          </div>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {uniqueDates.map(date => {
              const dayData = getDayData(date);
              return (
                <div key={date} className="border rounded-xl p-4 hover:bg-gray-50 transition">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-bold text-gray-800">{new Date(date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h4>
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">Total: {dayData.total} orders</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2">
                    <div className="text-center p-2 bg-blue-50 rounded-lg">
                      <UserIcon className="w-5 h-5 text-blue-600 mx-auto" />
                      <p className="text-sm text-gray-600">Single</p>
                      <p className="font-bold text-blue-600">{dayData.Single}</p>
                    </div>
                    <div className="text-center p-2 bg-green-50 rounded-lg">
                      <UsersIcon className="w-5 h-5 text-green-600 mx-auto" />
                      <p className="text-sm text-gray-600">Couple</p>
                      <p className="font-bold text-green-600">{dayData.Couple}</p>
                    </div>
                    <div className="text-center p-2 bg-yellow-50 rounded-lg">
                      <UserGroupIcon className="w-5 h-5 text-yellow-600 mx-auto" />
                      <p className="text-sm text-gray-600">Small Group</p>
                      <p className="font-bold text-yellow-600">{dayData.Small}</p>
                    </div>
                    <div className="text-center p-2 bg-red-50 rounded-lg">
                      <UserGroupIcon className="w-5 h-5 text-red-600 mx-auto" />
                      <p className="text-sm text-gray-600">Large Group</p>
                      <p className="font-bold text-red-600">{dayData.Large}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      {/* Pie Chart */}
      <div className="bg-white rounded-2xl shadow-lg p-5">
        <div className="flex items-center gap-2 mb-4">
          <ChartPieIcon className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-bold text-gray-800">Group Distribution</h3>
        </div>
        {groupDistribution.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={groupDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                dataKey="value"
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              >
                {groupDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-center py-12 text-gray-500">No data available</div>
        )}
      </div>
      
      {/* Weekday vs Weekend */}
      <div className="bg-white rounded-2xl shadow-lg p-5">
        <div className="flex items-center gap-2 mb-4">
          <ArrowTrendingUpIcon className="w-5 h-5 text-green-600" />
          <h3 className="text-lg font-bold text-gray-800">Weekday vs Weekend Analysis</h3>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={weekdayData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Single" fill="#3b82f6" name="Single" />
            <Bar dataKey="Couple" fill="#10b981" name="Couple" />
            <Bar dataKey="Small" fill="#f59e0b" name="Small Group" />
            <Bar dataKey="Large" fill="#ef4444" name="Large Group" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      {/* Insights */}
      {totalOrders > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl shadow-lg p-5">
          <div className="flex items-center gap-2 mb-3">
            <ArrowTrendingUpIcon className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-bold text-gray-800">Insights & Recommendations</h3>
          </div>
          <ul className="space-y-2">
            <li className="text-gray-700">Most orders are from <strong>{peakGroup.name}</strong> group ({peakGroup.value} orders)</li>
            <li className="text-gray-700">Average <strong>{avgPeople}</strong> people per order</li>
            <li className="text-gray-700">{weekdayTotal >= weekendTotal ? 'Weekdays' : 'Weekends'} are busier</li>
            {viewMode === 'current' && (
              <li className="text-gray-700 text-green-600">Showing data for <strong>June 2026 (Current Month)</strong></li>
            )}
            {viewMode === 'history' && (
              <li className="text-gray-700 text-blue-600">Showing history for <strong>{selectedMonth}</strong></li>
            )}
          </ul>
        </div>
      )}
      
      {/* Orders List for Selected Date */}
      {selectedDate && filteredOrders.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-5">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Orders on {selectedDate}</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {filteredOrders.map(order => (
              <div key={order.id} className="border-b pb-2 flex justify-between items-center">
                <div>
                  <p className="font-semibold">{order.customerName}</p>
                  <p className="text-sm text-gray-500">{getGroupType(order.numberOfPeople)} • {order.numberOfPeople} people</p>
                </div>
                <p className="font-bold text-green-600">₹{Math.floor(order.totalAmount)}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupAnalytics;