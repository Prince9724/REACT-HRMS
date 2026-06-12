import api from './api';

export const productService = {
    // Get all approved products (for customers)
    getApprovedProducts: async () => {
        try {
            console.log("API Call: GET /products?status=approved");
            const response = await api.get('/products?status=approved');
            console.log("API Response data length:", response.data?.length);
            return { success: true, data: response.data };  // ← YEH CHANGE KARO
        } catch (error) {
            console.error("API Error:", error);
            return { success: false, error: error.message, data: [] };
        }
    },

    // Get pending products (for admin)
    getPendingProducts: async () => {
        try {
            const response = await api.get('/products?status=pending');
            return { success: true, data: response.data };
        } catch (error) {
            console.error('Get pending products error:', error);
            return { success: false, error: error.message, data: [] };
        }
    },

    // Get single product by id
    getProductById: async (id) => {
        try {
            const response = await api.get(`/products/${id}`);
            return { success: true, data: response.data };
        } catch (error) {
            console.error('Get product error:', error);
            return { success: false, error: error.message };
        }
    },

    // Get products by seller (for seller dashboard)
    getProductsBySeller: async (sellerId) => {
        try {
            const response = await api.get(`/products?sellerId=${sellerId}`);
            return { success: true, data: response.data };
        } catch (error) {
            console.error('Get seller products error:', error);
            return { success: false, error: error.message, data: [] };
        }
    },

    // Add new product (seller)
    addProduct: async (productData) => {
        try {
            const response = await api.post('/products', {
                ...productData,
                status: 'pending',
                rating: 0,
                totalReviews: 0,
                createdAt: new Date().toISOString()
            });
            return { success: true, data: response.data };
        } catch (error) {
            console.error('Add product error:', error);
            return { success: false, error: error.message };
        }
    },

    // Update product (seller or admin)
    updateProduct: async (id, productData) => {
        try {
            const response = await api.patch(`/products/${id}`, productData);
            return { success: true, data: response.data };
        } catch (error) {
            console.error('Update product error:', error);
            return { success: false, error: error.message };
        }
    },

    // Delete product (seller or admin)
    deleteProduct: async (id) => {
        try {
            await api.delete(`/products/${id}`);
            return { success: true };
        } catch (error) {
            console.error('Delete product error:', error);
            return { success: false, error: error.message };
        }
    },

    // Approve product (admin)
    approveProduct: async (id) => {
        try {
            const response = await api.patch(`/products/${id}`, { status: 'approved' });
            return { success: true, data: response.data };
        } catch (error) {
            console.error('Approve product error:', error);
            return { success: false, error: error.message };
        }
    },

    // Reject product (admin)
    rejectProduct: async (id) => {
        try {
            const response = await api.patch(`/products/${id}`, { status: 'rejected' });
            return { success: true, data: response.data };
        } catch (error) {
            console.error('Reject product error:', error);
            return { success: false, error: error.message };
        }
    },

    // Get products by category
    getProductsByCategory: async (category) => {
        try {
            const response = await api.get(`/products?status=approved&category=${category}`);
            return { success: true, data: response.data };
        } catch (error) {
            console.error('Get products by category error:', error);
            return { success: false, error: error.message, data: [] };
        }
    }
};