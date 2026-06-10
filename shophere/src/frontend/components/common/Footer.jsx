import React from 'react'
import { Link } from 'react-router-dom'
import { FiFacebook, FiTwitter, FiInstagram, FiGithub } from 'react-icons/fi'

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <div style={styles.grid}>
          <div>
            <h3 style={styles.logo}>ShopSphere</h3>
            <p style={styles.description}>
              Your trusted marketplace for quality products from verified sellers.
            </p>
            <div style={styles.socialLinks}>
              <FiFacebook size={20} />
              <FiTwitter size={20} />
              <FiInstagram size={20} />
              <FiGithub size={20} />
            </div>
          </div>
          <div>
            <h4>Quick Links</h4>
            <ul style={styles.linkList}>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/products">Products</Link></li>
              <li><Link to="/about">About Us</Link></li>
            </ul>
          </div>
          <div>
            <h4>Customer Service</h4>
            <ul style={styles.linkList}>
              <li><Link to="/faq">FAQ</Link></li>
              <li><Link to="/returns">Returns Policy</Link></li>
              <li><Link to="/shipping">Shipping Info</Link></li>
            </ul>
          </div>
          <div>
            <h4>Contact Info</h4>
            <p>Email: support@shopsphere.com</p>
            <p>Phone: +1 234 567 890</p>
            <p>Address: 123 Market Street, NY</p>
          </div>
        </div>
        <div style={styles.bottom}>
          <p>&copy; 2024 ShopSphere. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

const styles = {
  footer: {
    backgroundColor: '#2c3e50',
    color: 'white',
    padding: '50px 0 20px',
    marginTop: 'auto'
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '40px',
    marginBottom: '40px'
  },
  logo: {
    fontSize: '24px',
    marginBottom: '15px',
    color: '#ff6b35'
  },
  description: {
    lineHeight: '1.6',
    marginBottom: '20px'
  },
  socialLinks: {
    display: 'flex',
    gap: '15px',
    cursor: 'pointer'
  },
  linkList: {
    listStyle: 'none',
    padding: 0
  },
  bottom: {
    textAlign: 'center',
    paddingTop: '20px',
    borderTop: '1px solid rgba(255,255,255,0.1)'
  }
}

export default Footer