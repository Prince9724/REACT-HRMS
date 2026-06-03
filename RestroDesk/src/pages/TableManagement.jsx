import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchTables, addTable, deleteTable, assignTable, reassignAllTables } from '../features/tables/tablesSlice';
import { fetchEmployees } from '../features/employees/employeeSlice';
import Spinner from '../components/Common/Spinner';
import { 
  TableCellsIcon, 
  PlusCircleIcon, 
  TrashIcon, 
  UserIcon,
  ArrowPathIcon,
  XMarkIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const TableManagement = () => {
  const dispatch = useAppDispatch();
  const { list: tables, isLoading } = useAppSelector(state => state.tables);
  const { list: employees } = useAppSelector(state => state.employees);
  const [newTableNumber, setNewTableNumber] = useState('');

  useEffect(() => {
    dispatch(fetchTables());
    dispatch(fetchEmployees());
  }, [dispatch]);

  const handleAddTable = async () => {
    if (!newTableNumber) {
      alert('Please enter a table number');
      return;
    }
    await dispatch(addTable(newTableNumber));
    setNewTableNumber('');
    await dispatch(reassignAllTables());
    dispatch(fetchTables());
  };

  const handleDeleteTable = async (id) => {
    if (window.confirm('Delete this table?')) {
      await dispatch(deleteTable(id));
      await dispatch(reassignAllTables());
      dispatch(fetchTables());
    }
  };

  const handleAssign = async (tableId, waiterId) => {
    await dispatch(assignTable({ id: tableId, assignedTo: waiterId }));
    dispatch(fetchTables());
  };

  const handleRedistribute = async () => {
    if (window.confirm('Redistribute all tables equally among active waiters?')) {
      await dispatch(reassignAllTables());
      dispatch(fetchTables());
      alert('Tables have been redistributed successfully!');
    }
  };

  if (isLoading) return <Spinner />;
  
  const activeWaiters = employees.filter(e => e.role === 'employee' && !e.isOnLeave);
  const unassignedTables = tables.filter(t => !t.assignedTo).length;
  const assignedTables = tables.filter(t => t.assignedTo).length;

  return (
    <div className="space-y-6">
      {/* Header Stats Cards - White Background with Shadow & Hover */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Tables Card */}
        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-5 border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm mb-1">Total Tables</p>
              <p className="text-3xl font-bold text-gray-800">{tables.length}</p>
            </div>
            <div className="bg-blue-100 rounded-xl p-3">
              <TableCellsIcon className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Assigned Tables Card */}
        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-5 border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm mb-1">Assigned Tables</p>
              <p className="text-3xl font-bold text-green-600">{assignedTables}</p>
            </div>
            <div className="bg-green-100 rounded-xl p-3">
              <CheckCircleIcon className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>

        {/* Unassigned Tables Card */}
        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-5 border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm mb-1">Unassigned Tables</p>
              <p className="text-3xl font-bold text-orange-600">{unassignedTables}</p>
            </div>
            <div className="bg-orange-100 rounded-xl p-3">
              <ExclamationTriangleIcon className="w-8 h-8 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Add Table Section */}
      <div className="bg-white rounded-2xl shadow-lg p-5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <TableCellsIcon className="w-6 h-6 text-[#1a237e]" /> Table Management
            </h2>
            <p className="text-gray-500 text-sm mt-1">Add, assign, or remove restaurant tables</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Table number"
                value={newTableNumber}
                onChange={e => setNewTableNumber(e.target.value)}
                className="border border-gray-200 rounded-xl px-4 py-2 w-36 focus:ring-2 focus:ring-[#1a237e] focus:border-[#1a237e] outline-none transition"
              />
              <button
                onClick={handleAddTable}
                className="bg-gradient-to-r from-[#1a237e] to-[#4a148c] hover:from-[#1a237e]/90 hover:to-[#4a148c]/90 text-white px-4 py-2 rounded-xl font-semibold transition flex items-center gap-2 shadow-md"
              >
                <PlusCircleIcon className="w-5 h-5" /> Add Table
              </button>
            </div>
            
            <button
              onClick={handleRedistribute}
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-4 py-2 rounded-xl font-semibold transition flex items-center justify-center gap-2 shadow-md"
            >
              <ArrowPathIcon className="w-5 h-5" /> Redistribute Equally
            </button>
          </div>
        </div>
      </div>

      {/* Tables Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {tables.map(table => {
          const waiter = employees.find(e => e.id === table.assignedTo);
          const isAssigned = !!table.assignedTo;
          
          return (
            <div 
              key={table.id} 
              className={`bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${
                !isAssigned ? 'border-l-4 border-orange-500' : 'border-l-4 border-green-500'
              }`}
            >
              <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <TableCellsIcon className={`w-6 h-6 ${isAssigned ? 'text-green-600' : 'text-orange-600'}`} />
                    <h3 className="text-xl font-bold text-gray-800">Table {table.number}</h3>
                  </div>
                  <button
                    onClick={() => handleDeleteTable(table.id)}
                    className="text-red-500 hover:text-red-700 transition p-1"
                    title="Delete table"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-gray-600">
                    <UserIcon className="w-4 h-4" />
                    <span className="text-sm">
                      {waiter ? (
                        <span className="font-medium text-gray-800">{waiter.name}</span>
                      ) : (
                        <span className="text-orange-500">Not assigned</span>
                      )}
                    </span>
                  </div>
                  
                  <div className="mt-3">
                    <label className="block text-xs text-gray-500 mb-1">Assign to waiter:</label>
                    <select
                      onChange={e => handleAssign(table.id, parseInt(e.target.value))}
                      value={table.assignedTo || ''}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-[#1a237e] focus:border-[#1a237e] outline-none transition bg-white"
                    >
                      <option value="">-- Select Waiter --</option>
                      {activeWaiters.map(w => (
                        <option key={w.id} value={w.id}>
                          {w.name} {w.isOnLeave ? '(On Leave)' : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="mt-2 pt-2 border-t border-gray-100">
                    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
                      isAssigned 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-orange-100 text-orange-700'
                    }`}>
                      {isAssigned ? (
                        <CheckCircleIcon className="w-3 h-3" />
                      ) : (
                        <ExclamationTriangleIcon className="w-3 h-3" />
                      )}
                      {isAssigned ? 'Assigned' : 'Unassigned'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {tables.length === 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <TableCellsIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">No Tables Added</h3>
          <p className="text-gray-500">Click "Add Table" to create your first table.</p>
        </div>
      )}

      {/* Active Waiters Info */}
      {activeWaiters.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-5">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-3">
            <UserIcon className="w-5 h-5 text-[#1a237e]" /> Active Waiters ({activeWaiters.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {activeWaiters.map(waiter => (
              <span key={waiter.id} className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                <CheckCircleIcon className="w-3 h-3" /> {waiter.name}
              </span>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-3">
            <ArrowPathIcon className="w-3 h-3 inline mr-1" />
            Tables are distributed equally among active waiters when you click "Redistribute Equally"
          </p>
        </div>
      )}
    </div>
  );
};

export default TableManagement;