import React from 'react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';

const UserManagementPage = () => {
  return (
    <>
      <Navbar />
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h1>User Management</h1>
        <p>All users will be shown here</p>
      </div>
      <Footer />
    </>
  );
};

export default UserManagementPage;