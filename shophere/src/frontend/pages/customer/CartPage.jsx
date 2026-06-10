import React from 'react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';

const CartPage = () => {
  return (
    <>
      <Navbar />
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h1>Shopping Cart</h1>
        <p>Your cart is empty</p>
        <p>Cart functionality coming soon...</p>
      </div>
      <Footer />
    </>
  );
};

export default CartPage;