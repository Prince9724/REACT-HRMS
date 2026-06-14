import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';

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
  const [cartCount, setCartCount] = useState(0);  // Unique products count
  const [cartTotal, setCartTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCart();
  }, [user?.id]);

  const loadCart = () => {
    const savedCart = localStorage.getItem('shopsphere_cart');
    if (savedCart) {
      try {
        const items = JSON.parse(savedCart);
        setCartItems(items);
        updateCartSummary(items);
      } catch (e) {
        console.error('Error loading cart:', e);
      }
    }
    setLoading(false);
  };

  const updateCartSummary = (items) => {
    // ✅ FIX: cartCount = number of unique products (NOT total quantity)
    const uniqueProductCount = items.length;  // Sirf unique products ki count
    const total = items.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 1)), 0);
    
    setCartCount(uniqueProductCount);
    setCartTotal(total);
    
    // Save to localStorage
    localStorage.setItem('shopsphere_cart', JSON.stringify(items));
  };

  const addToCart = (product, quantity = 1) => {
    setCartItems(prevItems => {
      const existingIndex = prevItems.findIndex(item => item.id === product.id);
      
      if (existingIndex !== -1) {
        // Product already exists - only update quantity, NOT cart count
        const updatedItems = [...prevItems];
        updatedItems[existingIndex].quantity += quantity;
        updateCartSummary(updatedItems);
        return updatedItems;
      } else {
        // New product - cart count will increase
        const newItem = {
          id: product.id,
          name: product.name,
          price: product.finalPrice || product.price,
          image: product.images?.[0] || '',
          quantity: quantity,
          stock: product.stockQuantity
        };
        const newItems = [...prevItems, newItem];
        updateCartSummary(newItems);
        return newItems;
      }
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prevItems => {
      const newItems = prevItems.filter(item => item.id !== productId);
      updateCartSummary(newItems);
      return newItems;
    });
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }
    
    setCartItems(prevItems => {
      const newItems = prevItems.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      );
      updateCartSummary(newItems);
      return newItems;
    });
  };

  const clearCart = () => {
    setCartItems([]);
    updateCartSummary([]);
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