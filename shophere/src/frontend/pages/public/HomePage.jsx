import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import { useCart } from '../../contexts/CartContext';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import { FiShoppingBag, FiTruck, FiShield, FiHeadphones, FiStar, FiArrowRight, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useWishlist } from '../../contexts/WishlistContext';
import { FiHeart } from 'react-icons/fi';

const HomePage = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [currentProducts, setCurrentProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist, getWishlistItemId } = useWishlist();

  const PRODUCTS_PER_PAGE = 40; // 40 products per page on home page

  useEffect(() => {
    fetchHomeData();
  }, []);

  useEffect(() => {
    // Update current page products when page changes
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
    const endIndex = startIndex + PRODUCTS_PER_PAGE;
    setCurrentProducts(allProducts.slice(startIndex, endIndex));
  }, [allProducts, currentPage]);

  const fetchHomeData = async () => {
    setLoading(true);

    const productsResult = await productService.getApprovedProducts();

    if (productsResult.success) {
      const allProductsData = productsResult.data;
      // Sort by newest first
      const sortedByNewest = [...allProductsData].sort((a, b) =>
        new Date(b.createdAt) - new Date(a.createdAt)
      );
      setAllProducts(sortedByNewest);
      setCurrentProducts(sortedByNewest.slice(0, PRODUCTS_PER_PAGE));
    }

    const categoriesResult = await categoryService.getAllCategories();
    if (categoriesResult.success) {
      setCategories(categoriesResult.data);
    }

    setLoading(false);
  };

  const totalPages = Math.ceil(allProducts.length / PRODUCTS_PER_PAGE);

  const goToPage = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
        <span className="text-xs text-gray-500">({numRating})</span>
      </div>
    );
  };

  const getImageUrl = (product) => {
    if (product.images && Array.isArray(product.images) && product.images.length > 0 && product.images[0]) {
      const imgUrl = product.images[0];
      if (imgUrl && (imgUrl.startsWith('http://') || imgUrl.startsWith('https://'))) {
        return imgUrl;
      }
    }
    return `https://picsum.photos/300/200?random=${product.id}`;
  };

  const features = [
    { icon: FiShoppingBag, title: 'Free Shipping', description: 'On orders over $50' },
    { icon: FiTruck, title: 'Fast Delivery', description: 'Within 24 hours' },
    { icon: FiShield, title: 'Secure Payment', description: '100% secure transactions' },
    { icon: FiHeadphones, title: '24/7 Support', description: 'Dedicated customer service' }
  ];

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

      <main>
        {/* Hero Banner */}
        <section className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome to ShopSphere</h1>
            <p className="text-xl mb-8 opacity-90">Your one-stop marketplace for everything you need</p>
            <Link to="/products" className="inline-block bg-primary text-white px-8 py-3 rounded-lg text-lg hover:bg-orange-600 transition transform hover:scale-105">
              Shop Now
              <FiArrowRight className="inline ml-2" />
            </Link>
          </div>
        </section>

        {/* Categories Section */}
        {categories.length > 0 && (
          <section className="py-12 bg-white">
            <div className="max-w-7xl mx-auto px-4">
              <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-8">Shop by Category</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {categories.map(cat => {
                  // Category-wise images mapping
                  const categoryImages = {
                    'Electronics': 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=150',
                    'Fashion': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=150',
                    'Home & Living': 'https://images.unsplash.com/photo-1615873968403-89e068629265?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8aG9tZSUyMGRlY29yfGVufDB8fDB8fHww',
                    'Books': 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=150',
                    'Sports': 'https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=150',
                  };

                  const defaultImage = 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=150';
                  const categoryImage = categoryImages[cat.name] || defaultImage;

                  return (
                    <Link
                      key={cat.id}
                      to={`/products?category=${encodeURIComponent(cat.name)}`}
                      className="group text-center p-4 bg-gray-50 rounded-lg hover:bg-primary transition hover:shadow-lg overflow-hidden"
                    >
                      <div className="w-20 h-20 mx-auto mb-3 rounded-full overflow-hidden bg-gray-200">
                        <img
                          src={categoryImage}
                          alt={cat.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          onError={(e) => {
                            e.target.src = 'https://picsum.photos/80/80?random=' + cat.id;
                          }}
                        />
                      </div>
                      <p className="text-gray-700 group-hover:text-white font-medium">{cat.name}</p>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* Products Section with Pagination */}
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Featured Products</h2>
              <Link to="/products" className="text-primary hover:text-orange-600 flex items-center gap-1">
                View All <FiArrowRight />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {currentProducts.map(product => (
                <div key={product.id} className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <Link to={`/product/${product.id}`}>
                    <div className="relative h-48 overflow-hidden bg-gray-100">
                      <img
                        src={getImageUrl(product)}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          e.target.src = `https://picsum.photos/300/200?random=${product.id}`;
                        }}
                      />
                      {product.discount > 0 && (
                        <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                          {product.discount}% OFF
                        </span>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-800 group-hover:text-primary transition line-clamp-1">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">{product.brand || 'Generic'}</p>
                      <div className="mt-2">
                        <StarRating rating={product.rating} />
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-xl font-bold text-primary">${Number(product.finalPrice).toFixed(2)}</span>
                        {product.discount > 0 && (
                          <span className="text-sm text-gray-400 line-through">${product.price}</span>
                        )}
                      </div>
                    </div>
                    <div className="absolute top-2 left-2 z-10">
                      <button
                        onClick={async (e) => {
                          e.preventDefault();
                          if (isInWishlist(product.id)) {
                            const wishlistId = getWishlistItemId(product.id);
                            await removeFromWishlist(wishlistId);
                          } else {
                            await addToWishlist(product);
                          }
                        }}
                        className="bg-white rounded-full p-2 shadow-md hover:scale-110 transition"
                      >
                        <FiHeart
                          size={18}
                          className={isInWishlist(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-500'}
                        />
                      </button>
                    </div>
                  </Link>
                  {/* <div className="px-4 pb-4">
                    <button
                      onClick={() => addToCart(product)}
                      disabled={product.stockQuantity === 0}
                      className="w-full bg-primary text-white py-2 rounded-lg hover:bg-orange-600 transition disabled:opacity-50"
                    >
                      Add to Cart
                    </button>
                  </div> */}
                </div>
              ))}
            </div>

            {/* Pagination for Home Page */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-10 flex-wrap">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
                >
                  <FiChevronLeft size={18} />
                </button>

                {[...Array(Math.min(totalPages, 10)).keys()].map(number => {
                  const pageNum = number + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => goToPage(pageNum)}
                      className={`w-10 h-10 rounded-lg transition ${currentPage === pageNum
                        ? 'bg-primary text-white'
                        : 'border border-gray-300 hover:bg-gray-50'
                        }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                {totalPages > 10 && <span className="px-2">...</span>}

                {totalPages > 10 && (
                  <button
                    onClick={() => goToPage(totalPages)}
                    className="w-10 h-10 rounded-lg border border-gray-300 hover:bg-gray-50 transition"
                  >
                    {totalPages}
                  </button>
                )}

                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
                >
                  <FiChevronRight size={18} />
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Features Section */}
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {features.map((Feature, index) => (
                <div key={index} className="text-center p-6 bg-gray-50 rounded-xl shadow-md hover:shadow-lg transition">
                  <Feature.icon size={48} className="text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{Feature.title}</h3>
                  <p className="text-gray-600">{Feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default HomePage;