import api from './api';

// ============================================
// DATABASE SERVICE LAYER
// Abhi: JSON Server (db.json)
// Future: Real Backend (Node.js + MongoDB)
// ============================================

export const dbService = {
  // ========== USERS ==========
  getUsers: async () => {
    try {
      const response = await api.get('/users');
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  },

  getUserById: async (id) => {
    try {
      const response = await api.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user:', error);
      return null;
    }
  },

  // ========== PRODUCTS ==========
  getProducts: async (params = '') => {
    try {
      const response = await api.get(`/products${params}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  },

  getProductById: async (id) => {
    try {
      const response = await api.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching product:', error);
      return null;
    }
  },

  // ========== ORDERS ==========
  getOrders: async (userId) => {
    try {
      const response = await api.get(`/orders?userId=${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching orders:', error);
      return [];
    }
  },

  getAllOrders: async () => {
    try {
      const response = await api.get('/orders');
      return response.data;
    } catch (error) {
      console.error('Error fetching all orders:', error);
      return [];
    }
  },

  createOrder: async (orderData) => {
    try {
      const response = await api.post('/orders', orderData);
      return response.data;
    } catch (error) {
      console.error('Error creating order:', error);
      return null;
    }
  },

  updateOrderStatus: async (orderId, status) => {
    try {
      const response = await api.patch(`/orders/${orderId}`, { status });
      return response.data;
    } catch (error) {
      console.error('Error updating order:', error);
      return null;
    }
  },

  // ========== CART ==========
  getCart: async (userId) => {
    try {
      const response = await api.get(`/cart?userId=${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching cart:', error);
      return [];
    }
  },

  updateCart: async (cartId, items) => {
    try {
      const response = await api.patch(`/cart/${cartId}`, { items });
      return response.data;
    } catch (error) {
      console.error('Error updating cart:', error);
      return null;
    }
  },

  // ========== WISHLIST ==========
  getWishlist: async (userId) => {
    try {
      const response = await api.get(`/wishlist?userId=${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      return [];
    }
  },

  addToWishlist: async (data) => {
    try {
      const response = await api.post('/wishlist', data);
      return response.data;
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      return null;
    }
  },

  removeFromWishlist: async (id) => {
    try {
      const response = await api.delete(`/wishlist/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      return null;
    }
  },

  // ========== CATEGORIES ==========
  getCategories: async () => {
    try {
      const response = await api.get('/categories');
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  },

  // ========== GENERIC ==========
  get: async (endpoint) => {
    try {
      const response = await api.get(endpoint);
      return response.data;
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
      return null;
    }
  },

  post: async (endpoint, data) => {
    try {
      const response = await api.post(endpoint, data);
      return response.data;
    } catch (error) {
      console.error(`Error posting to ${endpoint}:`, error);
      return null;
    }
  },

  patch: async (endpoint, data) => {
    try {
      const response = await api.patch(endpoint, data);
      return response.data;
    } catch (error) {
      console.error(`Error patching ${endpoint}:`, error);
      return null;
    }
  },

  delete: async (endpoint) => {
    try {
      const response = await api.delete(endpoint);
      return response.data;
    } catch (error) {
      console.error(`Error deleting ${endpoint}:`, error);
      return null;
    }
  }
};