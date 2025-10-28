import React from "react";
import AllNav from "../Components/AllNav";
import Link from "next/link";
import Image from "next/image";
import logo from "../../public/img/logo-two.png";
import eggplant from "../../public/img/eggplant.png";
import pawpaw from "../../public/asset/pawpaw.webp";

export default function page() {
  const product = [
    {
      img: pawpaw,
      name: "Organic Apples",
      price: "3.99/lb",
      description: "Fresh organic apples.",
    },
    {
      id: 2,
      img: eggplant,
      name: "Bananas",
      price: "1.50/bunch",
      description: "Sweet ripe bananas.",
    },
    {
      id: 3,
      img: pawpaw,
      name: "Carrots",
      price: "2.20/lb",
      description: "Crunchy organic carrots.",
    },
    {
      id: 4,
      img: pawpaw,
      name: "Tomatoes",
      price: "2.50/lb",
      description: "Juicy red tomatoes.",
    },
  ];
  return (
    <>
      <section>
        <header>
          <nav className="flex justify-between border-b-1 bg-white border-[#0000001e] px-10 xl:px-20 py-5 items-center">
            <Image src={logo} alt="logo" />
            <Link href={"/Shop"}>
              <svg
                className="w-7 text-[#333333] cursor-pointer transition hover:text-[#209e2e]"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M9 6H15C15 4.34315 13.6569 3 12 3C10.3431 3 9 4.34315 9 6ZM7 6C7 3.23858 9.23858 1 12 1C14.7614 1 17 3.23858 17 6H20C20.5523 6 21 6.44772 21 7V21C21 21.5523 20.5523 22 20 22H4C3.44772 22 3 21.5523 3 21V7C3 6.44772 3.44772 6 4 6H7ZM5 8V20H19V8H5ZM9 10C9 11.6569 10.3431 13 12 13C13.6569 13 15 11.6569 15 10H17C17 12.7614 14.7614 15 12 15C9.23858 15 7 12.7614 7 10H9Z"></path>
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
              <p className="hover:text-[#209e2e] transition cursor-pointer">
                Click here to login
              </p>
            </Link>
          </span>
        </div>
        <form>
          <section className="border-t-1 w-[90vw] m-auto flex  justify-center py-10 text-[#333333] border-[#0000001e] ">
            <div className="lg:w-[40vw]  justify-end ">
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
                  className="w-full border-1 border-[#0000001e] transition cursor-pointer hover:border-[#209e2e]  rounded px-4 py-3  outline-none"
                >
                  <option value="">Nigeria</option>
                  <option value="United Arab Emirates">
                    United Arab Emirates
                  </option>
                  <option value="China">China</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Germany">Germany</option>
                  <option value="France">France</option>
                  <option value="Japan">Japan</option>
                </select>
              </div>

              <div className="flex gap-4 mb-5">
                <span>
                  <label
                    htmlFor="first name"
                    className="text-[20px] rajdhani-light font-[500]"
                  >
                    First Name*
                  </label>
                  <input
                    className="w-full border-1 border-[#0000001e] transition cursor-pointer hover:border-[#209e2e] focus:border-[#209e2e]  rounded px-4 py-3  outline-none"
                    type="text"
                    required
                  />
                </span>
                <span>
                  <label
                    htmlFor="first name"
                    className="text-[20px] rajdhani-light font-[500]"
                  >
                    Last Name*
                  </label>
                  <input
                    className="w-full border-1 border-[#0000001e] transition cursor-pointer hover:border-[#209e2e] focus:border-[#209e2e]  rounded px-4 py-3  outline-none"
                    type="text"
                    required
                  />
                </span>
              </div>

              <div className="flex gap-4 mb-5">
                <span>
                  <label
                    htmlFor="first name"
                    className="text-[20px] rajdhani-light font-[500]"
                  >
                    State / County *
                  </label>
                  <input
                    className="w-full border-1 border-[#0000001e] transition cursor-pointer hover:border-[#209e2e] focus:border-[#209e2e]  rounded px-4 py-3  outline-none"
                    type="text"
                    required
                  />
                </span>
                <span>
                  <label
                    htmlFor="first name"
                    className="text-[20px] rajdhani-light font-[500]"
                  >
                    Phone*
                  </label>
                  <input
                    className="w-full border-1 border-[#0000001e] transition cursor-pointer hover:border-[#209e2e] focus:border-[#209e2e]  rounded px-4 py-3  outline-none"
                    type="text"
                    required
                  />
                </span>
              </div>

              <div className="mb-5">
                <label
                  htmlFor="first name"
                  className="text-[20px] rajdhani-light font-[500]"
                >
                  Company Name*
                </label>
                <input
                  className="w-full border-1 border-[#0000001e] transition cursor-pointer hover:border-[#209e2e] focus:border-[#209e2e]  rounded px-4 py-3  outline-none"
                  type="text"
                  placeholder="IGHUB (optional)"
                />
              </div>
              <div className="mb-5">
                <label
                  htmlFor="first name"
                  className="text-[20px] rajdhani-light font-[500]"
                >
                  Email Address *
                </label>
                <input
                  className="w-full border-1 border-[#0000001e] transition cursor-pointer hover:border-[#209e2e] focus:border-[#209e2e]  rounded px-4 py-3  outline-none"
                  type="text"
                />
              </div>

              <div className="mb-5">
                <textarea
                  className="w-full border-1 border-[#0000001e] transition cursor-pointer hover:border-[#209e2e] focus:border-[#209e2e]  rounded px-4 py-3  outline-none"
                  type="text"
                  placeholder="Order note"
                />
              </div>

              <button className="order w-full lg:hidden rounded-full p-4 cursor-pointer font-bold transition hover:bg-[#209e2e] hover:text-white text-[#333333]">
                PLACE ORDER
              </button>
            </div>
            <div className="w-[35vw] ml-10 hidden lg:block">
              <h3 className="rajdhani-light font-bold text-3xl border-b-1 border-[#0000001e] pb-1 mb-10">
                Your order
              </h3>
              <div className="flex flex-col gap-8 h-[30vh] overflow-y-scroll no-scrollbar">
                {product.map((product, index) => (
                  <div
                    className="flex justify-between items-center"
                    key={product.name || index}
                  >
                    <span className="flex items-center gap-2">
                      <li className="list-none flex relative text-[#b7b7b7] p-2 border-2 rounded-[10px] border-white shadow-sm hover:text-white cursor-pointer transition">
                        <Image
                          className="w-10"
                          src={product.img}
                          alt={product.name}
                        />

                        <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-[#209e2e] rounded-[5px]">
                          1
                        </span>
                      </li>
                      <p className="rajdhani-light font-[700] ">
                        {product.name}
                      </p>
                    </span>
                    <p className="text-[#666666] font-[500]">$300.00</p>
                  </div>
                ))}
              </div>

              <div className="text-[#333333] text-[14px] mt-5 flex flex-col gap-5">
                <span className="flex justify-between">
                  <p>Subtotal · {product.length} items</p>
                  <p className="text-[#666666]">$1,020.00</p>
                </span>
                <span className="flex justify-between">
                  <p>Shipping</p>
                  <p className="text-[#666666]">$0</p>
                </span>
                <span className="flex justify-between">
                  <h3 className="font-bold text-[20px] rajdhani-light">
                    Total
                  </h3>
                  <p>
                    <span className="font-extralight text-[#0000004e]">
                      USD
                    </span>{" "}
                    $1,020.00
                  </p>
                </span>

                <button className="order rounded-full p-4 cursor-pointer font-bold transition hover:bg-[#209e2e] hover:text-white text-[#333333]">
                  PLACE ORDER
                </button>
              </div>
            </div>
          </section>
        </form>
      </section>
    </>
  );
}
