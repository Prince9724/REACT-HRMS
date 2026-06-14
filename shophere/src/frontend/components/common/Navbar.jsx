import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { useWishlist } from '../../contexts/WishlistContext';
import { 
  FiShoppingCart, 
  FiHeart, 
  FiUser, 
  FiLogOut, 
  FiLogIn, 
  FiUserPlus, 
  FiHome, 
  FiPackage, 
  FiChevronDown
} from 'react-icons/fi';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const navigate = useNavigate();
  
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);
  const [isSellerMenuOpen, setIsSellerMenuOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-primary">
            ShopSphere
          </Link>

          {/* Navigation Links */}
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

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            
            {/* Wishlist */}
            <Link to="/wishlist" className="text-gray-700 hover:text-primary transition relative">
              <FiHeart size={20} />
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link to="/cart" className="text-gray-700 hover:text-primary transition relative">
              <FiShoppingCart size={22} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {isAuthenticated() ? (
              <div className="relative">
                <button
                  onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                  className="flex items-center gap-1 text-gray-700 hover:text-primary"
                >
                  <FiUser size={18} />
                  <span className="hidden md:inline text-sm font-medium">{user?.fullName?.split(' ')[0]}</span>
                  <FiChevronDown size={14} />
                </button>
                
                {isAccountMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-200">
                    <Link 
                      to="/profile" 
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsAccountMenuOpen(false)}
                    >
                      Your Profile
                    </Link>
                    <Link 
                      to="/my-orders" 
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsAccountMenuOpen(false)}
                    >
                      Your Orders
                    </Link>
                    <Link 
                      to="/wishlist" 
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsAccountMenuOpen(false)}
                    >
                      Your Wishlist
                    </Link>
                    <hr className="my-1" />
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex space-x-2">
                <Link to="/login" className="border border-primary text-primary px-3 py-1 rounded-lg hover:bg-primary hover:text-white transition text-sm">
                  Login
                </Link>
                <Link to="/register" className="bg-primary text-white px-3 py-1 rounded-lg hover:bg-orange-600 transition text-sm">
                  Register
                </Link>
              </div>
            )}

            {/* Admin Dropdown */}
            {user?.role === 'admin' && (
              <div className="relative">
                <button
                  onClick={() => setIsAdminMenuOpen(!isAdminMenuOpen)}
                  className="flex items-center gap-1 bg-gray-100 rounded-lg px-3 py-1 text-sm"
                >
                  Admin <FiChevronDown size={14} />
                </button>
                {isAdminMenuOpen && (
                  <div className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-lg py-2 z-50 border">
                    <Link to="/admin" className="block px-4 py-2 text-sm hover:bg-gray-100">Dashboard</Link>
                    <Link to="/admin/categories" className="block px-4 py-2 text-sm hover:bg-gray-100">Categories</Link>
                    <Link to="/admin/users" className="block px-4 py-2 text-sm hover:bg-gray-100">Users</Link>
                    <Link to="/admin/pending-products" className="block px-4 py-2 text-sm hover:bg-gray-100">Pending Products</Link>
                  </div>
                )}
              </div>
            )}

            {/* Seller Dropdown */}
            {user?.role === 'seller' && (
              <div className="relative">
                <button
                  onClick={() => setIsSellerMenuOpen(!isSellerMenuOpen)}
                  className="flex items-center gap-1 bg-gray-100 rounded-lg px-3 py-1 text-sm"
                >
                  Sell <FiChevronDown size={14} />
                </button>
                {isSellerMenuOpen && (
                  <div className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-lg py-2 z-50 border">
                    <Link to="/seller" className="block px-4 py-2 text-sm hover:bg-gray-100">Dashboard</Link>
                    <Link to="/seller/products" className="block px-4 py-2 text-sm hover:bg-gray-100">My Products</Link>
                    <Link to="/seller/add-product" className="block px-4 py-2 text-sm hover:bg-gray-100">Add Product</Link>
                    <Link to="/seller/orders" className="block px-4 py-2 text-sm hover:bg-gray-100">Orders</Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;