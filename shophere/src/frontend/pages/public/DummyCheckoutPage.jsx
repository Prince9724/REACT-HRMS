import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import { FiCheckCircle } from 'react-icons/fi';

const DummyCheckoutPage = () => {
  return (
    <>
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-16 min-h-screen text-center">
        <div className="bg-yellow-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
          <FiCheckCircle size={40} className="text-yellow-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Dummy Checkout Page</h2>
        <p className="text-gray-600 mb-6">This is a temporary checkout page. Payment integration coming soon!</p>
        <div className="flex gap-4 justify-center">
          <Link to="/cart" className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition">
            Back to Cart
          </Link>
          <Link to="/" className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition">
            Continue Shopping
          </Link>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default DummyCheckoutPage;