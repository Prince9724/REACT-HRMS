import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';

// Public Pages
import HomePage from '../pages/public/HomePage';
import ProductListingPage from '../pages/public/ProductListingPage';
import ProductDetailsPage from '../pages/public/ProductDetailsPage';
import LoginPage from '../pages/public/LoginPage';
import RegisterPage from '../pages/public/RegisterPage';

// Customer Pages
import CartPage from '../pages/customer/CartPage';
import WishlistPage from '../pages/customer/WishlistPage';
import CheckoutPage from '../pages/customer/CheckoutPage';
import MyOrdersPage from '../pages/customer/MyOrdersPage';

// Seller Pages
import SellerDashboard from '../pages/seller/SellerDashboard';
import AddProductPage from '../pages/seller/AddProductPage';
import MyProductsPage from '../pages/seller/MyProductsPage';
import SellerOrdersPage from '../pages/seller/SellerOrdersPage';

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import ProductApprovalPage from '../pages/admin/ProductApprovalPage';
import UserManagementPage from '../pages/admin/UserManagementPage';

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/products" element={<ProductListingPage />} />
      <Route path="/product/:id" element={<ProductDetailsPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      {/* Customer Routes */}
      <Route element={<PrivateRoute allowedRoles={['customer']} />}>
        <Route path="/cart" element={<CartPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/my-orders" element={<MyOrdersPage />} />
      </Route>
      
      {/* Seller Routes */}
      <Route element={<PrivateRoute allowedRoles={['seller']} />}>
        <Route path="/seller" element={<SellerDashboard />} />
        <Route path="/seller/add-product" element={<AddProductPage />} />
        <Route path="/seller/products" element={<MyProductsPage />} />
        <Route path="/seller/orders" element={<SellerOrdersPage />} />
      </Route>
      
      {/* Admin Routes */}
      <Route element={<PrivateRoute allowedRoles={['admin']} />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/pending-products" element={<ProductApprovalPage />} />
        <Route path="/admin/users" element={<UserManagementPage />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;