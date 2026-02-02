"use client";

import { subscriptionAPI } from "@/lib/api";

export default function UpgradeButton({ onSuccess }) {
  const loadRazorpay = () =>
    new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const handleUpgrade = async () => {
    const loaded = await loadRazorpay();
    if (!loaded) return alert("Razorpay failed to load");

    try {
      const { data: order } = await subscriptionAPI.createOrder();

      const rzp = new window.Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        order_id: order.id,
        name: "Food Not Waste",
        description: "Organisation Subscription",
        handler: async (res) => {
          await subscriptionAPI.verifyPayment({
            razorpay_order_id: res.razorpay_order_id,
            razorpay_payment_id: res.razorpay_payment_id,
            razorpay_signature: res.razorpay_signature,
          });

          alert("✅ Subscription Activated");
          onSuccess(); // 🔑 IMPORTANT
        },
        theme: { color: "#16a34a" },
      });

      rzp.open();
    } catch {
      alert("Payment failed");
    }
  };

  return (
    <button
      onClick={handleUpgrade}
      className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold"
    >
      Upgrade ₹1500 / month
    </button>
  );
}
