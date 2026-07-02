const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  image: { type: String },
  category: { type: String },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reviews: [reviewSchema],
  stock: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  reviewsCount: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
