"use client";

import React, { Suspense } from "react";
import Shop from "../Components/Shop";

export default function ShopPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col gap-4 items-center justify-center min-h-screen">
        <div className="w-20 h-20 border-4 border-transparent animate-spin border-t-blue-400 rounded-full flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-transparent animate-spin border-t-[#209e2e] rounded-full"></div>
        </div>
        <p className="text-[#209e2e] font-semibold">Loading shop...</p>
      </div>
    }>
      <Shop/>
    </Suspense>
  );
}