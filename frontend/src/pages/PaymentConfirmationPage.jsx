import { useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

export default function PaymentConfirmationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const orderData = location.state?.order;

  useEffect(() => {
    if (!location.state?.success) {
      navigate("/");
    }
  }, [location, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden p-8 text-center"
      >
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
        <p className="text-gray-600 mb-8">
          Thank you for your purchase. Your order has been placed successfully and is being processed.
        </p>

        {orderData && (
          <div className="bg-gray-50 rounded-xl p-4 mb-8 text-left border border-gray-100">
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

        <div className="space-y-3">
          <Link 
            to="/orders" 
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
        </div>
      </motion.div>
    </div>
  );
}
