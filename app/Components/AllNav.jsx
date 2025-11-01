"use client";

import React, { useEffect, useState, useCallback, useRef,Suspense } from "react";

import logo from "../../public/img/logo-two.png";
import Link from "next/link";
import Image from "next/image";
import Search from "./Search";
import sub1 from "../../public/img/1.jpg";
import sub2 from "../../public/img/2.jpg";
import sub3 from "../../public/img/3.jpg";
import sub4 from "../../public/img/4.jpg";
import sub5 from "../../public/img/5.jpg";
import sub6 from "../../public/img/6.jpg";
import sub7 from "../../public/img/7.jpg";
import sub8 from "../../public/img/8.jpg";
import { usePathname } from "next/navigation";
import logo2 from "../../public/download.png";
import Nav from "./Nav";
import Cart from "./Cart";
import AvatarNav from "./AvaterNav";
import AdminLink from "./AdminLink";

export default function AllNav() {
  const [view, setview] = useState(false);
  const [showside, setshowside] = useState(false);
  const [hamburga, sethamburga] = useState(false);
  const [displayNav, setdisplayNav] = useState(false);
  const [main, setmain] = useState(true);

  const search = () => setview(!view);
  let hamtoggle = useCallback(() => {
    sethamburga((prev) => !prev);
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const Scroll = () => {
      if (window.scrollY > 5) {
        sethamburga(false);
      }
    };

    window.addEventListener("scroll", Scroll);

    return () => window.removeEventListener("scroll", Scroll);
  }, []);

  useEffect(() => {
    const Scroll = () => {
      if (window.scrollY > 150) {
        setdisplayNav(true);
        setmain(false);
      } else {
        setdisplayNav(false);
        setmain(true);
      }
    };

    window.addEventListener("scroll", Scroll);

    return () => window.removeEventListener("scroll", Scroll);
  }, []);

  return (
    <>
      <section>
        <header className="xl:mb-0">
          {displayNav ? (
            <div className="hidden lg:block">
              <Nav />
            </div>
          ) : (
            <nav className=" hidden lg:flex items-center lg:p-4  xl:p-0 justify-between bg-[#00000093] text-white nav-border">
              <div className="p-5 lg:p-0 lg:px-5  xl:border-r xl:border-[#8b770577] lg:border-transparent  px-20">
                <Image
                  className="lg:w-[15vw] h-[10vh] rounded-full"
                  src={logo2}
                  alt="logo"
                />
              </div>
              <ul className="hidden lg:flex items-center gap-10  p-5 lg:p-0 lg:px-5  px-20 justify-center font-medium">
                <Link href={"/Home"}>
                  <li className="relative cursor-pointer transition hover:text-[#209e2e] after:content-[''] after:absolute after:left-1/2 after:-translate-x-1/2 after:bottom-0 after:top-8 after:w-3 after:h-3 after:rounded-full after:bg-[#209e2e] after:transition after:opacity-0 hover:after:opacity-100">
                    Home
                  </li>
                </Link>

                <Link href={"/About"}>
                  <li className="relative cursor-pointer after:content-[''] after:absolute after:left-1/2 after:-translate-x-1/2 after:bottom-0 after:top-8 after:w-3 after:h-3 after:rounded-full after:bg-[#209e2e] after:transition after:opacity-0 hover:after:opacity-100 transition hover:text-[#209e2e]">
                    About
                  </li>
                </Link>
                <li className="group relative cursor-pointer after:content-[''] after:absolute after:left-1/2 after:-translate-x-1/2 after:bottom-0 after:top-8 after:w-3 after:h-3 after:rounded-full after:bg-[#209e2e] after:transition after:opacity-0 hover:after:opacity-100 transition hover:text-[#209e2e]">
                  <span className="flex items-center">
                    <span>Shop</span>
                    <svg
                      className="w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M11.9999 13.1714L16.9497 8.22168L18.3639 9.63589L11.9999 15.9999L5.63599 9.63589L7.0502 8.22168L11.9999 13.1714Z"></path>
                    </svg>
                  </span>

                  <ul className="opacity-0 absolute  group-hover:opacity-100 mt-10 bg-white text-black flex flex-col gap-2 w-50 p-5">
                    <Link href={"/Shop"}>
                      <li className="block hover:text-[#82b440] transition-all hover:ml-1">
                        Shop
                      </li>
                    </Link>
                    <Link href={"/Cart"}>
                      <li className="block hover:text-[#82b440] transition-all hover:ml-1">
                        Cart
                      </li>
                    </Link>

                    <Link href={"/Checkout"}>
                      <li className="block hover:text-[#82b440] transition-all hover:ml-1">
                        Checkout
                      </li>
                    </Link>
                  </ul>
                </li>
                <Link href={"/Faq"}>
                  <li className="relative cursor-pointer transition hover:text-[#209e2e] after:content-[''] after:absolute after:left-1/2 after:-translate-x-1/2 after:bottom-0 after:top-8 after:w-3 after:h-3 after:rounded-full after:bg-[#209e2e] after:transition after:opacity-0 hover:after:opacity-100">
                    FAQ
                  </li>
                </Link>
                <Link href={"/Contact"}>
                  <li className="relative cursor-pointer transition hover:text-[#209e2e] after:content-[''] after:absolute after:left-1/2 after:-translate-x-1/2 after:bottom-0 after:top-8 after:w-3 after:h-3 after:rounded-full after:bg-[#209e2e] after:transition after:opacity-0 hover:after:opacity-100">
                    Contact
                  </li>
                </Link>

                <li className="group relative cursor-pointer  after:content-[''] after:absolute after:left-1/2 after:-translate-x-1/2 after:bottom-0 after:top-8 after:w-3 after:h-3 after:rounded-full after:bg-[#209e2e] after:transition after:opacity-0 hover:after:opacity-100 transition hover:text-[#209e2e]">
                  <span className="flex items-center">
                    <span>Login</span>
                    <svg
                      className="w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M11.9999 13.1714L16.9497 8.22168L18.3639 9.63589L11.9999 15.9999L5.63599 9.63589L7.0502 8.22168L11.9999 13.1714Z"></path>
                    </svg>
                  </span>

                  <ul className="opacity-0 absolute group-hover:opacity-100 mt-10 bg-white text-black flex flex-col gap-2 w-50 p-5">
                    <Link href={"/Login"}>
                      <li className="block hover:text-[#82b440] transition-all hover:ml-1">
                        Login
                      </li>
                    </Link>
                    <Link href={"/Signup"}>
                      <li className="block hover:text-[#82b440] transition-all hover:ml-1">
                        SignUp
                      </li>
                    </Link>
                    <li className="block hover:text-[#82b440] transition-all hover:ml-1">
                      <AdminLink />
                    </li>
                  </ul>
                </li>
              </ul>

              <ul className="flex xl:link1  xl:border-l xl:py-4 xl:border-[#8b770577] p-5 lg:p-0 lg:px-5  gap-5 px-20">
                <li className=" relative">
                  <svg
                    onClick={search}
                    className="w-9 text-[#b7b7b7] p-2 border-1 rounded-[10px] border-[#b7b7b7] hover:text-white hover:bg-[#82b440] cursor-pointer transition"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M18.031 16.6168L22.3137 20.8995L20.8995 22.3137L16.6168 18.031C15.0769 19.263 13.124 20 11 20C6.032 20 2 15.968 2 11C2 6.032 6.032 2 11 2C15.968 2 20 6.032 20 11C20 13.124 19.263 15.0769 18.031 16.6168ZM16.0247 15.8748C17.2475 14.6146 18 12.8956 18 11C18 7.1325 14.8675 4 11 4C7.1325 4 4 7.1325 4 11C4 14.8675 7.1325 18 11 18C12.8956 18 14.6146 17.2475 15.8748 16.0247L16.0247 15.8748Z"></path>
                  </svg>

                  {view && (
                    <div className="absolute right-0.5 top-15 bg-white w-[23vw] h-[80px] flex items-center justify-center">
                      <Search />
                    </div>
                  )}
                </li>
                <Cart />
                <li onClick={() => setshowside(true)}>
                  <svg
                    className="w-9 text-[#b7b7b7] p-2 border-1 rounded-[10px] border-[#b7b7b7]  hover:text-white hover:bg-[#82b440] cursor-pointer transition"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M3 4C3 3.44772 3.44772 3 4 3H10C10.5523 3 11 3.44772 11 4V10C11 10.5523 10.5523 11 10 11H4C3.44772 11 3 10.5523 3 10V4ZM3 14C3 13.4477 3.44772 13 4 13H10C10.5523 13 11 13.4477 11 14V20C11 20.5523 10.5523 21 10 21H4C3.44772 21 3 20.5523 3 20V14ZM13 4C13 3.44772 13.4477 3 14 3H20C20.5523 3 21 3.44772 21 4V10C21 10.5523 20.5523 11 20 11H14C13.4477 11 13 10.5523 13 10V4ZM13 14C13 13.4477 13.4477 13 14 13H20C20.5523 13 21 13.4477 21 14V20C21 20.5523 20.5523 21 20 21H14C13.4477 21 13 20.5523 13 20V14ZM15 5V9H19V5H15ZM15 15V19H19V15H15ZM5 5V9H9V5H5ZM5 15V19H9V15H5Z"></path>
                  </svg>
                </li>

                <AvatarNav title="View profile" />
              </ul>
            </nav>
          )}

          <section className="flex z-10 lg:hidden flex-col relative">
            <nav className="flex z-10 fixed px-5 w-[100vw] bg-white justify-between items-center p-3">
              <Image src={logo} alt="logo" />

              <div className="flex items-center gap-2">
                <svg
                  onClick={search}
                  className="w-5 list-none relative text-[#333333]  cursor-pointer transition"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M11 2C15.968 2 20 6.032 20 11C20 15.968 15.968 20 11 20C6.032 20 2 15.968 2 11C2 6.032 6.032 2 11 2ZM11 18C14.8675 18 18 14.8675 18 11C18 7.1325 14.8675 4 11 4C7.1325 4 4 7.1325 4 11C4 14.8675 7.1325 18 11 18ZM19.4853 18.0711L22.3137 20.8995L20.8995 22.3137L18.0711 19.4853L19.4853 18.0711Z"></path>
                </svg>

                {view && (
                  <div className="absolute top-15 left-0 bg-white w-[80vw] h-[60px] flex items-center justify-center">
                        <Suspense fallback={<div>Loading search...</div>}>
                    <Search />
                    </Suspense>
                  </div>
                )}
                <div>
                  <li className="list-none relative  p-2 text-[#333333] cursor-pointer transition">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-5"
                    >
                      <path d="M4.00436 6.41686L0.761719 3.17422L2.17593 1.76001L5.41857 5.00265H20.6603C21.2126 5.00265 21.6603 5.45037 21.6603 6.00265C21.6603 6.09997 21.6461 6.19678 21.6182 6.29L19.2182 14.29C19.0913 14.713 18.7019 15.0027 18.2603 15.0027H6.00436V17.0027H17.0044V19.0027H5.00436C4.45207 19.0027 4.00436 18.5549 4.00436 18.0027V6.41686ZM5.50436 23.0027C4.67593 23.0027 4.00436 22.3311 4.00436 21.5027C4.00436 20.6742 4.67593 20.0027 5.50436 20.0027C6.33279 20.0027 7.00436 20.6742 7.00436 21.5027C7.00436 22.3311 6.33279 23.0027 5.50436 23.0027ZM17.5044 23.0027C16.6759 23.0027 16.0044 22.3311 16.0044 21.5027C16.0044 20.6742 16.6759 20.0027 17.5044 20.0027C18.3328 20.0027 19.0044 20.6742 19.0044 21.5027C19.0044 22.3311 18.3328 23.0027 17.5044 23.0027Z"></path>
                    </svg>

                    <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-[#82b440] rounded-full">
                      0
                    </span>
                  </li>
                </div>
                {hamburga ? (
                  <svg
                    onClick={hamtoggle}
                    className="w-7"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M11.9997 10.5865L16.9495 5.63672L18.3637 7.05093L13.4139 12.0007L18.3637 16.9504L16.9495 18.3646L11.9997 13.4149L7.04996 18.3646L5.63574 16.9504L10.5855 12.0007L5.63574 7.05093L7.04996 5.63672L11.9997 10.5865Z"></path>
                  </svg>
                ) : (
                  <svg
                    className="w-5"
                    onClick={hamtoggle}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M3 4H21V6H3V4ZM3 11H21V13H3V11ZM3 18H21V20H3V18Z"></path>
                  </svg>
                )}
              </div>
            </nav>
            {hamburga && (
              <section className="  justify-center relative flex items-center ">
                <div className="justify-center fixed  w-[100vw] bg-[#00000087] h-[200vh]  flex items-center shadow-sm">
                  <ul className=" w-[90vw] bg-white slideMenu h-fit relative top-70 overflow-y-scroll  bottom-3">
                    <Link href={"/Home"}>
                      <li className="flex  justify-between p-3 rounded-sm border-b-1 border-[#8080803f] ">
                        <p className="text-[#82b440]">Home</p>
                        <svg
                          className="w-6 text-[gray]"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M20 20C20 20.5523 19.5523 21 19 21H5C4.44772 21 4 20.5523 4 20V11L1 11L11.3273 1.6115C11.7087 1.26475 12.2913 1.26475 12.6727 1.6115L23 11L20 11V20ZM12 15C13.3807 15 14.5 13.8807 14.5 12.5C14.5 11.1193 13.3807 9.99998 12 9.99998C10.6193 9.99998 9.5 11.1193 9.5 12.5C9.5 13.8807 10.6193 15 12 15Z"></path>
                        </svg>
                      </li>
                    </Link>
                    <Link href={"/About"}>
                      <li className="flex  justify-between p-3 rounded-sm border-b-1 border-[#8080803f] ">
                        <p className="text-[#82b440]">About</p>
                        <svg
                          className="w-6 text-[gray]"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M10.9042 2.10025L20.8037 3.51446L22.2179 13.414L13.0255 22.6063C12.635 22.9969 12.0019 22.9969 11.6113 22.6063L1.71184 12.7069C1.32131 12.3163 1.32131 11.6832 1.71184 11.2926L10.9042 2.10025ZM11.6113 4.22157L3.83316 11.9997L12.3184 20.485L20.0966 12.7069L19.036 5.28223L11.6113 4.22157ZM13.7327 10.5855C12.9516 9.80448 12.9516 8.53815 13.7327 7.7571C14.5137 6.97606 15.78 6.97606 16.5611 7.7571C17.3421 8.53815 17.3421 9.80448 16.5611 10.5855C15.78 11.3666 14.5137 11.3666 13.7327 10.5855Z"></path>
                        </svg>
                      </li>
                    </Link>
                    <Link href={"/Shop"}>
                      <li className="flex  justify-between p-3 rounded-sm border-b-1 border-[#8080803f] ">
                        <p className="text-[#82b440]">Shop</p>
                        <svg
                          className="w-6 text-[gray]"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M12.0049 0.999695C14.7663 0.999695 17.0049 3.23827 17.0049 5.99969V7.99969H20.0049C20.5572 7.99969 21.0049 8.44741 21.0049 8.99969V20.9997C21.0049 21.552 20.5572 21.9997 20.0049 21.9997H4.00488C3.4526 21.9997 3.00488 21.552 3.00488 20.9997V8.99969C3.00488 8.44741 3.4526 7.99969 4.00488 7.99969H7.00488V5.99969C7.00488 3.23827 9.24346 0.999695 12.0049 0.999695ZM17.0049 10.9997H15.0049V11.9997C15.0049 12.552 15.4526 12.9997 16.0049 12.9997C16.5177 12.9997 16.9404 12.6137 16.9982 12.1163L17.0049 11.9997V10.9997ZM9.00488 10.9997H7.00488V11.9997C7.00488 12.552 7.4526 12.9997 8.00488 12.9997C8.51772 12.9997 8.94039 12.6137 8.99815 12.1163L9.00488 11.9997V10.9997ZM12.0049 2.99969C10.4072 2.99969 9.10122 4.24861 9.00998 5.82342L9.00488 5.99969V7.99969H15.0049V5.99969C15.0049 4.40201 13.756 3.09603 12.1812 3.00479L12.0049 2.99969Z"></path>
                        </svg>
                      </li>
                    </Link>
                    <Link href={"/Cart"}>
                      <li className="flex  justify-between p-3 rounded-sm border-b-1 border-[#8080803f] ">
                        <p className="text-[#82b440]">Cart</p>
                        <svg
                          className="w-6 text-[gray]"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M4.00436 6.41686L0.761719 3.17422L2.17593 1.76001L5.41857 5.00265H20.6603C21.2126 5.00265 21.6603 5.45037 21.6603 6.00265C21.6603 6.09997 21.6461 6.19678 21.6182 6.29L19.2182 14.29C19.0913 14.713 18.7019 15.0027 18.2603 15.0027H6.00436V17.0027H17.0044V19.0027H5.00436C4.45207 19.0027 4.00436 18.5549 4.00436 18.0027V6.41686ZM5.50436 23.0027C4.67593 23.0027 4.00436 22.3311 4.00436 21.5027C4.00436 20.6742 4.67593 20.0027 5.50436 20.0027C6.33279 20.0027 7.00436 20.6742 7.00436 21.5027C7.00436 22.3311 6.33279 23.0027 5.50436 23.0027ZM17.5044 23.0027C16.6759 23.0027 16.0044 22.3311 16.0044 21.5027C16.0044 20.6742 16.6759 20.0027 17.5044 20.0027C18.3328 20.0027 19.0044 20.6742 19.0044 21.5027C19.0044 22.3311 18.3328 23.0027 17.5044 23.0027Z"></path>
                        </svg>
                      </li>
                    </Link>
                    <Link href={"/Checkout"}>
                      <li className="flex  justify-between p-3 rounded-sm border-b-1 border-[#8080803f] ">
                        <p className="text-[#82b440]">Checkout</p>
                        <svg
                          className="w-6 text-[gray]"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M4 3H20C20.5523 3 21 3.44772 21 4V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V4C3 3.44772 3.44772 3 4 3ZM11.0026 16L18.0737 8.92893L16.6595 7.51472L11.0026 13.1716L8.17421 10.3431L6.75999 11.7574L11.0026 16Z"></path>
                        </svg>
                      </li>
                    </Link>
                    <Link href={"/Faq"}>
                      <li className="flex  justify-between p-3 rounded-sm border-b-1 border-[#8080803f] ">
                        <p className="text-[#82b440]">FAQ</p>
                        <svg
                          className="w-6 text-[gray]"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M3 3C2.44772 3 2 3.44772 2 4V20C2 20.5523 2.44772 21 3 21H21C21.5523 21 22 20.5523 22 20V4C22 3.44772 21.5523 3 21 3H3ZM6 7H12V13H6V7ZM8 9V11H10V9H8ZM18 9H14V7H18V9ZM14 13V11H18V13H14ZM6 17V15L18 15V17L6 17Z"></path>
                        </svg>
                      </li>
                    </Link>
                    <Link href={"/Contact"}>
                      <li className="flex  justify-between p-3 rounded-sm border-b-1 border-[#8080803f] ">
                        <p className="text-[#82b440]">Contact</p>
                        <svg
                          className="w-6 text-[gray]"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M4 2C3.44772 2 3 2.44772 3 3V5H5V7H2V9H5V11H2V13H5V15H2V17H5V19H3V21C3 21.5523 3.44772 22 4 22H20C20.5523 22 21 21.5523 21 21V3C21 2.44772 20.5523 2 20 2H4ZM9 16C9 14.3431 10.3431 13 12 13C13.6569 13 15 14.3431 15 16H9ZM12 12C10.8954 12 10 11.1046 10 10C10 8.89543 10.8954 8 12 8C13.1046 8 14 8.89543 14 10C14 11.1046 13.1046 12 12 12Z"></path>
                        </svg>
                      </li>
                    </Link>
                    <Link href={"/Login"}>
                      <li className="flex  justify-between p-3 rounded-sm border-b-1 border-[#8080803f] ">
                        <p className="text-[#82b440]">Login now!</p>

                        <svg
                          className="w-6 text-[gray]"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M4 15H6V20H18V4H6V9H4V3C4 2.44772 4.44772 2 5 2H19C19.5523 2 20 2.44772 20 3V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V15ZM10 11V8L15 12L10 16V13H2V11H10Z"></path>
                        </svg>
                      </li>
                    </Link>
                  </ul>
                </div>
              </section>
            )}
          </section>
        </header>
      </section>

      {showside && (
        <section className="top-0 bg-[#000000c0] h-[100vh] fixed w-[100vw] z-30 transition">
          <div className="bg-white slideIn w-[30vw] xl:w-[30vw] lg:w-[50vw] absolute right-0  h-[100vh] overflow-y-scroll  p-10 flex flex-col gap-10">
            <div className="flex justify-end">
              <svg
                onClick={() => setshowside(false)}
                className="w-7 font-bold  text-[#595656] relative hover:text-black cursor-pointer transition"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M11.9997 10.5865L16.9495 5.63672L18.3637 7.05093L13.4139 12.0007L18.3637 16.9504L16.9495 18.3646L11.9997 13.4149L7.04996 18.3646L5.63574 16.9504L10.5855 12.0007L5.63574 7.05093L7.04996 5.63672L11.9997 10.5865Z"></path>
              </svg>
            </div>
            <span>
              <h1 className="font-[700] text-[24px] text-[#333333]">
                About us
              </h1>
              <p className="text-[#7a7e9a] font-[400] leading-[1.8] text-[15px]">
                We believe that quality produce builds trust. Fresh innovations
                and a satisfying shopping experience are at the heart of our
                farm. Only genuine fruits and vegetables. The customer is king,
                and their health and needs inspire everything we do
              </p>
            </span>

            <span className="flex flex-col gap-5 items-center justify-center">
              <h1 className="font-[700] text-[24px] text-[#333333]">Twitter</h1>
              <span className="justify-center flex flex-col gap-3">
                <span className="flex gap-3">
                  <Image className="w-15" src={sub1} alt="pic" />
                  <Image className="w-15" src={sub2} alt="pic" />
                  <Image className="w-15" src={sub3} alt="pic" />
                  <Image className="w-15" src={sub4} alt="pic" />
                </span>
                <span className="flex gap-3">
                  <Image className="w-15" src={sub5} alt="pic" />
                  <Image className="w-15" src={sub6} alt="pic" />
                  <Image className="w-15" src={sub7} alt="pic" />
                  <Image className="w-15" src={sub8} alt="pic" />
                </span>
              </span>

              <a href="http://Wa.me/2348147186916" target="_blank">
                <p className="text-center font-extrabold text-[#0c810c] hover:text-black cursor-pointer transition text-[20px]">
                  +234 8147186916
                </p>
              </a>
              <p className="text-center font-bold text-[#7a7e9a]">OR</p>
              <a href="mailto:farmforteorg@gmail.com">
                <p className="font-bold hover:text-[#209e2e] text-[20px] cursor-pointer text-center">
                  farmforteorg@gmail.com
                </p>
              </a>
              <ul className="flex gap-3 justify-center items-center">
                <a
                  href="https://x.com/Farmforte_?t=MP0FWyznlVo9xfNUmWmMKA&s=09"
                  target="_blank"
                >
                  <svg
                    className="w-8 rounded-4xl border-1 border-[#aba5a5] text-[#aba5a5] p-2 hover:text-white hover:bg-[#0c810c] hover:border-0 cursor-pointer transition"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M22.2125 5.65605C21.4491 5.99375 20.6395 6.21555 19.8106 6.31411C20.6839 5.79132 21.3374 4.9689 21.6493 4.00005C20.8287 4.48761 19.9305 4.83077 18.9938 5.01461C18.2031 4.17106 17.098 3.69303 15.9418 3.69434C13.6326 3.69434 11.7597 5.56661 11.7597 7.87683C11.7597 8.20458 11.7973 8.52242 11.8676 8.82909C8.39047 8.65404 5.31007 6.99005 3.24678 4.45941C2.87529 5.09767 2.68005 5.82318 2.68104 6.56167C2.68104 8.01259 3.4196 9.29324 4.54149 10.043C3.87737 10.022 3.22788 9.84264 2.64718 9.51973C2.64654 9.5373 2.64654 9.55487 2.64654 9.57148C2.64654 11.5984 4.08819 13.2892 6.00199 13.6731C5.6428 13.7703 5.27232 13.8194 4.90022 13.8191C4.62997 13.8191 4.36771 13.7942 4.11279 13.7453C4.64531 15.4065 6.18886 16.6159 8.0196 16.6491C6.53813 17.8118 4.70869 18.4426 2.82543 18.4399C2.49212 18.4402 2.15909 18.4205 1.82812 18.3811C3.74004 19.6102 5.96552 20.2625 8.23842 20.2601C15.9316 20.2601 20.138 13.8875 20.138 8.36111C20.138 8.1803 20.1336 7.99886 20.1256 7.81997C20.9443 7.22845 21.651 6.49567 22.2125 5.65605Z"></path>
                  </svg>
                </a>

                <a
                  href="https://www.facebook.com/share/1FdAZsmyJ7/"
                  target="_blank"
                >
                  <svg
                    className="w-8 rounded-4xl border-1 border-[#aba5a5] text-[#aba5a5] p-2 hover:text-white hover:bg-[#0c810c] hover:border-0 cursor-pointer transition"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M14 13.5H16.5L17.5 9.5H14V7.5C14 6.47062 14 5.5 16 5.5H17.5V2.1401C17.1743 2.09685 15.943 2 14.6429 2C11.9284 2 10 3.65686 10 6.69971V9.5H7V13.5H10V22H14V13.5Z"></path>
                  </svg>
                </a>

                <a href="mailto:farmforteorg@gmail.com" target="_blank">
                  <svg
                    className="w-8 rounded-4xl border-1 border-[#aba5a5] text-[#aba5a5] p-2 hover:text-white hover:bg-[#0c810c] hover:border-0 cursor-pointer transition"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M2.24283 6.85435L11.4895 1.3086C11.8062 1.11865 12.2019 1.11872 12.5185 1.30878L21.7573 6.85433C21.9079 6.9447 22 7.10743 22 7.28303V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V7.28315C2 7.10748 2.09218 6.94471 2.24283 6.85435ZM18.3456 8.24383L12.0606 13.6829L5.64722 8.23769L4.35278 9.7623L12.0731 16.3171L19.6544 9.75615L18.3456 8.24383Z"></path>
                  </svg>
                </a>

                <a href="http://Wa.me/2348147186916" target="_blank">
                  <svg
                    className="w-8 rounded-4xl border-1 border-[#aba5a5] text-[#aba5a5] p-2 hover:text-white hover:bg-[#0c810c] hover:border-0 cursor-pointer transition"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12.001 2C17.5238 2 22.001 6.47715 22.001 12C22.001 17.5228 17.5238 22 12.001 22C10.1671 22 8.44851 21.5064 6.97086 20.6447L2.00516 22L3.35712 17.0315C2.49494 15.5536 2.00098 13.8345 2.00098 12C2.00098 6.47715 6.47813 2 12.001 2ZM8.59339 7.30019L8.39232 7.30833C8.26293 7.31742 8.13607 7.34902 8.02057 7.40811C7.93392 7.45244 7.85348 7.51651 7.72709 7.63586C7.60774 7.74855 7.53857 7.84697 7.46569 7.94186C7.09599 8.4232 6.89729 9.01405 6.90098 9.62098C6.90299 10.1116 7.03043 10.5884 7.23169 11.0336C7.63982 11.9364 8.31288 12.8908 9.20194 13.7759C9.4155 13.9885 9.62473 14.2034 9.85034 14.402C10.9538 15.3736 12.2688 16.0742 13.6907 16.4482C13.6907 16.4482 14.2507 16.5342 14.2589 16.5347C14.4444 16.5447 14.6296 16.5313 14.8153 16.5218C15.1066 16.5068 15.391 16.428 15.6484 16.2909C15.8139 16.2028 15.8922 16.159 16.0311 16.0714C16.0311 16.0714 16.0737 16.0426 16.1559 15.9814C16.2909 15.8808 16.3743 15.81 16.4866 15.6934C16.5694 15.6074 16.6406 15.5058 16.6956 15.3913C16.7738 15.2281 16.8525 14.9166 16.8838 14.6579C16.9077 14.4603 16.9005 14.3523 16.8979 14.2854C16.8936 14.1778 16.8047 14.0671 16.7073 14.0201L16.1258 13.7587C16.1258 13.7587 15.2563 13.3803 14.7245 13.1377C14.6691 13.1124 14.6085 13.1007 14.5476 13.097C14.4142 13.0888 14.2647 13.1236 14.1696 13.2238C14.1646 13.2218 14.0984 13.279 13.3749 14.1555C13.335 14.2032 13.2415 14.3069 13.0798 14.2972C13.0554 14.2955 13.0311 14.292 13.0074 14.2858C12.9419 14.2685 12.8781 14.2457 12.8157 14.2193C12.692 14.1668 12.6486 14.1469 12.5641 14.1105C11.9868 13.8583 11.457 13.5209 10.9887 13.108C10.8631 12.9974 10.7463 12.8783 10.6259 12.7616C10.2057 12.3543 9.86169 11.9211 9.60577 11.4938C9.5918 11.4705 9.57027 11.4368 9.54708 11.3991C9.50521 11.331 9.45903 11.25 9.44455 11.1944C9.40738 11.0473 9.50599 10.9291 9.50599 10.9291C9.50599 10.9291 9.74939 10.663 9.86248 10.5183C9.97128 10.379 10.0652 10.2428 10.125 10.1457C10.2428 9.95633 10.2801 9.76062 10.2182 9.60963C9.93764 8.92565 9.64818 8.24536 9.34986 7.56894C9.29098 7.43545 9.11585 7.33846 8.95659 7.32007C8.90265 7.31384 8.84875 7.30758 8.79459 7.30402C8.66053 7.29748 8.5262 7.29892 8.39232 7.30833L8.59339 7.30019Z"></path>
                  </svg>
                </a>
              </ul>
            </span>
          </div>
        </section>
      )}
    </>
  );
}
