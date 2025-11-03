"use client";

import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function Subcribe() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loader, setloader] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setMessage("Subscribing...");
    setloader(true);

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (data.ok) {
        toast.success("Subscribed successfully!");
        setEmail("");
      } else {
        toast.error(data.error || "Something went wrong");
      }
    } catch (error) {
      console.error(error);
      toast.error("Subscription failed");
    } finally {
      setloader(false);
    }
  };

  return (
    <section className="faq py-[100px] flex flex-col items-center justify-center px-5">
      <div>
        <div className="mb-[30px] text-center">
          <h3 className="text-[25px] mb-[10px] font-extrabold text-[#333333]">
            Subscribe newsletter
          </h3>
          <p className="max-w-[605px] text-[#7a7e9a] text-[16px] font-[400] leading-1.8">
            Stay updated with the freshest vegetables and fruits from FarmForte.
            Subscribe to get our latest products and offers.
          </p>
        </div>

        <form
          onSubmit={handleSubscribe}
          className="lg:flex lg:items-center lg:justify-center lg:gap-3 w-full"
        >
          <input
            className="flex-1 lg:w-auto lg:border lg:border-dashed border-[#209e2e] h-[55px] outline-0 pl-[25px] bg-white lg:bg-transparent text-[#333333] w-full rounded-4xl"
            type="text  "
            placeholder="Enter Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            type="submit"
            className="bg-[#209e2e] w-full lg:w-auto xl:w-[18vw] h-[55px] flex justify-center items-center lg:px-8 gap-1 text-white cursor-pointer transition rounded-4xl mt-5 lg:mt-0"
          >
            <p className="font-medium lg:text-[17px]">
              {loader ? "Subscribing..." : "      Subscribe Now"}
            </p>
            <svg
              className="w-6"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M11 11V5H13V11H19V13H13V19H11V13H5V11H11Z"></path>
            </svg>
          </button>
        </form>
      </div>
      <Toaster />
    </section>
  );
}