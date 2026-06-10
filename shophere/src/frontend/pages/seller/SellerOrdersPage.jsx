import React from 'react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';

const SellerOrdersPage = () => {
  return (
    <>
      <Navbar />
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h1>Seller Orders</h1>
        <p>Orders for your products will be shown here</p>
      </div>
      <Footer />
    </>
  );
};

export default SellerOrdersPage;