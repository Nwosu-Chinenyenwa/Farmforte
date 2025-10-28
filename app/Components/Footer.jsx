"use client";

import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import pay2 from "../../public/asset/skrill.webp";
import pay1 from "../../public/asset/discover.webp";
import pay3 from "../../public/asset/paypal.webp";
import pay4 from "../../public/asset/mastercard.webp";
import pay5 from "../../public/asset/visa.webp";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
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

  const year = new Date().getFullYear();
  return (
    <footer>
      <section className="bg-[#000000d6] pt-[50px]  lg:pt-[100px] flex flex-col items-center justify-center">
        <div className="w-[90vw] flex flex-col items-center justify-center">
          <div className="text-white  flex-col lg:flex lg:flex-row m-auto border-b-1 border-dashed pb-[50px] border-[#209e2e] justify-center gap-10">
            <ul className="lg:w-[25%] max-w-[100%]">
              <h3 className="text-[20px] font-bold mb-[30px]">About Trifles</h3>
              <p className="leading-[25px] text-[16px] font-[400] mb-[18px]">
                Trifles focuses on modern cultivation methods that connect
                farmers, buyers, and markets through innovative digital
                solutions built for sustainable growth and productivity.
              </p>
              <a href="https://www.google.com/maps/place/Umuariaga+Primary+School/@5.4809596,7.5443763,17z/data=!3m1!4b1!4m6!3m5!1s0x1042c5a3b597c15f:0x9654b1f3cace9baa!8m2!3d5.4809596!4d7.5469512!16s%2Fg%2F11q43nzsc4?entry=ttu&g_ep=EgoyMDI1MTAyMi4wIKXMDSoASAFQAw%3D%3D" target="_blank">
              <li className="flex items-center text-[#209e2e] gap-2 cursor-pointer">
                <svg
                  className="w-8"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M1.99974 13.0001L1.9996 11.0002L18.1715 11.0002L14.2218 7.05044L15.636 5.63623L22 12.0002L15.636 18.3642L14.2218 16.9499L18.1716 13.0002L1.99974 13.0001Z"></path>
                </svg>
                <p className="text-[18px] font-[500]">FIND US ON MAP</p>
              </li>
              </a>
            </ul>
            <ul className="lg:w-[25%] max-w-[100%]">
              <h3 className="text-[20px] font-bold mb-[30px]">About Trifles</h3>
              <p className="leading-[25px] text-[16px] font-[400] mb-[5px]">
                Help and Ordering
              </p>
              <p className="leading-[25px] text-[16px] font-[400] mb-[5px]">
                Return & Cancellation
              </p>
              <p className="leading-[25px] text-[16px] font-[400] mb-[5px]">
                Delevery Schedule
              </p>
              <p className="leading-[25px] text-[16px] font-[400] mb-[5px]">
                Get a Call
              </p>
              <p className="leading-[25px] text-[16px] font-[400] mb-[5px]">
                Online Enquiry
              </p>
              <Link href={"/Profile"}>
                <p className="leading-[25px] text-[16px] font-[400] mb-[5px] hover:text-[#209e2e] transition hover:ml-2 cursor-pointer">
                  My Account
                </p>
              </Link>
            </ul>

            <ul className="lg:w-[25%] max-w-[100%]">
              <h3 className="text-[20px] font-bold mb-[30px]">Contact info</h3>

              <ul className="flex flex-col gap-3">
                <li>
                  <span className="flex items-center gap-2 mb-2">
                    <svg
                      className="w-5 text-[#b48017]"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 20.8995L16.9497 15.9497C19.6834 13.2161 19.6834 8.78392 16.9497 6.05025C14.2161 3.31658 9.78392 3.31658 7.05025 6.05025C4.31658 8.78392 4.31658 13.2161 7.05025 15.9497L12 20.8995ZM12 23.7279L5.63604 17.364C2.12132 13.8492 2.12132 8.15076 5.63604 4.63604C9.15076 1.12132 14.8492 1.12132 18.364 4.63604C21.8787 8.15076 21.8787 13.8492 18.364 17.364L12 23.7279ZM12 13C13.1046 13 14 12.1046 14 11C14 9.89543 13.1046 9 12 9C10.8954 9 10 9.89543 10 11C10 12.1046 10.8954 13 12 13ZM12 15C9.79086 15 8 13.2091 8 11C8 8.79086 9.79086 7 12 7C14.2091 7 16 8.79086 16 11C16 13.2091 14.2091 15 12 15Z"></path>
                    </svg>
                    <h3 className="font-[400] text-[14px] uppercase">
                      Location
                    </h3>
                  </span>
                  <p>Umuariaga Community,  Ikwuano Abia State, Nigeria</p>
                </li>

                <li>
                  <span className="flex items-center gap-2  mb-2">
                    <svg
                      className="w-5 text-[#b48017]"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M9.36556 10.6821C10.302 12.3288 11.6712 13.698 13.3179 14.6344L14.2024 13.3961C14.4965 12.9845 15.0516 12.8573 15.4956 13.0998C16.9024 13.8683 18.4571 14.3353 20.0789 14.4637C20.599 14.5049 21 14.9389 21 15.4606V19.9234C21 20.4361 20.6122 20.8657 20.1022 20.9181C19.5723 20.9726 19.0377 21 18.5 21C9.93959 21 3 14.0604 3 5.5C3 4.96227 3.02742 4.42771 3.08189 3.89776C3.1343 3.38775 3.56394 3 4.07665 3H8.53942C9.0611 3 9.49513 3.40104 9.5363 3.92109C9.66467 5.54288 10.1317 7.09764 10.9002 8.50444C11.1427 8.9484 11.0155 9.50354 10.6039 9.79757L9.36556 10.6821ZM6.84425 10.0252L8.7442 8.66809C8.20547 7.50514 7.83628 6.27183 7.64727 5H5.00907C5.00303 5.16632 5 5.333 5 5.5C5 12.9558 11.0442 19 18.5 19C18.667 19 18.8337 18.997 19 18.9909V16.3527C17.7282 16.1637 16.4949 15.7945 15.3319 15.2558L13.9748 17.1558C13.4258 16.9425 12.8956 16.6915 12.3874 16.4061L12.3293 16.373C10.3697 15.2587 8.74134 13.6303 7.627 11.6707L7.59394 11.6126C7.30849 11.1044 7.05754 10.5742 6.84425 10.0252Z"></path>
                    </svg>
                    <h3 className="font-[400] text-[14px] uppercase">
                      Call Us
                    </h3>
                  </span>
                  <a href="tel:+2348147186916" target="_blank">
                    <p className="leading-[25px] text-[16px] font-[400] mb-[5px] hover:text-[#209e2e] transition hover:ml-2 cursor-pointer">
                      +234 8147186916
                    </p>
                  </a>
                </li>
                <li>
                  <span className="flex items-center gap-2  mb-2">
                    <svg
                      className="w-5 text-[#b48017]"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M3 3H21C21.5523 3 22 3.44772 22 4V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3ZM12.0606 11.6829L5.64722 6.2377L4.35278 7.7623L12.0731 14.3171L19.6544 7.75616L18.3456 6.24384L12.0606 11.6829Z"></path>
                    </svg>
                    <h3 className="font-[400] text-[14px] uppercase">
                      Email Us
                    </h3>
                  </span>
                  <a href="mailto:farmforteorg@gmail.com">
                    <p className="leading-[25px] text-[16px] font-[400] mb-[5px] hover:text-[#209e2e] transition hover:ml-2 cursor-pointer">
                      farmforteorg@gmail.com
                    </p>
                  </a>
                </li>
              </ul>
            </ul>

            <ul className="lg:w-[20%] max-w-[100%]">
              <h3 className="text-[20px] font-bold mb-[30px]">
                Stay Connected
              </h3>
              <p className="leading-[25px] text-[16px] font-[400] mb-[18px]">
                Get the latest updates on our products and services right in
                your inbox.
              </p>

              <ul>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="text-[#333333] rounded-4xl border-1 border-dashed border-[#209e2e] w-[100%] h-[50px] outline-none text-[15px] placeholder:text-[#7a7e9a] bg-[#ffffff] pl-[25px]"
                  type="email"
                  placeholder="Enter Your email address"
                />

                <button
                  onClick={handleSubscribe}
                  className="bg-[#209e2e] mt-5 w-[100%] h-[50px] flex justify-center items-center lg:px-8 gap-1 text-white cursor-pointer transition p-3 rounded-4xl hover:bg-[#5c5b5a] hover:text-white"
                >
                  <p className="font-medium lg:text-[17px]">
                    {" "}
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

                <div>
                  <h5 className="mt-[30px] rajdhani-light  text-[18px] font-[700] text-white mb-2">
                    We Accept
                  </h5>
                  <div className="bg-[white] flex gap-1 w-fit">
                    <Image className="w-10" src={pay1} alt="payments" />
                    <Image className="w-10" src={pay2} alt="payments" />
                    <Image className="w-10" src={pay3} alt="payments" />
                    <Image className="w-10" src={pay4} alt="payments" />
                    <Image className="w-10" src={pay5} alt="payments" />
                  </div>
                </div>
              </ul>
            </ul>
          </div>

          <div className="lg:flex text-center  justify-between text-[#ffffff] w-[90vw] py-10 text-[14px] font-[600]">
            <p>
              Copyright @ {year} Trifles. All Rights Reserved by{" "}
              <a className="font-[900]" href="">
                EnvyTheme
              </a>
            </p>
            <ul className="flex gap-3 mt-3 lg:mt-0 text-center items-center justify-center">
              <li className="border-r-2 border-[#209e2e] px-3 cursor-pointer">
                Terms & Conditions
              </li>
              <li className="cursor-pointer ">Privacy Policy</li>
            </ul>
          </div>
        </div>
      </section>
      <Toaster />
    </footer>
  );
}
