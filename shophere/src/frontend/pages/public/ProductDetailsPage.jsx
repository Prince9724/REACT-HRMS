import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import { useCart } from '../../contexts/CartContext';
import { useWishlist } from '../../contexts/WishlistContext';
import { useAuth } from '../../contexts/AuthContext';
import { FiStar, FiShoppingCart, FiHeart, FiTruck, FiShield, FiRefreshCw, FiZap, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist, getWishlistItemId } = useWishlist();
  const { user } = useAuth();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (product) {
      setIsWishlisted(isInWishlist(product.id));
    }
  }, [product, isInWishlist]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`http://localhost:5000/products/${id}`);
      const data = await response.json();
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
    navigate('/checkout');
  };

  const handleWishlistToggle = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (isWishlisted) {
      const wishlistId = getWishlistItemId(product.id);
      await removeFromWishlist(wishlistId);
      setIsWishlisted(false);
    } else {
      await addToWishlist(product);
      setIsWishlisted(true);
    }
  };

  // Get all images from product
  const getAllImages = () => {
    const images = [];
    if (product.images && Array.isArray(product.images)) {
      for (let img of product.images) {
        if (img && img.trim() !== '') {
          images.push(img);
        }
      }
    }
    // If no images, add placeholder
    if (images.length === 0) {
      images.push(`https://picsum.photos/500/500?random=${product?.id}`);
    }
    return images;
  };

  const nextImage = () => {
    const images = getAllImages();
    setActiveImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    const images = getAllImages();
    setActiveImage((prev) => (prev - 1 + images.length) % images.length);
  };

  const StarRating = ({ rating }) => {
    const numRating = Number(rating) || 0;
    return (
      <div className="flex items-center space-x-1">
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <FiStar
              key={star}
              size={16}
              className={star <= numRating ? 'text-yellow-400 fill-current' : 'text-gray-300'}
            />
          ))}
        </div>
        <span className="text-sm text-gray-500">({numRating} reviews)</span>
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

  const images = getAllImages();
  const hasMultipleImages = images.length > 1;

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8 min-h-screen">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
            {/* Product Images Gallery */}
            <div>
              {/* Main Image with Navigation */}
              <div className="relative h-96 bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={images[activeImage]}
                  alt={product.name}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.target.src = `https://picsum.photos/500/500?random=${product.id}`;
                  }}
                />
                
                {/* Image Navigation Arrows */}
                {hasMultipleImages && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition"
                    >
                      <FiChevronLeft size={20} />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition"
                    >
                      <FiChevronRight size={20} />
                    </button>
                  </>
                )}
                
                {product.discount > 0 && (
                  <span className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    {product.discount}% OFF
                  </span>
                )}
                
                {/* Wishlist Heart Button */}
                <button
                  onClick={handleWishlistToggle}
                  className="absolute top-4 left-4 bg-white rounded-full p-2 shadow-md hover:scale-110 transition"
                >
                  <FiHeart 
                    size={20} 
                    className={isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-500'} 
                  />
                </button>
              </div>
              
              {/* Thumbnail Images */}
              {hasMultipleImages && (
                <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                  {images.map((img, index) => (
                    <div
                      key={index}
                      onClick={() => setActiveImage(index)}
                      className={`w-20 h-20 rounded-lg overflow-hidden cursor-pointer border-2 flex-shrink-0 ${
                        activeImage === index ? 'border-primary' : 'border-gray-200'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${product.name} view ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = `https://picsum.photos/100/100?random=${product.id}${index}`;
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
              
              {/* Image Count Indicator */}
              {hasMultipleImages && (
                <div className="text-center mt-2 text-sm text-gray-500">
                  {activeImage + 1} / {images.length} images
                </div>
              )}
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