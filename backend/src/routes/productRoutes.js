const express = require("express");
const router = express.Router();
const validate = require("../middleware/validate");
const { productSchema } = require("../validators");
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const { protect, restrictTo } = require("../middlewares/authMiddleware");

// Buyer/Seller: Browse and view products
router.get("/", getProducts);
router.get("/:id", getProductById);

// Seller: Create/manage products
router.post(
  "/",
  protect,
  restrictTo("seller"),
  validate(productSchema),
  createProduct,
);
router.put(
  "/:id",
  protect,
  restrictTo("seller"),
  validate(productSchema),
  updateProduct,
);
router.delete("/:id", protect, restrictTo("seller"), deleteProduct);

module.exports = router;
