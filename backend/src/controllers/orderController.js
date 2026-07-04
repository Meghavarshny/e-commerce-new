const Order = require('../models/Order');
const Product = require('../models/Product');

// Place Order (Buyer)
exports.placeOrder = async (req, res) => {
  const { items, shippingInfo, paymentInfo } = req.body;
  const orderStatus = paymentInfo?.status === 'Paid' ? 'Processing' : 'Pending';
  const order = await Order.create({
    buyer: req.user.userId,
    items,
    shippingInfo,
    paymentInfo,
    status: orderStatus
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
  const isBuyer = order.buyer.toString() === req.user.userId;
  const isSeller = order.items.some(item => item.seller.toString() === req.user.userId);
  if (!isBuyer && !isSeller) {
    return res.status(403).json({ message: 'Not authorized' });
  }
  res.status(200).json(order);
};

// Update Order Status (Seller only — marks items they fulfill)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const isSeller = order.items.some(item => item.seller.toString() === req.user.userId);
    if (!isSeller) {
      return res.status(403).json({ message: 'Not authorized to update this order' });
    }

    order.status = status;
    await order.save();
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update order status', error: error.message });
  }
};
