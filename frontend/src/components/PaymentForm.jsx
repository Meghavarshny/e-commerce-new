import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useState } from "react";

export default function PaymentForm({ amount, onSuccess, onError }) {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/orders`,
      },
      redirect: "if_required",
    });

    if (error) {
      setMessage(error.message);
      onError(error.message);
      setIsProcessing(false);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      setMessage("Payment Status: " + paymentIntent.status);
      onSuccess(paymentIntent);
      setIsProcessing(false);
    } else {
      setMessage("Unexpected state");
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <PaymentElement />
      {message && <div className="text-red-500 mt-2 text-sm">{message}</div>}
      <button
        disabled={isProcessing || !stripe || !elements}
        id="submit"
        className="mt-4 w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 disabled:opacity-50 transition"
      >
        <span id="button-text">
          {isProcessing ? "Processing..." : `Pay ₹${amount}`}
        </span>
      </button>
    </form>
  );
}
