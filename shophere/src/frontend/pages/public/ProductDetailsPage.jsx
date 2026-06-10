import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import { productService } from '../../services/productService';
import { FiStar, FiShoppingCart, FiHeart, FiTruck, FiShield, FiRefreshCw } from 'react-icons/fi';

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  
  useEffect(() => {
    fetchProduct();
  }, [id]);
  
  const fetchProduct = async () => {
    setLoading(true);
    const result = await productService.getProductById(id);
    if (result.success) {
      setProduct(result.data);
    }
    setLoading(false);
  };
  
  const handleAddToCart = () => {
    // Will implement later
    alert('Added to cart!');
  };
  
  const handleBuyNow = () => {
    navigate('/checkout');
  };
  
  const StarRating = ({ rating }) => {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
        <div style={{ display: 'flex', gap: '2px' }}>
          {[1, 2, 3, 4, 5].map((star) => (
            <FiStar
              key={star}
              size={16}
              fill={star <= rating ? '#ffc107' : 'none'}
              color={star <= rating ? '#ffc107' : '#ddd'}
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
        <div style={styles.loader}>Loading product details...</div>
        <Footer />
      </>
    );
  }
  
  if (!product) {
    return (
      <>
        <Navbar />
        <div style={styles.loader}>Product not found</div>
        <Footer />
      </>
    );
  }
  
  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.productContainer}>
          {/* Product Images */}
          <div style={styles.imageSection}>
            <div style={styles.mainImage}>
              <img src={product.images?.[activeImage] || 'https://via.placeholder.com/400'} alt={product.name} />
            </div>
            <div style={styles.thumbnailList}>
              {product.images?.map((img, index) => (
                <div
                  key={index}
                  style={{
                    ...styles.thumbnail,
                    ...(activeImage === index ? styles.activeThumbnail : {})
                  }}
                  onClick={() => setActiveImage(index)}
                >
                  <img src={img} alt={`${product.name} ${index + 1}`} />
                </div>
              ))}
            </div>
          </div>
          
          {/* Product Info */}
          <div style={styles.infoSection}>
            <h1 style={styles.productName}>{product.name}</h1>
            <p style={styles.brand}>Brand: {product.brand}</p>
            <p style={styles.category}>Category: {product.category}</p>
            
            <div style={styles.rating}>
              <StarRating rating={product.rating} />
              <span style={styles.reviewCount}>({product.totalReviews || 0} reviews)</span>
            </div>
            
            <div style={styles.priceSection}>
              <span style={styles.currentPrice}>${product.finalPrice}</span>
              {product.discount > 0 && (
                <>
                  <span style={styles.originalPrice}>${product.price}</span>
                  <span style={styles.discount}>{product.discount}% OFF</span>
                </>
              )}
            </div>
            
            <p style={styles.description}>{product.description}</p>
            
            <div style={styles.stockInfo}>
              {product.stockQuantity > 0 ? (
                <span style={styles.inStock}>In Stock ({product.stockQuantity} available)</span>
              ) : (
                <span style={styles.outOfStock}>Out of Stock</span>
              )}
            </div>
            
            {/* Quantity Selector */}
            {product.stockQuantity > 0 && (
              <div style={styles.quantitySection}>
                <label>Quantity:</label>
                <div style={styles.quantityControls}>
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    style={styles.qtyBtn}
                  >
                    -
                  </button>
                  <span style={styles.qtyValue}>{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                    style={styles.qtyBtn}
                  >
                    +
                  </button>
                </div>
              </div>
            )}
            
            {/* Action Buttons */}
            <div style={styles.actionButtons}>
              <button
                onClick={handleAddToCart}
                style={styles.cartBtn}
                disabled={product.stockQuantity === 0}
              >
                <FiShoppingCart size={18} />
                Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                style={styles.buyBtn}
                disabled={product.stockQuantity === 0}
              >
                Buy Now
              </button>
              <button style={styles.wishlistBtn}>
                <FiHeart size={20} />
              </button>
            </div>
            
            {/* Delivery Info */}
            <div style={styles.deliveryInfo}>
              <div style={styles.deliveryItem}>
                <FiTruck size={20} color="#666" />
                <div>
                  <strong>Free Delivery</strong>
                  <p>On orders above $50</p>
                </div>
              </div>
              <div style={styles.deliveryItem}>
                <FiShield size={20} color="#666" />
                <div>
                  <strong>Secure Payment</strong>
                  <p>100% secure transactions</p>
                </div>
              </div>
              <div style={styles.deliveryItem}>
                <FiRefreshCw size={20} color="#666" />
                <div>
                  <strong>Easy Returns</strong>
                  <p>7 days return policy</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Seller Info */}
        <div style={styles.sellerSection}>
          <h3>Seller Information</h3>
          <div style={styles.sellerInfo}>
            <div>
              <strong>{product.sellerName || 'Verified Seller'}</strong>
              <p>Member since 2024</p>
            </div>
            <button style={styles.contactBtn}>Contact Seller</button>
          </div>
        </div>
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
  productContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '40px',
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  },
  imageSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  },
  mainImage: {
    width: '100%',
    height: '400px',
    border: '1px solid #eee',
    borderRadius: '8px',
    overflow: 'hidden'
  },
  thumbnailList: {
    display: 'flex',
    gap: '10px'
  },
  thumbnail: {
    width: '80px',
    height: '80px',
    border: '1px solid #eee',
    borderRadius: '5px',
    cursor: 'pointer',
    overflow: 'hidden'
  },
  activeThumbnail: {
    borderColor: '#ff6b35'
  },
  infoSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  },
  productName: {
    fontSize: '28px',
    color: '#333'
  },
  brand: {
    color: '#666'
  },
  category: {
    color: '#666'
  },
  rating: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  reviewCount: {
    color: '#666',
    fontSize: '14px'
  },
  priceSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px'
  },
  currentPrice: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#ff6b35'
  },
  originalPrice: {
    fontSize: '18px',
    color: '#999',
    textDecoration: 'line-through'
  },
  discount: {
    backgroundColor: '#ff6b35',
    color: 'white',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px'
  },
  description: {
    lineHeight: '1.6',
    color: '#555'
  },
  stockInfo: {
    marginTop: '10px'
  },
  inStock: {
    color: '#28a745'
  },
  outOfStock: {
    color: '#dc3545'
  },
  quantitySection: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    marginTop: '10px'
  },
  quantityControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  qtyBtn: {
    width: '30px',
    height: '30px',
    border: '1px solid #ddd',
    backgroundColor: 'white',
    cursor: 'pointer',
    borderRadius: '5px'
  },
  qtyValue: {
    width: '40px',
    textAlign: 'center',
    fontSize: '16px'
  },
  actionButtons: {
    display: 'flex',
    gap: '15px',
    marginTop: '20px'
  },
  cartBtn: {
    flex: 1,
    backgroundColor: '#ff6b35',
    color: 'white',
    padding: '12px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px'
  },
  buyBtn: {
    flex: 1,
    backgroundColor: '#28a745',
    color: 'white',
    padding: '12px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px'
  },
  wishlistBtn: {
    width: '45px',
    backgroundColor: 'white',
    border: '1px solid #ddd',
    borderRadius: '5px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  deliveryInfo: {
    marginTop: '20px',
    paddingTop: '20px',
    borderTop: '1px solid #eee'
  },
  deliveryItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    marginBottom: '15px'
  },
  sellerSection: {
    marginTop: '30px',
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  },
  sellerInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '15px'
  },
  contactBtn: {
    padding: '8px 20px',
    border: '1px solid #ff6b35',
    backgroundColor: 'white',
    color: '#ff6b35',
    borderRadius: '5px',
    cursor: 'pointer'
  },
  loader: {
    textAlign: 'center',
    padding: '100px',
    fontSize: '18px'
  }
};

export default ProductDetailsPage;