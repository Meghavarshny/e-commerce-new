const Product = require('../models/Product');
const Order = require('../models/Order');

// Add Review (Buyer)
exports.addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const { productId } = req.params;
    const userId = req.user.userId;

    // 1. Check if product exists
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // 2. Check if user has purchased this product
    const hasPurchased = await Order.findOne({
      buyer: userId,
      'items.product': productId,
      status: { $in: ['Paid', 'Delivered', 'Shipped'] }
    });

    if (!hasPurchased) {
      return res.status(403).json({ 
        message: 'You can only review products you have purchased.' 
      });
    }

    // 3. Check if user already reviewed
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === userId.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({ message: 'You have already reviewed this product' });
    }

    // 4. Add review
    product.reviews.push({
      user: userId,
      rating: Number(rating),
      comment
    });

    // Update product rating (simple average)
    const totalRating = product.reviews.reduce((acc, item) => item.rating + acc, 0);
    product.rating = totalRating / product.reviews.length;
    product.reviewsCount = product.reviews.length;

    await product.save();
    res.status(201).json({ message: 'Review added successfully' });
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({ message: 'Failed to add review' });
  }
};
