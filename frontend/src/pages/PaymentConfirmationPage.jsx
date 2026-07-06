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

  const isError = state?.orderFailed;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="max-w-md w-full bg-white rounded-3xl shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden"
      >
        <div className={`px-8 pt-10 pb-6 text-center ${isError ? "bg-gradient-to-br from-yellow-400 to-yellow-500" : "bg-gradient-to-br from-emerald-400 to-emerald-500"}`}>
          <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto shadow-lg">
            {isError ? (
              <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
          <h2 className="text-2xl font-bold text-white mt-5 mb-1">
            {isError ? "Payment Received" : "Payment Successful!"}
          </h2>
          <p className="text-sm text-white/80 font-medium">
            {isError ? "We're confirming your order" : "Your order is being processed"}
          </p>
        </div>

        <div className="px-8 py-6 space-y-5">
          {!isError && orderData && (
            <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Order ID</span>
                <span className="text-sm font-bold text-gray-900 font-mono">#{orderData._id?.slice(-8).toUpperCase()}</span>
              </div>
              <div className="h-px bg-gray-200" />
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Transaction</span>
                <span className="text-xs font-mono text-gray-700 truncate ml-4 max-w-[180px]">{orderData.paymentInfo?.transactionId}</span>
              </div>
            </div>
          )}

          {isError && state?.transactionId && (
            <div className="bg-yellow-50 rounded-2xl p-5 border border-yellow-200 space-y-3">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-yellow-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01" />
                </svg>
                <span className="text-xs font-bold text-yellow-800 uppercase tracking-wider">Transaction ID</span>
              </div>
              <p className="text-sm font-mono text-yellow-900 bg-yellow-100/50 rounded-lg px-3 py-2 break-all">{state.transactionId}</p>
              <p className="text-xs text-yellow-700 leading-relaxed">
                Your payment was successful. If your order doesn't appear within 24 hours, please contact support with the transaction ID above.
              </p>
            </div>
          )}

          <div className="space-y-3 pt-2">
            <Link
              to="/orders"
              className="flex items-center justify-center gap-2 w-full py-3.5 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              View My Orders
            </Link>
            <Link
              to="/"
              className="flex items-center justify-center gap-2 w-full py-3.5 bg-white text-gray-700 font-bold rounded-2xl border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Continue Shopping
            </Link>
          </div>

          <div className="flex items-center justify-center gap-4 text-xs text-gray-400 pt-2">
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Secured
            </div>
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Instant confirmation
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
