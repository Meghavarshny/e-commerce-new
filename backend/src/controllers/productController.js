const Product = require('../models/Product');
const cloudinary = require('../config/cloudinary');

// Create Product (Seller)
exports.createProduct = async (req, res) => {
  let productData = req.body;
  if (req.file) {
    const result = await cloudinary.uploader.upload(req.file.path);
    productData.image = result.secure_url;
  }
  productData.seller = req.user.userId;
  const product = await Product.create(productData);
  res.status(201).json(product);
};

// Get All Products
exports.getProducts = async (req, res) => {
  const { search, category } = req.query;
  let query = {};
  if (search) query.name = { $regex: search, $options: 'i' };
  if (category) query.category = category;
  const products = await Product.find(query);
  res.status(200).json(products);
};

// Get Product By ID
exports.getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.status(200).json(product);
};

// Update Product (Seller)
exports.updateProduct = async (req, res) => {
  const product = await Product.findOneAndUpdate(
    { _id: req.params.id, seller: req.user.userId },
    req.body,
    { new: true }
  );
  if (!product) return res.status(404).json({ message: 'Product not found or unauthorized' });
  res.status(200).json(product);
};

// Delete Product (Seller)
exports.deleteProduct = async (req, res) => {
  const product = await Product.findOneAndDelete({ _id: req.params.id, seller: req.user.userId });
  if (!product) return res.status(404).json({ message: 'Product not found or unauthorized' });
  res.status(204).send();
};
