import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import { useAuth } from '../../contexts/AuthContext';
import { FiPackage, FiShoppingBag, FiDollarSign, FiClock } from 'react-icons/fi';

const SellerDashboard = () => {
  const { user } = useAuth();
  
  const stats = [
    { icon: FiPackage, label: 'Total Products', value: 0, color: '#ff6b35' },
    { icon: FiShoppingBag, label: 'Total Orders', value: 0, color: '#28a745' },
    { icon: FiDollarSign, label: 'Total Sales', value: '$0', color: '#17a2b8' },
    { icon: FiClock, label: 'Pending Orders', value: 0, color: '#ffc107' }
  ];
  
  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.header}>
          <h1>Seller Dashboard</h1>
          <p>Welcome back, {user?.fullName}</p>
        </div>
        
        <div style={styles.statsGrid}>
          {stats.map((stat, index) => (
            <div key={index} style={styles.statCard}>
              <stat.icon size={30} color={stat.color} />
              <div>
                <h3>{stat.value}</h3>
                <p>{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div style={styles.actions}>
          <Link to="/seller/add-product" style={styles.addProductBtn}>
            Add New Product
          </Link>
          <Link to="/seller/products" style={styles.viewProductsBtn}>
            View My Products
          </Link>
        </div>
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
    marginBottom: '30px'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    marginBottom: '30px'
  },
  statCard: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  },
  actions: {
    display: 'flex',
    gap: '15px'
  },
  addProductBtn: {
    backgroundColor: '#ff6b35',
    color: 'white',
    padding: '12px 24px',
    textDecoration: 'none',
    borderRadius: '5px'
  },
  viewProductsBtn: {
    backgroundColor: '#6c757d',
    color: 'white',
    padding: '12px 24px',
    textDecoration: 'none',
    borderRadius: '5px'
  }
};

export default SellerDashboard;