"use client";

import React, { useState, useEffect, useRef } from "react";
import AllNav from "../Components/AllNav";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@supabase/supabase-js";
import logo from "../../public/img/logo-two.png";
import eggplant from "../../public/img/eggplant.png";
import pawpaw from "../../public/asset/pawpaw.webp";
import logo2 from "../../public/asset/FARMFORTE 5.jpg";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function page() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paystackLoaded, setPaystackLoaded] = useState(false);
  const paymentTimeoutRef = useRef(null);

  const route = useRouter();

  const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "";

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (window.PaystackPop) {
      setPaystackLoaded(true);
      return;
    }

    const existing = document.getElementById("paystack-inline-js");
    if (existing) {
      existing.addEventListener("load", () => setPaystackLoaded(true));
      return;
    }

    const script = document.createElement("script");
    script.id = "paystack-inline-js";
    script.src = "https://js.paystack.co/v1/inline.js";
    script.async = true;
    script.onload = () => {
      console.log("Paystack script loaded");
      setPaystackLoaded(true);
    };
    script.onerror = () => {
      console.error("Failed to load Paystack script");
      toast.error("Failed to load payment provider. Try again later.");
    };
    document.body.appendChild(script);
  }, []);

  const waitForPaystackReady = (timeoutMs = 10000) => {
    return new Promise((resolve) => {
      if (paystackLoaded && window.PaystackPop) return resolve(true);

      const start = Date.now();
      const interval = setInterval(() => {
        if (window.PaystackPop) {
          clearInterval(interval);
          setPaystackLoaded(true);
          return resolve(true);
        }
        if (Date.now() - start > timeoutMs) {
          clearInterval(interval);
          return resolve(false);
        }
      }, 200);
    });
  };

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/cart/get");
      if (res.ok) {
        const json = await res.json();
        setCartItems(json.data || []);
      } else {
        const raw = localStorage.getItem("local_cart") || "[]";
        setCartItems(JSON.parse(raw));
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  const subtotal = cartItems.reduce((sum, item) => {
    const price = Number(item.unit_price ?? item.price ?? 0);
    const qty = Number(item.quantity ?? 1);
    return sum + price * qty;
  }, 0);
  const shipping = 0;
  const total = subtotal + shipping;

  const clearPaymentTimeout = () => {
    if (paymentTimeoutRef.current) {
      clearTimeout(paymentTimeoutRef.current);
      paymentTimeoutRef.current = null;
    }
  };

const openPaystackPopup = (amountNGN = 0, customerEmail = "", customerName = "", orderDetails = {}) => {
  if (typeof window === "undefined") {
    toast.error("Payment must be triggered in the browser.");
    setIsProcessing(false);
    return;
  }

  console.log("openPaystackPopup run — paystackLoaded:", paystackLoaded, "window.PaystackPop:", !!window.PaystackPop, "publicKey:", publicKey);

  if (!window.PaystackPop || !paystackLoaded) {
    console.error("Paystack not ready (synchronous check).");
    toast.error("Payment provider not ready. Try again in a moment.");
    setIsProcessing(false);
    return;
  }

  if (!publicKey) {
    console.error("Missing NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY");
    toast.error("Paystack public key not configured.");
    setIsProcessing(false);
    return;
  }

  function onSuccess(response) {
    console.log("Paystack callback response (raw):", response);
    clearPaymentTimeout();
    toast.success("Payment successful! Reference: " + response.reference);

    (async () => {
      try {
        const payload = { ...orderDetails, payment_reference: response.reference, status: "paid" };
        const res = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const result = await res.json();

        if (res.ok) {
          toast.success("Order saved successfully!");
          localStorage.removeItem("local_cart");
          setCartItems([]);
        } else {
          console.error("Order save error:", result);
          toast.error("Failed to save order: " + (result.error || "Unknown"));
        }
      } catch (err) {
        console.error("Network error while saving order:", err);
        toast.error("Network error saving order. Please contact support.");
      } finally {
        setIsProcessing(false);
      }
    })().catch((err) => {
      console.error("Unexpected error in onSuccess async handler:", err);
      setIsProcessing(false);
    });
  }

  function onClosed() {
    console.log("Paystack window closed by user (onClose).");
    clearPaymentTimeout();
    toast("Payment window closed.");
    setIsProcessing(false);
  }

  try {
    const handler = window.PaystackPop.setup({
      key: publicKey,
      email: customerEmail || "nwosuchinenyenwa4@gmail.com",
      amount: Math.round(Number(amountNGN) * 100),
      currency: "NGN",
      ref: "ref_" + Date.now(),
      metadata: {
        custom_fields: [{ display_name: "First Name", variable_name: "first_name", value: customerName || "" }],
      },
      callback: onSuccess,
      onClose: onClosed,   
    });

    paymentTimeoutRef.current = setTimeout(() => {
      paymentTimeoutRef.current = null;
      console.error("Payment fallback timeout fired — no callback/onClose received");
      toast.error("Payment did not start. Please try again or check your popup blocker.");
      setIsProcessing(false);
    }, 20000);

    handler.openIframe();
    console.log("handler.openIframe() called (synchronously).");
  } catch (err) {
    console.error("Failed to open paystack iframe (setup/open):", err);
    clearPaymentTimeout();
    toast.error("Could not open payment window. Try again.");
    setIsProcessing(false);
  }
};



  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isProcessing) return;

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    if (!data.first_name || !data.last_name || !data.phone || !data.state) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setIsProcessing(true);

    const orderDetails = {
      user_id: "anonymous",
      status: "pending",
      currency: "NGN",
      amount: total,
      item_count: cartItems.length,
      metadata: {
        ...data,
        items: cartItems,
      },
      stripe_session_id: null,
    };

    setName(data.first_name || "");
    setEmail(data.email || "");

    openPaystackPopup(total, data.email || "", data.first_name || "", orderDetails);
  };

  useEffect(() => {
    return () => clearPaymentTimeout();
  }, []);

  return (
    <>
      <section>
        <header>
          <nav className="flex justify-between border-b-1 bg-white border-[#0000001e] px-10 xl:px-20 py-5 items-center">
            <Image
              className="lg:w-[15vw] lg:h-[8vh] rounded-bl-3xl"
              src={logo2}
              alt="logo"
            />
            <Link href={"/Shop"}>
              <svg
                className="w-7 text-[#333333] cursor-pointer transition hover:text-[#209e2e]"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12.0049 0.999695C14.7663 0.999695 17.0049 3.23827 17.0049 5.99969V7.99969H20.0049C20.5572 7.99969 21.0049 8.44741 21.0049 8.99969V20.9997C21.0049 21.552 20.5572 21.9997 20.0049 21.9997H4.00488C3.4526 21.9997 3.00488 21.552 3.00488 20.9997V8.99969C3.00488 8.44741 3.4526 7.99969 4.00488 7.99969H7.00488V5.99969C7.00488 3.23827 9.24346 0.999695 12.0049 0.999695ZM17.0049 10.9997H15.0049V11.9997C15.0049 12.552 15.4526 12.9997 16.0049 12.9997C16.5177 12.9997 16.9404 12.6137 16.9982 12.1163L17.0049 11.9997V10.9997ZM9.00488 10.9997H7.00488V11.9997C7.00488 12.552 7.4526 12.9997 8.00488 12.9997C8.51772 12.9997 8.94039 12.6137 8.99815 12.1163L9.00488 11.9997V10.9997ZM12.0049 2.99969C10.4072 2.99969 9.10122 4.24861 9.00998 5.82342L9.00488 5.99969V7.99969H15.0049V5.99969C15.0049 4.40201 13.756 3.09603 12.1812 3.00479L12.0049 2.99969Z"></path>
              </svg>
            </Link>
          </nav>
        </header>

        <div className="w-[90vw] font-[600] bg-white text-[#333333] m-auto border-t-3 my-20 p-5 border-black shadow-lg ">
          <span className="flex items-center gap-1 flex-wrap">
            <span className="flex flex-nowrap gap-1">
              <svg
                className="w-5 font-extrabold"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M5 22C4.44772 22 4 21.5523 4 21V3C4 2.44772 4.44772 2 5 2H19C19.5523 2 20 2.44772 20 3V6H18V4H6V20H18V18H20V21C20 21.5523 19.5523 22 19 22H5ZM18 16V13H11V11H18V8L23 12L18 16Z"></path>
              </svg>
              <p>Returning customer?</p>
            </span>
            <Link href={"/Login"}>
              <p onClick={() => route.back()} className="hover:text-[#209e2e] animate-pulse transition cursor-pointer">
                click me to return to last page
              </p>
            </Link>
          </span>
        </div>

        <form onSubmit={handleSubmit}>
          <section className="border-t-1 w-[90vw] m-auto flex justify-center py-10 text-[#333333] border-[#0000001e] ">
            <div className="lg:w-[40vw] justify-end ">
              <h3 className="rajdhani-light font-bold text-3xl border-b-1 border-[#0000001e] pb-1 mb-10">
                Billing Details
              </h3>

              <div className="flex flex-col gap-3 mb-5">
                <label
                  htmlFor="country"
                  className="text-[20px] rajdhani-light font-[500]"
                >
                  Country*
                </label>
                <select
                  id="country"
                  name="country"
                  required
                  className="w-full border-1 border-[#0000001e] transition cursor-pointer hover:border-[#209e2e] rounded px-4 py-3 outline-none"
                >
                  <option value="Nigeria">Nigeria</option>
                  <option value="Nigeria">Nigeria</option>
                </select>
              </div>

              <div className="flex gap-4 mb-5">
                <span>
                  <label
                    htmlFor="first_name"
                    className="text-[20px] rajdhani-light font-[500]"
                  >
                    First Name*
                  </label>
                  <input
                    name="first_name"
                    className="w-full border-1 border-[#0000001e] transition cursor-pointer hover:border-[#209e2e] focus:border-[#209e2e] rounded px-4 py-3 outline-none"
                    type="text"
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </span>
                <span>
                  <label
                    htmlFor="last_name"
                    className="text-[20px] rajdhani-light font-[500]"
                  >
                    Last Name*
                  </label>
                  <input
                    name="last_name"
                    className="w-full border-1 border-[#0000001e] transition cursor-pointer hover:border-[#209e2e] focus:border-[#209e2e] rounded px-4 py-3 outline-none"
                    type="text"
                    required
                  />
                </span>
              </div>

              <div className="flex gap-4 mb-5">
                <span>
                  <label
                    htmlFor="state"
                    className="text-[20px] rajdhani-light font-[500]"
                  >
                    State / County *
                  </label>
                  <input
                    name="state"
                    className="w-full border-1 border-[#0000001e] transition cursor-pointer hover:border-[#209e2e] focus:border-[#209e2e] rounded px-4 py-3 outline-none"
                    type="text"
                    required
                  />
                </span>
                <span>
                  <label
                    htmlFor="phone"
                    className="text-[20px] rajdhani-light font-[500]"
                  >
                    Phone*
                  </label>
                  <input
                    name="phone"
                    className="w-full border-1 border-[#0000001e] transition cursor-pointer hover:border-[#209e2e] focus:border-[#209e2e] rounded px-4 py-3 outline-none"
                    type="tel"
                    required
                  />
                </span>
              </div>

              <div className="mb-5">
                <label
                  htmlFor="company"
                  className="text-[20px] rajdhani-light font-[500]"
                >
                  Full Address
                </label>
                <input
                  name="company"
                  className="w-full border-1 border-[#0000001e] transition cursor-pointer hover:border-[#209e2e] focus:border-[#209e2e] rounded px-4 py-3 outline-none"
                  type="text"
                  placeholder="full address"
                  required
                />
              </div>

              <div className="mb-5">
                <label
                  htmlFor="email"
                  className="text-[20px] rajdhani-light font-[500]"
                >
                  Email Address *
                </label>
                <input
                  name="email"
                  className="w-full border-1 border-[#0000001e] transition cursor-pointer hover:border-[#209e2e] focus:border-[#209e2e] rounded px-4 py-3 outline-none"
                  type="email"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="mb-5">
                <textarea
                  name="order_note"
                  className="w-full border-1 border-[#0000001e] transition cursor-pointer hover:border-[#209e2e] focus:border-[#209e2e] rounded px-4 py-3 outline-none"
                  placeholder="Order note (optional)"
                />
              </div>

              <button 
                type="submit"
                className="order w-full lg:hidden rounded-full p-4 cursor-pointer font-bold transition hover:bg-[#209e2e] hover:text-white text-[#333333] border-2 border-[#209e2e]"
                disabled={isProcessing}
              >
                {isProcessing ? "PROCESSING..." : "PLACE ORDER"}
              </button>
            </div>

            <div className="w-[35vw] ml-10 hidden lg:block">
              <h3 className="rajdhani-light font-bold text-3xl border-b-1 border-[#0000001e] pb-1 mb-10">
                Your order
              </h3>
              <div className="flex flex-col gap-8 h-[30vh] overflow-y-scroll no-scrollbar">
                {!loading && cartItems.length === 0 && (
                  <p className="text-[#8d8c8c]">Your cart is empty</p>
                )}
                {cartItems.map((item, index) => (
                  <div
                    className="flex justify-between items-center"
                    key={item.id ?? item.product_id ?? index}
                  >
                    <span className="flex items-center gap-2">
                      <li className="list-none flex relative text-[#b7b7b7] p-2 border-2 rounded-[10px] border-white shadow-sm hover:text-white cursor-pointer transition">
                        <img
                          className="w-10"
                          src={item.image_url || pawpaw}
                          alt={item.name}
                        />
                        <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-[#209e2e] rounded-[5px]">
                          {item.quantity ?? 1}
                        </span>
                      </li>
                      <p className="rajdhani-light font-[700]">{item.name}</p>
                    </span>
                    <p className="text-[#666666] font-[500]">
                      $
                      {(
                        (item.unit_price ?? item.price ?? 0) *
                        (item.quantity ?? 1)
                      ).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="text-[#333333] text-[14px] mt-5 flex flex-col gap-5">
                <span className="flex justify-between">
                  <p>Subtotal · {cartItems.length} items</p>
                  <p className="text-[#666666]">${subtotal.toFixed(2)}</p>
                </span>
                <span className="flex justify-between">
                  <p>Shipping</p>
                  <p className="text-[#666666]">${shipping.toFixed(2)}</p>
                </span>
                <span className="flex justify-between">
                  <h3 className="font-bold text-[20px] rajdhani-light">
                    Total
                  </h3>
                  <p>
                    <span className="font-extralight text-[#0000004e]">
                      USD
                    </span>{" "}
                    ${total.toFixed(2)}
                  </p>
                </span>

                <button 
                  type="submit"
                  className="order rounded-full p-4 cursor-pointer font-bold transition hover:bg-[#209e2e] hover:text-white text-[#333333] border-2 border-[#209e2e]"
                  disabled={isProcessing}
                >
                  {isProcessing ? "PROCESSING..." : "PLACE ORDER"}
                </button>
              </div>
            </div>
          </section>
        </form>
      </section>

      <Toaster />
    </>
  );
}
