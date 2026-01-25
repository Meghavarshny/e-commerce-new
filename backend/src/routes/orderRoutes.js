const express = require("express");
const router = express.Router();
const validate = require("../middleware/validate");
const { orderSchema } = require("../validators");
const {
  placeOrder,
  getOrders,
  getOrderById,
} = require("../controllers/orderController");
const { protect } = require("../middlewares/authMiddleware");

// Place order (buyer)
router.post("/", protect, validate(orderSchema), placeOrder);
// Get orders (buyer/seller)
router.get("/", protect, getOrders);
// Get specific order
router.get("/:id", protect, getOrderById);

module.exports = router;
