import React, { useState, useEffect } from 'react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import { useAuth } from '../../contexts/AuthContext';
import { productService } from '../../services/productService';
import { FiCheck, FiX, FiEye, FiClock } from 'react-icons/fi';

const ProductApprovalPage = () => {
  const { user } = useAuth();
  const [pendingProducts, setPendingProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    fetchPendingProducts();
  }, []);

  const fetchPendingProducts = async () => {
    setLoading(true);
    const result = await productService.getPendingProducts();
    if (result.success) {
      setPendingProducts(result.data);
    }
    setLoading(false);
  };

  const handleApprove = async (productId) => {
    const result = await productService.approveProduct(productId);
    if (result.success) {
      setMessage('Product approved successfully! It is now visible to customers.');
      fetchPendingProducts();
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleReject = async (productId) => {
    const result = await productService.rejectProduct(productId);
    if (result.success) {
      setMessage('Product rejected!');
      fetchPendingProducts();
      setTimeout(() => setMessage(''), 3000);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8 min-h-screen">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Product Approval Queue</h1>
          <p className="text-gray-600 mt-2">Review and approve products submitted by sellers</p>
        </div>

        {message && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6">
            {message}
          </div>
        )}

        {pendingProducts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <FiClock className="mx-auto text-gray-400 text-5xl mb-4" />
            <p className="text-gray-500">No pending products for approval</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {pendingProducts.map(product => (
              <div key={product.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition">
                <div className="relative h-48">
                  <img
                    src={product.images?.[0] || 'https://via.placeholder.com/400'}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs">
                    Pending
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg text-gray-800 mb-1">{product.name}</h3>
                  <p className="text-sm text-gray-600">Seller: {product.sellerName}</p>
                  <p className="text-sm text-gray-600">Category: {product.category}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xl font-bold text-primary">${product.finalPrice}</span>
                    {product.discount > 0 && (
                      <span className="text-sm text-gray-400 line-through">${product.price}</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-2">Stock: {product.stockQuantity} units</p>
                  <p className="text-sm text-gray-500 mt-2 line-clamp-2">{product.description}</p>
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() => handleApprove(product.id)}
                      className="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition flex items-center justify-center gap-2"
                    >
                      <FiCheck /> Approve
                    </button>
                    <button
                      onClick={() => handleReject(product.id)}
                      className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition flex items-center justify-center gap-2"
                    >
                      <FiX /> Reject
                    </button>
                    <button
                      onClick={() => setSelectedProduct(product)}
                      className="bg-gray-500 text-white p-2 rounded-lg hover:bg-gray-600 transition"
                    >
                      <FiEye />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold">Product Details</h2>
              <button onClick={() => setSelectedProduct(null)} className="text-gray-500 hover:text-gray-700">
                <FiX size={24} />
              </button>
            </div>
            <div className="p-6">
              <img
                src={selectedProduct.images?.[0] || 'https://via.placeholder.com/400'}
                alt={selectedProduct.name}
                className="w-full h-64 object-cover rounded-lg mb-4"
              />
              <h3 className="font-bold text-2xl mb-2">{selectedProduct.name}</h3>
              <p className="text-gray-600 mb-2">Brand: {selectedProduct.brand}</p>
              <p className="text-gray-600 mb-2">Category: {selectedProduct.category}</p>
              <p className="text-gray-600 mb-2">Seller: {selectedProduct.sellerName}</p>
              <p className="text-2xl font-bold text-primary mb-2">${selectedProduct.finalPrice}</p>
              <p className="text-gray-700 mb-4">{selectedProduct.description}</p>
              <p className="text-gray-600">Stock: {selectedProduct.stockQuantity} units</p>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
};

export default ProductApprovalPage;