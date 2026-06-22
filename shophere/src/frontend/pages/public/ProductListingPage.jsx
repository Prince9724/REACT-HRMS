import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';  // ✅ YEH IMPORT ADD KIYA
import { useWishlist } from '../../contexts/WishlistContext';
import { FiSearch, FiStar, FiFilter, FiChevronLeft, FiChevronRight, FiHeart } from 'react-icons/fi';

const ProductListingPage = () => {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const { addToWishlist, removeFromWishlist, isInWishlist, getWishlistItemId } = useWishlist();

  const { addToCart } = useCart();
  const { user } = useAuth();  // ✅ YEH LINE ADD KIYA
  const productsPerPage = 30;

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
      setLoading(true);
      console.log("Fetching products...");

      const productRes = await fetch('http://localhost:5000/products?status=approved');
      const productData = await productRes.json();
      console.log('Products fetched:', productData.length);

      const validProducts = productData.filter(p => {
        const price = Number(p.finalPrice);
        return !isNaN(price) && price > 0 && p.status === 'approved';
      });

      console.log('Valid products count:', validProducts.length);
      setProducts(validProducts);
      setFilteredProducts(validProducts);

      if (validProducts.length > 0) {
        const prices = validProducts.map(p => Number(p.finalPrice)).filter(price => !isNaN(price));
        if (prices.length > 0) {
          const maxPrice = Math.max(...prices);
          setPriceRange({ min: 0, max: maxPrice });
        }
      }

      const catRes = await fetch('http://localhost:5000/categories');
      const catData = await catRes.json();
      setCategories(catData);

    } catch (err) {
      console.error('Error fetching products:', err);
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

    filtered = filtered.filter(p => {
      const price = Number(p.finalPrice);
      return price >= priceRange.min && price <= priceRange.max;
    });

    if (sortBy === 'newest') {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === 'price-low') {
      filtered.sort((a, b) => Number(a.finalPrice) - Number(b.finalPrice));
    } else if (sortBy === 'price-high') {
      filtered.sort((a, b) => Number(b.finalPrice) - Number(a.finalPrice));
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
    if (product.images && Array.isArray(product.images) && product.images.length > 0 && product.images[0]) {
      const imgUrl = product.images[0];
      if (imgUrl && (imgUrl.startsWith('http://') || imgUrl.startsWith('https://'))) {
        return imgUrl;
      }
    }
    return `https://picsum.photos/300/200?random=${product.id}`;
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

  if (products.length === 0) {
    return (
      <>
        <Navbar />
        <div className="text-center py-12">
          <p className="text-gray-500">No products available</p>
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
          {user?.role === 'admin' && (
            <p className="text-sm text-primary mt-1">{filteredProducts.length} products available</p>
          )}
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

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full md:w-56 p-2 border border-gray-300 rounded-lg"
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.name}>{cat.name}</option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full md:w-56 p-2 border border-gray-300 rounded-lg"
          >
            <option value="newest">Newest First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {currentProducts.map(product => (
  <div key={product.id} className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition">
    <Link to={`/product/${product.id}`}>
      <div className="relative h-48 overflow-hidden bg-gray-100">
        <img
          src={getImageUrl(product)}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition"
          onError={(e) => {
            e.target.src = `https://picsum.photos/300/200?random=${product.id}`;
          }}
        />
        {product.discount > 0 && (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
            {product.discount}% OFF
          </span>
        )}
        
        {/* ✅ WISHLIST BUTTON */}
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
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 line-clamp-1">{product.name}</h3>
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
    </Link>
    <div className="px-4 pb-4">
      <button
        onClick={() => addToCart(product)}
        disabled={product.stockQuantity === 0}
        className="w-full bg-primary text-white py-2 rounded-lg hover:bg-orange-600 transition disabled:opacity-50"
      >
        Add to Cart
      </button>
    </div>
  </div>
))}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-10">
            <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} className="p-2 border rounded-lg">
              <FiChevronLeft />
            </button>
            <span className="px-4 py-2">Page {currentPage} of {totalPages}</span>
            <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages} className="p-2 border rounded-lg">
              <FiChevronRight />
            </button>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default ProductListingPage;