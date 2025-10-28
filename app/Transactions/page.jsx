import React from "react";
import AdminNav from "../Components/AdminNav";
import Aside from "../Components/Aside";
import { IoIosArrowForward } from "react-icons/io";
import { IoSearchOutline, IoNotificationsSharp } from "react-icons/io5";
import veg2 from "../../public/img/veg2.png";
import Image from "next/image";
import { MdDelete } from "react-icons/md";
import { FaCheck } from "react-icons/fa6";

const accounts = [
  {
    name: "John Doe",
    product: "pawpaw",
    date: "May 19,2025",
    paymemt: "Credit Card",
    amount: "$13.43",
    img: veg2,
  },
  {
    name: "John Doe",
    product: "pawpaw",
    date: "May 19,2025",
    paymemt: "Credit Card",
    amount: "$13.43",
    img: veg2,
  },
  {
    name: "John Doe",
    product: "pawpaw",
    date: "May 19,2025",
    paymemt: "Credit Card",
    amount: "$13.43",
    img: veg2,
  },
  {
    name: "John Doe",
    product: "pawpaw",
    date: "May 19,2025",
    paymemt: "Credit Card",
    amount: "$13.43",
    img: veg2,
  },
  {
    name: "John Doe",
    product: "pawpaw",
    date: "May 19,2025",
    paymemt: "Credit Card",
    amount: "$13.43",
    img: veg2,
  },
  {
    name: "John Doe",
    product: "pawpaw",
    date: "May 19,2025",
    paymemt: "Credit Card",
    amount: "$13.43",
    img: veg2,
  },
];

export default function page() {
  return (
    <section className="bg-[#e6e8ec]">
      <div className="flex">
        <Aside />

        <div>
          <AdminNav />

          <div className="w-[70vw] m-auto">
            <div className="py-10">
              <div className="flex justify-between">
                <h3 className="text-[#1C252E] text-[24px] font-[700]">
                  Transactions
                </h3>
                <div className="flex gap-[8px] items-center text-[#1c252e] font-[500]">
                  <h3>Dashboard</h3>
                  <span>/</span>
                  <h3 className="text-[#209e2f98]">Transactions</h3>
                </div>
              </div>

              <div>
                <div className="py-5">
                  <div className="flex justify-between">
                    <div className="text-[gray] flex items-center text-[14px] gap-3">
                      <span className="flex items-center">
                        <IoIosArrowForward />
                        <IoIosArrowForward />
                      </span>
                      <h6>May 19,2025</h6>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="relative inline-block">
                        <IoNotificationsSharp className="p-3 text-[45px] cursor-pointer rounded-full text-gray-500 hover:bg-gray-100 transition" />

                        <span className="absolute top-2 right-2 block w-[12px] h-[12px] bg-[#209e2f98] rounded-full border-[2px] border-white animate-pulse"></span>
                      </div>
                      <div className="flex bg-[#f5f7fa] items-center gap-2 p-3 rounded-full">
                        <IoSearchOutline className="text-[#a2a6b0] w-[30px] text-[20px]" />
                        <input
                          type="text"
                          placeholder="Search for something"
                          className="text-[8ba3cb] w-[100%] placeholder:text-[#00000058] outline-0"
                        />
                      </div>
                    </div>
                  </div>

                  <h3 className="font-[500] text-2xl mt-3 text-[#1c252e]">
                    Recent Transaction
                  </h3>
                </div>
                <div>
                  <div>
                    <h3 className="text-[#ff5e5e] flex items-start flex-col font-[700] after:block after:w-[25px] after:h-[2px] after:bg-[red]">
                      All
                    </h3>
                  </div>

                  <div className="w-full max-w-[1280px] bg-[#ffffff] rounded-2xl p-5 mt-10 relative overflow-hidden">
                    <div
                      className="grid border-b border-[#00000019] py-2 px-5 text-[#637381] font-medium text-left"
                      style={{
                        gridTemplateColumns: "2fr 2fr 1.5fr 1fr 1fr",
                      }}
                    >
                      <div>Items</div>
                      <div>Shop name</div>
                      <div>Date</div>
                      <div>Payment method</div>
                      <div>Amount</div>
                    </div>

                    <div>
                      {accounts.map((account, index) => (
                        <div
                          key={index}
                          className="grid items-center  border-b border-[#0000001c] py-4 text-[#1C252E] text-[14px] px-5"
                          style={{
                            gridTemplateColumns: "2fr 2fr 1.5fr 1fr 1fr",
                          }}
                        >
                          <div className="flex items-center gap-3 overflow-hidden">
                            <Image
                              className="w-[30px] h-[30px] rounded-full flex-shrink-0"
                              src={account.img}
                              alt={account.name}
                              width={30}
                              height={30}
                            />
                            <h3 className="font-bold text-ellipsis overflow-hidden whitespace-nowrap">
                              {account.name}
                            </h3>
                          </div>

                          <h3 className="text-[gray] font-[400] text-ellipsis overflow-hidden whitespace-nowrap">
                            {account.product}
                          </h3>

                          <h3 className="text-[gray] font-[400] text-ellipsis overflow-hidden whitespace-nowrap">
                            {account.date}
                          </h3>

                          <h3 className="text-[gray] font-[400] text-ellipsis overflow-hidden whitespace-nowrap">
                            {account.paymemt}
                          </h3>

                          <h3 className="font-bold text-[14px] text-ellipsis overflow-hidden whitespace-nowrap">
                            {account.amount}
                          </h3>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-end py-2 text-[#374151]">
                      <div className="flex items-center gap-4">
                        <div className="text-sm">1–5 of 24</div>
                        <button
                          className="p-2 cursor-pointer rounded-full disabled:opacity-40"
                          disabled
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24">
                            <path
                              d="M15 18l-6-6 6-6"
                              stroke="#111827"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              fill="none"
                            />
                          </svg>
                        </button>
                        <button className="p-2 cursor-pointer rounded-full">
                          <svg width="16" height="16" viewBox="0 0 24 24">
                            <path
                              d="M9 6l6 6-6 6"
                              stroke="#111827"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              fill="none"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
