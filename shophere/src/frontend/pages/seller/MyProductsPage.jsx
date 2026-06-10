import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import { useAuth } from '../../contexts/AuthContext';
import { productService } from '../../services/productService';
import { FiEdit, FiTrash2, FiEye } from 'react-icons/fi';

const MyProductsPage = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const result = await productService.getProductsBySeller(user?.id);
    if (result.success) {
      setProducts(result.data);
    }
    setLoading(false);
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      const result = await productService.deleteProduct(productId);
      if (result.success) {
        setMessage('Product deleted successfully!');
        fetchProducts();
        setTimeout(() => setMessage(''), 3000);
      }
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'approved':
        return { text: 'Approved', color: '#28a745' };
      case 'pending':
        return { text: 'Pending Approval', color: '#ffc107' };
      case 'rejected':
        return { text: 'Rejected', color: '#dc3545' };
      default:
        return { text: status, color: '#6c757d' };
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={styles.loader}>Loading your products...</div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.header}>
          <h1>My Products</h1>
          <Link to="/seller/add-product" style={styles.addBtn}>
            Add New Product
          </Link>
        </div>

        {message && <div style={styles.success}>{message}</div>}

        {products.length === 0 ? (
          <div style={styles.noProducts}>
            <p>You haven't added any products yet.</p>
            <Link to="/seller/add-product" style={styles.addProductBtn}>
              Add Your First Product
            </Link>
          </div>
        ) : (
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Product Name</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => {
                  const status = getStatusBadge(product.status);
                  return (
                    <tr key={product.id}>
                      <td style={styles.imageCell}>
                        <img src={product.images?.[0] || 'https://via.placeholder.com/50'} alt={product.name} style={styles.thumbnail} />
                      </td>
                      <td>{product.name}</td>
                      <td>${product.finalPrice}</td>
                      <td>{product.stockQuantity}</td>
                      <td>
                        <span style={{ ...styles.statusBadge, backgroundColor: status.color }}>
                          {status.text}
                        </span>
                      </td>
                      <td>
                        <div style={styles.actions}>
                          <Link to={`/product/${product.id}`} style={styles.actionBtn}>
                            <FiEye />
                          </Link>
                          <button onClick={() => handleDelete(product.id)} style={styles.deleteBtn}>
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '30px 20px',
    minHeight: 'calc(100vh - 200px)'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px'
  },
  addBtn: {
    backgroundColor: '#ff6b35',
    color: 'white',
    padding: '10px 20px',
    textDecoration: 'none',
    borderRadius: '5px'
  },
  tableContainer: {
    overflowX: 'auto',
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  imageCell: {
    width: '80px'
  },
  thumbnail: {
    width: '50px',
    height: '50px',
    objectFit: 'cover',
    borderRadius: '5px'
  },
  statusBadge: {
    padding: '4px 8px',
    borderRadius: '4px',
    color: 'white',
    fontSize: '12px'
  },
  actions: {
    display: 'flex',
    gap: '10px'
  },
  actionBtn: {
    backgroundColor: '#17a2b8',
    color: 'white',
    padding: '5px 10px',
    borderRadius: '4px',
    textDecoration: 'none',
    cursor: 'pointer'
  },
  deleteBtn: {
    backgroundColor: '#dc3545',
    color: 'white',
    padding: '5px 10px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  noProducts: {
    textAlign: 'center',
    padding: '50px',
    backgroundColor: 'white',
    borderRadius: '10px'
  },
  addProductBtn: {
    display: 'inline-block',
    backgroundColor: '#ff6b35',
    color: 'white',
    padding: '12px 24px',
    textDecoration: 'none',
    borderRadius: '5px',
    marginTop: '15px'
  },
  loader: {
    textAlign: 'center',
    padding: '100px',
    fontSize: '18px'
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

export default MyProductsPage;