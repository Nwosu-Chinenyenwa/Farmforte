"use client";

import React, { useState } from "react";
import AllNav from "../Components/AllNav";
import Subcribe from "../Components/Subcribe";
import Footer from "../Components/Footer";
import Ask from "../../data/faq.json"
import Link from "next/link";

export default function Page() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFaq = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <>
      <section className="pagetitle">
        <AllNav />
        <div className="py-50 bg-[#00000093] text-white text-center">
          <h1 className="text-[30px] font-extrabold">FAQ</h1>
          <div className="flex items-center justify-center gap-2">
            <Link href={"/Home"}>
              <p className="cursor-pointer">Home</p>
            </Link>
            <span className="w-[5px] h-[5px] rounded-full bg-[#209e2e] block"></span>
            <p className="cursor-pointer">Faq</p>
          </div>
        </div>
      </section>

      <div className="py-20">
        <div className="lg:w-[90vw] m-auto">
          {Ask.faq.map((faqs, index) => (
            <div key={index} className="px-10 py-4 border-b border-[#F2F6F7]">
              <span className="flex justify-between items-center">
                <h3 className="rajdhani-light font-bold text-[16px] lg:text-[19px]">
                  {faqs.title}
                </h3>

                {activeIndex === index ? (
                  <svg
                    onClick={() => toggleFaq(index)}
                    className="w-9 p-2 cursor-pointer bg-[#209e2e] text-white  transition-transform duration-300 rotate-180"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M19 11H5V13H19V11Z"></path>
                  </svg>
                ) : (
                  <svg
                    onClick={() => toggleFaq(index)}
                    className="w-9 p-2 cursor-pointer bg-[#F2F6F7] text-[#071c1f]  transition-transform duration-300"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M13.0001 10.9999L22.0002 10.9997L22.0002 12.9997L13.0001 12.9999L13.0001 21.9998L11.0001 21.9998L11.0001 12.9999L2.00004 13.0001L2 11.0001L11.0001 10.9999L11 2.00025L13 2.00024L13.0001 10.9999Z"></path>
                  </svg>
                )}
              </span>
              <div
                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                  activeIndex === index
                    ? "max-h-[500px] opacity-100 mt-3"
                    : "max-h-0 opacity-0"
                }`}
              >
                <p className="my-5 text-[#071c1f] font-[400] text-[16px] leading-relaxed">
                  {faqs.discription}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex rajdhani-light flex-col items-center justify-center py-10">
        <h3 className=" text-[071c1f] font-[700] text-[20px] lg:text-[30px] text-center leading-1.3 mb-[15px]">
          For furthermore help... Contact with our support team.
        </h3>

        <Link href={"/Contact"}>
          <button className="font-bold mb-[15px] text-white bg-[#80b500] p-4 px-8 transition cursor-pointer hover:bg-[#071c1f] text-[17px]">
            Contact us
          </button>
        </Link>

        <a href="tel:+2348147186916">
          <span className=" flex text-[071c1f] font-[700] text-[18px] lg:text-[25px]">
            <svg
              className="w-8"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M21 16.42V19.9561C21 20.4811 20.5941 20.9167 20.0705 20.9537C19.6331 20.9846 19.2763 21 19 21C10.1634 21 3 13.8366 3 5C3 4.72371 3.01545 4.36687 3.04635 3.9295C3.08337 3.40588 3.51894 3 4.04386 3H7.5801C7.83678 3 8.05176 3.19442 8.07753 3.4498C8.10067 3.67907 8.12218 3.86314 8.14207 4.00202C8.34435 5.41472 8.75753 6.75936 9.3487 8.00303C9.44359 8.20265 9.38171 8.44159 9.20185 8.57006L7.04355 10.1118C8.35752 13.1811 10.8189 15.6425 13.8882 16.9565L15.4271 14.8019C15.5572 14.6199 15.799 14.5573 16.001 14.6532C17.2446 15.2439 18.5891 15.6566 20.0016 15.8584C20.1396 15.8782 20.3225 15.8995 20.5502 15.9225C20.8056 15.9483 21 16.1633 21 16.42Z"></path>
            </svg>
            <h3>+0123-456-789</h3>
          </span>
        </a>
      </div>

      <Subcribe />
      <Footer />
    </>
  );
}
