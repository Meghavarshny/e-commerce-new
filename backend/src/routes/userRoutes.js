const express = require("express");
const router = express.Router();
const validate = require("../middleware/validate");
const { registerSchema, loginSchema } = require("../validators");
const {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
} = require("../controllers/userController");
const { protect } = require("../middlewares/authMiddleware");

// Registration and Login
router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);

// Protected Profile Routes
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);

// Password Management
router.put("/password", protect, changePassword);

module.exports = router;
