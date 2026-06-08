import { calculateTotals } from '../../utils/calculateBill';
import { ShoppingCartIcon, ShoppingBagIcon, PlusIcon, MinusIcon, TagIcon } from '@heroicons/react/24/outline';

const Cart = ({ cartItems, setCartItems }) => {
  const updateQty = (id, delta) => {
    const newCart = cartItems.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        if (newQty <= 0) return null;
        return { ...item, quantity: newQty };
      }
      return item;
    }).filter(Boolean);
    setCartItems(newCart);
  };

  // Calculate discount (10% flat, min ₹500, max ₹200)
  const calculateDiscount = (subtotal) => {
    if (subtotal >= 500) {
      let discount = subtotal * 0.10;
      if (discount > 200) discount = 200;
      return Math.floor(discount);
    }
    return 0;
  };

  const { subtotal, gst, serviceCharge, total } = calculateTotals(cartItems);
  const discount = calculateDiscount(subtotal);
  const finalTotal = total - discount;

  return (
    <div className="bg-gray-50 rounded-xl p-4">
      <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
        <ShoppingCartIcon className="w-5 h-5" /> Your Cart
      </h3>

      {cartItems.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          <ShoppingBagIcon className="w-12 h-12 text-gray-300 mx-auto mb-2" />
          <p>Cart is empty</p>
        </div>
      )}

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {cartItems.map(item => (
          <div key={item.id} className="flex justify-between items-center bg-white p-2 rounded-lg shadow-sm">
            <div className="flex-1">
              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-gray-600">₹{item.price} x {item.quantity}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQty(item.id, -1)}
                className="w-7 h-7 bg-red-100 text-red-600 rounded-full flex items-center justify-center hover:bg-red-200"
              >
                <MinusIcon className="w-3 h-3" />
              </button>
              <span className="w-6 text-center font-semibold">{item.quantity}</span>
              <button
                onClick={() => updateQty(item.id, 1)}
                className="w-7 h-7 bg-green-100 text-green-600 rounded-full flex items-center justify-center hover:bg-green-200"
              >
                <PlusIcon className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {cartItems.length > 0 && (
        <div className="mt-4 pt-3 border-t">
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>₹{Math.floor(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>GST (5%):</span>
              <span>₹{Math.floor(gst)}</span>
            </div>
            <div className="flex justify-between">
              <span>Service Charge (5%):</span>
              <span>₹{Math.floor(serviceCharge)}</span>
            </div>
            
            {/* ✅ Discount Section */}
            {discount > 0 && (
              <div className="flex justify-between text-green-600 font-medium">
                <span className="flex items-center gap-1">
                  <TagIcon className="w-4 h-4" /> Discount (10% off):
                </span>
                <span>- ₹{discount}</span>
              </div>
            )}
            
            <div className="flex justify-between font-bold text-lg pt-2 border-t mt-2">
              <span>Total:</span>
              <span className="text-green-600">₹{Math.floor(finalTotal)}</span>
            </div>
            
            {/* ✅ Discount Info Message */}
            {subtotal < 500 && (
              <div className="mt-2 p-2 bg-yellow-50 rounded-lg text-xs text-yellow-700 text-center">
                Add items worth ₹{500 - Math.floor(subtotal)} more to get 10% discount!
              </div>
            )}
            {subtotal >= 500 && discount > 0 && (
              <div className="mt-2 p-2 bg-green-50 rounded-lg text-xs text-green-700 text-center flex items-center justify-center gap-1">
                <TagIcon className="w-3 h-3" /> 10% discount applied! You saved ₹{discount}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;