import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Calculate totals
  const subtotal = cart.reduce((sum, item) => {
    const itemPrice = Number(item.price) || 0;
    const itemQuantity = Number(item.quantity) || 0;
    return sum + (itemPrice * itemQuantity);
  }, 0);
  
  // Apply discount if subtotal exceeds certain amount
  const discount = subtotal > 5000 ? subtotal * 0.05 : 0; // 5% discount for orders over ₹5000
  const tax = (subtotal - discount) * 0.1; // 10% tax on discounted amount
  const shipping = subtotal >= 1000 ? 0 : 99; // Free shipping for orders over ₹1000
  const total = subtotal - discount + tax + shipping;

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity <= 0) {
      if (window.confirm("Are you sure you want to remove this item from your cart?")) {
        handleRemoveFromCart(productId);
      }
      return;
    }
    
    setIsUpdating(true);
    try {
      await updateQuantity(productId, newQuantity);
    } catch (error) {
      console.error('Error updating quantity:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemoveFromCart = async (productId) => {
    setIsUpdating(true);
    try {
      await removeFromCart(productId);
    } catch (error) {
      console.error('Error removing item:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your entire cart?')) {
      clearCart();
    }
  };

  // Function to calculate total for a single item
  const getItemTotal = (item) => {
    return (item.price * item.quantity).toFixed(2);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Your Shopping Cart</h1>
          <p className="text-gray-600 mt-2">
            {cart.length} item{cart.length !== 1 ? 's' : ''} in your cart
          </p>
        </div>

        {cart.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Your cart is empty</h3>
            <p className="text-gray-600 mb-6">Looks like you haven't added anything to your cart yet</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/products" 
                className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition shadow-md"
              >
                Continue Shopping
              </Link>
              <Link 
                to="/"
                className="px-8 py-3 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition"
              >
                Back to Home
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Table Header */}
                <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 text-gray-700 text-sm font-semibold border-b">
                  <div className="col-span-5">Product</div>
                  <div className="col-span-2 text-center">Price</div>
                  <div className="col-span-3 text-center">Quantity</div>
                  <div className="col-span-2 text-right">Total</div>
                </div>

                {/* Cart Items List */}
                <div className="divide-y divide-gray-200">
                  {cart.map((item, index) => (
                    <div key={item._id} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-6 hover:bg-gray-50 transition">
                      {/* Mobile Header */}
                      <div className="md:hidden mb-2">
                        <div className="text-sm font-semibold text-gray-700">Item #{index + 1}</div>
                      </div>
                      
                      {/* Product Info */}
                      <div className="md:col-span-5 flex items-start">
                        <div className="flex-shrink-0 w-20 h-20 bg-gray-200 rounded-lg overflow-hidden mr-4">
                          {item.image ? (
                            <img 
                              src={item.image} 
                              alt={item.name} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
                            {item.name}
                          </h3>
                          <div className="flex items-center text-sm text-gray-500 mb-2">
                            <span className="font-medium">₹{item.price?.toFixed(2)}</span>
                            {item.originalPrice && item.originalPrice > item.price && (
                              <>
                                <span className="ml-2 line-through">₹{item.originalPrice?.toFixed(2)}</span>
                                <span className="ml-2 text-green-600 font-semibold">
                                  {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% OFF
                                </span>
                              </>
                            )}
                          </div>
                          <button
                            onClick={() => handleRemoveFromCart(item._id)}
                            className="text-xs text-red-600 hover:text-red-800 font-medium flex items-center py-0.5 px-1"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Remove
                          </button>
                        </div>
                      </div>

                      {/* Price - Hidden on mobile */}
                      <div className="md:col-span-2 flex items-center justify-center text-sm font-medium text-gray-900">
                        ₹{item.price?.toFixed(2)}
                      </div>

                      {/* Quantity */}
                      <div className="md:col-span-3 flex items-center justify-center">
                        <div className="flex items-center border border-gray-300 rounded-lg">
                          <button
                            onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                            disabled={isUpdating}
                            className="w-7 h-7 flex items-center justify-center text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-l disabled:opacity-50"
                          >
                            -
                          </button>
                          <span className="w-10 text-center text-sm font-medium bg-gray-50">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                            disabled={isUpdating}
                            className="w-7 h-7 flex items-center justify-center text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-r disabled:opacity-50"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Total */}
                      <div className="md:col-span-2 flex items-center justify-end text-sm font-semibold text-gray-900">
                        ₹{getItemTotal(item)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Cart Actions */}
                <div className="p-6 border-t border-gray-200 bg-gray-50">
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <button
                      onClick={handleClearCart}
                      disabled={isUpdating}
                      className="flex items-center text-red-600 hover:text-red-800 font-medium disabled:opacity-50"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Clear Cart
                    </button>
                    <div className="flex items-center">
                      <Link 
                        to="/products" 
                        className="px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition mr-3"
                      >
                        Continue Shopping
                      </Link>
                      <button
                        onClick={() => window.location.reload()}
                        disabled={isUpdating}
                        className="px-6 py-2 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition disabled:opacity-50"
                      >
                        Refresh Cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Special Offers */}
              {subtotal >= 500 && subtotal < 5000 && (
                <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-sm font-semibold text-blue-800">Spend ₹{5000 - subtotal > 0 ? Math.ceil(5000 - subtotal) : 0} more for 5% discount!</h4>
                      <p className="text-sm text-blue-600 mt-1">Add more items to qualify for a special discount on your order.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-fit sticky top-8">
              <h3 className="text-xl font-bold mb-6 text-gray-800">Order Summary</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                </div>
                
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span className="line-through text-gray-500">Original Total</span>
                    <span className="line-through">₹{(subtotal - discount).toFixed(2)}</span>
                  </div>
                )}
                
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount (5%)</span>
                    <span>-₹{discount.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className={shipping === 0 ? "font-medium text-green-600" : "font-medium"}>
                    {shipping === 0 ? "Free" : `₹${shipping.toFixed(2)}`}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">₹{tax.toFixed(2)}</span>
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 space-y-4">
                <Link 
                  to="/checkout" 
                  className="w-full block text-center px-6 py-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isUpdating}
                >
                  {isUpdating ? 'Processing...' : `Proceed to Checkout - ₹${total.toFixed(2)}`}
                </Link>
                
                <div className="flex items-center">
                  <div className="flex-1 border-t border-gray-300"></div>
                  <span className="px-4 text-sm text-gray-500">or</span>
                  <div className="flex-1 border-t border-gray-300"></div>
                </div>
                
                <Link 
                  to="/products" 
                  className="w-full block text-center px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition"
                >
                  Continue Shopping
                </Link>
              </div>

              {/* Security badges */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex justify-center space-x-6 text-sm text-gray-600">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    Secure Checkout
                  </div>
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    Multiple Payment Options
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}