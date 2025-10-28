"use client";

import React, { useState } from "react";
import Aside from "../Components/Aside";
import {
  IoSearchOutline,
  IoSettingsOutline,
  IoNotificationsSharp,
} from "react-icons/io5";
import user from "../../public/asset/avatar-CDT9_MFd.jpg";
import Image from "next/image";
import { Mail } from "lucide-react";
import AdminNav from "../Components/AdminNav";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";
import Rocket from "../../public/404.png";
import { useRouter } from "next/navigation";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  defs,
} from "recharts";

export default function page() {
  const updata = [
    { month: "jen", value1: 20, value2: 30, sold: 50 },
    { month: "feb", value1: 20, value2: 30, sold: 50 },
    { month: "mar", value1: 20, value2: 30, sold: 50 },
    { month: "Apr", value1: 20, value2: 30, sold: 50 },
    { month: "May", value1: 80, value2: 60, sold: 120 },
    { month: "Jun", value1: 300, value2: 100, sold: 210 },
    { month: "Jul", value1: 250, value2: 200, sold: 340 },
    { month: "Aug", value1: 500, value2: 300, sold: 460 },
    { month: "Sep", value1: 270, value2: 320, sold: 390 },
    { month: "Oct", value1: 350, value2: 330, sold: 400 },
    { month: "Nov", value1: 200, value2: 250, sold: 310 },
    { month: "Dec", value1: 500, value2: 400, sold: 480 },
  ];

  const route = useRouter()
  return (
    <>
      <section className="bg-[#e6e8ec] ">
        <div className="flex">
          <Aside />

          <div>
            <AdminNav />

            <div className="w-[70vw] m-auto">
              <div>
                <nav className="flex justify-between p-3 ">
                  <div className="flex flex-col text-[#27272a]">
                    <span className="flex gap-2 mb-3">
                        <p onClick={() => route.back()} className="text-[#718096] cursor-pointer">Back</p>
                        <p>/</p>
                      <p>Dashboard</p>
                    </span>

                    <span className="flex items-center gap-1">
                      <svg
                        className="w-5 text-[gold]"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M2.80577 5.20006L7.00505 7.99958L11.1913 2.13881C11.5123 1.6894 12.1369 1.58531 12.5863 1.90631C12.6761 1.97045 12.7546 2.04901 12.8188 2.13881L17.0051 7.99958L21.2043 5.20006C21.6639 4.89371 22.2847 5.01788 22.5911 5.47741C22.7228 5.67503 22.7799 5.91308 22.7522 6.14895L21.109 20.1164C21.0497 20.62 20.6229 20.9996 20.1158 20.9996H3.8943C3.38722 20.9996 2.9604 20.62 2.90115 20.1164L1.25792 6.14895C1.19339 5.60045 1.58573 5.10349 2.13423 5.03896C2.37011 5.01121 2.60816 5.06832 2.80577 5.20006ZM12.0051 14.9996C13.1096 14.9996 14.0051 14.1042 14.0051 12.9996C14.0051 11.895 13.1096 10.9996 12.0051 10.9996C10.9005 10.9996 10.0051 11.895 10.0051 12.9996C10.0051 14.1042 10.9005 14.9996 12.0051 14.9996Z"></path>
                      </svg>

                      <h2 className="font-bold">Admin Dashboard</h2>
                    </span>
                  </div>

                  <div className="flex gap-5 items-center">
                    <span className="flex gap-2">
                      <Link href={"/Signup"}>
                        <button className="border-2 cursor-pointer border-[#1C4532] p-1 px-8 rounded-4xl font-bold text-[#1C4532]">
                          Sign up
                        </button>
                      </Link>
                      <Link href={"/Login"}>
                        <button className="text-[#718096] p-1 cursor-pointer">
                          Sign in
                        </button>
                      </Link>
                    </span>
                  </div>
                </nav>

                <div className="p-1">
                  <div className="flex gap-3">
                    <div className="grid grid-cols-2 w-[35vw] gap-3">
                      <div className="bg-[#1C4532] w-[15vw] p-5 flex flex-col gap-3 text-[white] rounded-2xl shadow-sm">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-10 bg-[white] p-2 rounded-4xl text-[black]"
                        >
                          <path d="M23.0049 12.0028V14.0028C23.0049 17.3165 18.08 20.0028 12.0049 20.0028C6.03824 20.0028 1.18114 17.4116 1.00957 14.1797L1.00488 14.0028V12.0028C1.00488 15.3165 5.92975 18.0028 12.0049 18.0028C18.08 18.0028 23.0049 15.3165 23.0049 12.0028ZM12.0049 4.00281C18.08 4.00281 23.0049 6.6891 23.0049 10.0028C23.0049 13.3165 18.08 16.0028 12.0049 16.0028C5.92975 16.0028 1.00488 13.3165 1.00488 10.0028C1.00488 6.6891 5.92975 4.00281 12.0049 4.00281Z"></path>
                        </svg>

                        <span className="flex justify-between items-center">
                          <p className="text-[white] font-bold text-2xl">100</p>
                          <p className="text-[white] font-bold">+55%</p>
                        </span>
                        <p>Total coins</p>
                      </div>

                      <div className="bg-[#27272a] w-[15vw] p-5 flex flex-col gap-3 text-[white] rounded-2xl shadow-sm">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-10 bg-[white] p-2 rounded-4xl text-[black]"
                        >
                          <path d="M13.0607 8.11097L14.4749 9.52518C17.2086 12.2589 17.2086 16.691 14.4749 19.4247L14.1214 19.7782C11.3877 22.5119 6.95555 22.5119 4.22188 19.7782C1.48821 17.0446 1.48821 12.6124 4.22188 9.87874L5.6361 11.293C3.68348 13.2456 3.68348 16.4114 5.6361 18.364C7.58872 20.3166 10.7545 20.3166 12.7072 18.364L13.0607 18.0105C15.0133 16.0578 15.0133 12.892 13.0607 10.9394L11.6465 9.52518L13.0607 8.11097ZM19.7782 14.1214L18.364 12.7072C20.3166 10.7545 20.3166 7.58872 18.364 5.6361C16.4114 3.68348 13.2456 3.68348 11.293 5.6361L10.9394 5.98965C8.98678 7.94227 8.98678 11.1081 10.9394 13.0607L12.3536 14.4749L10.9394 15.8891L9.52518 14.4749C6.79151 11.7413 6.79151 7.30911 9.52518 4.57544L9.87874 4.22188C12.6124 1.48821 17.0446 1.48821 19.7782 4.22188C22.5119 6.95555 22.5119 11.3877 19.7782 14.1214Z"></path>
                        </svg>

                        <span className="flex justify-between items-center">
                          <p className="text-[white] font-bold text-2xl">4</p>
                          <p className="text-[white] font-bold">10</p>
                        </span>
                        <p>Total Referals</p>
                      </div>

                      <div className="bg-[#27272a] w-[15vw] p-5 flex flex-col gap-3 text-[white] rounded-2xl shadow-sm">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-10 bg-[white] p-2 rounded-4xl text-[black]"
                        >
                          <path d="M5 3V19H21V21H3V3H5ZM19.9393 5.93934L22.0607 8.06066L16 14.1213L13 11.121L9.06066 15.0607L6.93934 12.9393L13 6.87868L16 9.879L19.9393 5.93934Z"></path>
                        </svg>

                        <span className="flex justify-between items-center">
                          <p className="text-[white] font-bold text-2xl">200</p>
                          <p className="text-[white] font-bold">+55%</p>
                        </span>
                        <p>Claimed coins</p>
                      </div>

                      <div className="bg-[#1C4532] w-[15vw] p-5 flex flex-col gap-3 text-[white] rounded-2xl shadow-sm">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-10 bg-[white] p-2 rounded-4xl text-[black]"
                        >
                          <path d="M2 22C2 17.5817 5.58172 14 10 14C14.4183 14 18 17.5817 18 22H2ZM10 13C6.685 13 4 10.315 4 7C4 3.685 6.685 1 10 1C13.315 1 16 3.685 16 7C16 10.315 13.315 13 10 13ZM17.3628 15.2332C20.4482 16.0217 22.7679 18.7235 22.9836 22H20C20 19.3902 19.0002 17.0139 17.3628 15.2332ZM15.3401 12.9569C16.9728 11.4922 18 9.36607 18 7C18 5.58266 17.6314 4.25141 16.9849 3.09687C19.2753 3.55397 21 5.57465 21 8C21 10.7625 18.7625 13 16 13C15.7763 13 15.556 12.9853 15.3401 12.9569Z"></path>
                        </svg>
                        <span className="flex justify-between items-center">
                          <p className="text-[white] font-bold text-2xl">569</p>
                          <p className="text-[white] font-bold">+55%</p>
                        </span>
                        <p>Total users</p>
                      </div>
                    </div>

                    <div className="w-[37vw] shadow-sm rounded-2xl bg-white p-5 flex flex-col gap-5">
                      <h1 className="font-bold text-[#1c1b1bf0] text-1xl">
                        Reviews
                      </h1>

                      <div className="flex flex-col gap-3">
                        <div className="flex flex-col gap-1">
                          <span className="flex justify-between">
                            <h2>Positive Reviews</h2>
                            <p className="text-[#718096] font-bold">80%</p>
                          </span>
                          <span className="bg-[whitesmoke] w-[33vw] h-[1vh] rounded-4xl">
                            <p className="bg-[#1C4532] w-[25vw] block h-[1.3vh] rounded-4xl"></p>
                          </span>
                        </div>

                        <div className="flex flex-col gap-1">
                          <span className="flex justify-between">
                            <h2>Neutral Reviews</h2>
                            <p className="text-[#718096] font-bold">17%</p>
                          </span>
                          <span className="bg-[whitesmoke] w-[33vw] h-[1vh] rounded-4xl">
                            <p className="bg-[#1C4532] w-[5vw] block h-[1.3vh] rounded-4xl"></p>
                          </span>
                        </div>

                        <div className="flex flex-col gap-1">
                          <span className="flex justify-between">
                            <h2>Negative Reviews</h2>
                            <p className="text-[#718096] font-bold">3%</p>
                          </span>
                          <span className="bg-[whitesmoke] w-[33vw] h-[1vh] rounded-4xl">
                            <p className="bg-[#1C4532] w-[2vw] block h-[1.3vh] rounded-4xl"></p>
                          </span>
                        </div>
                      </div>

                      <div>
                        <p className="text-[#718096] ">
                          More than <strong>1,500,000</strong> developers used
                          Creative Tim's products and over{" "}
                          <strong>700,000 </strong>
                          projects were created.
                        </p>
                      </div>
                    </div>
                  </div>

                  <section className="py-10">
                    <div className="bg-white shadow-sm rounded-2xl p-6">
                      <h3 className="text-lg font-semibold text-gray-800">
                        Sales overview
                      </h3>
                      <p className="text-sm text-gray-500 mb-4">
                        <span className="text-indigo-600 font-semibold">
                          4% more
                        </span>{" "}
                        in 2021
                      </p>

                      <div className="h-80 w-full outline-0">
                        <ResponsiveContainer>
                          <LineChart
                            data={updata}
                            margin={{ top: 20, right: 20, left: 0, bottom: 0 }}
                          >
                            <CartesianGrid
                              strokeDasharray="3 3"
                              vertical={false}
                              stroke="#f3f4f6"
                            />

                            <XAxis
                              dataKey="month"
                              axisLine={false}
                              tickLine={false}
                              tick={{ fill: "#9ca3af" }}
                            />
                            <YAxis
                              axisLine={false}
                              tickLine={false}
                              tick={{ fill: "#9ca3af" }}
                              domain={[0, 500]}
                            />

                            <defs>
                              <linearGradient
                                id="colorValue1"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                              >
                                <stop
                                  offset="0%"
                                  stopColor="#ec4899"
                                  stopOpacity={0.4}
                                />
                                <stop
                                  offset="100%"
                                  stopColor="#ec4899"
                                  stopOpacity={0}
                                />
                              </linearGradient>
                            </defs>
                            <Area
                              type="monotone"
                              dataKey="value1"
                              stroke="none"
                              fill="url(#colorValue1)"
                              dot={false}
                              activeDot={false}
                            />

                            <Line
                              type="monotone"
                              dataKey="value1"
                              stroke="#ec4899"
                              strokeWidth={3}
                              dot={false}
                              activeDot={{ r: 6 }}
                            />
                            <Line
                              type="monotone"
                              dataKey="value2"
                              stroke="#4b5563"
                              strokeWidth={2}
                              dot={false}
                              activeDot={{ r: 6 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Toaster />
      </section>
    </>
  );
}
