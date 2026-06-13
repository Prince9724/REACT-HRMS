import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import { useAuth } from '../../contexts/AuthContext';
import { categoryService } from '../../services/categoryService';
import { FiUpload, FiX, FiImage } from 'react-icons/fi';

const AddProductPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    brand: '',
    description: '',
    price: '',
    discount: '0',
    stockQuantity: '',
    images: []
  });
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const result = await categoryService.getAllCategories();
    if (result.success) {
      setCategories(result.data);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

 const addImage = () => {
  if (imageUrl && imageUrl.trim() !== '') {
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      const currentImages = [...formData.images];
      console.log('🔵 Current images before add:', currentImages);
      
      const newImages = [...currentImages, imageUrl.trim()];
      console.log('🟢 New images array:', newImages);
      
      setFormData(prev => ({ 
        ...prev, 
        images: newImages 
      }));
      setImageUrl('');
    } else {
      setError('Please enter a valid image URL starting with http:// or https://');
      setTimeout(() => setError(''), 3000);
    }
  }
};

  const removeImage = (index) => {
    const newImages = [...formData.images];
    newImages.splice(index, 1);
    setFormData({ ...formData, images: newImages });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setLoading(true);
  
  if (!formData.name || !formData.category || !formData.price || !formData.stockQuantity) {
    setError('Please fill all required fields');
    setLoading(false);
    return;
  }
  
  // ✅ IMPORTANT: Log current images before submit
  console.log('🔴 Current formData.images BEFORE submit:', formData.images);
  console.log('🔴 Type of images:', typeof formData.images);
  console.log('🔴 Is array?', Array.isArray(formData.images));
  
  const finalPrice = formData.price - (formData.price * formData.discount / 100);
  
  // ✅ Ensure images is an array and has valid URLs
  let imagesToSubmit = [];
  if (formData.images && Array.isArray(formData.images)) {
    imagesToSubmit = formData.images.filter(img => img && img.trim() !== '');
  }
  
  console.log('✅ Images to submit:', imagesToSubmit);
  
  const productData = {
    name: formData.name,
    category: formData.category,
    brand: formData.brand,
    description: formData.description,
    price: Number(formData.price),
    discount: Number(formData.discount),
    stockQuantity: Number(formData.stockQuantity),
    images: imagesToSubmit,  // ✅ Use the filtered array
    finalPrice: Number(finalPrice.toFixed(2)),
    sellerId: user?.id,
    sellerName: user?.fullName,
    slug: formData.name.toLowerCase().replace(/ /g, '-'),
    status: 'pending',
    rating: 0,
    totalReviews: 0,
    createdAt: new Date().toISOString()
  };
  
  console.log('📤 Final product data:', JSON.stringify(productData, null, 2));
  
  try {
    const response = await fetch('http://localhost:5000/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData)
    });
    
    const responseData = await response.json();
    console.log('📥 Server response:', responseData);
    
    if (response.ok) {
      setSuccess('Product added successfully!');
      setTimeout(() => navigate('/seller/products'), 2000);
    } else {
      setError('Failed to add product');
    }
  } catch (err) {
    console.error('❌ Error:', err);
    setError(err.message);
  }
  
  setLoading(false);
};

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8 min-h-screen">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Add New Product</h1>
          <p className="text-gray-600 mt-2">Your product will be reviewed by admin before going live</p>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6">
            {success}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Product Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter product name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                placeholder="Enter brand name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price ($) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Enter price"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Discount (%)</label>
              <input
                type="number"
                name="discount"
                value={formData.discount}
                onChange={handleChange}
                placeholder="Enter discount percentage"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Stock Quantity *</label>
              <input
                type="number"
                name="stockQuantity"
                value={formData.stockQuantity}
                onChange={handleChange}
                placeholder="Enter stock quantity"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
          </div>
          
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter product description"
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Product Images</label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Enter image URL (https://...)"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                type="button"
                onClick={addImage}
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
              >
                <FiUpload /> Add
              </button>
            </div>
            
            {/* Debug: Show images count */}
            <p className="text-sm text-blue-600 mb-2">Images added: {formData.images.length}</p>
            
            {formData.images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-3">
                {formData.images.map((img, index) => (
                  <div key={index} className="relative group border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                    <img
                      src={img}
                      alt={`Product preview ${index + 1}`}
                      className="w-full h-32 object-cover"
                      onError={(e) => {
                        e.target.src = 'https://picsum.photos/150/150?random=' + index;
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                    >
                      <FiX size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            {formData.images.length === 0 && (
              <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                <FiImage size={40} className="mx-auto text-gray-400 mb-2" />
                <p className="text-gray-500">No images added. Add image URLs above.</p>
              </div>
            )}
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="mt-8 w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition disabled:opacity-50"
          >
            {loading ? 'Adding Product...' : 'Add Product'}
          </button>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default AddProductPage;