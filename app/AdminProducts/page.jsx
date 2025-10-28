"use client";

import React, { useEffect, useState } from "react";
import AdminNav from "../Components/AdminNav";
import Aside from "../Components/Aside";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const limit = 9; // number of products per page

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const start = (page - 1) * limit;
        const end = start + limit - 1;

        const { data, error, count } = await supabase
          .from("products")
          .select("*", { count: "exact" })
          .range(start, end)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Failed to fetch products:", error);
          setProducts([]);
        } else if (mounted) {
          setProducts(data || []);
          if (count) setTotalPages(Math.ceil(count / limit));
        }
      } catch (err) {
        console.error("Unexpected error fetching products:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [page]);

  return (
    <section className="bg-[#e6e8ec] h-[100vh] overflow-y-scroll no-scrollbar">
      <div className="flex">
        <Aside />
        <div>
          <AdminNav />

          <div className="w-[70vw] m-auto">
            <div className="py-10 flex flex-col justify-between h-[100vh]">
              <div className="flex justify-between">
                <h3 className="text-[#1C252E] text-[24px] font-[700]">
                  Products
                </h3>
                <div className="flex gap-[8px] items-center text-[#1c252e] font-[500]">
                  <h3>Dashboard</h3>
                  <span>/</span>
                  <h3 className="text-[#209e2f98]">Products</h3>
                </div>
              </div>

              <div>
                {loading ? (
                  <div className="text-center flex justify-center items-center">
                    <div className="flex-col gap-4 w-full flex items-center justify-center">
                      <div className="w-20 h-20 border-4 border-transparent text-blue-400 text-4xl animate-spin flex items-center justify-center border-t-blue-400 rounded-full">
                        <div className="w-16 h-16 border-4 border-transparent text-[#209e2e] text-2xl animate-spin flex items-center justify-center border-t-[#209e2e] rounded-full"></div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-8 items-center">
                    {products.length > 0 ? (
                      products.map((items, index) => (
                        <div className="w-[15vw] max-w-[18vw]" key={index}>
                          <div className="rounded-tl-[10px] rounded-tr-[10px] overflow-hidden relative">
                            <Image
                              src={items.image_url || "/placeholder.png"}
                              alt={items.name}
                              width={200}
                              height={200}
                              className="object-cover w-full h-[200px]"
                            />
                            <span className="absolute top-5 right-5 text-[#7A0916] text-[12px] font-[800] bg-[#FFE9D5] rounded-[6px] p-1 px-3">
                              {items.type || "sale"}
                            </span>
                          </div>
                          <div className="bg-[#209e2f0c] px-3 py-4 rounded-bl-[10px] rounded-br-[10px]">
                            <h3 className="text-[14px] font-[600] hover:underline transition mb-4">
                              {items.name}
                            </h3>
                            <div className="flex justify-between items-center">
                              <div className="flex">
                                <span className="block h-[10px] w-[10px] relative left-1 bg-[#00AB55] rounded-full"></span>
                                <span className="block h-[10px] w-[10px] bg-black rounded-full"></span>
                              </div>
                              <h6 className="text-[16px] font-[600]">
                                {items.price
                                  ? `$${parseFloat(items.price).toFixed(2)}`
                                  : "$0.00"}
                              </h6>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-center w-full text-gray-500">
                        No products found.
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="w-full flex justify-center mt-6">
                <nav
                  className="inline-flex items-center gap-4 px-4 py-2 rounded-md"
                  aria-label="Pagination UI"
                >
                  <button
                    onClick={() => setPage((p) => Math.max(p - 1, 1))}
                    disabled={page === 1}
                    className="flex items-center justify-center w-8 h-8 rounded-full disabled:opacity-40"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#9CA3AF"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <polyline points="15 18 9 12 15 6" />
                    </svg>
                  </button>

                  <ul className="flex items-center gap-4 list-none p-0 m-0">
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <li key={i}>
                        <span
                          onClick={() => setPage(i + 1)}
                          className={`cursor-pointer text-sm font-medium ${
                            page === i + 1
                              ? "text-white bg-[#1E90FF] w-9 h-9 flex items-center justify-center rounded-full shadow-md"
                              : "text-[#111827]"
                          }`}
                        >
                          {i + 1}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                    disabled={page === totalPages}
                    className="flex items-center justify-center w-8 h-8 rounded-full disabled:opacity-40"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#9CA3AF"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
