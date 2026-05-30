import { calculateTotals } from '../../utils/calculateBill';

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

  const { subtotal, gst, serviceCharge, total } = calculateTotals(cartItems);
  return (
    <div className="border p-4 rounded">
      <h3 className="font-bold">Cart</h3>
      {cartItems.length === 0 && <p>No items</p>}
      {cartItems.map(item => (
        <div key={item.id} className="flex justify-between items-center my-1">
          <span>{item.name} x{item.quantity}</span>
          <span>₹{item.price * item.quantity}</span>
          <div>
            <button onClick={() => updateQty(item.id, -1)} className="bg-red-500 text-white px-2 mx-1">-</button>
            <button onClick={() => updateQty(item.id, 1)} className="bg-green-500 text-white px-2">+</button>
          </div>
        </div>
      ))}
      <hr className="my-2" />
      <p>Subtotal: ₹{subtotal}</p>
      <p>GST: ₹{gst}</p>
      <p>Service Charge: ₹{serviceCharge}</p>
      <p className="font-bold">Total: ₹{total}</p>
    </div>
  );
};
export default Cart;