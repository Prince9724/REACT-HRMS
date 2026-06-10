import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import { useAuth } from '../../contexts/AuthContext';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import { FiUpload, FiX } from 'react-icons/fi';

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
    if (imageUrl && !formData.images.includes(imageUrl)) {
      setFormData({
        ...formData,
        images: [...formData.images, imageUrl]
      });
      setImageUrl('');
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
    
    const finalPrice = formData.price - (formData.price * formData.discount / 100);
    
    const productData = {
      ...formData,
      price: Number(formData.price),
      discount: Number(formData.discount),
      finalPrice: finalPrice,
      stockQuantity: Number(formData.stockQuantity),
      sellerId: user?.id,
      sellerName: user?.fullName,
      slug: formData.name.toLowerCase().replace(/ /g, '-')
    };
    
    const result = await productService.addProduct(productData);
    
    if (result.success) {
      setSuccess('Product added successfully! It will be visible after admin approval.');
      setTimeout(() => {
        navigate('/seller/products');
      }, 2000);
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };
  
  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.header}>
          <h1>Add New Product</h1>
          <p>Your product will be reviewed by admin before going live</p>
        </div>
        
        {error && <div style={styles.error}>{error}</div>}
        {success && <div style={styles.success}>{success}</div>}
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGrid}>
            <div style={styles.formGroup}>
              <label>Product Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter product name"
                required
              />
            </div>
            
            <div style={styles.formGroup}>
              <label>Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>
            
            <div style={styles.formGroup}>
              <label>Brand</label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                placeholder="Enter brand name"
              />
            </div>
            
            <div style={styles.formGroup}>
              <label>Price ($) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Enter price"
                required
              />
            </div>
            
            <div style={styles.formGroup}>
              <label>Discount (%)</label>
              <input
                type="number"
                name="discount"
                value={formData.discount}
                onChange={handleChange}
                placeholder="Enter discount percentage"
              />
            </div>
            
            <div style={styles.formGroup}>
              <label>Stock Quantity *</label>
              <input
                type="number"
                name="stockQuantity"
                value={formData.stockQuantity}
                onChange={handleChange}
                placeholder="Enter stock quantity"
                required
              />
            </div>
          </div>
          
          <div style={styles.formGroup}>
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter product description"
              rows="4"
            />
          </div>
          
          <div style={styles.formGroup}>
            <label>Product Images</label>
            <div style={styles.imageInput}>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Enter image URL"
              />
              <button type="button" onClick={addImage} style={styles.addImageBtn}>
                <FiUpload /> Add Image
              </button>
            </div>
            <div style={styles.imagePreview}>
              {formData.images.map((img, index) => (
                <div key={index} style={styles.imageItem}>
                  <img src={img} alt={`Product ${index + 1}`} />
                  <button type="button" onClick={() => removeImage(index)} style={styles.removeImage}>
                    <FiX />
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          <button type="submit" style={styles.submitBtn} disabled={loading}>
            {loading ? 'Adding Product...' : 'Add Product'}
          </button>
        </form>
      </div>
      <Footer />
    </>
  );
};

const styles = {
  container: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '30px 20px',
    minHeight: 'calc(100vh - 200px)'
  },
  header: {
    marginBottom: '30px',
    textAlign: 'center'
  },
  form: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '20px'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginBottom: '20px'
  },
  imageInput: {
    display: 'flex',
    gap: '10px'
  },
  imagePreview: {
    display: 'flex',
    gap: '10px',
    marginTop: '10px',
    flexWrap: 'wrap'
  },
  imageItem: {
    position: 'relative',
    width: '80px',
    height: '80px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    overflow: 'hidden'
  },
  removeImage: {
    position: 'absolute',
    top: '2px',
    right: '2px',
    backgroundColor: 'red',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '20px',
    height: '20px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  addImageBtn: {
    padding: '8px 16px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '5px'
  },
  submitBtn: {
    backgroundColor: '#ff6b35',
    color: 'white',
    padding: '12px',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    cursor: 'pointer',
    width: '100%'
  },
  error: {
    backgroundColor: '#ffebee',
    color: '#c62828',
    padding: '10px',
    borderRadius: '5px',
    marginBottom: '20px',
    textAlign: 'center'
  },
  success: {
    backgroundColor: '#e8f5e9',
    color: '#2e7d32',
    padding: '10px',
    borderRadius: '5px',
    marginBottom: '20px',
    textAlign: 'center'
  }
};

export default AddProductPage;