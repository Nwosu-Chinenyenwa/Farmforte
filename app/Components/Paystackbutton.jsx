"use client";
import React, { useState, useEffect } from "react";
import { PaystackButton } from "react-paystack";
import toast, { Toaster } from "react-hot-toast";

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + (item.unit_price ?? item.price ?? 0) * (item.quantity ?? 1),
    0
  );

  const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;

  const handleSuccess = async (reference) => {
    // Payment was successful, create the order in Supabase
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: "anonymous", // replace with logged-in user id if available
          status: "paid",
          currency: "NGN",
          amount: totalAmount,
          item_count: cartItems.length,
          metadata: { items: cartItems },
          stripe_session_id: reference.reference,
        }),
      });

      const result = await res.json();
      if (res.ok) {
        toast.success("Payment successful and order saved!");
        setCartItems([]);
        localStorage.removeItem("local_cart");
      } else {
        console.error(result.error);
        toast.error("Order creation failed after payment.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error while creating order.");
    }
  };

  const handleClose = () => {
    toast("Payment cancelled");
  };

  return (
    <>
      <h1>Checkout</h1>
      <PaystackButton
        text="Pay Now"
        email="nwosuchinenyenwa4@gmail.com" // replace with actual email from billing
        amount={totalAmount * 100} 
        currency="NGN"
        publicKey={publicKey}
        onSuccess={handleSuccess}
        onClose={handleClose}
      />
      <Toaster />
    </>
  );
}
