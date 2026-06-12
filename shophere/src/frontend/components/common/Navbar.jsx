import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';  // ← ../../ (2 level up)
import { FiShoppingCart, FiHeart, FiUser, FiLogOut, FiLogIn, FiUserPlus, FiHome, FiPackage } from 'react-icons/fi';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

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
                <Link to="/wishlist" className="text-gray-700 hover:text-primary transition">
                  <FiHeart size={20} />
                </Link>
                <Link to="/cart" className="text-gray-700 hover:text-primary transition relative">
                  <FiShoppingCart size={20} />
                  <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    0
                  </span>
                </Link>
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