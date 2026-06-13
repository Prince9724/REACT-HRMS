import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PrivateRoute = ({ allowedRoles = [] }) => {
  const { isAuthenticated, user, loading } = useAuth();
  
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  
  // Cart and Wishlist - Sabhi logged in users (Admin, Seller, Customer) ke liye allow
  const publicRoutesForAll = ['/cart', '/wishlist', '/checkout', '/my-orders', '/profile'];
  const currentPath = window.location.pathname;
  
  if (publicRoutesForAll.includes(currentPath)) {
    return <Outlet />;
  }
  
  // Other routes - role based access
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    if (user?.role === 'admin') return <Navigate to="/admin" replace />;
    if (user?.role === 'seller') return <Navigate to="/seller" replace />;
    return <Navigate to="/" replace />;
  }
  
  return <Outlet />;
};

export default PrivateRoute;