import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FiShoppingCart, FiHeart, FiUser, FiLogOut, FiLogIn, FiUserPlus, FiHome } from 'react-icons/fi';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.container}>
        <Link to="/" style={styles.logo}>
          ShopSphere
        </Link>

        <div style={styles.navLinks}>
          <Link to="/" style={styles.navLink}>
            <FiHome size={16} />
            Home
          </Link>
          <Link to="/products" style={styles.navLink}>
            Products
          </Link>
        </div>

        <div style={styles.rightSection}>
          {isAuthenticated() ? (
            <>
              <Link to="/wishlist" style={styles.iconLink}>
                <FiHeart size={20} />
              </Link>
              
              <Link to="/cart" style={styles.iconLink}>
                <FiShoppingCart size={20} />
              </Link>
              
              <div style={styles.userMenu}>
                <FiUser size={18} />
                <span>{user?.fullName?.split(' ')[0]}</span>
                <button onClick={handleLogout} style={styles.logoutBtn}>
                  <FiLogOut size={16} />
                </button>
              </div>
            </>
          ) : (
            <div style={styles.authButtons}>
              <Link to="/login" style={styles.loginBtn}>
                <FiLogIn size={16} />
                Login
              </Link>
              <Link to="/register" style={styles.registerBtn}>
                <FiUserPlus size={16} />
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    backgroundColor: '#ffffff',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    padding: '15px 0',
    position: 'sticky',
    top: 0,
    zIndex: 1000
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  logo: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#ff6b35',
    textDecoration: 'none'
  },
  navLinks: {
    display: 'flex',
    gap: '30px'
  },
  navLink: {
    textDecoration: 'none',
    color: '#333',
    fontSize: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '5px'
  },
  rightSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px'
  },
  iconLink: {
    color: '#333',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center'
  },
  userMenu: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    backgroundColor: '#f0f0f0',
    padding: '8px 15px',
    borderRadius: '20px'
  },
  logoutBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    color: '#ff4444'
  },
  authButtons: {
    display: 'flex',
    gap: '10px'
  },
  loginBtn: {
    backgroundColor: 'transparent',
    color: '#ff6b35',
    padding: '8px 16px',
    borderRadius: '5px',
    textDecoration: 'none',
    border: '1px solid #ff6b35',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  registerBtn: {
    backgroundColor: '#ff6b35',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '5px',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  }
};

export default Navbar;