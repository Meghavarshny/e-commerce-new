const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const { createRazorpayOrder, verifySignature } = require("../controllers/paymentController");

// Create Razorpay order
router.post("/create-razorpay-order", protect, createRazorpayOrder);

// Verify Razorpay signature
router.post("/verify-signature", protect, verifySignature);

module.exports = router;
