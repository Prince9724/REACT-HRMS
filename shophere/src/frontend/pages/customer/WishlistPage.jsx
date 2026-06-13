import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import { useWishlist } from '../../contexts/WishlistContext';
import { useCart } from '../../contexts/CartContext';
import { FiHeart, FiShoppingCart, FiTrash2, FiStar } from 'react-icons/fi';

const WishlistPage = () => {
  const { wishlistItems, loading, removeFromWishlist, fetchWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleMoveToCart = async (item) => {
    const product = {
      id: item.productId,
      name: item.productName,
      finalPrice: item.productPrice,
      images: [item.productImage],
      stockQuantity: 10
    };
    addToCart(product, 1);
    await removeFromWishlist(item.id);
  };

  const StarRating = ({ rating }) => {
    const numRating = Number(rating) || 0;
    return (
      <div className="flex items-center space-x-1">
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <FiStar
              key={star}
              size={14}
              className={star <= numRating ? 'text-yellow-400 fill-current' : 'text-gray-300'}
            />
          ))}
        </div>
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
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8 min-h-screen">
        <div className="flex items-center gap-3 mb-8">
          <FiHeart size={28} className="text-primary" />
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">My Wishlist</h1>
          <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm">
            {wishlistItems.length} items
          </span>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow">
            <FiHeart size={64} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg mb-2">Your wishlist is empty</p>
            <p className="text-gray-400 mb-6">Save your favorite items here</p>
            <Link to="/products" className="bg-primary text-white px-6 py-2 rounded-lg inline-block hover:bg-orange-600 transition">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map(item => (
              <div key={item.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition group">
                <Link to={`/product/${item.productId}`}>
                  <div className="relative h-48 overflow-hidden bg-gray-100">
                    <img
                      src={item.productImage || `https://picsum.photos/300/200?random=${item.productId}`}
                      alt={item.productName}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                      onError={(e) => {
                        e.target.src = `https://picsum.photos/300/200?random=${item.productId}`;
                      }}
                    />
                    {item.productDiscount > 0 && (
                      <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        {item.productDiscount}% OFF
                      </span>
                    )}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        removeFromWishlist(item.id);
                      }}
                      className="absolute top-2 left-2 bg-white rounded-full p-2 shadow-md hover:bg-red-50 transition"
                    >
                      <FiTrash2 size={16} className="text-red-500" />
                    </button>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 group-hover:text-primary transition line-clamp-1">
                      {item.productName}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">{item.productBrand || 'Generic'}</p>
                    <p className="text-sm text-gray-500">{item.productCategory}</p>
                    <div className="mt-2">
                      <StarRating rating={4} />
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-xl font-bold text-primary">${item.productPrice}</span>
                      {item.productDiscount > 0 && (
                        <span className="text-sm text-gray-400 line-through">${item.productOriginalPrice}</span>
                      )}
                    </div>
                  </div>
                </Link>
                <div className="px-4 pb-4">
                  <button
                    onClick={() => handleMoveToCart(item)}
                    className="w-full bg-primary text-white py-2 rounded-lg hover:bg-orange-600 transition flex items-center justify-center gap-2"
                  >
                    <FiShoppingCart size={16} /> Move to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default WishlistPage;