import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchTables, addTable, deleteTable, assignTable, reassignAllTables } from '../features/tables/tablesSlice';
import { fetchEmployees } from '../features/employees/employeeSlice';
import Spinner from '../components/Common/Spinner';

const TableManagement = () => {
  const dispatch = useAppDispatch();
  const { list: tables, isLoading } = useAppSelector(state => state.tables);
  const { list: employees } = useAppSelector(state => state.employees);
  const [newTableNumber, setNewTableNumber] = useState('');
  const [editingAssign, setEditingAssign] = useState(null);

  useEffect(() => {
    dispatch(fetchTables());
    dispatch(fetchEmployees());
  }, [dispatch]);

  const handleAddTable = async () => {
    if (!newTableNumber) return;
    await dispatch(addTable(newTableNumber));
    setNewTableNumber('');
    // After adding, optionally reassign equally
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
    await dispatch(reassignAllTables());
    dispatch(fetchTables());
  };

  if (isLoading) return <Spinner />;
  const activeWaiters = employees.filter(e => e.role === 'employee' && !e.isOnLeave);

  return (
    <div>
      <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
        <h2 className="text-2xl font-bold">🪑 Table Management</h2>
        <div className="flex gap-3">
          <input type="number" placeholder="Table number" value={newTableNumber} onChange={e => setNewTableNumber(e.target.value)} className="border rounded-lg p-2 w-32" />
          <button onClick={handleAddTable} className="bg-green-600 text-white px-4 py-2 rounded-lg">+ Add Table</button>
          <button onClick={handleRedistribute} className="bg-blue-600 text-white px-4 py-2 rounded-lg">Redistribute Equally</button>
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow-lg overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr><th className="p-3">Table No.</th><th>Assigned Waiter</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {tables.map(table => {
              const waiter = employees.find(e => e.id === table.assignedTo);
              return (
                <tr key={table.id} className="border-t">
                  <td className="p-3 font-bold">Table {table.number}</td>
                  <td className="p-3">
                    {waiter ? waiter.name : 'Unassigned'}
                    <select onChange={e => handleAssign(table.id, parseInt(e.target.value))} value={table.assignedTo || ''} className="ml-2 border rounded p-1 text-sm">
                      <option value="">-- Assign --</option>
                      {activeWaiters.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                    </select>
                  </td>
                  <td className="p-3">
                    <button onClick={() => handleDeleteTable(table.id)} className="bg-red-500 text-white px-2 py-1 rounded text-sm">Delete</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default TableManagement;