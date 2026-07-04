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

// Cart routes (buyer and seller can both access cart)
router.post('/', protect, restrictTo('buyer', 'seller'), addToCart);
router.put('/', protect, restrictTo('buyer', 'seller'), updateCartItem);
router.delete('/:productId', protect, restrictTo('buyer', 'seller'), removeFromCart);
router.get('/', protect, restrictTo('buyer', 'seller'), getCart);
router.delete('/', protect, restrictTo('buyer', 'seller'), clearCart);

module.exports = router;