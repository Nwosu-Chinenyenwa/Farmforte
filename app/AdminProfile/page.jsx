"use client";
import React, { useEffect, useState } from "react";
import AdminNav from "../Components/AdminNav";
import Aside from "../Components/Aside";
import { FaFacebookF, FaLinkedinIn, FaYoutube } from "react-icons/fa";
import { FaXTwitter, FaGithub } from "react-icons/fa6";
import { createClient } from "@/utils/supabase/client";
import { IoSettingsOutline } from "react-icons/io5";
import { CiMenuKebab } from "react-icons/ci";
import { useRouter } from "next/navigation";
import user from "../../public/asset/avatar-CDT9_MFd.jpg";
import { IoSearchOutline, IoNotificationsSharp } from "react-icons/io5";
import Link from "next/link";
import Image from "next/image";
import Adminshort from "../Components/Adminshort";

const supabase = createClient();

export default function Page() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [aside, setaside] = useState(false);
  const [showProfile, setshowProfile] = useState(false);

  const [stats, setStats] = useState({
    users: 0,
    products: 0,
    earnings: 0,
  });

  const router = useRouter();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const userRes = await fetch("/api/users/get");
        const userJson = await userRes.json();
        const userCount = userJson.success ? userJson.users.length : 0;

        const { count: productCount, error: pErr } = await supabase
          .from("products")
          .select("id", { count: "exact", head: true });
        if (pErr) console.warn("products count err", pErr);

        const { data: orders, error: oErr } = await supabase
          .from("orders")
          .select("amount");
        if (oErr) console.warn("orders fetch err", oErr);

        const totalEarnings = Array.isArray(orders)
          ? orders.reduce((sum, order) => sum + Number(order?.amount || 0), 0)
          : 0;

        setStats({
          users: userCount || 0,
          products: productCount || 0,
          earnings: totalEarnings || 0,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []);

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
        const { data: userResp } = await supabase.auth.getUser();
        const user = userResp?.user;
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
          console.error(
            "Error fetching admin profile:",
            error.message || error
          );
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

  if (loading)
    return (
      <section className="flex items-center justify-center h-[100vh]">
        <div className="flex-col gap-4 w-full flex items-center justify-center">
          <div className="w-20 h-20 border-4 border-transparent text-blue-400 text-4xl animate-spin flex items-center justify-center border-t-blue-400 rounded-full">
            <div className="w-16 h-16 border-4 border-transparent text-[#209e2e] text-2xl animate-spin flex items-center justify-center border-t-[#209e2e] rounded-full"></div>
          </div>
        </div>
      </section>
    );

  return (
    <section className="">
      <div className="flex">
        {aside && (
          <div className="xl:hidden">
            <Aside />
          </div>
        )}

        <div className="hidden xl:block">
          <Aside />
        </div>

        <div>
          <div className="xl:w-[80vw] border-b-[#dfeaf2] border-1 w-[100vw]">
            <header className="">
              <nav className="bg-[#ffffff] flex justify-between py-5 px-5 lg:px-7 items-center">
                <span className="hidden lg:flex items-center gap-3 xl:hidden">
                  <CiMenuKebab
                    onClick={() => setaside(!aside)}
                    className="text-[30px]"
                  />
                  <h2 className="text-[#343c6a] font-[600] text-[28px]">
                    Overview
                  </h2>
                </span>
                <h2 className="text-[#343c6a] font-[600] text-[0px] lg:text-[28px] hidden xl:block">
                  Overview
                </h2>
                <CiMenuKebab
                  onClick={() => setaside(!aside)}
                  className="text-[35px] lg:hidden"
                />
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
                    <IoSettingsOutline className="bg-[#f5f7fa] hidden md:block lg:block p-3 text-[45px] cursor-pointer rounded-full text-[#00000058] " />
                  </Link>
                  <IoNotificationsSharp className="bg-[#f5f7fa] hidden md:block lg:block p-3 text-[45px] cursor-pointer rounded-full text-[#fe5c73] animate-pulse" />

                  <div>
                    <Image
                      onClick={() => setshowProfile(!showProfile)}
                      className="w-[40px] h-[40px]  rounded-full cursor-pointer"
                      src={user}
                      alt="You"
                    />
                  </div>
                </div>
              </nav>

              {showProfile && <Adminshort />}
            </header>
          </div>

          <div className="xl:w-[70vw] p-2 xl:p-0 m-auto">
            <div className="py-10">
              <div className="flex justify-between pb-10">
                <h3 className="text-[#1c252e] text-[24px] font-[700]">
                  Profile
                </h3>
                <div className="flex gap-[8px] items-center text-[#1c252e] font-[500]">
                  <h3>Dashboard</h3>
                  <span>/</span>
                  <h3 className="text-[#209e2f98]">Profile</h3>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-md overflow-hidden w-full max-w-4xl mx-auto">
                <div className="relative">
                  <img
                    src={
                      profile?.cover_url ||
                      "https://demo.nextadmin.co/_next/image?url=%2Fimages%2Fcover%2Fcover-01.png&w=2048&q=75"
                    }
                    alt="cover"
                    className="w-full h-56 object-cover"
                  />
                  <button className="absolute top-4 right-6 flex items-center gap-2 bg-violet-600 text-white text-sm font-medium px-4 py-2 rounded-lg shadow hover:bg-violet-700 transition">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Edit
                  </button>

                  <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
                    <div className="relative">
                      <img
                        src={
                          profile?.avatar_url ||
                          "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop"
                        }
                        alt="profile"
                        className="w-32 h-32 rounded-full border-4 border-white object-cover shadow-md"
                      />
                      <div className="absolute bottom-2 right-2 bg-violet-600 w-7 h-7 rounded-full flex items-center justify-center shadow cursor-pointer">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="white"
                          className="w-4 h-4"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.75 10.5l4.5 4.5m0 0l-4.5 4.5m4.5-4.5H3"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-20 text-center px-6 pb-8">
                  <div className="flex justify-center items-center gap-8 mt-4 px-4 shadow-sm rounded-lg py-1 w-fit mx-auto">
                    <div className="text-center flex items-center ">
                      <p className="font-[500] text-[#111928] mr-1">
                        {stats.users}
                      </p>
                      <p className="text-sm text-slate-500 leading-[22px] text-[14px]">
                        user(s)
                      </p>
                    </div>
                    <div className="text-center flex items-center ">
                      <p className="font-[500] text-[#111928] mr-1">
                        {stats.products}
                      </p>
                      <p className="text-sm text-slate-500 leading-[22px] text-[14px]">
                        product(s)
                      </p>
                    </div>
                    <div className="text-center flex items-center">
                      <p className="font-[500] text-[#111928] mr-1">
                        ₦{Number(stats.earnings || 0).toLocaleString()}
                      </p>
                      <p className="text-sm text-slate-500 leading-[22px] text-[14px]">
                        earning(s)
                      </p>
                    </div>
                  </div>

                  <div className="mt-8">
                    <h3 className="text-md font-semibold text-slate-800 mb-2">
                      About Me
                    </h3>
                    <p className="text-[#6b7280] text-md leading-relaxed max-w-2xl mx-auto">
                      {profile?.bio ||
                        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque posuere fermentum urna."}
                    </p>
                  </div>

                  <div className="mt-8">
                    <h4 className="text-sm font-medium text-slate-700 mb-3">
                      Follow me on
                    </h4>
                    <div className="flex justify-center gap-6 text-[#6b7280]">
                      <a href="#" className="hover:text-[#209e2e] transition">
                        <i className="fab fa-facebook-f text-xl">
                          <FaFacebookF />
                        </i>
                      </a>
                      <a href="#" className="hover:text-[#209e2e] transition">
                        <i className="fab fa-facebook-f text-xl">
                          <FaXTwitter />
                        </i>
                      </a>
                      <a href="#" className="hover:text-[#209e2e] transition">
                        <i className="fab fa-facebook-f text-xl">
                          <FaLinkedinIn />
                        </i>
                      </a>
                      <a href="#" className="hover:text-[#209e2e] transition">
                        <i className="fab fa-facebook-f text-xl">
                          <FaYoutube />
                        </i>
                      </a>
                      <a href="#" className="hover:text-[#209e2e] transition">
                        <i className="fab fa-facebook-f text-xl">
                          <FaGithub />
                        </i>
                      </a>
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
