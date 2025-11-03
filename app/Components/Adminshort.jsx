"use client"

import React, { useEffect, useState } from "react";
import { Mail } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function Adminshort() {
      const [profile, setProfile] = useState(null);
      const [loading, setLoading] = useState(true);
      const [aside, setaside] = useState(false);
      const [showProfile, setshowProfile] = useState(true);
    
      const router = useRouter();
    
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
    
      useEffect(() => {
        const fetchProfile = async () => {
          try {
            const supabase = createClient();
            const {
              data: { user },
            } = await supabase.auth.getUser();
    
            if (!user) {
              console.error("No logged-in user found");
              setLoading(false);
              return;
            }
    
            const { data, error } = await supabase
              .from("admin_profiles")
              .select("*")
              .eq("id", user.id)
              .single();
    
            if (error) {
              console.error("Error fetching admin profile:", error.message);
            } else {
              setProfile(data);
            }
          } catch (err) {
            console.error("Unexpected error:", err);
          } finally {
            setLoading(false);
          }
        };
    
        fetchProfile();
      }, []);

      useEffect(() => {
        if(typeof window === "undefined") return;
       const handlescroll = () =>{
        if(window.scrollY > 5){
            setshowProfile(false)
        }

        
       }
       window.addEventListener("scroll", handlescroll)
        return () => window.removeEventListener("scroll", handlescroll)
      },[])


  return (
    <>
    {showProfile &&
    <div className="relative z-10">
      <div className="absolute top-2 right-10 w-[280px] bg-white rounded-[12px] shadow-md py-4 px-7">
        <h3 className="text-[#343c6a] text-[14px] font-[700] mb-3">
          User Profile
        </h3>

        <div className="flex items-center gap-5 border-b border-[#e5e7eb] pb-4">
          <img
            src={
              profile?.avatar_url ||
              "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop"
            }
            alt="profile"
            className="rounded-full w-[50px] h-[50px] "
          />
          <div className="flex flex-col gap-1">
            <h6 className="text-[#343c6a] text-[14px] font-[600]">
              {profile?.username}
            </h6>
            <p className="text-[#8ba3cb] text-[12px] font-[500]">Founder/CEO</p>
            <div className="flex items-center gap-1 text-[#8ba3cb] text-[12px]">
              <Mail size={12} />
              <span>farmforteorg@gmail.com</span>
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
    }
    </>
  );
}
