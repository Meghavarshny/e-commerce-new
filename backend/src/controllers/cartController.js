const User = require('../models/User');
const Product = require('../models/Product');

// Add to Cart
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    
    // Validate product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if product is already in cart
    const existingCartItem = user.cart.find(item => 
      item.product.toString() === productId
    );

    if (existingCartItem) {
      // Update quantity if product already exists in cart
      existingCartItem.quantity = Math.max(1, existingCartItem.quantity + parseInt(quantity));
      existingCartItem.price = product.price; // Update price in case it changed
    } else {
      // Add new product to cart
      user.cart.push({
        product: productId,
        quantity: parseInt(quantity),
        price: product.price
      });
    }

    await user.save();
    
    // Populate the cart with product details
    const populatedUser = await User.findById(req.user.userId)
      .populate('cart.product');
    
    res.status(200).json(populatedUser.cart);
  } catch (err) {
    res.status(500).json({ message: 'Failed to add to cart', error: err.message });
  }
};

// Update Cart Item Quantity
exports.updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const cartItem = user.cart.find(item => 
      item.product.toString() === productId
    );

    if (!cartItem) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    if (quantity <= 0) {
      // Remove item if quantity is 0 or less
      user.cart = user.cart.filter(item => 
        item.product.toString() !== productId
      );
    } else {
      cartItem.quantity = Math.max(1, parseInt(quantity));
    }

    await user.save();
    
    // Populate the cart with product details
    const populatedUser = await User.findById(req.user.userId)
      .populate('cart.product');
    
    res.status(200).json(populatedUser.cart);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update cart item', error: err.message });
  }
};

// Remove from Cart
exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Remove item from cart
    user.cart = user.cart.filter(item => 
      item.product.toString() !== productId
    );

    await user.save();
    
    // Populate the cart with product details
    const populatedUser = await User.findById(req.user.userId)
      .populate('cart.product');
    
    res.status(200).json(populatedUser.cart);
  } catch (err) {
    res.status(500).json({ message: 'Failed to remove from cart', error: err.message });
  }
};

// Get Cart
exports.getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).populate('cart.product');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json(user.cart);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch cart', error: err.message });
  }
};

// Clear Cart
exports.clearCart = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.cart = [];
    await user.save();
    
    res.status(200).json(user.cart);
  } catch (err) {
    res.status(500).json({ message: 'Failed to clear cart', error: err.message });
  }
};