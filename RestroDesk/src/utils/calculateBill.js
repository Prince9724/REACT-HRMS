export const calculateTotals = (items) => {
  let subtotal = 0;
  let gst = 0;
  items.forEach(item => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;
    gst += (itemTotal * (item.taxRate || 5)) / 100;
  });
  const serviceCharge = subtotal * 0.05;
  const total = subtotal + gst + serviceCharge;
  return { subtotal, gst, serviceCharge, total };
};