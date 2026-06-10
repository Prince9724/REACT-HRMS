import React from 'react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';

const MyOrdersPage = () => {
  return (
    <>
      <Navbar />
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h1>My Orders</h1>
        <p>No orders yet</p>
        <p>Orders functionality coming soon...</p>
      </div>
      <Footer />
    </>
  );
};

export default MyOrdersPage;