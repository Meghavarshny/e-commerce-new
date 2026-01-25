import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import useOrders from "../hooks/useOrders";
import { useNavigate } from "react-router-dom";
import useNotification from "../hooks/useNotification";
import Notification from "../components/Notification";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import PaymentForm from "../components/PaymentForm";
import useApi from "../hooks/useApi";

// Initialize Stripe (replace with your publishable key)
const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLIC_KEY || "pk_test_123456789",
);

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const { placeOrder } = useOrders();
  const { api } = useApi();
  const navigate = useNavigate();
  const { notification, showNotification, hideNotification } =
    useNotification();

  // Initialize state
  const [shippingInfo, setShippingInfo] = useState({
    address: user?.address || "",
    city: user?.city || "",
    postalCode: user?.postalCode || "",
    country: user?.country || "",
  });

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [clientSecret, setClientSecret] = useState("");

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => {
    const itemPrice = Number(item.price) || 0;
    const itemQuantity = Number(item.quantity) || 0;
    return sum + itemPrice * itemQuantity;
  }, 0);
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;

  // Create Payment Intent when total changes or component mounts
  useEffect(() => {
    if (paymentMethod === "card" && total > 0) {
      api
        .post("/payment/create-payment-intent", { amount: total })
        .then((res) => setClientSecret(res.data.clientSecret))
        .catch((err) => console.error("Stripe Intent Error:", err));
    }
  }, [total, paymentMethod, api]);

  // Validate shipping information
  const validateShipping = () => {
    const newErrors = {};

    if (!shippingInfo.address.trim()) {
      newErrors.address = "Address is required";
    }

    if (!shippingInfo.city.trim()) {
      newErrors.city = "City is required";
    }

    if (!shippingInfo.postalCode.trim()) {
      newErrors.postalCode = "Postal code is required";
    }

    if (!shippingInfo.country.trim()) {
      newErrors.country = "Country is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePaymentSuccess = async (paymentIntent) => {
    setLoading(true);
    try {
      await placeOrder({
        items: cart.map((item) => ({
          product: item._id,
          seller: item.seller || item.sellerId || user.id,
          quantity: item.quantity,
          price: item.price,
        })),
        shippingInfo,
        paymentInfo: {
          method: "card",
          status: "Paid",
          transactionId: paymentIntent.id,
        },
      });
      clearCart();
      showNotification("Order placed successfully!");
      navigate("/orders");
    } catch (err) {
      showNotification(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentError = (errorMessage) => {
    showNotification(errorMessage, "error");
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    // Validate both shipping and payment information
    if (!validateShipping()) {
      return;
    }

    if (paymentMethod === "card") {
      // PaymentLogic handled by PaymentForm
      return;
    }

    setLoading(true);
    try {
      await placeOrder({
        items: cart.map((item) => ({
          product: item._id,
          seller: item.seller || item.sellerId || user.id,
          quantity: item.quantity,
          price: item.price,
        })),
        shippingInfo,
        paymentInfo: {
          method: paymentMethod,
          status: "Pending", // COD or other methods are pending
        },
      });
      clearCart();
      showNotification("Order placed successfully!");
      navigate("/orders");
    } catch (err) {
      showNotification(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const onChange = (e) => {
    setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
  };

  // Handle case where user is not logged in
  if (!user) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden p-8 text-center">
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            Login Required
          </h3>
          <p className="text-gray-600 mb-6">
            Please log in to proceed with checkout
          </p>
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  // Handle case where cart is empty
  if (!cart || cart.length === 0) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden p-8 text-center">
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            Your Cart is Empty
          </h3>
          <p className="text-gray-600 mb-6">
            Add some items to your cart before checking out
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h2 className="text-3xl font-bold mb-8 text-gray-800">Checkout</h2>

      {notification && (
        <Notification {...notification} onClose={hideNotification} />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Shipping Information */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold mb-6 text-gray-800">
              Shipping Information
            </h3>

            <form onSubmit={onSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={user?.name || ""}
                    disabled
                    className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={user?.email || ""}
                    disabled
                    className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <input
                  name="address"
                  placeholder="Street address"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.address ? "border-red-500" : "border-gray-300"
                  }`}
                  value={shippingInfo.address}
                  onChange={onChange}
                />
                {errors.address && (
                  <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    name="city"
                    placeholder="City"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.city ? "border-red-500" : "border-gray-300"
                    }`}
                    value={shippingInfo.city}
                    onChange={onChange}
                  />
                  {errors.city && (
                    <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Postal Code
                  </label>
                  <input
                    name="postalCode"
                    placeholder="Postal Code"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.postalCode ? "border-red-500" : "border-gray-300"
                    }`}
                    value={shippingInfo.postalCode}
                    onChange={onChange}
                  />
                  {errors.postalCode && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.postalCode}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country
                  </label>
                  <input
                    name="country"
                    placeholder="Country"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.country ? "border-red-500" : "border-gray-300"
                    }`}
                    value={shippingInfo.country}
                    onChange={onChange}
                  />
                  {errors.country && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.country}
                    </p>
                  )}
                </div>
              </div>

              {/* Payment Method */}
              <div className="pt-6">
                <h3 className="text-xl font-bold mb-6 text-gray-800">
                  Payment Method
                </h3>

                <div className="space-y-4">
                  {/* Card Payment Option */}
                  <div className="flex items-start">
                    <input
                      type="radio"
                      id="card"
                      name="paymentMethod"
                      value="card"
                      checked={paymentMethod === "card"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mt-1"
                    />
                    <label htmlFor="card" className="ml-3 block w-full">
                      <div className="flex items-center">
                        <div className="w-8 h-5 bg-blue-600 rounded mr-2 flex items-center justify-center">
                          <span className="text-xs font-bold text-white">
                            CC
                          </span>
                        </div>
                        <span className="text-gray-700 font-medium">
                          Credit/Debit Card
                        </span>
                      </div>

                      {/* Stripe Elements Form */}
                      {paymentMethod === "card" && (
                        <div className="mt-4 p-4 border rounded bg-gray-50">
                          {clientSecret ? (
                            <Elements
                              stripe={stripePromise}
                              options={{ clientSecret }}
                            >
                              <PaymentForm
                                amount={total}
                                onSuccess={handlePaymentSuccess}
                                onError={handlePaymentError}
                              />
                            </Elements>
                          ) : (
                            <div className="text-sm text-gray-500">
                              Loading secure payment details...
                            </div>
                          )}
                        </div>
                      )}
                    </label>
                  </div>

                  {/* Cash on Delivery Option */}
                  <div className="flex items-start">
                    <input
                      type="radio"
                      id="cod"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === "cod"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mt-1"
                    />
                    <label htmlFor="cod" className="ml-3 block">
                      <div className="flex items-center">
                        <div className="w-8 h-5 bg-gray-600 rounded mr-2 flex items-center justify-center">
                          <span className="text-xs font-bold text-white">
                            COD
                          </span>
                        </div>
                        <span className="text-gray-700 font-medium">
                          Cash on Delivery
                        </span>
                      </div>
                    </label>
                  </div>

                  {/* UPI Payment Option (if applicable) */}
                  <div className="flex items-start">
                    <input
                      type="radio"
                      id="upi"
                      name="paymentMethod"
                      value="upi"
                      checked={paymentMethod === "upi"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mt-1"
                    />
                    <label htmlFor="upi" className="ml-3 block">
                      <div className="flex items-center">
                        <div className="w-8 h-5 bg-green-600 rounded mr-2 flex items-center justify-center">
                          <span className="text-xs font-bold text-white">
                            UPI
                          </span>
                        </div>
                        <span className="text-gray-700 font-medium">
                          UPI Payment
                        </span>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Place Order Button */}
              {paymentMethod !== "card" && (
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-3 px-4 rounded-lg text-white font-medium ${
                      loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
                    } transition shadow-md`}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Processing...
                      </div>
                    ) : (
                      `Place Order - ₹ ${total.toFixed(2)}`
                    )}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit sticky top-8">
          <h3 className="text-xl font-bold mb-6 text-gray-800">
            Order Summary
          </h3>

          <div className="space-y-4">
            {cart.map((item) => (
              <div
                key={item._id}
                className="flex justify-between items-center py-3 border-b border-gray-100"
              >
                <div className="flex items-center">
                  <img
                    src={item.image || "https://placeholder.co/60x60"}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded mr-4"
                  />
                  <div>
                    <h4 className="font-medium text-gray-800">{item.name}</h4>
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                  </div>
                </div>
                <p className="font-medium">
                  ₹ {(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}

            <div className="pt-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">₹ {subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium text-green-600">Free</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span className="font-medium">₹ {tax.toFixed(2)}</span>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>₹ {total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Shipping Info Summary */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <h4 className="font-medium text-gray-800 mb-2">
                Shipping Address
              </h4>
              <p className="text-sm text-gray-600">{shippingInfo.address}</p>
              <p className="text-sm text-gray-600">
                {shippingInfo.city}, {shippingInfo.postalCode}
              </p>
              <p className="text-sm text-gray-600">{shippingInfo.country}</p>
            </div>

            {/* Payment Method Summary */}
            <div className="mt-4">
              <h4 className="font-medium text-gray-800 mb-2">Payment Method</h4>
              <p className="text-sm text-gray-600 capitalize">
                {paymentMethod.replace("_", " ")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
