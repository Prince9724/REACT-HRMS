import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import { useCart } from '../../contexts/CartContext';
import { FiTrash2, FiPlus, FiMinus, FiShoppingBag, FiArrowLeft } from 'react-icons/fi';

const CartPage = () => {
  const { cartItems, cartTotal, updateQuantity, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  const handleQuantityChange = (productId, currentQuantity, delta) => {
    const newQuantity = currentQuantity + delta;
    if (newQuantity >= 1) {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleRemove = (productId) => {
    if (window.confirm('Are you sure you want to remove this item?')) {
      removeFromCart(productId);
    }
  };

  const handleCheckout = () => {
    if (cartItems.length > 0) {
      navigate('/checkout');
    }
  };

  // Format price in Rupees
  const formatPrice = (price) => {
    return `₹${price.toLocaleString('en-IN')}`;
  };

  if (cartItems.length === 0) {
    return (
      <>
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-16 min-h-screen">
          <div className="text-center">
            <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
              <FiShoppingBag size={48} className="text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-6">Looks like you haven't added any items to your cart yet.</p>
            <Link to="/products" className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition inline-block">
              Continue Shopping
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8 min-h-screen">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          
          {/* Cart Items - Left Side */}
          <div className="flex-1 w-full md:w-2/3">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Shopping Cart</h1>
            
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              {/* Table Header - Desktop */}
              <div className="hidden md:grid grid-cols-12 gap-4 bg-gray-50 px-6 py-3 text-sm font-semibold text-gray-600 border-b">
                <div className="col-span-6">Product</div>
                <div className="col-span-2 text-center">Price</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-right">Total</div>
              </div>

              {/* Cart Items List */}
              <div className="divide-y divide-gray-200">
                {cartItems.map((item) => (
                  <div key={item.id} className="p-4 md:p-6">
                    {/* Desktop View */}
                    <div className="hidden md:grid grid-cols-12 gap-4 items-center">
                      {/* Product Info */}
                      <div className="col-span-6 flex gap-4">
                        <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={item.image || `https://picsum.photos/80/80?random=${item.id}`}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = `https://picsum.photos/80/80?random=${item.id}`;
                            }}
                          />
                        </div>
                        <div>
                          <Link to={`/product/${item.id}`} className="font-semibold text-gray-800 hover:text-primary transition">
                            {item.name}
                          </Link>
                          <button
                            onClick={() => handleRemove(item.id)}
                            className="flex items-center gap-1 text-red-500 text-sm mt-2 hover:text-red-700"
                          >
                            <FiTrash2 size={14} /> Remove
                          </button>
                        </div>
                      </div>
                      
                      {/* Price */}
                      <div className="col-span-2 text-center font-medium">
                        {formatPrice(item.price)}
                      </div>
                      
                      {/* Quantity */}
                      <div className="col-span-2 flex items-center justify-center gap-3">
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity, -1)}
                          className="w-8 h-8 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50"
                        >
                          <FiMinus size={14} />
                        </button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity, 1)}
                          className="w-8 h-8 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50"
                        >
                          <FiPlus size={14} />
                        </button>
                      </div>
                      
                      {/* Total */}
                      <div className="col-span-2 text-right font-bold text-primary">
                        {formatPrice(item.price * item.quantity)}
                      </div>
                    </div>

                    {/* Mobile View */}
                    <div className="md:hidden">
                      <div className="flex gap-4">
                        <img
                          src={item.image || `https://picsum.photos/80/80?random=${item.id}`}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <Link to={`/product/${item.id}`} className="font-semibold text-gray-800">
                            {item.name}
                          </Link>
                          <p className="text-primary font-bold mt-1">{formatPrice(item.price)}</p>
                          
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center gap-2 border border-gray-300 rounded-lg">
                              <button
                                onClick={() => handleQuantityChange(item.id, item.quantity, -1)}
                                className="w-8 h-8 flex items-center justify-center"
                              >
                                <FiMinus size={14} />
                              </button>
                              <span className="w-8 text-center">{item.quantity}</span>
                              <button
                                onClick={() => handleQuantityChange(item.id, item.quantity, 1)}
                                className="w-8 h-8 flex items-center justify-center"
                              >
                                <FiPlus size={14} />
                              </button>
                            </div>
                            <p className="font-bold text-primary">{formatPrice(item.price * item.quantity)}</p>
                          </div>
                          
                          <button
                            onClick={() => handleRemove(item.id)}
                            className="text-red-500 text-sm mt-2 flex items-center gap-1"
                          >
                            <FiTrash2 size={14} /> Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center mt-6">
              <Link to="/products" className="flex items-center gap-2 text-primary hover:text-orange-600 transition">
                <FiArrowLeft size={16} /> Continue Shopping
              </Link>
              <button
                onClick={clearCart}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                Clear Cart
              </button>
            </div>
          </div>

          {/* Order Summary - Right Side */}
          <div className="w-full md:w-80">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>
              
              <div className="space-y-3 border-b border-gray-200 pb-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})</span>
                  <span>{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
              </div>
              
              <div className="flex justify-between mt-4 pt-2">
                <span className="font-bold text-lg">Total</span>
                <span className="font-bold text-xl text-primary">{formatPrice(cartTotal)}</span>
              </div>
              
              <button
                onClick={handleCheckout}
                className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition mt-6"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CartPage;