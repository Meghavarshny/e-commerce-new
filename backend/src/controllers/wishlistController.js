const User = require('../models/User');

// Add to Wishlist
exports.addToWishlist = async (req, res) => {
  const user = await User.findById(req.user.userId);
  if (!user.wishlist.includes(req.params.productId)) {
    user.wishlist.push(req.params.productId);
    await user.save();
  }
  res.status(200).json({ message: 'Added to wishlist' });
};

// Remove from Wishlist
exports.removeFromWishlist = async (req, res) => {
  const user = await User.findById(req.user.userId);
  user.wishlist = user.wishlist.filter(p => p.toString() !== req.params.productId);
  await user.save();
  res.status(200).json({ message: 'Removed from wishlist' });
};

// Get Wishlist
exports.getWishlist = async (req, res) => {
  const user = await User.findById(req.user.userId).populate('wishlist');
  res.status(200).json(user.wishlist);
};
