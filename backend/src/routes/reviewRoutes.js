const express = require('express');
const router = express.Router();
const { addReview } = require('../controllers/reviewController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

// Add product review (buyer)
router.post('/:productId', protect, restrictTo('buyer'), addReview);

module.exports = router;
