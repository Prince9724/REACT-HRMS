import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import { useAuth } from '../../contexts/AuthContext';
import { FiUsers, FiShoppingBag, FiPackage, FiDollarSign } from 'react-icons/fi';

const AdminDashboard = () => {
  const { user } = useAuth();
  
  const stats = [
    { icon: FiUsers, label: 'Total Users', value: 0, color: '#ff6b35', link: '/admin/users' },
    { icon: FiShoppingBag, label: 'Total Sellers', value: 0, color: '#28a745', link: '/admin/sellers' },
    { icon: FiPackage, label: 'Total Products', value: 0, color: '#17a2b8', link: '/admin/products' },
    { icon: FiPackage, label: 'Pending Products', value: 0, color: '#ffc107', link: '/admin/pending-products' }
  ];
  
  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.header}>
          <h1>Admin Dashboard</h1>
          <p>Welcome back, {user?.fullName}</p>
        </div>
        
        <div style={styles.statsGrid}>
          {stats.map((stat, index) => (
            <Link to={stat.link} key={index} style={styles.statCard}>
              <stat.icon size={30} color={stat.color} />
              <div>
                <h3>{stat.value}</h3>
                <p>{stat.label}</p>
              </div>
            </Link>
          ))}
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
    gap: '20px'
  },
  statCard: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    textDecoration: 'none',
    color: '#333',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  }
};

export default AdminDashboard;