import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchMenu, addMenuItem, updateMenuItem, deleteMenuItem } from '../features/menu/menuSlice';
import Spinner from '../components/Common/Spinner';

const MenuManagement = () => {
  const dispatch = useAppDispatch();
  const { items, isLoading } = useAppSelector(state => state.menu);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({ name: '', category: '', price: '', taxRate: 5, available: true, description: '', image: '' });

  useEffect(() => { dispatch(fetchMenu()); }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { ...formData, price: Number(formData.price), taxRate: Number(formData.taxRate) };
    if (editing) await dispatch(updateMenuItem({ id: editing.id, updates: data }));
    else await dispatch(addMenuItem(data));
    resetForm(); dispatch(fetchMenu());
  };

  const resetForm = () => { setShowForm(false); setEditing(null); setFormData({ name: '', category: '', price: '', taxRate: 5, available: true, description: '', image: '' }); };

  if (isLoading) return <Spinner />;
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">🍽️ Menu Items <span className="bg-gray-200 px-2 py-1 text-sm rounded-full">{items.length} items</span></h2>
        <button onClick={() => setShowForm(true)} className="bg-green-600 text-white px-5 py-2 rounded-xl shadow hover:bg-green-700 transition flex items-center gap-2">
          <span>+</span> Add Dish
        </button>
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">{editing ? '✏️ Edit Dish' : '➕ Add Dish'}</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input type="text" placeholder="Dish Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full border rounded-lg p-2" required />
              <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full border rounded-lg p-2">
                <option value="">Select Category</option>
                <option>Starter</option><option>Main</option><option>Bread</option><option>Dessert</option><option>Beverage</option>
              </select>
              <input type="number" placeholder="Price (₹)" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} className="w-full border rounded-lg p-2" required />
              <input type="number" placeholder="Tax Rate (%)" value={formData.taxRate} onChange={e => setFormData({ ...formData, taxRate: e.target.value })} className="w-full border rounded-lg p-2" />
              <input type="text" placeholder="Image URL (optional)" value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} className="w-full border rounded-lg p-2" />
              <textarea placeholder="Description" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full border rounded-lg p-2" rows="2"></textarea>
              <label className="flex items-center gap-2"><input type="checkbox" checked={formData.available} onChange={e => setFormData({ ...formData, available: e.target.checked })} /> Available</label>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={resetForm} className="bg-gray-400 text-white px-4 py-2 rounded-lg">Cancel</button>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg">{editing ? 'Update' : 'Add'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Menu Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map(item => (
          <div key={item.id} className={`bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all ${!item.available ? 'opacity-60' : ''}`}>
            <img src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=200&fit=crop'} alt={item.name} className="w-full h-40 object-cover" />
            <div className="p-4">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-bold">{item.name}</h3>
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">{item.category}</span>
              </div>
              <p className="text-green-600 font-bold text-lg mt-1">₹{item.price}</p>
              <p className="text-sm text-gray-500 mt-1 line-clamp-2">{item.description}</p>
              <div className="flex justify-between mt-3 gap-2">
                <button onClick={() => { setEditing(item); setFormData(item); setShowForm(true); }} className="flex-1 bg-yellow-500 text-white py-1 rounded-lg text-sm">Edit</button>
                <button onClick={() => { if (window.confirm('Delete?')) dispatch(deleteMenuItem(item.id)).then(() => dispatch(fetchMenu())); }} className="flex-1 bg-red-500 text-white py-1 rounded-lg text-sm">Delete</button>
                <button onClick={() => dispatch(updateMenuItem({ id: item.id, updates: { available: !item.available } })).then(() => dispatch(fetchMenu()))} className={`flex-1 py-1 rounded-lg text-sm ${item.available ? 'bg-gray-500' : 'bg-green-500'} text-white`}>
                  {item.available ? 'Unavail' : 'Avail'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default MenuManagement;  