import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import useOrders from "../hooks/useOrders";
import { useNavigate } from "react-router-dom";
import useNotification from "../hooks/useNotification";
import Notification from "../components/Notification";
import useApi from "../hooks/useApi";

const PAYMENT_ICONS = {
  card: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
  ),
  upi: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  ),
  cod: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),
};

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const { placeOrder } = useOrders();
  const { api } = useApi();
  const navigate = useNavigate();
  const { notification, showNotification, hideNotification } =
    useNotification();

  const [shippingInfo, setShippingInfo] = useState({
    name: user?.name || "",
    email: user?.email || "",
    address: user?.address || "",
    city: user?.city || "",
    postalCode: user?.postalCode || "",
    country: user?.country || "",
  });

  const [paymentMethod, setPaymentMethod] = useState("card");
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

  // Validate shipping information
  const validateShipping = () => {
    const newErrors = {};

    if (!shippingInfo.address.trim() || shippingInfo.address.trim().length < 5) {
      newErrors.address = "Address must be at least 5 characters";
    }

    if (!shippingInfo.city.trim() || shippingInfo.city.trim().length < 2) {
      newErrors.city = "City is required (min 2 characters)";
    }

    if (!shippingInfo.postalCode.trim() || shippingInfo.postalCode.trim().length < 3) {
      newErrors.postalCode = "Postal code must be at least 3 characters";
    }

    if (!shippingInfo.country.trim() || shippingInfo.country.trim().length < 2) {
      newErrors.country = "Country is required (min 2 characters)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRazorpayPayment = async () => {
    if (!validateShipping()) return;

    setLoading(true);
    try {
      if (!window.Razorpay) {
        showNotification("Razorpay SDK not loaded. Please refresh the page.", "error");
        setLoading(false);
        return;
      }
      // 1. Create Razorpay Order in Backend
      const { data: orderData } = await api.post("/payment/create-razorpay-order", {
        amount: total,
      });

      // 2. Configure Razorpay Options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Modern E-Commerce",
        description: "Purchase of products",
        order_id: orderData.id,
        handler: async function (response) {
          // 3. Verify Signature in Backend
          try {
            const { data: verifyData } = await api.post("/payment/verify-signature", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyData.success) {
              // 4. Place Final Order in Database
              const orderData = {
                items: cart.map((item) => ({
                  product: item._id,
                  seller: item.seller?._id || item.seller || user.id,
                  quantity: Number(item.quantity),
                  price: Number(item.price),
                })),
                shippingInfo: {
          ...shippingInfo,
          name: user.name,
          email: user.email,
        },
                paymentInfo: {
                  method: paymentMethod,
                  status: "Paid",
                  transactionId: response.razorpay_payment_id,
                },
              };

              try {
                const order = await placeOrder(orderData);
                clearCart();
                showNotification("Order placed successfully!");
                navigate("/payment-confirmation", { state: { success: true, order } });
              } catch (orderErr) {
                const detail = orderErr.validationErrors
                  ? orderErr.validationErrors.map(e => e.field + ": " + e.message).join("; ")
                  : orderErr.userMessage;
                console.error("Order placement failed after payment:", detail);
                navigate("/payment-confirmation", {
                  state: {
                    success: true,
                    paymentSuccess: true,
                    orderFailed: true,
                    transactionId: response.razorpay_payment_id,
                    errorMsg: detail,
                  },
                });
              }
            } else {
              showNotification("Payment verification failed", "error");
              setLoading(false);
            }
          } catch (err) {
            showNotification("Verification Error: " + err.message, "error");
            setLoading(false);
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: {
          color: "#3B82F6",
        },
        modal: {
            ondismiss: function() {
                setLoading(false);
            }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Razorpay Error:", err);
      const errorMsg = err.response?.data?.message || err.message;
      const hint = err.response?.data?.hint || "";
      showNotification(`Failed to initiate payment: ${errorMsg}. ${hint}`, "error");
      setLoading(false);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!validateShipping()) return;

    if (paymentMethod === "card" || paymentMethod === "upi") {
      handleRazorpayPayment();
      return;
    }

    // Handle COD
    setLoading(true);
    try {
      const order = await placeOrder({
        items: cart.map((item) => ({
          product: item._id,
          seller: item.seller?._id || item.seller || user.id,
          quantity: Number(item.quantity),
          price: Number(item.price),
        })),
        shippingInfo: {
          ...shippingInfo,
          name: user.name,
          email: user.email,
        },
        paymentInfo: {
          method: paymentMethod,
          status: "Pending",
        },
      });
      clearCart();
      showNotification("Order placed successfully!");
      navigate("/orders", { state: { success: true, order } });
    } catch (err) {
      showNotification(err?.response?.data?.message || err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const onChange = (e) => {
    setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
  };

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-10 text-center max-w-sm w-full border border-gray-100">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-5">
            <svg className="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Login Required</h3>
          <p className="text-gray-500 mb-8">Please log in to your account to proceed with checkout</p>
          <button onClick={() => navigate("/login")} className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-200">Login to Continue</button>
        </div>
      </div>
    );
  }

  if (!cart || cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-10 text-center max-w-sm w-full border border-gray-100">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-5">
            <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Your Cart is Empty</h3>
          <p className="text-gray-500 mb-8">Add some items before checking out</p>
          <button onClick={() => navigate("/")} className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-200">Continue Shopping</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-10">
          <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Secure Checkout</h1>
            <p className="text-sm text-gray-500 font-medium">Complete your purchase in a few steps</p>
          </div>
        </div>

        {notification && <Notification {...notification} onClose={hideNotification} />}

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/40 border border-gray-100 overflow-hidden">
              <div className="px-8 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white text-sm font-bold shadow-md shadow-blue-200">1</span>
                  <div>
                    <h3 className="font-bold text-gray-900">Shipping Information</h3>
                    <p className="text-xs text-gray-500">Where should we deliver your order?</p>
                  </div>
                </div>
              </div>
              <form id="checkout-form" onSubmit={onSubmit} className="p-8 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
                    <input type="text" value={user?.name || ""} disabled className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-500 text-sm cursor-not-allowed" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
                    <input type="email" value={user?.email || ""} disabled className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-500 text-sm cursor-not-allowed" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Delivery Address</label>
                  <input name="address" placeholder="Street address, apartment, building" className={`w-full px-4 py-2.5 border-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition ${errors.address ? "border-red-400 bg-red-50" : "border-gray-200 bg-white hover:border-gray-300"}`} value={shippingInfo.address} onChange={onChange} />
                  {errors.address && <p className="text-red-500 text-xs font-medium mt-1.5 flex items-center gap-1"><svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>{errors.address}</p>}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">City</label>
                    <input name="city" placeholder="e.g. Mumbai" className={`w-full px-4 py-2.5 border-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition ${errors.city ? "border-red-400 bg-red-50" : "border-gray-200 bg-white hover:border-gray-300"}`} value={shippingInfo.city} onChange={onChange} />
                    {errors.city && <p className="text-red-500 text-xs font-medium mt-1.5 flex items-center gap-1"><svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>{errors.city}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Postal Code</label>
                    <input name="postalCode" placeholder="e.g. 400001" className={`w-full px-4 py-2.5 border-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition ${errors.postalCode ? "border-red-400 bg-red-50" : "border-gray-200 bg-white hover:border-gray-300"}`} value={shippingInfo.postalCode} onChange={onChange} />
                    {errors.postalCode && <p className="text-red-500 text-xs font-medium mt-1.5 flex items-center gap-1"><svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>{errors.postalCode}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Country</label>
                    <input name="country" placeholder="e.g. India" className={`w-full px-4 py-2.5 border-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition ${errors.country ? "border-red-400 bg-red-50" : "border-gray-200 bg-white hover:border-gray-300"}`} value={shippingInfo.country} onChange={onChange} />
                    {errors.country && <p className="text-red-500 text-xs font-medium mt-1.5 flex items-center gap-1"><svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>{errors.country}</p>}
                  </div>
                </div>
              </form>
            </div>

            <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/40 border border-gray-100 overflow-hidden">
              <div className="px-8 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white text-sm font-bold shadow-md shadow-blue-200">2</span>
                  <div>
                    <h3 className="font-bold text-gray-900">Payment Method</h3>
                    <p className="text-xs text-gray-500">Choose how you'd like to pay</p>
                  </div>
                </div>
              </div>
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { id: "card", label: "Credit / Debit Card", color: "bg-blue-600", desc: "Secure Razorpay popup" },
                    { id: "upi", label: "UPI / QR", color: "bg-emerald-600", desc: "Pay via UPI app" },
                    { id: "cod", label: "Cash on Delivery", color: "bg-gray-700", desc: "Pay when delivered" },
                  ].map((method) => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setPaymentMethod(method.id)}
                      className={`relative flex flex-col items-center gap-3 p-5 rounded-xl border-2 transition-all text-center ${
                        paymentMethod === method.id
                          ? `${method.color} border-transparent shadow-lg scale-[1.02]`
                          : "border-gray-200 bg-white hover:bg-gray-50 hover:shadow-sm"
                      }`}
                    >
                      {paymentMethod === method.id && (
                        <div className="absolute top-2 right-2 w-5 h-5 bg-white/30 rounded-full flex items-center justify-center backdrop-blur-sm">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                        </div>
                      )}
                      <div className={`w-10 h-7 ${method.color} rounded-lg flex items-center justify-center shadow-sm ${paymentMethod === method.id ? "opacity-90" : ""}`}>
                        <span className="text-[10px] font-black text-white tracking-wider">{method.id === "card" ? "CC" : method.id.toUpperCase()}</span>
                      </div>
                      <div>
                        <p className={`text-sm font-bold ${paymentMethod === method.id ? "text-white" : "text-gray-800"}`}>{method.label}</p>
                        <p className={`text-[10px] mt-0.5 ${paymentMethod === method.id ? "text-white/80" : "text-gray-500"}`}>{method.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              type="submit"
              form="checkout-form"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-2xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-xl shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  {paymentMethod === "cod" ? "Place Order" : "Pay & Place Order"}
                  <span className="bg-white/20 px-3 py-1 rounded-lg text-sm">₹ {total.toFixed(2)}</span>
                </>
              )}
            </button>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/40 border border-gray-100 sticky top-8">
              <div className="px-6 py-5 border-b border-gray-100">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Order Summary
                  <span className="ml-auto text-sm font-medium text-gray-400">({cart.length} item{cart.length !== 1 ? "s" : ""})</span>
                </h3>
              </div>
              <div className="p-6 space-y-4 max-h-[400px] overflow-y-auto">
                {cart.map((item) => (
                  <div key={item._id} className="flex gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 shadow-sm">
                      <img src={item.image || "https://placehold.jp/60x60"} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-gray-800 truncate">{item.name}</h4>
                      <p className="text-xs text-gray-500 mt-0.5">Qty: {item.quantity}</p>
                      <p className="text-sm font-bold text-gray-900 mt-1">₹ {(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-6 py-5 border-t border-gray-100 bg-gradient-to-b from-gray-50 to-white rounded-b-2xl space-y-3">
                <div className="flex justify-between text-sm"><span className="text-gray-500">Subtotal</span><span className="font-semibold text-gray-800">₹ {subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-500">Shipping</span><span className="font-semibold text-emerald-600">Free</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-500">Tax (10%)</span><span className="font-semibold text-gray-800">₹ {tax.toFixed(2)}</span></div>
                <div className="border-t border-gray-200 pt-3 mt-3">
                  <div className="flex justify-between text-base"><span className="font-bold text-gray-900">Total</span><span className="font-black text-gray-900 text-lg">₹ {total.toFixed(2)}</span></div>
                </div>
                <div className="flex items-center gap-2 pt-2 text-xs text-gray-400">
                  <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Secure checkout via Razorpay
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
