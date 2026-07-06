import { useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

export default function PaymentConfirmationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state;
  const orderData = state?.order;

  useEffect(() => {
    if (!state?.success) {
      navigate("/");
    }
  }, [state, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden p-8 text-center"
      >
        <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${state?.orderFailed ? "bg-yellow-100" : "bg-green-100"}`}>
          {state?.orderFailed ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>

        <h2 className={`text-3xl font-bold mb-2 ${state?.orderFailed ? "text-yellow-800" : "text-gray-900"}`}>
          {state?.orderFailed ? "Payment Received — Order Pending" : "Payment Successful!"}
        </h2>
        <p className="text-gray-600 mb-8">
          {state?.orderFailed
            ? "Your payment was successful, but we encountered an issue creating your order. Our team has been notified and will resolve it shortly. Please contact support with your transaction ID."
            : "Thank you for your purchase. Your order has been placed successfully and is being processed."
          }
        </p>

        {orderData && (
          <div className="bg-gray-50 rounded-xl p-4 mb-4 text-left border border-gray-100">
            <div className="flex justify-between mb-2">
              <span className="text-gray-500 text-sm">Order ID:</span>
              <span className="font-semibold text-gray-900 text-sm">#{orderData._id?.slice(-8).toUpperCase()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 text-sm">Transaction ID:</span>
              <span className="font-mono text-gray-900 text-xs">{orderData.paymentInfo?.transactionId}</span>
            </div>
          </div>
        )}

        {state?.orderFailed && state?.transactionId && (
          <div className="bg-yellow-50 rounded-xl p-4 mb-8 text-left border border-yellow-200">
            <div className="flex justify-between mb-2">
              <span className="text-yellow-700 text-sm font-medium">Transaction ID:</span>
              <span className="font-mono text-yellow-800 text-xs">{state.transactionId}</span>
            </div>
            <p className="text-yellow-700 text-xs mt-2">
              Please save this transaction ID for reference. Contact support if your order does not appear within 24 hours.
            </p>
          </div>
        )}

        <div className="space-y-3">
          <Link 
            to={state?.orderFailed ? "/orders" : "/orders"} 
            className="block w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition shadow-md"
          >
            View My Orders
          </Link>
          <Link 
            to="/" 
            className="block w-full py-3 bg-white text-gray-700 font-semibold rounded-xl border border-gray-200 hover:bg-gray-50 transition"
          >
            Continue Shopping
          </Link>
          {state?.orderFailed && (
            <Link
              to="/orders"
              className="block w-full py-3 bg-gray-100 text-gray-600 font-semibold rounded-xl border border-gray-200 hover:bg-gray-200 transition"
            >
              Check My Orders
            </Link>
          )}
        </div>
      </motion.div>
    </div>
  );
}
