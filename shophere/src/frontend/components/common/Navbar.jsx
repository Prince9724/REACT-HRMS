// src/components/Layout/Navbar.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { logout } from '../../features/auth/authSlice';
import { 
  FiShoppingCart, 
  FiUser, 
  FiLogOut, 
  FiHome, 
  FiMenu,
  FiX,
  FiChevronDown,
  FiSearch
} from 'react-icons/fi';
import { HiOutlineClipboardList, HiOutlineCake, HiOutlineTableCells, HiOutlineCalendar } from 'react-icons/hi';

const Navbar = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector(state => state.auth);
  const { cartItems } = useAppSelector(state => state.cart);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // ✅ Unique item count (not quantity)
  const uniqueCartCount = cartItems.length;

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${searchTerm}`);
      setSearchTerm('');
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <nav className="bg-[#131921] sticky top-0 z-50">
      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-white p-2"
          >
            {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>

          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-white hover:text-gray-200 transition">
            🍽️ RestroDesk
          </Link>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl mx-6">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search menu items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 rounded-l-lg focus:outline-none"
              />
              <button 
                type="submit"
                className="absolute right-0 top-0 bg-[#febd69] hover:bg-[#f3a847] text-black px-4 py-2 rounded-r-lg transition"
              >
                <FiSearch size={20} />
              </button>
            </div>
          </form>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            
            {/* Cart Icon */}
            <Link to="/cart" className="relative text-white hover:text-[#febd69] transition">
              <FiShoppingCart size={24} />
              {uniqueCartCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-[#febd69] text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {uniqueCartCount}
                </span>
              )}
            </Link>

            {/* User Section - Desktop */}
            {user ? (
              <div className="hidden md:flex items-center space-x-3">
                <div className="relative">
                  <button 
                    onClick={() => setIsAdminMenuOpen(!isAdminMenuOpen)}
                    className="flex items-center gap-2 text-white hover:text-[#febd69] transition"
                  >
                    <FiUser size={18} />
                    <span className="text-sm">Hello, {user.name?.split(' ')[0]}</span>
                    <FiChevronDown size={14} />
                  </button>
                  
                  {isAdminMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2 z-50 border">
                      <div className="px-4 py-2 border-b bg-gray-50">
                        <p className="text-sm font-semibold">{user.name}</p>
                        <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                      </div>
                      
                      {user.role === 'manager' && (
                        <>
                          <Link to="/manager" className="block px-4 py-2 text-gray-700 hover:bg-gray-100" onClick={() => setIsAdminMenuOpen(false)}>
                            📊 Dashboard
                          </Link>
                          <Link to="/manager/employees" className="block px-4 py-2 text-gray-700 hover:bg-gray-100" onClick={() => setIsAdminMenuOpen(false)}>
                            👥 Employees
                          </Link>
                          <Link to="/manager/menu" className="block px-4 py-2 text-gray-700 hover:bg-gray-100" onClick={() => setIsAdminMenuOpen(false)}>
                            🍔 Menu
                          </Link>
                          <Link to="/manager/tables" className="block px-4 py-2 text-gray-700 hover:bg-gray-100" onClick={() => setIsAdminMenuOpen(false)}>
                            🪑 Tables
                          </Link>
                          <Link to="/manager/orders" className="block px-4 py-2 text-gray-700 hover:bg-gray-100" onClick={() => setIsAdminMenuOpen(false)}>
                            📋 All Orders
                          </Link>
                          <Link to="/manager/leave" className="block px-4 py-2 text-gray-700 hover:bg-gray-100" onClick={() => setIsAdminMenuOpen(false)}>
                            🏖️ Leave Requests
                          </Link>
                          <Link to="/manager/analytics" className="block px-4 py-2 text-gray-700 hover:bg-gray-100" onClick={() => setIsAdminMenuOpen(false)}>
                            📊 Analytics
                          </Link>
                        </>
                      )}
                      
                      {user.role === 'employee' && (
                        <>
                          <Link to="/employee" className="block px-4 py-2 text-gray-700 hover:bg-gray-100" onClick={() => setIsAdminMenuOpen(false)}>
                            🍽️ Waiter Panel
                          </Link>
                          <Link to="/employee/orders" className="block px-4 py-2 text-gray-700 hover:bg-gray-100" onClick={() => setIsAdminMenuOpen(false)}>
                            📜 My Orders
                          </Link>
                        </>
                      )}
                      
                      <div className="border-t mt-1 pt-1">
                        <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100">
                          <FiLogOut className="inline mr-2" size={14} /> Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <Link to="/login" className="hidden md:block text-white hover:text-[#febd69] transition">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#232f3e] px-4 py-3 space-y-2">
          {/* Search Bar - Mobile */}
          <form onSubmit={handleSearch} className="mb-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search menu items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 rounded-lg focus:outline-none"
              />
              <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500">
                <FiSearch size={18} />
              </button>
            </div>
          </form>

          {user ? (
            <>
              <div className="flex items-center gap-2 pb-2 border-b border-gray-700">
                <FiUser className="text-white" />
                <span className="text-white">{user.name}</span>
                <span className="text-xs text-[#febd69] capitalize">{user.role}</span>
              </div>
              
              {user.role === 'manager' && (
                <>
                  <Link to="/manager" className="block text-white hover:text-[#febd69]" onClick={() => setIsMobileMenuOpen(false)}>📊 Dashboard</Link>
                  <Link to="/manager/employees" className="block text-white hover:text-[#febd69]" onClick={() => setIsMobileMenuOpen(false)}>👥 Employees</Link>
                  <Link to="/manager/menu" className="block text-white hover:text-[#febd69]" onClick={() => setIsMobileMenuOpen(false)}>🍔 Menu</Link>
                  <Link to="/manager/tables" className="block text-white hover:text-[#febd69]" onClick={() => setIsMobileMenuOpen(false)}>🪑 Tables</Link>
                  <Link to="/manager/orders" className="block text-white hover:text-[#febd69]" onClick={() => setIsMobileMenuOpen(false)}>📋 All Orders</Link>
                  <Link to="/manager/leave" className="block text-white hover:text-[#febd69]" onClick={() => setIsMobileMenuOpen(false)}>🏖️ Leave</Link>
                </>
              )}
              
              {user.role === 'employee' && (
                <>
                  <Link to="/employee" className="block text-white hover:text-[#febd69]" onClick={() => setIsMobileMenuOpen(false)}>🍽️ Waiter Panel</Link>
                  <Link to="/employee/orders" className="block text-white hover:text-[#febd69]" onClick={() => setIsMobileMenuOpen(false)}>📜 My Orders</Link>
                </>
              )}
              
              <button onClick={handleLogout} className="block w-full text-left text-red-400 hover:text-red-300 py-1">
                <FiLogOut className="inline mr-2" size={14} /> Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="block text-white hover:text-[#febd69]" onClick={() => setIsMobileMenuOpen(false)}>Sign In</Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;