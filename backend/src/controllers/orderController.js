const Order = require('../models/Order');
const Product = require('../models/Product');

// Place Order (Buyer)
exports.placeOrder = async (req, res) => {
  const { items, shippingInfo, paymentInfo } = req.body;
  const order = await Order.create({
    buyer: req.user.userId,
    items,
    shippingInfo,
    paymentInfo,
    status: 'Paid'
  });
  res.status(201).json(order);
};

// Get Orders for User (Buyer or Seller)
exports.getOrders = async (req, res) => {
  let filter = {};
  if (req.user.role === 'buyer') filter.buyer = req.user.userId;
  if (req.user.role === 'seller') filter['items.seller'] = req.user.userId;
  const orders = await Order.find(filter).sort({ createdAt: -1 });
  res.status(200).json(orders);
};

// Get Order By ID
exports.getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  if (
    order.buyer.toString() !== req.user.userId &&
    order.items.some(item => item.seller.toString() !== req.user.userId)
  ) {
    return res.status(403).json({ message: 'Not authorized' });
  }
  res.status(200).json(order);
};
