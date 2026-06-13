import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import { useCart } from '../../contexts/CartContext';
import { FiStar, FiShoppingCart, FiHeart, FiTruck, FiShield, FiRefreshCw, FiZap } from 'react-icons/fi';

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`http://localhost:5000/products/${id}`);
      const data = await response.json();
      console.log('Product fetched:', data);
      setProduct(data);
    } catch (err) {
      console.error('Error:', err);
    }
    setLoading(false);
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/dummy-checkout'); // Dummy page for now
  };

  // Function to get working image URL
  const getProductImage = () => {
    if (product.images && product.images[0]) {
      // Check if URL is valid
      const url = product.images[0];
      if (url.startsWith('http://') || url.startsWith('https://')) {
        return url;
      }
    }
    // Fallback images based on category
    const fallbackImages = {
      'Electronics': 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400',
      'Fashion': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
      'Books': 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=400',
      'Sports': 'https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=400',
    };
    return fallbackImages[product?.category] || `https://picsum.photos/400/400?random=${id}`;
  };

  const StarRating = ({ rating }) => {
    return (
      <div className="flex items-center space-x-1">
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <FiStar
              key={star}
              size={16}
              className={star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}
            />
          ))}
        </div>
        <span className="text-sm text-gray-500">({rating || 0} reviews)</span>
      </div>
    );
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <div className="text-center py-12">Product not found</div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8 min-h-screen">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
            {/* Product Images */}
            <div>
              <div className="relative h-96 bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={getProductImage()}
                  alt={product.name}
                  className="w-full h-full object-contain"
                />
                {product.discount > 0 && (
                  <span className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    {product.discount}% OFF
                  </span>
                )}
              </div>
            </div>

            {/* Product Info */}
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>
              <p className="text-gray-500 mb-2">Brand: {product.brand || 'Generic'}</p>
              <p className="text-gray-500 mb-4">Category: {product.category}</p>
              
              <div className="mb-4">
                <StarRating rating={product.rating} />
              </div>
              
              <div className="mb-4">
                <span className="text-3xl font-bold text-primary">${product.finalPrice}</span>
                {product.discount > 0 && (
                  <>
                    <span className="text-lg text-gray-400 line-through ml-2">${product.price}</span>
                    <span className="ml-2 text-green-600 font-semibold">Save ${(product.price - product.finalPrice).toFixed(2)}</span>
                  </>
                )}
              </div>
              
              <div className="mb-4">
                {product.stockQuantity > 0 ? (
                  <span className="text-green-600 font-semibold">In Stock ({product.stockQuantity} available)</span>
                ) : (
                  <span className="text-red-600 font-semibold">Out of Stock</span>
                )}
              </div>
              
              <p className="text-gray-600 mb-6 leading-relaxed">{product.description}</p>
              
              {/* Quantity Selector */}
              {product.stockQuantity > 0 && (
                <div className="flex items-center gap-4 mb-6">
                  <span className="font-medium">Quantity:</span>
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-2 border-r border-gray-300 hover:bg-gray-100"
                    >
                      -
                    </button>
                    <span className="px-6 py-2">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                      className="px-3 py-2 border-l border-gray-300 hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stockQuantity === 0}
                  className="flex-1 bg-primary text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <FiShoppingCart size={20} />
                  {addedToCart ? 'Added to Cart!' : 'Add to Cart'}
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={product.stockQuantity === 0}
                  className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <FiZap size={20} />
                  Buy Now
                </button>
                <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                  <FiHeart size={20} className="text-gray-600" />
                </button>
              </div>
              
              {/* Delivery Info */}
              <div className="border-t border-gray-200 pt-4 space-y-3">
                <div className="flex items-center gap-3">
                  <FiTruck size={20} className="text-primary" />
                  <div>
                    <p className="font-medium">Free Delivery</p>
                    <p className="text-sm text-gray-500">On orders above $50</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FiShield size={20} className="text-primary" />
                  <div>
                    <p className="font-medium">Secure Payment</p>
                    <p className="text-sm text-gray-500">100% secure transactions</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FiRefreshCw size={20} className="text-primary" />
                  <div>
                    <p className="font-medium">Easy Returns</p>
                    <p className="text-sm text-gray-500">7 days return policy</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};
export default ProductDetailsPage;
