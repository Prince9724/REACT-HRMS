import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';

// Public Pages
import HomePage from '../pages/public/HomePage';
import ProductListingPage from '../pages/public/ProductListingPage';
import ProductDetailsPage from '../pages/public/ProductDetailsPage';
import LoginPage from '../pages/public/LoginPage';
import RegisterPage from '../pages/public/RegisterPage';
import DummyCheckoutPage from '../pages/public/DummyCheckoutPage';

// Customer Pages (and also for Seller/Admin)
import CartPage from '../pages/customer/CartPage';
import WishlistPage from '../pages/customer/WishlistPage';
import CheckoutPage from '../pages/customer/CheckoutPage';
import MyOrdersPage from '../pages/customer/MyOrdersPage';
import CustomerProfile from '../pages/customer/CustomerProfile';

// Seller Pages
import SellerDashboard from '../pages/seller/SellerDashboard';
import AddProductPage from '../pages/seller/AddProductPage';
import EditProductPage from '../pages/seller/EditProductPage';
import MyProductsPage from '../pages/seller/MyProductsPage';
import SellerOrdersPage from '../pages/seller/SellerOrdersPage';

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import ProductApprovalPage from '../pages/admin/ProductApprovalPage';
import UserManagementPage from '../pages/admin/UserManagementPage';
import SellerManagementPage from '../pages/admin/SellerManagementPage';
import CategoryManagementPage from '../pages/admin/CategoryManagementPage';

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/products" element={<ProductListingPage />} />
      <Route path="/product/:id" element={<ProductDetailsPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/dummy-checkout" element={<DummyCheckoutPage />} />
      
      {/* Cart & Wishlist - Sabhi logged in users (Admin, Seller, Customer) ke liye */}
      <Route element={<PrivateRoute />}>
        <Route path="/cart" element={<CartPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/my-orders" element={<MyOrdersPage />} />
        <Route path="/profile" element={<CustomerProfile />} />
      </Route>
      
      {/* Seller Routes */}
      <Route element={<PrivateRoute allowedRoles={['seller']} />}>
        <Route path="/seller" element={<SellerDashboard />} />
        <Route path="/seller/add-product" element={<AddProductPage />} />
        <Route path="/seller/edit-product/:id" element={<EditProductPage />} />
        <Route path="/seller/products" element={<MyProductsPage />} />
        <Route path="/seller/orders" element={<SellerOrdersPage />} />
      </Route>
      
      {/* Admin Routes */}
      <Route element={<PrivateRoute allowedRoles={['admin']} />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/pending-products" element={<ProductApprovalPage />} />
        <Route path="/admin/users" element={<UserManagementPage />} />
        <Route path="/admin/sellers" element={<SellerManagementPage />} />
        <Route path="/admin/categories" element={<CategoryManagementPage />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;