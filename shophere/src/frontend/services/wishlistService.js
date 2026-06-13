import api from './api';

export const wishlistService = {
  // Get user's wishlist
  getUserWishlist: async (userId) => {
    try {
      const response = await api.get(`/wishlist?userId=${userId}`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Get wishlist error:', error);
      return { success: false, error: error.message, data: [] };
    }
  },
  
  // Add to wishlist
  addToWishlist: async (wishlistItem) => {
    try {
      // Check if already exists
      const existing = await api.get(`/wishlist?userId=${wishlistItem.userId}&productId=${wishlistItem.productId}`);
      if (existing.data.length > 0) {
        return { success: false, error: 'Product already in wishlist' };
      }
      
      const response = await api.post('/wishlist', {
        ...wishlistItem,
        createdAt: new Date().toISOString()
      });
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Add to wishlist error:', error);
      return { success: false, error: error.message };
    }
  },
  
  // Remove from wishlist
  removeFromWishlist: async (id) => {
    try {
      await api.delete(`/wishlist/${id}`);
      return { success: true };
    } catch (error) {
      console.error('Remove from wishlist error:', error);
      return { success: false, error: error.message };
    }
  },
  
  // Check if product is in wishlist
  isInWishlist: async (userId, productId) => {
    try {
      const response = await api.get(`/wishlist?userId=${userId}&productId=${productId}`);
      return { success: true, inWishlist: response.data.length > 0, data: response.data[0] };
    } catch (error) {
      return { success: false, inWishlist: false };
    }
  }
};