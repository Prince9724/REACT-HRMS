import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import { useCart } from '../../contexts/CartContext';
import { FiSearch, FiStar, FiFilter, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const ProductListingPage = () => {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 5000 });
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  
  const { addToCart } = useCart();
  const productsPerPage = 30; // 30 products per page

  // Get category from URL query params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get('category');
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [location.search]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterAndSortProducts();
  }, [searchTerm, selectedCategory, priceRange, sortBy, products]);

  const fetchData = async () => {
    try {
      const productRes = await fetch('http://localhost:5000/products?status=approved');
      const productData = await productRes.json();
      console.log('Products fetched:', productData.length);
      setProducts(productData);
      setFilteredProducts(productData);

      const catRes = await fetch('http://localhost:5000/categories');
      const catData = await catRes.json();
      setCategories(catData);
      
      // Set max price range based on products
      const maxPrice = Math.max(...productData.map(p => p.finalPrice), 5000);
      setPriceRange({ min: 0, max: maxPrice });
    } catch (err) {
      console.error('Error:', err);
    }
    setLoading(false);
  };

  const filterAndSortProducts = () => {
    let filtered = [...products];

    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.brand && p.brand.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    filtered = filtered.filter(p =>
      p.finalPrice >= priceRange.min && p.finalPrice <= priceRange.max
    );

    if (sortBy === 'newest') {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === 'price-low') {
      filtered.sort((a, b) => a.finalPrice - b.finalPrice);
    } else if (sortBy === 'price-high') {
      filtered.sort((a, b) => b.finalPrice - a.finalPrice);
    }

    setFilteredProducts(filtered);
    setCurrentPage(1);
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const goToPage = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getImageUrl = (product) => {
    if (product.images && product.images[0] && product.images[0].startsWith('http')) {
      return product.images[0];
    }
    return `https://picsum.photos/300/200?random=${product.id}`;
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

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {selectedCategory ? `${selectedCategory} Products` : 'All Products'}
          </h1>
          <p className="text-gray-600">Discover amazing products from trusted sellers</p>
        </div>

        <div className="relative mb-6">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search products by name or brand..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className="md:hidden flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg mb-4"
        >
          <FiFilter /> {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full md:w-56 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.name}>{cat.name}</option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full md:w-56 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="newest">Newest First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>

        {/* Price Range Filter - Always Visible */}
        <div className="bg-white p-5 rounded-lg shadow-md mb-6 border border-gray-200">
          <h3 className="font-semibold text-gray-800 mb-4">Price Range: ${priceRange.min} - ${priceRange.max}</h3>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="text-sm text-gray-600 block mb-1">Min Price ($)</label>
              <input
                type="range"
                min={0}
                max={5000}
                value={priceRange.min}
                onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                className="w-full"
              />
              <input
                type="number"
                value={priceRange.min}
                onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                className="w-full mt-2 p-2 border border-gray-300 rounded-lg"
                placeholder="Min"
              />
            </div>
            <div className="flex-1">
              <label className="text-sm text-gray-600 block mb-1">Max Price ($)</label>
              <input
                type="range"
                min={0}
                max={5000}
                value={priceRange.max}
                onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                className="w-full"
              />
              <input
                type="number"
                value={priceRange.max}
                onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                className="w-full mt-2 p-2 border border-gray-300 rounded-lg"
                placeholder="Max"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={() => setPriceRange({ min: 0, max: 5000 })}
                className="px-4 py-2 text-sm bg-gray-200 rounded-lg hover:bg-gray-300 transition"
              >
                Reset Price
              </button>
            </div>
          </div>
        </div>

        {currentProducts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-500">No products found matching your criteria</p>
          </div>
        ) : (
          <>
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
                      {product.stockQuantity <= 5 && product.stockQuantity > 0 && (
                        <span className="absolute top-2 left-2 bg-orange-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                          Only {product.stockQuantity} left
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
                        <span className="text-xl font-bold text-primary">${product.finalPrice}</span>
                        {product.discount > 0 && (
                          <span className="text-sm text-gray-400 line-through">${product.price}</span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 mt-1">{product.category}</p>
                    </div>
                  </Link>
                  <div className="px-4 pb-4">
                    <button
                      onClick={() => addToCart(product)}
                      disabled={product.stockQuantity === 0}
                      className="w-full bg-primary text-white py-2 rounded-lg hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-10 flex-wrap">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
                >
                  <FiChevronLeft size={18} />
                </button>
                
                {[...Array(totalPages).keys()].slice(0, 10).map(number => {
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
                
                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
                >
                  <FiChevronRight size={18} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
      <Footer />
    </>
  );
};

export default ProductListingPage;