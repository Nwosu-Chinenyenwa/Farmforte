"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import toast, { Toaster } from "react-hot-toast";

// ✅ dynamically import PaystackButton to avoid "window is not defined" error
const PaystackButton = dynamic(
  () => import("react-paystack").then((mod) => mod.PaystackButton),
  { ssr: false }
);

export default function CheckoutPage() {
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [name, setName] = useState("");

  // ✅ get Paystack public key from environment
  const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;

  // ✅ Paystack configuration
  const componentProps = {
    email: email || "nwosuchinenyenwa4@gmail.com", // fallback email
    amount: amount ? parseInt(amount) * 100 : 0, // convert to kobo
    metadata: {
      name,
    },
    publicKey,
    text: "Pay Now",
    currency: "NGN",
    onSuccess: (ref) => {
      toast.success("Payment successful! Reference: " + ref.reference);
      console.log("✅ Payment success:", ref);

      // you can send order data to your backend here
      // fetch("/api/orders", { method: "POST", body: JSON.stringify({...}) })
    },
    onClose: () => {
      toast.error("Payment cancelled.");
      console.log("❌ Payment closed");
    },
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-4 text-[#209e2e]">Checkout Page</h1>

      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6">
        <label className="block mb-3">
          Full Name:
          <input
            type="text"
            placeholder="Enter your name"
            className="border p-3 w-full rounded mt-1"
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>

        <label className="block mb-3">
          Email Address:
          <input
            type="email"
            placeholder="Enter your email"
            className="border p-3 w-full rounded mt-1"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <label className="block mb-6">
          Amount (₦):
          <input
            type="number"
            placeholder="Amount in NGN"
            className="border p-3 w-full rounded mt-1"
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </label>

        {/* ✅ Paystack payment button */}
        {publicKey ? (
          <PaystackButton
            className="w-full bg-[#209e2e] text-white font-bold py-3 rounded-lg hover:bg-green-700 transition"
            {...componentProps}
          />
        ) : (
          <p className="text-red-600 text-center">
            ⚠️ Paystack public key missing. Check your .env.local file.
          </p>
        )}
      </div>

      <Toaster />
    </div>
  );
}
