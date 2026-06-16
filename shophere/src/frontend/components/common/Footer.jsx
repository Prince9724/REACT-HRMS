import React from 'react';
import { Link } from 'react-router-dom';
import { FiFacebook, FiTwitter, FiInstagram, FiGithub } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-secondary text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold text-primary mb-3">ShopSphere</h3>
            <p className="text-gray-300 text-sm">Your trusted marketplace for quality products from verified sellers.</p>
            <div className="flex space-x-4 mt-4">
              <a href=""><FiFacebook className="cursor-pointer hover:text-primary" size={20} /></a>
              <FiTwitter className="cursor-pointer hover:text-primary" size={20} />
              <FiInstagram className="cursor-pointer hover:text-primary" size={20} />
              <FiGithub className="cursor-pointer hover:text-primary" size={20} />
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link to="/" className="hover:text-primary">Home</Link></li>
              <li><Link to="/products" className="hover:text-primary">Products</Link></li>
              <li><Link to="/about" className="hover:text-primary">About Us</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Customer Service</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link to="/faq" className="hover:text-primary">FAQ</Link></li>
              <li><Link to="/returns" className="hover:text-primary">Returns Policy</Link></li>
              <li><Link to="/shipping" className="hover:text-primary">Shipping Info</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Contact Info</h4>
            <p className="text-sm text-gray-300">Email: support@shopsphere.com</p>
            <p className="text-sm text-gray-300">Phone: +1 234 567 890</p>
            <p className="text-sm text-gray-300">Address: 123 Market Street, NY</p>
          </div>
        </div>
        <div className="text-center pt-6 mt-6 border-t border-gray-700 text-sm text-gray-400">
          <p>&copy; 2024 ShopSphere. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

///1917 * 885 