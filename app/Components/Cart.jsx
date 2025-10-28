"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "../../utils/supabase/client";

export default function Cart() {
  const [showside, setshowside] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    async function fetchCartCount() {
      setIsLoading(true);
      try {
        const res = await supabase.auth.getUser();
        if (res.error) throw res.error;

        const user = res?.data?.user || null;

        if (user) {
          const { data, error } = await supabase
            .from("cart_items")
            .select("quantity")
            .eq("user_id", user.id);

          if (error) throw error;

          const total = (data || []).reduce(
            (sum, item) => sum + (item.quantity || 0),
            0
          );
          setCartCount(total);
        } else {
          setCartCount(0);
        }
      } catch (err) {
        console.error("Error fetching cart count:", err);
        setCartCount(0);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCartCount();

    const interval = setInterval(fetchCartCount, 10000);

    const handleStorageChange = () => fetchCartCount();
    window.addEventListener("storage", handleStorageChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <Link href={"/Cart"}>
      <li
        onClick={() => setshowside(!showside)}
        className="relative text-[#b7b7b7] p-2 border-1 rounded-[10px] border-[#b7b7b7] hover:text-white hover:bg-[#82b440] cursor-pointer transition"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-5"
        >
          <path d="M4.00436 6.41686L0.761719 3.17422L2.17593 1.76001L5.41857 5.00265H20.6603C21.2126 5.00265 21.6603 5.45037 21.6603 6.00265C21.6603 6.09997 21.6461 6.19678 21.6182 6.29L19.2182 14.29C19.0913 14.713 18.7019 15.0027 18.2603 15.0027H6.00436V17.0027H17.0044V19.0027H5.00436C4.45207 19.0027 4.00436 18.5549 4.00436 18.0027V6.41686ZM5.50436 23.0027C4.67593 23.0027 4.00436 22.3311 4.00436 21.5027C4.00436 20.6742 4.67593 20.0027 5.50436 20.0027C6.33279 20.0027 7.00436 20.6742 7.00436 21.5027C7.00436 22.3311 6.33279 23.0027 5.50436 23.0027Z" />
        </svg>

        <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-[#82b440] rounded-full">
          {isLoading ? <span className="animate-pulse">...</span> : cartCount}
        </span>
      </li>
    </Link>
  );
}
