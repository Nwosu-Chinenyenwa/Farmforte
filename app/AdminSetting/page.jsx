"use client";

import React, { useState, useRef, useEffect } from "react";
import Aside from "../Components/Aside";
import AdminNav from "../Components/AdminNav";
import { CiUser, CiPhone } from "react-icons/ci";
import toast, { Toaster } from "react-hot-toast";
import { createBrowserClient } from "@supabase/ssr";

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

  return (
    <section className="bg-[#f0f2f5]">
      <div className="flex">
        <Aside />

        <div>
          <AdminNav />

          <div className="w-[70vw] m-auto">
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
                <div className="flex gap-8">
                  <div className="bg-white shadow-md w-[40vw] pb-5 rounded-2xl">
                    <div className="font-[500] text-[#111928] px-5 py-5  border-b-1 border-[#00000014]">
                      <h3>Personal Information</h3>
                    </div>
                    <form
                      className="flex flex-col justify-center gap-5 py-8"
                      onSubmit={handleSave}
                    >
                      <div className="flex items-center justify-center gap-5 w-[35vw] m-auto">
                        <div className="flex flex-col gap-2">
                          <label className="font-[600] ">Full Name</label>
                          <span className="bg-[#ffffff] flex border-2 hover:border-2 hover:border-[#209e2e] rounded-[5px] pl-3 border-[#e6ebf1] py-2">
                            <CiUser className="text-2xl text-[#afbaca]" />
                            <input
                              type="text"
                              value={fullName}
                              onChange={(e) => setFullName(e.target.value)}
                              className="placeholder:text-[#afbaca] ml-2 placeholder:font-[500] outline-none"
                              placeholder="John Felix"
                            />
                          </span>
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="font-[600] ">Phone Number</label>
                          <span className="bg-[#ffffff] flex border-2 hover:border-2 hover:border-[#209e2e] rounded-[5px] pl-3 border-[#e6ebf1] py-2">
                            <CiPhone className="text-2xl text-[#afbaca]" />
                            <input
                              type="text"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              className="placeholder:text-[#afbaca]  ml-2 placeholder:font-[500] outline-none"
                              placeholder="+905 6853 4755"
                            />
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 w-[35vw] m-auto">
                        <label className="font-[600] ">Email Address</label>
                        <span className="bg-[#ffffff] flex border-2 hover:border-2 hover:border-[#209e2e] rounded-[5px] pl-3 border-[#e6ebf1] py-2">
                          <CiPhone className="text-2xl text-[#afbaca]" />
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="placeholder:text-[#afbaca] ml-2 placeholder:font-[500] outline-none"
                            placeholder="admin@yourcompany.com"
                          />
                        </span>
                      </div>
                      <div className="flex flex-col gap-2 w-[35vw] m-auto">
                        <label className="font-[600] ">Username</label>
                        <span className="bg-[#ffffff] flex border-2 hover:border-2 hover:border-[#209e2e] rounded-[5px] pl-3 border-[#e6ebf1] py-2">
                          <CiPhone className="text-2xl text-[#afbaca]" />
                          <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="placeholder:text-[#afbaca] ml-2 placeholder:font-[500] outline-none"
                            placeholder="divinehhog24"
                          />
                        </span>
                      </div>
                      <div className="flex flex-col gap-2 w-[35vw] m-auto">
                        <label className="font-[600] ">Bio</label>
                        <span className="bg-[#ffffff] flex border-2 hover:border-2 hover:border-[#209e2e] rounded-[5px] pl-3 border-[#e6ebf1] py-2">
                          <CiPhone className="text-2xl text-[#afbaca]" />
                          <textarea
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            className="placeholder:text-[#afbaca] h-[150px] w-full ml-2 placeholder:font-[500] outline-none"
                            placeholder="Write you bio here..."
                          />
                        </span>
                      </div>

                      <div className="font-[500] text-[#1c252e] flex justify-end px-8 gap-5">
                        <button
                          type="button"
                          onClick={() => {
                            // reset to last saved values (clear local edits)
                            // we simply reload current profile from DB
                            (async () => {
                              const {
                                data: { user },
                              } = await supabase.auth.getUser();
                              if (!user) return;
                              const { data: profile } = await supabase
                                .from("admin_profiles")
                                .select("*")
                                .eq("id", user.id)
                                .maybeSingle();
                              if (profile) {
                                setFullName(profile.full_name || "");
                                setPhone(profile.phone_number || "");
                                setUsername(profile.username || "");
                                setBio(profile.bio || "");
                                setAvatarUrl(profile.avatar_url || null);
                                setPreview(profile.avatar_url || null);
                              }
                            })();
                          }}
                          className="border-1 border-[#e6ebf1] rounded-[8px] py-2 px-4 cursor-pointer px[#e6ebf1]"
                        >
                          Cancle
                        </button>
                        <button
                          type="submit"
                          disabled={loading}
                          className="bg-[#209e2e] text-white rounded-[8px] py-2 px-4 cursor-pointer px[#e6ebf1]"
                        >
                          {loading ? "Saving..." : "Save"}
                        </button>
                      </div>
                    </form>
                  </div>

                  <div className="max-w-[420px] h-fit bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="font-[500] text-[#111928] px-5 py-5  border-b-1 border-[#00000014]">
                      <h3>Your Photo</h3>
                    </div>

                    <div className="p-6 space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-100 flex-shrink-0">
                          {preview ? (
                            // prefer preview (local or uploaded public url)
                            // using <img> keeps your original code style
                            <img
                              src={preview}
                              alt="preview"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <img
                              src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3&s=placeholder"
                              alt="avatar"
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>

                        <div className="flex-1">
                          <h4 className="text-xl font-semibold text-slate-800">
                            Edit your photo
                          </h4>
                          <div className="mt-1 text-sm text-slate-500 flex gap-4">
                            <p>Edit profile</p>
                          </div>
                        </div>
                      </div>

                      <div
                        onDrop={onDrop}
                        onDragOver={onDragOver}
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full cursor-pointer hover:border-2 hover:border-[#209e2e] transition rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 p-8 flex flex-col items-center justify-center text-center"
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

                        <div className="flex items-center gap-1">
                          <label
                            htmlFor="file-input"
                            className="cursor-pointer text-sm text-[#209e2e] font-medium"
                          >
                            Click to upload
                          </label>

                          <div className="text-sm text-slate-500">
                            or drag and drop
                          </div>
                        </div>

                        <div className="text-xs text-slate-400 mt-4">
                          SVG, PNG, JPG or GIF (max, 800 X 800px)
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

                      <div className="font-[500] text-[#1c252e] flex justify-end gap-5">
                        <button
                          onClick={clear}
                          className="border-1 border-[#e6ebf1] rounded-[8px] py-2 px-4 cursor-pointer px[#e6ebf1]"
                        >
                          Cancle
                        </button>
                        <button
                          onClick={handleSave}
                          disabled={loading}
                          className="bg-[#209e2e] text-white rounded-[8px] py-2 px-4 cursor-pointer px[#e6ebf1]"
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
      <Toaster />
    </section>
  );
}
