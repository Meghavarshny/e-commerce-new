const express = require('express');
const router = express.Router();
const {
  addToWishlist,
  removeFromWishlist,
  getWishlist
} = require('../controllers/wishlistController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

// Add/remove product (buyer)
router.post('/:productId', protect, restrictTo('buyer'), addToWishlist);
router.delete('/:productId', protect, restrictTo('buyer'), removeFromWishlist);
router.get('/', protect, restrictTo('buyer'), getWishlist);

module.exports = router;
