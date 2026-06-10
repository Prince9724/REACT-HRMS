import api from './api';

export const categoryService = {
  // Get all categories
  getAllCategories: async () => {
    try {
      const response = await api.get('/categories');
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Get categories error:', error);
      return { success: false, error: error.message, data: [] };
    }
  },
  
  // Add new category (admin only)
  addCategory: async (categoryData) => {
    try {
      const response = await api.post('/categories', categoryData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
  
  // Update category (admin only)
  updateCategory: async (id, categoryData) => {
    try {
      const response = await api.patch(`/categories/${id}`, categoryData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
  
  // Delete category (admin only)
  deleteCategory: async (id) => {
    try {
      await api.delete(`/categories/${id}`);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};