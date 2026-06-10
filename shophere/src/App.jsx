import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './frontend/contexts/AuthContext';
import { CartProvider } from './frontend/contexts/CartContext';
import { WishlistProvider } from './frontend/contexts/WishlistContext';
import { NotificationProvider } from './frontend/contexts/NotificationContext';
import AppRoutes from './frontend/routes/AppRoutes';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <NotificationProvider>
              <AppRoutes />
            </NotificationProvider>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;