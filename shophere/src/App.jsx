import React from 'react'
import { AuthProvider } from './frontend/contexts/AuthContext'
import { CartProvider } from './frontend/contexts/CartContext'
import { WishlistProvider } from './frontend/contexts/WishlistContext'
import { NotificationProvider } from './frontend/contexts/NotificationContext'
import AppRoutes from './frontend/routes/AppRoutes'

function App() {
  console.log('App rendering from src')
  
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <NotificationProvider>
            <AppRoutes />
          </NotificationProvider>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  )
}

export default App