"use client";

import { subscriptionAPI } from "@/lib/api";

export default function UpgradeButton() {

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
    const ok = await loadRazorpay();
    if (!ok) {
      alert("Razorpay SDK failed to load");
      return;
    }

    // 🔑 organization data from localStorage
    const org = JSON.parse(localStorage.getItem("organization"));
    if (!org) {
      alert("Please login again");
      return;
    }

    // 1️⃣ create order
    const orderRes = await subscriptionAPI.createOrder();
    const order = orderRes.data;

    // 2️⃣ Razorpay popup
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: "INR",
      order_id: order.id,

      name: "Food Not Waste",
      description: "Monthly Organisation Subscription",

      // 🔥🔥 THIS IS THE FIX 🔥🔥
      notes: {
        userId: org.userId,   // 👈 VERY IMPORTANT
      },

      handler: async function () {
        alert("✅ Payment successful. Subscription will activate shortly.");
        window.location.reload();
      },

      theme: { color: "#16a34a" },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <button
      onClick={handleUpgrade}
      className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold"
    >
      Upgrade ₹1000 / month
    </button>
  );
}
