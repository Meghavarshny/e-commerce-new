const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, default: 1 },
  price: { type: Number, required: true }
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['buyer', 'seller'], required: true },
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  cart: [cartItemSchema],
  address: { type: String },
  city: { type: String },
  postalCode: { type: String },
  country: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
