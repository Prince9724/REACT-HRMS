import React from 'react';
import { AuthProvider } from './frontend/contexts/AuthContext';
import { CartProvider } from './frontend/contexts/CartContext';
import { WishlistProvider } from './frontend/contexts/WishlistContext';
import { NotificationProvider } from './frontend/contexts/NotificationContext';
import AppRoutes from './frontend/routes/AppRoutes';
import ChatBot from './frontend/components/common/ChatBot';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <NotificationProvider>
            <AppRoutes />
            <ChatBot />
          </NotificationProvider>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;