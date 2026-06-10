import React, { useState, useEffect } from 'react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import { productService } from '../../services/productService';
import { FiCheck, FiX, FiEye } from 'react-icons/fi';

const ProductApprovalPage = () => {
  const [pendingProducts, setPendingProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchPendingProducts();
  }, []);

  const fetchPendingProducts = async () => {
    setLoading(true);
    const result = await productService.getPendingProducts();
    if (result.success) {
      setPendingProducts(result.data);
    }
    setLoading(false);
  };

  const handleApprove = async (productId) => {
    const result = await productService.approveProduct(productId);
    if (result.success) {
      setMessage('Product approved successfully!');
      fetchPendingProducts();
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleReject = async (productId) => {
    const result = await productService.rejectProduct(productId);
    if (result.success) {
      setMessage('Product rejected!');
      fetchPendingProducts();
      setTimeout(() => setMessage(''), 3000);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={styles.loader}>Loading pending products...</div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.header}>
          <h1>Product Approval Queue</h1>
          <p>Review and approve products submitted by sellers</p>
        </div>

        {message && <div style={styles.success}>{message}</div>}

        {pendingProducts.length === 0 ? (
          <div style={styles.noProducts}>
            <p>No pending products for approval</p>
          </div>
        ) : (
          <div style={styles.productsList}>
            {pendingProducts.map(product => (
              <div key={product.id} style={styles.productCard}>
                <div style={styles.productImage}>
                  <img src={product.images?.[0] || 'https://via.placeholder.com/100'} alt={product.name} />
                </div>
                <div style={styles.productInfo}>
                  <h3>{product.name}</h3>
                  <p>Seller: {product.sellerName}</p>
                  <p>Category: {product.category}</p>
                  <p>Price: ${product.finalPrice}</p>
                  <p>Stock: {product.stockQuantity}</p>
                </div>
                <div style={styles.productActions}>
                  <button onClick={() => handleApprove(product.id)} style={styles.approveBtn}>
                    <FiCheck /> Approve
                  </button>
                  <button onClick={() => handleReject(product.id)} style={styles.rejectBtn}>
                    <FiX /> Reject
                  </button>
                  <button style={styles.viewBtn}>
                    <FiEye /> View
                  </button>
                </div>
              </div>
            ))}
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
    marginBottom: '30px',
    textAlign: 'center'
  },
  productsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  productCard: {
    backgroundColor: 'white',
    borderRadius: '10px',
    padding: '20px',
    display: 'flex',
    gap: '20px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    alignItems: 'center'
  },
  productImage: {
    width: '100px',
    height: '100px',
    borderRadius: '8px',
    overflow: 'hidden'
  },
  productInfo: {
    flex: 1
  },
  productActions: {
    display: 'flex',
    gap: '10px'
  },
  approveBtn: {
    backgroundColor: '#28a745',
    color: 'white',
    padding: '8px 16px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '5px'
  },
  rejectBtn: {
    backgroundColor: '#dc3545',
    color: 'white',
    padding: '8px 16px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '5px'
  },
  viewBtn: {
    backgroundColor: '#6c757d',
    color: 'white',
    padding: '8px 16px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '5px'
  },
  noProducts: {
    textAlign: 'center',
    padding: '50px',
    backgroundColor: 'white',
    borderRadius: '10px'
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

export default ProductApprovalPage;