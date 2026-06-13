import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import api from '../services/api';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  // Load cart from JSON Server on user login
  useEffect(() => {
    if (user?.id) {
      fetchCartFromServer();
    } else {
      // Guest cart from localStorage
      loadGuestCart();
    }
  }, [user?.id]);

  const fetchCartFromServer = async () => {
    try {
      const response = await api.get(`/cart?userId=${user.id}`);
      if (response.data.length > 0) {
        const serverCart = response.data[0];
        setCartItems(serverCart.items || []);
        updateCartSummary(serverCart.items || []);
      } else {
        // No cart on server, check guest cart
        loadGuestCart();
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      loadGuestCart();
    }
    setLoading(false);
  };

  const loadGuestCart = () => {
    const savedCart = localStorage.getItem('shopsphere_cart');
    if (savedCart) {
      try {
        const items = JSON.parse(savedCart);
        setCartItems(items);
        updateCartSummary(items);
      } catch (e) {
        console.error('Error loading guest cart:', e);
      }
    }
  };

  const saveCartToServer = async (items) => {
    if (!user?.id) {
      // Guest user - save to localStorage
      localStorage.setItem('shopsphere_cart', JSON.stringify(items));
      return;
    }

    try {
      const existing = await api.get(`/cart?userId=${user.id}`);
      if (existing.data.length > 0) {
        // Update existing cart
        await api.patch(`/cart/${existing.data[0].id}`, { items });
      } else {
        // Create new cart
        await api.post('/cart', {
          userId: user.id,
          items: items,
          createdAt: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Error saving cart to server:', error);
    }
  };

  const updateCartSummary = (items) => {
    const count = items.reduce((total, item) => total + (item.quantity || 1), 0);
    const total = items.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 1)), 0);
    setCartCount(count);
    setCartTotal(total);
  };

  const addToCart = async (product, quantity = 1) => {
    const newItems = [...cartItems];
    const existingIndex = newItems.findIndex(item => item.id === product.id);
    
    if (existingIndex !== -1) {
      newItems[existingIndex].quantity += quantity;
    } else {
      newItems.push({
        id: product.id,
        name: product.name,
        price: product.finalPrice || product.price,
        image: product.images?.[0] || '',
        quantity: quantity,
        stock: product.stockQuantity
      });
    }
    
    setCartItems(newItems);
    updateCartSummary(newItems);
    await saveCartToServer(newItems);
  };

  const removeFromCart = async (productId) => {
    const newItems = cartItems.filter(item => item.id !== productId);
    setCartItems(newItems);
    updateCartSummary(newItems);
    await saveCartToServer(newItems);
  };

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) {
      await removeFromCart(productId);
      return;
    }
    
    const newItems = cartItems.map(item =>
      item.id === productId ? { ...item, quantity: newQuantity } : item
    );
    
    setCartItems(newItems);
    updateCartSummary(newItems);
    await saveCartToServer(newItems);
  };

  const clearCart = async () => {
    setCartItems([]);
    updateCartSummary([]);
    await saveCartToServer([]);
  };

  const value = {
    cartItems,
    cartCount,
    cartTotal,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};