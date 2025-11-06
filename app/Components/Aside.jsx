"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import logo2 from "../../public/asset/FARMFORTE 5.jpg";
import { GrTransaction } from "react-icons/gr";
import { MdSupervisorAccount } from "react-icons/md";
import { FaProductHunt } from "react-icons/fa6";
import { ImProfile } from "react-icons/im";
import { TbLogout2 } from "react-icons/tb";
import { IoSettingsOutline } from "react-icons/io5";
import { IoClose } from "react-icons/io5";

export default function Aside() {
  const [showAuth, setshowAuth] = useState(false);
  const [showProduct, setshowProduct] = useState(true);
  const [show, setshow] = useState(true);
  return (
    <>
      {show && (
        <aside className="xl:w-[20vw] w-[100vw] h-[100vh] z-20 lg:absolute xl:relative">
          <div className="border-r-1 w-[100vw] fixed bg-[#ffffff] lg:w-[30vw] border-[#dfeaf2] xl:w-[20vw] overflow-x-scroll no-scrollbar h-[100vh] inter text-[15px] p-5">
            <div>
              <Image
                src={logo2}
                alt="Logo"
                className="xl:w-[15vw] lg:h-[9vh] w-[vw] rounded-bl-3xl"
              />
              <IoClose
                onClick={() => setshow(!show)}
                className="mt-10 bg-[#209e2e] xl:hidden text-[40px] p-2 rounded-full text-white"
              />
            </div>

            <ul className="mt-10 flex flex-col gap-10">
              <ul className="flex flex-col gap-2">
                <li className="flex items-center cursor-pointer gap-1 bg-[#f3f5f8] p-2 transition hover:bg-[#209e2f3f] rounded-[5px]">
                  <svg
                    className="w-[20px] text-[#72767c]"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M14 21C13.4477 21 13 20.5523 13 20V12C13 11.4477 13.4477 11 14 11H20C20.5523 11 21 11.4477 21 12V20C21 20.5523 20.5523 21 20 21H14ZM4 13C3.44772 13 3 12.5523 3 12V4C3 3.44772 3.44772 3 4 3H10C10.5523 3 11 3.44772 11 4V12C11 12.5523 10.5523 13 10 13H4ZM9 11V5H5V11H9ZM4 21C3.44772 21 3 20.5523 3 20V16C3 15.4477 3.44772 15 4 15H10C10.5523 15 11 15.4477 11 16V20C11 20.5523 10.5523 21 10 21H4ZM5 19H9V17H5V19ZM15 19H19V13H15V19ZM13 4C13 3.44772 13.4477 3 14 3H20C20.5523 3 21 3.44772 21 4V8C21 8.55228 20.5523 9 20 9H14C13.4477 9 13 8.55228 13 8V4ZM15 5V7H19V5H15Z"></path>
                  </svg>
                  <Link href={"/admin"}>
                    <span className="text-[14px] text-[#5f6165] font-[600] ">
                      Dashboard
                    </span>
                  </Link>
                </li>

                <li className="flex items-center cursor-pointer justify-between hover:bg-[#f3f5f8] p-2 transition rounded-[5px]">
                  <div className="flex gap-1 items-center">
                    <svg
                      className="w-[20px] text-[#72767c]"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M3.78307 2.82598L12 1L20.2169 2.82598C20.6745 2.92766 21 3.33347 21 3.80217V13.7889C21 15.795 19.9974 17.6684 18.3282 18.7812L12 23L5.6718 18.7812C4.00261 17.6684 3 15.795 3 13.7889V3.80217C3 3.33347 3.32553 2.92766 3.78307 2.82598ZM5 4.60434V13.7889C5 15.1263 5.6684 16.3752 6.7812 17.1171L12 20.5963L17.2188 17.1171C18.3316 16.3752 19 15.1263 19 13.7889V4.60434L12 3.04879L5 4.60434Z"></path>
                    </svg>
                    <span className="text-[14px] text-[#5f6165] font-[600]">
                      Authentication
                    </span>
                  </div>

                  <svg
                    onClick={() => setshowAuth(!showAuth)}
                    className={`w-6 transition-transform duration-300 ease-in-out ${
                      showAuth ? "rotate-180" : "rotate-0"
                    }`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 15.0006L7.75732 10.758L9.17154 9.34375L12 12.1722L14.8284 9.34375L16.2426 10.758L12 15.0006Z"></path>
                  </svg>
                </li>

                <div
                  className={`transition-all duration-500 ease-in-out overflow-hidden ${
                    showAuth ? "max-h-40 opacity-100 mt-1" : "max-h-0 opacity-0"
                  }`}
                >
                  <Link href={"/Login"}>
                    <li className="cursor-pointer gap-1 hover:bg-[#f3f5f8] p-2 transition rounded-[5px] mb-2">
                      <p className="text-[14px] ml-5 text-[#5f6165] font-[600]">
                        Login
                      </p>
                    </li>
                  </Link>

                  <Link href={"/Signup"}>
                    <li className="cursor-pointer gap-1 hover:bg-[#f3f5f8] p-2 transition rounded-[5px]">
                      <p className="text-[14px] ml-5 text-[#5f6165] font-[600]">
                        Signup
                      </p>
                    </li>
                  </Link>
                </div>

                <Link href={"/Transactions"}>
                  <li className="flex items-center cursor-pointer gap-1 hover:bg-[#f3f5f8] p-2 transition rounded-[5px]">
                    <GrTransaction className="w-[20px] text-[#72767c]" />
                    <span className="text-[14px] text-[#5f6165] font-[600] ">
                      Transactions
                    </span>
                  </li>
                </Link>
                <Link href={"/Accounts"}>
                  <li className="flex items-center cursor-pointer gap-1 hover:bg-[#f3f5f8] p-2 transition rounded-[5px]">
                    <MdSupervisorAccount className="text-[20px] text-[#72767c]" />
                    <span className="text-[14px] text-[#5f6165] font-[600] ">
                      Accounts
                    </span>
                  </li>
                </Link>

                <li className="flex items-center cursor-pointer justify-between hover:bg-[#f3f5f8] p-2 transition rounded-[5px]">
                  <div className="flex gap-1 items-center">
                    <FaProductHunt className="text-[20px] text-[#72767c]" />
                    <span className="text-[14px] text-[#5f6165] font-[600]">
                      Products
                    </span>
                  </div>

                  <svg
                    onClick={() => setshowProduct(!showProduct)}
                    className={`w-6 transition-transform duration-300 ease-in-out ${
                      showProduct ? "rotate-180" : "rotate-0"
                    }`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 15.0006L7.75732 10.758L9.17154 9.34375L12 12.1722L14.8284 9.34375L16.2426 10.758L12 15.0006Z"></path>
                  </svg>
                </li>

                <div
                  className={`transition-all duration-500 ease-in-out overflow-hidden ${
                    showProduct
                      ? "max-h-40 opacity-100 mt-1"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <Link href={"/AddProducts"}>
                    <li className="cursor-pointer gap-1 hover:bg-[#f3f5f8] p-2 transition rounded-[5px] mb-2">
                      <p className="text-[14px] ml-5 text-[#5f6165] font-[600]">
                        Add product
                      </p>
                    </li>
                  </Link>
                  <Link href={"/AdminProducts"}>
                    <li className="cursor-pointer gap-1 hover:bg-[#f3f5f8] p-2 transition rounded-[5px]">
                      <p className="text-[14px] ml-5 text-[#5f6165] font-[600]">
                        View products
                      </p>
                    </li>
                  </Link>
                </div>

                <Link href={"/AdminProfile"}>
                  <li className="flex items-center cursor-pointer gap-1 hover:bg-[#f3f5f8] p-2 transition rounded-[5px]">
                    <ImProfile className="text-[20px] text-[#72767c]" />
                    <span className="text-[14px] text-[#5f6165] font-[600] ">
                      Profile
                    </span>
                  </li>
                </Link>
              </ul>

              <ul className="flex flex-col">
                <Link href={"/AdminSetting"}>
                  <li className="flex items-center cursor-pointer gap-1 hover:bg-[#f3f5f8] p-2 transition rounded-[5px]">
                    <IoSettingsOutline className="text-[20px] text-[#72767c]" />
                    <span className="text-[14px] text-[#5f6165] font-[600] ">
                      Settings
                    </span>
                  </li>
                </Link>

                <Link href={"/Logout"}>
                  <li className="flex items-center cursor-pointer gap-1 hover:bg-[#f3f5f8] p-2 transition rounded-[5px]">
                    <TbLogout2 className="text-[20px] text-[#72767c]" />
                    <span className="text-[14px] text-[#5f6165] font-[600] ">
                      Logout
                    </span>
                  </li>
                </Link>
              </ul>
            </ul>
          </div>
        </aside>
      )}
    </>
  );
}
