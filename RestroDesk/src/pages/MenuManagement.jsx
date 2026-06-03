import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchMenu, addMenuItem, updateMenuItem, deleteMenuItem } from '../features/menu/menuSlice';
import Spinner from '../components/Common/Spinner';
import { 
  CakeIcon, 
  PlusCircleIcon, 
  PencilIcon, 
  TrashIcon, 
  XMarkIcon,
  CheckCircleIcon,
  XCircleIcon,
  CurrencyRupeeIcon,
  TagIcon,
  DocumentTextIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';

const DEFAULT_IMAGE = "https://media.istockphoto.com/id/1182393436/vector/fast-food-seamless-pattern-with-vector-line-icons-of-hamburger-pizza-hot-dog-beverage.jpg?s=612x612&w=0&k=20&c=jlj-n_CNsrd13tkHwC7MVo0cGUyyc8YP6wJQdCvMUGw=";

const MenuManagement = () => {
  const dispatch = useAppDispatch();
  const { items, isLoading } = useAppSelector(state => state.menu);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({ 
    name: '', 
    category: '', 
    price: '', 
    taxRate: 5, 
    available: true, 
    description: '', 
    image: '' 
  });

  useEffect(() => { 
    dispatch(fetchMenu()); 
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { ...formData, price: Number(formData.price), taxRate: Number(formData.taxRate) };
    if (editing) {
      await dispatch(updateMenuItem({ id: editing.id, updates: data }));
    } else {
      await dispatch(addMenuItem(data));
    }
    resetForm(); 
    dispatch(fetchMenu());
  };

  const resetForm = () => { 
    setShowForm(false); 
    setEditing(null); 
    setFormData({ 
      name: '', 
      category: '', 
      price: '', 
      taxRate: 5, 
      available: true, 
      description: '', 
      image: '' 
    }); 
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this item?')) {
      await dispatch(deleteMenuItem(id));
      dispatch(fetchMenu());
    }
  };

  const toggleAvailability = async (item) => {
    await dispatch(updateMenuItem({ id: item.id, updates: { available: !item.available } }));
    dispatch(fetchMenu());
  };

  if (isLoading) return <Spinner />;

  const availableCount = items.filter(i => i.available).length;
  const unavailableCount = items.filter(i => !i.available).length;

  return (
    <div className="space-y-6">
      {/* Header Stats Cards - White Background with Shadow & Hover */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Items Card */}
        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-5 border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm mb-1">Total Items</p>
              <p className="text-3xl font-bold text-gray-800">{items.length}</p>
            </div>
            <div className="bg-blue-100 rounded-xl p-3">
              <CakeIcon className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Available Items Card */}
        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-5 border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm mb-1">Available</p>
              <p className="text-3xl font-bold text-green-600">{availableCount}</p>
            </div>
            <div className="bg-green-100 rounded-xl p-3">
              <CheckCircleIcon className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>

        {/* Unavailable Items Card */}
        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-5 border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm mb-1">Unavailable</p>
              <p className="text-3xl font-bold text-red-600">{unavailableCount}</p>
            </div>
            <div className="bg-red-100 rounded-xl p-3">
              <XCircleIcon className="w-8 h-8 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Header with Add Button */}
      <div className="bg-white rounded-2xl shadow-lg p-5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <CakeIcon className="w-6 h-6 text-[#1a237e]" /> Menu Items
            </h2>
            <p className="text-gray-500 text-sm mt-1">Manage your restaurant menu</p>
          </div>
          
          <button
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-[#1a237e] to-[#4a148c] hover:from-[#1a237e]/90 hover:to-[#4a148c]/90 text-white px-5 py-2 rounded-xl font-semibold transition flex items-center justify-center gap-2 shadow-md"
          >
            <PlusCircleIcon className="w-5 h-5" /> Add Dish
          </button>
        </div>
      </div>

      {/* Add/Edit Modal - Same as before */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-[#1a237e] to-[#4a148c] p-5 sticky top-0">
              <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                <PlusCircleIcon className="w-6 h-6" />
                {editing ? 'Edit Dish' : 'Add New Dish'}
              </h3>
              <p className="text-blue-100 text-sm mt-1">Fill in the dish details below</p>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Dish Name"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1a237e] focus:border-[#1a237e] outline-none transition"
                  required
                />

                <select
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1a237e] focus:border-[#1a237e] outline-none transition bg-white"
                >
                  <option value="">Select Category</option>
                  <option>Starter</option>
                  <option>Main</option>
                  <option>Bread</option>
                  <option>Dessert</option>
                  <option>Beverage</option>
                </select>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="relative">
                  <CurrencyRupeeIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    placeholder="Price (₹)"
                    value={formData.price}
                    onChange={e => setFormData({ ...formData, price: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1a237e] focus:border-[#1a237e] outline-none transition"
                    required
                  />
                </div>

                <div className="relative">
                  <TagIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    placeholder="Tax Rate (%)"
                    value={formData.taxRate}
                    onChange={e => setFormData({ ...formData, taxRate: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1a237e] focus:border-[#1a237e] outline-none transition"
                  />
                </div>
              </div>

              <div className="relative">
                <PhotoIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Image URL (optional)"
                  value={formData.image}
                  onChange={e => setFormData({ ...formData, image: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1a237e] focus:border-[#1a237e] outline-none transition"
                />
              </div>

              {(formData.image || editing?.image) && (
                <div className="mt-2">
                  <img 
                    src={formData.image || editing?.image || DEFAULT_IMAGE} 
                    alt="Preview" 
                    className="w-32 h-32 object-cover rounded-xl border mx-auto"
                    onError={(e) => { e.target.src = DEFAULT_IMAGE; }}
                  />
                  <p className="text-xs text-gray-500 text-center mt-1">Image preview</p>
                </div>
              )}

              <div className="relative">
                <DocumentTextIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <textarea
                  placeholder="Description"
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1a237e] focus:border-[#1a237e] outline-none transition"
                  rows="2"
                />
              </div>

              <label className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl p-4 cursor-pointer hover:bg-gray-100 transition">
                <input
                  type="checkbox"
                  checked={formData.available}
                  onChange={e => setFormData({ ...formData, available: e.target.checked })}
                  className="w-5 h-5 accent-[#1a237e]"
                />
                <span className="font-medium text-gray-700">Item is available for ordering</span>
              </label>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2.5 rounded-xl bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition flex items-center gap-2"
                >
                  <XMarkIcon className="w-4 h-4" /> Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#1a237e] to-[#4a148c] hover:from-[#1a237e]/90 hover:to-[#4a148c]/90 text-white font-semibold transition flex items-center gap-2 shadow-md"
                >
                  <PlusCircleIcon className="w-4 h-4" />
                  {editing ? 'Update Dish' : 'Add Dish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Menu Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map(item => (
          <div 
            key={item.id} 
            className={`bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${
              !item.available ? 'opacity-60' : ''
            }`}
          >
            <div className="relative">
              <img 
                src={item.image || DEFAULT_IMAGE} 
                alt={item.name} 
                className="w-full h-48 object-cover"
                onError={(e) => { e.target.src = DEFAULT_IMAGE; }}
              />
              <span className={`absolute top-3 right-3 px-2 py-1 rounded-lg text-xs font-semibold ${
                item.available 
                  ? 'bg-green-500 text-white' 
                  : 'bg-red-500 text-white'
              }`}>
                {item.available ? 'Available' : 'Unavailable'}
              </span>
            </div>
            
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-gray-800">{item.name}</h3>
                <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
                  {item.category}
                </span>
              </div>
              
              <p className="text-green-600 font-bold text-lg flex items-center gap-1">
                <CurrencyRupeeIcon className="w-4 h-4" /> {item.price}
              </p>
              
              {item.description && (
                <p className="text-sm text-gray-500 mt-2 line-clamp-2">{item.description}</p>
              )}
              
              <div className="flex gap-2 mt-4">
                <button 
                  onClick={() => { setEditing(item); setFormData(item); setShowForm(true); }} 
                  className="flex-1 bg-amber-500 hover:bg-amber-600 text-white py-2 rounded-xl text-sm font-medium transition flex items-center justify-center gap-1"
                >
                  <PencilIcon className="w-4 h-4" /> Edit
                </button>
                <button 
                  onClick={() => handleDelete(item.id)} 
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-xl text-sm font-medium transition flex items-center justify-center gap-1"
                >
                  <TrashIcon className="w-4 h-4" /> Delete
                </button>
                <button 
                  onClick={() => toggleAvailability(item)} 
                  className={`flex-1 py-2 rounded-xl text-sm font-medium transition flex items-center justify-center gap-1 ${
                    item.available 
                      ? 'bg-gray-500 hover:bg-gray-600 text-white' 
                      : 'bg-green-500 hover:bg-green-600 text-white'
                  }`}
                >
                  {item.available ? (
                    <XCircleIcon className="w-4 h-4" />
                  ) : (
                    <CheckCircleIcon className="w-4 h-4" />
                  )}
                  {item.available ? 'Unavail' : 'Avail'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <CakeIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">No Menu Items</h3>
          <p className="text-gray-500">Click "Add Dish" to create your first menu item.</p>
        </div>
      )}
    </div>
  );
};

export default MenuManagement;