import React from 'react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';

const CategoryManagementPage = () => {
  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8 min-h-screen">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Category Management</h1>
        <div className="bg-white rounded-xl shadow-md p-6">
          <p className="text-gray-500">Category management features coming soon...</p>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CategoryManagementPage;