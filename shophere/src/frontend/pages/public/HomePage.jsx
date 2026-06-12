import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import { FiShoppingBag, FiTruck, FiShield, FiHeadphones, FiStar, FiArrowRight } from 'react-icons/fi';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Configurable limits - Future mein badha sakte ho
  const FEATURED_LIMIT = 12;  // 12 products dikhenge
  const NEW_ARRIVALS_LIMIT = 12;  // 12 products dikhenge

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    setLoading(true);
    
    const productsResult = await productService.getApprovedProducts();
    
    if (productsResult.success) {
      const allProducts = productsResult.data;
      
      // Sort by newest first
      const sortedByNewest = [...allProducts].sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );
      
      // Featured products = newest products (up to FEATURED_LIMIT)
      setFeaturedProducts(sortedByNewest.slice(0, FEATURED_LIMIT));
      
      // New arrivals = next products (up to NEW_ARRIVALS_LIMIT)
      setNewArrivals(sortedByNewest.slice(FEATURED_LIMIT, FEATURED_LIMIT + NEW_ARRIVALS_LIMIT));
    }
    
    // Categories - saari dikhao
    const categoriesResult = await categoryService.getAllCategories();
    if (categoriesResult.success) {
      setCategories(categoriesResult.data);
    }
    
    setLoading(false);
  };

  const StarRating = ({ rating }) => {
    return (
      <div className="flex items-center space-x-1">
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <FiStar
              key={star}
              size={14}
              className={star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}
            />
          ))}
        </div>
        <span className="text-xs text-gray-500">({rating || 0})</span>
      </div>
    );
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
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {categories.map(cat => (
                  <Link
                    key={cat.id}
                    to={`/products?category=${cat.name}`}
                    className="group text-center p-4 bg-gray-50 rounded-lg hover:bg-primary transition hover:shadow-lg"
                  >
                    <div className="text-3xl mb-2 group-hover:text-white">📂</div>
                    <p className="text-gray-700 group-hover:text-white">{cat.name}</p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Featured Products - Newest Products */}
        {featuredProducts.length > 0 && (
          <section className="py-12 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Featured Products</h2>
                <Link to="/products" className="text-primary hover:text-orange-600 flex items-center gap-1">
                  View All <FiArrowRight />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6">
                {featuredProducts.map(product => (
                  <Link to={`/product/${product.id}`} key={product.id} className="group">
                    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1">
                      <div className="relative h-48 overflow-hidden bg-gray-100">
                        <img
                          src={product.images?.[0] || 'https://via.placeholder.com/300'}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        {product.discount > 0 && (
                          <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                            {product.discount}% OFF
                          </span>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-800 group-hover:text-primary transition line-clamp-1">
                          {product.name}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">{product.brand}</p>
                        <div className="mt-2">
                          <StarRating rating={product.rating} />
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                          <span className="text-lg font-bold text-primary">${product.finalPrice}</span>
                          {product.discount > 0 && (
                            <span className="text-sm text-gray-400 line-through">${product.price}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* New Arrivals */}
        {newArrivals.length > 0 && (
          <section className="py-12 bg-white">
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800">New Arrivals</h2>
                <Link to="/products" className="text-primary hover:text-orange-600 flex items-center gap-1">
                  View All <FiArrowRight />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6">
                {newArrivals.map(product => (
                  <Link to={`/product/${product.id}`} key={product.id} className="group">
                    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1">
                      <div className="relative h-48 overflow-hidden bg-gray-100">
                        <img
                          src={product.images?.[0] || 'https://via.placeholder.com/300'}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <span className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                          New
                        </span>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-800 group-hover:text-primary transition line-clamp-1">
                          {product.name}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">{product.brand}</p>
                        <div className="mt-2">
                          <StarRating rating={product.rating} />
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                          <span className="text-lg font-bold text-primary">${product.finalPrice}</span>
                          {product.discount > 0 && (
                            <span className="text-sm text-gray-400 line-through">${product.price}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Features Section */}
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {features.map((Feature, index) => (
                <div key={index} className="text-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition">
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

// const FEATURED_LIMIT = 30;  // 30 products dikhenge
// const NEW_ARRIVALS_LIMIT = 30;  // 30 products dikhenge