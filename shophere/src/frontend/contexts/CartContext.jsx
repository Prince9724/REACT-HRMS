import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);

  // Load cart from localStorage on mount
  useEffect(() => {
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
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('shopsphere_cart', JSON.stringify(cartItems));
    updateCartSummary(cartItems);
  }, [cartItems]);

  const updateCartSummary = (items) => {
    const count = items.reduce((total, item) => total + (item.quantity || 1), 0);
    const total = items.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 1)), 0);
    setCartCount(count);
    setCartTotal(total);
    console.log('Cart updated - Count:', count, 'Total:', total);
  };

  // Add item to cart
  const addToCart = (product, quantity = 1) => {
    console.log('Adding to cart:', product);
    
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      
      if (existingItem) {
        console.log('Item exists, updating quantity');
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: (item.quantity || 1) + quantity }
            : item
        );
      } else {
        console.log('New item, adding to cart');
        return [...prevItems, {
          id: product.id,
          name: product.name,
          price: product.finalPrice || product.price,
          image: product.images?.[0] || '',
          quantity: quantity,
          stock: product.stockQuantity
        }];
      }
    });
  };

  // Remove item from cart
  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  // Update quantity
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }
    
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Clear cart
  const clearCart = () => {
    setCartItems([]);
  };

  const value = {
    cartItems,
    cartCount,
    cartTotal,
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