const express = require("express");
const router = express.Router();
const validate = require("../middleware/validate");
const { orderSchema } = require("../validators");
const {
  placeOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
} = require("../controllers/orderController");
const { protect, restrictTo } = require("../middlewares/authMiddleware");

// Place order (buyer)
router.post("/", protect, validate(orderSchema), placeOrder);
// Get orders (buyer/seller)
router.get("/", protect, getOrders);
// Get specific order
router.get("/:id", protect, getOrderById);
// Update order status (seller)
router.put("/:id/status", protect, restrictTo("seller"), updateOrderStatus);

module.exports = router;
