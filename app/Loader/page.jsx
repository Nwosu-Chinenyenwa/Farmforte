"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function page() {
  const loader = useState(false);
  const route = useRouter();

  useEffect(() => {
    const loader = setInterval(() => route.push("/Home"), 2000);
    return () => clearInterval(loader);
  }, []);
  return (
    <>
      <section className="flex items-center justify-center h-[100vh]">
        <div className="flex-col gap-4 w-full flex items-center justify-center">
          <div className="w-20 h-20 border-4 border-transparent text-blue-400 text-4xl animate-spin flex items-center justify-center border-t-blue-400 rounded-full">
            <div className="w-16 h-16 border-4 border-transparent text-[#209e2e] text-2xl animate-spin flex items-center justify-center border-t-[#209e2e] rounded-full"></div>
          </div>
        </div>
      </section>
    </>
  );
}
