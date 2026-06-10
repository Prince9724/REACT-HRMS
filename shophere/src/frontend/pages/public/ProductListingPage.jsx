import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import { FiSearch, FiStar, FiFilter, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const ProductListingPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 2000 });
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  
  const productsPerPage = 8;
  
  useEffect(() => {
    fetchData();
  }, []);
  
  useEffect(() => {
    filterAndSortProducts();
  }, [products, searchTerm, selectedCategory, priceRange, sortBy]);
  
  const fetchData = async () => {
    setLoading(true);
    const productsResult = await productService.getApprovedProducts();
    const categoriesResult = await categoryService.getAllCategories();
    
    if (productsResult.success) {
      setProducts(productsResult.data);
    }
    if (categoriesResult.success) {
      setCategories(categoriesResult.data);
    }
    setLoading(false);
  };
  
  const filterAndSortProducts = () => {
    let filtered = [...products];
    
    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }
    
    // Price filter
    filtered = filtered.filter(product => 
      product.finalPrice >= priceRange.min && product.finalPrice <= priceRange.max
    );
    
    // Sorting
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.finalPrice - b.finalPrice);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.finalPrice - a.finalPrice);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      default:
        break;
    }
    
    setFilteredProducts(filtered);
    setCurrentPage(1);
  };
  
  // Pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  // Star rating component
  const StarRating = ({ rating }) => {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
        <div style={{ display: 'flex', gap: '2px' }}>
          {[1, 2, 3, 4, 5].map((star) => (
            <FiStar
              key={star}
              size={14}
              fill={star <= rating ? '#ffc107' : 'none'}
              color={star <= rating ? '#ffc107' : '#ddd'}
            />
          ))}
        </div>
        <span style={{ fontSize: '12px', color: '#666' }}>({rating || 0})</span>
      </div>
    );
  };
  
  if (loading) {
    return (
      <>
        <Navbar />
        <div style={styles.loader}>Loading products...</div>
        <Footer />
      </>
    );
  }
  
  return (
    <>
      <Navbar />
      <div style={styles.container}>
        {/* Page Header */}
        <div style={styles.pageHeader}>
          <h1>All Products</h1>
          <p>Discover amazing products from trusted sellers</p>
        </div>
        
        {/* Search and Filter Bar */}
        <div style={styles.searchBar}>
          <div style={styles.searchInput}>
            <FiSearch size={20} color="#999" />
            <input
              type="text"
              placeholder="Search products by name or brand..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button style={styles.filterToggle} onClick={() => setShowFilters(!showFilters)}>
            <FiFilter size={18} />
            Filters
          </button>
        </div>
        
        {/* Main Content */}
        <div style={styles.mainContent}>
          {/* Filters Sidebar */}
          {(showFilters || window.innerWidth > 768) && (
            <div style={styles.filters}>
              {/* Category Filter */}
              <div style={styles.filterSection}>
                <h3>Categories</h3>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  style={styles.select}
                >
                  <option value="">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>
              
              {/* Price Filter */}
              <div style={styles.filterSection}>
                <h3>Price Range</h3>
                <div style={styles.priceInputs}>
                  <input
                    type="number"
                    placeholder="Min"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                  />
                  <span>-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                  />
                </div>
              </div>
              
              {/* Sort By */}
              <div style={styles.filterSection}>
                <h3>Sort By</h3>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={styles.select}
                >
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>
          )}
          
          {/* Products Grid */}
          <div style={styles.productsGrid}>
            {currentProducts.length === 0 ? (
              <div style={styles.noProducts}>
                <p>No products found</p>
              </div>
            ) : (
              currentProducts.map(product => (
                <Link to={`/product/${product.id}`} key={product.id} style={styles.productCard}>
                  <div style={styles.productImage}>
                    <img src={product.images?.[0]} alt={product.name} />
                    {product.discount > 0 && (
                      <span style={styles.discountBadge}>{product.discount}% OFF</span>
                    )}
                  </div>
                  <div style={styles.productInfo}>
                    <h3>{product.name}</h3>
                    <p style={styles.brand}>{product.brand}</p>
                    <StarRating rating={product.rating} />
                    <div style={styles.price}>
                      <span style={styles.currentPrice}>${product.finalPrice}</span>
                      {product.discount > 0 && (
                        <span style={styles.originalPrice}>${product.price}</span>
                      )}
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div style={styles.pagination}>
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              style={styles.pageBtn}
            >
              <FiChevronLeft />
            </button>
            {[...Array(totalPages).keys()].map(number => (
              <button
                key={number + 1}
                onClick={() => paginate(number + 1)}
                style={{
                  ...styles.pageBtn,
                  ...(currentPage === number + 1 ? styles.activePage : {})
                }}
              >
                {number + 1}
              </button>
            ))}
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              style={styles.pageBtn}
            >
              <FiChevronRight />
            </button>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '30px 20px',
    minHeight: 'calc(100vh - 200px)'
  },
  pageHeader: {
    textAlign: 'center',
    marginBottom: '30px'
  },
  pageHeader: {
    textAlign: 'center',
    marginBottom: '30px'
  },
  searchBar: {
    display: 'flex',
    gap: '15px',
    marginBottom: '30px'
  },
  searchInput: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '12px 15px',
    backgroundColor: 'white'
  },
  searchInput: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '12px 15px',
    backgroundColor: 'white'
  },
  filterToggle: {
    padding: '12px 20px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: 'white',
    cursor: 'pointer',
    display: 'none'
  },
  mainContent: {
    display: 'flex',
    gap: '30px'
  },
  filters: {
    width: '250px',
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    height: 'fit-content'
  },
  filterSection: {
    marginBottom: '20px'
  },
  filterSection: {
    marginBottom: '20px'
  },
  select: {
    width: '100%',
    padding: '8px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    marginTop: '8px'
  },
  priceInputs: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
    marginTop: '8px'
  },
  productsGrid: {
    flex: 1,
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '20px'
  },
  productCard: {
    backgroundColor: 'white',
    borderRadius: '8px',
    overflow: 'hidden',
    textDecoration: 'none',
    color: '#333',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease'
  },
  productImage: {
    position: 'relative',
    height: '200px',
    overflow: 'hidden',
    backgroundColor: '#f5f5f5'
  },
  discountBadge: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    backgroundColor: '#ff6b35',
    color: 'white',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px'
  },
  productInfo: {
    padding: '15px'
  },
  brand: {
    fontSize: '12px',
    color: '#666',
    marginBottom: '5px'
  },
  price: {
    marginTop: '10px'
  },
  currentPrice: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#ff6b35'
  },
  originalPrice: {
    fontSize: '14px',
    color: '#999',
    textDecoration: 'line-through',
    marginLeft: '8px'
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    gap: '8px',
    marginTop: '40px'
  },
  pageBtn: {
    padding: '8px 14px',
    border: '1px solid #ddd',
    backgroundColor: 'white',
    cursor: 'pointer',
    borderRadius: '5px'
  },
  activePage: {
    backgroundColor: '#ff6b35',
    color: 'white',
    borderColor: '#ff6b35'
  },
  loader: {
    textAlign: 'center',
    padding: '100px',
    fontSize: '18px'
  },
  noProducts: {
    textAlign: 'center',
    padding: '50px',
    fontSize: '16px',
    color: '#666'
  }
};

export default ProductListingPage;