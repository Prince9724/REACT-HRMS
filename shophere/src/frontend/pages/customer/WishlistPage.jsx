import React from 'react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';

const WishlistPage = () => {
  return (
    <>
      <Navbar />
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h1>My Wishlist</h1>
        <p>Your wishlist is empty</p>
        <p>Wishlist functionality coming soon...</p>
      </div>
      <Footer />
    </>
  );
};

export default WishlistPage;