import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { FiShoppingCart, FiHeart, FiUser, FiLogOut, FiLogIn, FiUserPlus, FiHome, FiPackage } from 'react-icons/fi';
import { useWishlist } from '../../contexts/WishlistContext';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);
  const { wishlistCount } = useWishlist();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold text-primary">
            ShopSphere
          </Link>

          <div className="hidden md:flex space-x-8">
            <Link to="/" className="flex items-center space-x-1 text-gray-700 hover:text-primary transition">
              <FiHome size={18} />
              <span>Home</span>
            </Link>
            <Link to="/products" className="flex items-center space-x-1 text-gray-700 hover:text-primary transition">
              <FiPackage size={18} />
              <span>Products</span>
            </Link>

          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated() ? (
              <>
                {/* <Link to="/wishlist" className="text-gray-700 hover:text-primary transition">
                  <FiHeart size={20} />
                </Link> */}
                <Link to="/wishlist" className="text-gray-700 hover:text-primary transition relative">
                  <FiHeart size={20} />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {wishlistCount}
                    </span>
                  )}
                </Link>
                <Link to="/cart" className="text-gray-700 hover:text-primary transition relative">
                  <FiShoppingCart size={20} />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Link>

                {/* User Info */}
                <div className="flex items-center space-x-3 bg-gray-100 rounded-full px-4 py-2">
                  <FiUser size={18} className="text-gray-600" />
                  <span className="text-sm font-medium">{user?.fullName?.split(' ')[0]}</span>
                  <span className="text-xs bg-primary text-white px-2 py-1 rounded-full">
                    {user?.role}
                  </span>
                  <button onClick={handleLogout} className="text-red-500 hover:text-red-700">
                    <FiLogOut size={18} />
                  </button>
                </div>

                {/* ✅ Admin Dropdown Menu - YAHAN ADD KIYA */}
                {user?.role === 'admin' && (
                  <div className="relative">
                    <button
                      onClick={() => setIsAdminMenuOpen(!isAdminMenuOpen)}
                      className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-2 hover:bg-gray-200 transition"
                    >
                      <span className="text-sm font-medium">Admin Panel</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {isAdminMenuOpen && (
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-200">
                        <Link
                          to="/admin"
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsAdminMenuOpen(false)}
                        >
                          Dashboard
                        </Link>
                        <Link
                          to="/admin/categories"
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsAdminMenuOpen(false)}
                        >
                          Categories
                        </Link>
                        <Link
                          to="/admin/users"
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsAdminMenuOpen(false)}
                        >
                          Users
                        </Link>
                        <Link
                          to="/admin/pending-products"
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsAdminMenuOpen(false)}
                        >
                          Pending Products
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="flex space-x-3">
                <Link to="/login" className="flex items-center space-x-1 border border-primary text-primary px-4 py-2 rounded-lg hover:bg-primary hover:text-white transition">
                  <FiLogIn size={16} />
                  <span>Login</span>
                </Link>
                <Link to="/register" className="flex items-center space-x-1 bg-primary text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition">
                  <FiUserPlus size={16} />
                  <span>Register</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;