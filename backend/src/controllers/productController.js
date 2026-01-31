const Product = require("../models/Product");
const cloudinary = require("../config/cloudinary");

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
  const { search, category, minPrice, maxPrice } = req.query;
  let query = {};
  if (search) query.name = { $regex: search, $options: "i" };
  if (category) query.category = category;

  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  const products = await Product.find(query);
  res.status(200).json(products);
};

// Get Product By ID
exports.getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.status(200).json(product);
};

// Update Product (Seller)
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const existingProduct = await Product.findById(id);

    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check ownership
    // If product has a seller, ensures it matches current user
    if (
      existingProduct.seller &&
      existingProduct.seller.toString() !== userId
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to edit this product" });
    }

    // If product has no seller (orphan), we allow the current seller to 'claim' it
    // effectively fixing the bad data.

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { ...req.body, seller: userId }, // Ensure seller is set
      { new: true },
    );

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ message: "Server error during update" });
  }
};

// Delete Product (Seller)
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const existingProduct = await Product.findById(id);

    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check ownership
    if (
      existingProduct.seller &&
      existingProduct.seller.toString() !== userId
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this product" });
    }

    await Product.findByIdAndDelete(id);
    res.status(204).send();
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ message: "Server error during delete" });
  }
};
