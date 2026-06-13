import React, { createContext, useState, useContext, useEffect } from 'react';
import { wishlistService } from '../services/wishlistService';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within WishlistProvider');
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Load wishlist on user login
  useEffect(() => {
    if (user?.id) {
      fetchWishlist();
    } else {
      setWishlistItems([]);
      setWishlistCount(0);
    }
  }, [user?.id]);

  const fetchWishlist = async () => {
    setLoading(true);
    const result = await wishlistService.getUserWishlist(user?.id);
    if (result.success) {
      setWishlistItems(result.data);
      setWishlistCount(result.data.length);
    }
    setLoading(false);
  };

  // Add to wishlist
  const addToWishlist = async (product) => {
    const wishlistItem = {
      userId: user?.id,
      productId: product.id,
      productName: product.name,
      productPrice: product.finalPrice,
      productImage: product.images?.[0] || '',
      productCategory: product.category,
      productBrand: product.brand,
      productDiscount: product.discount,
      productOriginalPrice: product.price
    };
    
    const result = await wishlistService.addToWishlist(wishlistItem);
    if (result.success) {
      await fetchWishlist();
      return { success: true, message: 'Added to wishlist' };
    }
    return { success: false, message: result.error };
  };

  // Remove from wishlist
  const removeFromWishlist = async (wishlistId) => {
    const result = await wishlistService.removeFromWishlist(wishlistId);
    if (result.success) {
      await fetchWishlist();
      return { success: true, message: 'Removed from wishlist' };
    }
    return { success: false, message: result.error };
  };

  // Check if product is in wishlist
  const isInWishlist = (productId) => {
    return wishlistItems.some(item => item.productId === productId);
  };

  // Get wishlist item id by product id
  const getWishlistItemId = (productId) => {
    const item = wishlistItems.find(item => item.productId === productId);
    return item?.id;
  };

  const value = {
    wishlistItems,
    wishlistCount,
    loading,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    getWishlistItemId,
    fetchWishlist
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};