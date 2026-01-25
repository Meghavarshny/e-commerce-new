const express = require('express');
const router = express.Router();
const {
  addToCart,
  updateCartItem,
  removeFromCart,
  getCart,
  clearCart
} = require('../controllers/cartController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

// Cart routes (buyer only)
router.post('/', protect, restrictTo('buyer'), addToCart);
router.put('/', protect, restrictTo('buyer'), updateCartItem);
router.delete('/:productId', protect, restrictTo('buyer'), removeFromCart);
router.get('/', protect, restrictTo('buyer'), getCart);
router.delete('/', protect, restrictTo('buyer'), clearCart);

module.exports = router;