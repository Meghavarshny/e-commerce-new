const Product = require('../models/Product');

// Add Review (Buyer)
exports.addReview = async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.productId);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  product.reviews.push({
    user: req.user.userId,
    rating,
    comment
  });
  await product.save();
  res.status(201).json({ message: 'Review added' });
};
