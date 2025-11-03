"use client";

import React, { useState, useRef, useEffect } from "react";
import Aside from "../Components/Aside";
import AdminNav from "../Components/AdminNav";
import { CiUser, CiPhone } from "react-icons/ci";
import toast, { Toaster } from "react-hot-toast";
import { createBrowserClient } from "@supabase/ssr";
import { IoSettingsOutline } from "react-icons/io5";
import { CiMenuKebab } from "react-icons/ci";
import { useRouter } from "next/navigation";
import user from "../../public/asset/avatar-CDT9_MFd.jpg";
import { IoSearchOutline, IoNotificationsSharp } from "react-icons/io5";
import Link from "next/link";
import Image from "next/image";
import Adminshort from "../Components/Adminshort";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function page() {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [aside, setaside] = useState(false);
  const [showProfile, setshowProfile] = useState(false);

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function load() {
      const {
        data: { user },
        error: userErr,
      } = await supabase.auth.getUser();
      if (userErr) {
        console.error("auth.getUser error:", userErr);
        return;
      }
      if (!user) return;

      if (!mounted) return;

      setEmail(user.email ?? "");

      const { data: profile, error } = await supabase
        .from("admin_profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (error) {
        console.error("fetch admin_profiles error:", error);
      } else if (profile) {
        setFullName(profile.full_name || "");
        setPhone(profile.phone_number || "");
        setUsername(profile.username || "");
        setBio(profile.bio || "");
        setAvatarUrl(profile.avatar_url || null);
        setPreview(profile.avatar_url || null);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  function handleFileLocal(f) {
    if (!f) return;
    setFile(f);
    const url = URL.createObjectURL(f);
    setPreview(url);
  }

  function onChange(e) {
    const f = e.target.files?.[0];
    if (f) handleFileLocal(f);
  }

  function onDrop(e) {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) handleFileLocal(f);
  }

  function onDragOver(e) {
    e.preventDefault();
  }

  function clear() {
    setFile(null);
    setPreview(avatarUrl || null);
    if (fileInputRef.current) fileInputRef.current.value = null;
  }

  async function handleSave(e) {
    e?.preventDefault();
    setLoading(true);

    try {
      const {
        data: { user },
        error: userErr,
      } = await supabase.auth.getUser();
      if (userErr || !user) {
        toast.error("You must be signed in to save profile");
        setLoading(false);
        return;
      }

      let uploadedUrl = avatarUrl || null;

      if (file instanceof File) {
        const fileExt = file.name.split(".").pop();
        const filePath = `admin-img/${user.id}/${Date.now()}.${fileExt}`;

        const { error: uploadErr } = await supabase.storage
          .from("admin-img")
          .upload(filePath, file, { upsert: true });

        if (uploadErr) {
          console.error("Storage upload error:", uploadErr);
          toast.error("Failed to upload avatar");
          setLoading(false);
          return;
        }

        const { data: publicData } = supabase.storage
          .from("admin-img")
          .getPublicUrl(filePath);

        uploadedUrl = publicData?.publicUrl ?? null;
      }

      const payload = {
        id: user.id,
        full_name: fullName,
        phone_number: phone,
        email: email || user.email,
        username,
        bio,
        avatar_url: uploadedUrl,
        updated_at: new Date().toISOString(),
      };

      const { data, error: upsertErr } = await supabase
        .from("admin_profiles")
        .upsert(payload, { returning: "representation" })
        .select();

      if (upsertErr) {
        console.error("upsert error:", upsertErr);
        toast.error(upsertErr.message || "Failed to save profile");
        setLoading(false);
        return;
      }

      toast.success("Saved!");
      if (uploadedUrl) {
        setAvatarUrl(uploadedUrl);
        setPreview(uploadedUrl);
      }
    } catch (err) {
      console.error("save error:", err);
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }

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

              {showProfile && (
              <Adminshort/>
              )}
            </header>
          </div>

          <div className="xl:w-[70vw] xl:p-0 p-3 m-auto">
            <div className="py-10">
              <div className="flex justify-between pb-10">
                <h3 className="text-[#1c252e] text-[24px] font-[700]">
                  Setting
                </h3>
                <div className="flex gap-[8px] items-center text-[#1c252e] font-[500]">
                  <h3>Dashboard</h3>
                  <span>/</span>
                  <h3 className="text-[#209e2f98]">Settings</h3>
                </div>
              </div>

              <div>
                <div className="flex flex-col xl:flex-row mb-5 xl:mb-0 gap-8 w-full">
                  <div className="bg-white shadow-md w-full xl:w-[40vw] pb-5 rounded-2xl">
                    <div className="font-[500] text-[#111928] px-5 py-5 border-b border-[#00000014]">
                      <h3>Personal Information</h3>
                    </div>

                    <form
                      className="flex flex-col justify-center gap-5 py-8"
                      onSubmit={handleSave}
                    >
                      <div className="flex flex-col sm:flex-row sm:flex-wrap items-center justify-center gap-5 w-[90%] md:w-[80%] xl:w-[35vw] lg:flex-nowrap m-auto">
                        <div className="flex flex-col gap-2 w-full sm:w-[48%]">
                          <label className="font-[600]">Full Name</label>
                          <span className="bg-[#ffffff] flex border-2 hover:border-[#209e2e] rounded-[5px] pl-3 border-[#e6ebf1] py-2">
                            <CiUser className="text-2xl text-[#afbaca]" />
                            <input
                              type="text"
                              value={fullName}
                              onChange={(e) => setFullName(e.target.value)}
                              className="placeholder:text-[#afbaca] ml-2 placeholder:font-[500] outline-none w-full"
                              placeholder="John Felix"
                            />
                          </span>
                        </div>

                        <div className="flex flex-col gap-2 w-full sm:w-[48%]">
                          <label className="font-[600]">Phone Number</label>
                          <span className="bg-[#ffffff] flex border-2 hover:border-[#209e2e] rounded-[5px] pl-3 border-[#e6ebf1] py-2">
                            <CiPhone className="text-2xl text-[#afbaca]" />
                            <input
                              type="text"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              className="placeholder:text-[#afbaca] ml-2 placeholder:font-[500] outline-none w-full"
                              placeholder="+905 6853 4755"
                            />
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 w-[90%] md:w-[80%] xl:w-[35vw] m-auto">
                        <label className="font-[600]">Email Address</label>
                        <span className="bg-[#ffffff] flex border-2 hover:border-[#209e2e] rounded-[5px] pl-3 border-[#e6ebf1] py-2">
                          <CiPhone className="text-2xl text-[#afbaca]" />
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="placeholder:text-[#afbaca] ml-2 placeholder:font-[500] outline-none w-full"
                            placeholder="admin@yourcompany.com"
                          />
                        </span>
                      </div>

                      <div className="flex flex-col gap-2 w-[90%] md:w-[80%] xl:w-[35vw] m-auto">
                        <label className="font-[600]">Username</label>
                        <span className="bg-[#ffffff] flex border-2 hover:border-[#209e2e] rounded-[5px] pl-3 border-[#e6ebf1] py-2">
                          <CiPhone className="text-2xl text-[#afbaca]" />
                          <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="placeholder:text-[#afbaca] ml-2 placeholder:font-[500] outline-none w-full"
                            placeholder="divinehhog24"
                          />
                        </span>
                      </div>

                      <div className="flex flex-col gap-2 w-[90%] md:w-[80%] xl:w-[35vw] m-auto">
                        <label className="font-[600]">Bio</label>
                        <span className="bg-[#ffffff] flex border-2 hover:border-[#209e2e] rounded-[5px] pl-3 border-[#e6ebf1] py-2">
                          <CiPhone className="text-2xl text-[#afbaca]" />
                          <textarea
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            className="placeholder:text-[#afbaca] h-[150px] w-full ml-2 placeholder:font-[500] outline-none"
                            placeholder="Write your bio here..."
                          />
                        </span>
                      </div>

                      <div className="font-[500] text-[#1c252e] flex justify-end px-5 md:px-8 gap-4 sm:gap-5 flex-wrap">
                        <button
                          type="button"
                          className="border border-[#e6ebf1] rounded-[8px] py-2 px-4 cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={loading}
                          className="bg-[#209e2e] text-white rounded-[8px] py-2 px-4 cursor-pointer"
                        >
                          {loading ? "Saving..." : "Save"}
                        </button>
                      </div>
                    </form>
                  </div>

                  <div className="">
                    <div className="w-full md:float-end max-w-[420px] h-fit bg-white rounded-xl shadow-md overflow-hidden mx-auto xl:mx-0">
                      <div className="font-[500] text-[#111928] px-5 py-5 border-b border-[#00000014]">
                        <h3>Your Photo</h3>
                      </div>

                      <div className="p-6 space-y-4">
                        <div className="flex items-start gap-4 flex-wrap sm:flex-nowrap">
                          <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-100 flex-shrink-0 m-auto sm:m-0">
                            {preview ? (
                              <img
                                src={preview}
                                alt="preview"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <img
                                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop"
                                alt="avatar"
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                          <div className="flex-1 text-center sm:text-left">
                            <h4 className="text-lg font-semibold text-slate-800">
                              Edit your photo
                            </h4>
                            <p className="mt-1 text-sm text-slate-500">
                              Edit profile
                            </p>
                          </div>
                        </div>

                        {/* Upload Box */}
                        <div
                          onDrop={onDrop}
                          onDragOver={onDragOver}
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full cursor-pointer hover:border-[#209e2e] transition rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 p-6 sm:p-8 flex flex-col items-center justify-center text-center"
                        >
                          <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center mb-4">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="w-8 h-8 text-slate-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 9l5-5 5 5M12 4v12"
                              />
                            </svg>
                          </div>

                          <div className="flex flex-col sm:flex-row items-center justify-center gap-1">
                            <label
                              htmlFor="file-input"
                              className="cursor-pointer text-sm text-[#209e2e] font-medium"
                            >
                              Click to upload
                            </label>
                            <span className="text-sm text-slate-500">
                              or drag and drop
                            </span>
                          </div>

                          <div className="text-xs text-slate-400 mt-4 text-center">
                            SVG, PNG, JPG or GIF (max, 800 × 800px)
                          </div>

                          <input
                            id="file-input"
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={onChange}
                          />
                        </div>

                        {/* Buttons */}
                        <div className="font-[500] text-[#1c252e] flex justify-end gap-3 flex-wrap">
                          <button
                            onClick={clear}
                            className="border border-[#e6ebf1] rounded-[8px] py-2 px-4 cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleSave}
                            disabled={loading}
                            className="bg-[#209e2e] text-white rounded-[8px] py-2 px-4 cursor-pointer"
                          >
                            {loading ? "Saving..." : "Save"}
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
      </div>
      <Toaster />
    </section>
  );
}
