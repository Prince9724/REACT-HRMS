import React from 'react'
import Navbar from '../../components/common/Navbar'
import Footer from '../../components/common/Footer'
import { FiShoppingBag, FiTruck, FiShield, FiHeadphones } from 'react-icons/fi'

const HomePage = () => {
  const features = [
    { icon: FiShoppingBag, title: 'Free Shipping', description: 'On orders over $50' },
    { icon: FiTruck, title: 'Fast Delivery', description: 'Within 24 hours' },
    { icon: FiShield, title: 'Secure Payment', description: '100% secure transactions' },
    { icon: FiHeadphones, title: '24/7 Support', description: 'Dedicated customer service' }
  ]

  return (
    <>
      <Navbar />
      
      <main>
        {/* Hero Section */}
        <section style={styles.hero}>
          <div style={styles.heroContent}>
            <h1 style={styles.heroTitle}>Welcome to ShopSphere</h1>
            <p style={styles.heroSubtitle}>
              Your one-stop marketplace for everything you need
            </p>
            <button style={styles.shopNowBtn}>Shop Now</button>
          </div>
        </section>

        {/* Features Section */}
        <section style={styles.features}>
          <div style={styles.container}>
            <h2 style={styles.sectionTitle}>Why Choose Us</h2>
            <div style={styles.featuresGrid}>
              {features.map((Feature, index) => (
                <div key={index} style={styles.featureCard}>
                  <Feature.icon size={40} color="#ff6b35" />
                  <h3>{Feature.title}</h3>
                  <p>{Feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}

const styles = {
  hero: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: '80px 20px',
    textAlign: 'center'
  },
  heroContent: {
    maxWidth: '800px',
    margin: '0 auto'
  },
  heroTitle: {
    fontSize: '48px',
    marginBottom: '20px'
  },
  heroSubtitle: {
    fontSize: '20px',
    marginBottom: '30px',
    opacity: 0.9
  },
  shopNowBtn: {
    backgroundColor: '#ff6b35',
    color: 'white',
    padding: '12px 30px',
    fontSize: '18px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px'
  },
  sectionTitle: {
    textAlign: 'center',
    fontSize: '32px',
    marginBottom: '40px',
    color: '#333'
  },
  features: {
    padding: '60px 0',
    backgroundColor: '#f9f9f9'
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '30px'
  },
  featureCard: {
    textAlign: 'center',
    padding: '30px',
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
  }
}

export default HomePage