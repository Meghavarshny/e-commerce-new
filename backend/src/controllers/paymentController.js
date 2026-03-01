const Razorpay = require("razorpay");
const crypto = require("crypto");

// Move initialization inside the handlers to pick up .env changes without restart (optional but safer for some envs)
// or just use a factory function.
const getRazorpay = () => {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret || keySecret === "YOUR_RAZORPAY_SECRET_HERE") {
    throw new Error("Razorpay Keys are missing or invalid. Please check your .env file.");
  }

  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
};

// Create Order (Razorpay)
exports.createRazorpayOrder = async (req, res) => {
  try {
    const { amount } = req.body; // Amount should be in INR

    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount provided." });
    }

    const razorpay = getRazorpay();

    const options = {
      amount: Math.round(amount * 100), // Razorpay expects amount in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error("Razorpay Order Error:", error);
    res.status(500).json({ 
      message: "Razorpay Order Creation Failed",
      error: error.message,
      hint: error.message.includes("Key ID") ? "Check your RAZORPAY_KEY_ID in .env" : "Check your RAZORPAY_KEY_SECRET in .env"
    });
  }
};

// Verify Signature (Razorpay)
exports.verifySignature = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: "Missing required payment fields." });
    }

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      return res.status(200).json({ message: "Payment verified successfully", success: true });
    } else {
      return res.status(400).json({ message: "Invalid signature", success: false });
    }
  } catch (error) {
    console.error("Razorpay Verification Error:", error);
    res.status(500).json({ error: error.message });
  }
};
