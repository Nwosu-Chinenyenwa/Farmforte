"use client";

import React, { useState } from "react";
import {
  IoSearchOutline,
  IoSettingsOutline,
  IoNotificationsSharp,
} from "react-icons/io5";
import user from "../../public/asset/avatar-CDT9_MFd.jpg";
import Image from "next/image";
import { Mail } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { CiMenuKebab } from "react-icons/ci";

export default function AdminNav() {
  const [showProfile, setshowProfile] = useState(false);

  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error("Error logging out:", error.message);
        alert("Logout failed. Please try again.");
      } else {
        router.push("/Login");
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };

  return (
    <div className="xl:w-[80vw]">
      <header>
        <nav className="bg-[#ffffff] flex justify-between py-5 px-0 xl:px-7 items-center">
          <h2 className="text-[#343c6a] font-[600] text-[28px] hidden xl:block">Overview</h2>
            <CiMenuKebab className="text-[35px]"/>
          <div className="flex items-center gap-3">
            <div className="flex bg-[#f5f7fa] items-center gap-2 p-3 rounded-full">
              <IoSearchOutline className="text-[#a2a6b0] w-[30px] text-[20px]" />
              <input
                type="text"
                placeholder="Search for something"
                className="text-[8ba3cb] w-[100%] placeholder:text-[#00000058] outline-0"
              />
            </div>

            <Link href={"/AdminSetting"}>
              <IoSettingsOutline className="bg-[#f5f7fa] p-3 text-[45px] cursor-pointer rounded-full text-[#00000058] " />
            </Link>
            <IoNotificationsSharp className="bg-[#f5f7fa] hidden lg:block p-3 text-[45px] cursor-pointer rounded-full text-[#fe5c73] animate-pulse" />

            <div>
              <Image
                onClick={() => setshowProfile(!showProfile)}        
                className="xl:w-[40px] h-[40px] w-[70px]  rounded-full cursor-pointer"
                src={user}
                alt="You"
              />
            </div>
          </div>
        </nav>

        {showProfile && (
          <div className="relative z-10">
            <div className="absolute top-2 right-10 w-[280px] bg-white rounded-[12px] shadow-md py-4 px-7">
              <h3 className="text-[#343c6a] text-[14px] font-[700] mb-3">
                User Profile
              </h3>

              <div className="flex items-center gap-5 border-b border-[#e5e7eb] pb-4">
                <Image
                  src={user}
                  alt="Profile"
                  width={48}
                  height={48}
                  className="rounded-full w-[50px] h-[50px] "
                />
                <div className="flex flex-col gap-1">
                  <h6 className="text-[#343c6a] text-[14px] font-[600]">
                    Charlene Reed
                  </h6>
                  <p className="text-[#8ba3cb] text-[12px] font-[500]">
                    Designer
                  </p>
                  <div className="flex items-center gap-1 text-[#8ba3cb] text-[12px]">
                    <Mail size={12} />
                    <span>info@dashbank.com</span>
                  </div>
                </div>
              </div>

              <Link href={"/AdminProfile"}>
                <div className="flex items-center gap-2 my-4 cursor-pointer">
                  <div className="bg-[#e7edff] p-2 rounded-[8px]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-[20px] h-[20px] text-[#718ebf]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5.121 17.804A4 4 0 016 17h12a4 4 0 01.879.804M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h6 className="text-[#343c6a] text-[13px] font-[600]">
                      My Profile
                    </h6>
                    <p className="text-[#8ba3cb] text-[12px] font-[500]">
                      Account Settings
                    </p>
                  </div>
                </div>
              </Link>

              <button
                onClick={handleLogout}
                className="w-full border-1 border-[#ff5e5e] text-[#ff5e5e] font-[600] py-2 rounded-full hover:bg-[#ff5e5e17] cursor-pointer  transition"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </header>
    </div>
  );
}
