"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import AvatarNav from "../Components/AvaterNav";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AllNav from "../Components/AllNav";
import Subcribe from "../Components/Subcribe";
import Footer from "../Components/Footer";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [fullName, setFullName] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(null);

  const [deleting, setDeleting] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const [lastPassword, setLastPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changing, setChanging] = useState(false);
  const [changeSuccess, setChangeSuccess] = useState(null);
  const [changeError, setChangeError] = useState("");

  const router = useRouter();

  useEffect(() => {
    async function getUserAndProfile() {
      try {
        const supabase = createClient();
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session?.user) {
          setUser(null);
          setIsLoading(false);
          return;
        }

        setUser(session.user);

        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", session.user.id)
          .single();

        if (!profileError && profile) {
          setFullName(profile.full_name || "");
        }
      } catch (err) {
        console.error("Failed to load user/profile", err);
      } finally {
        setIsLoading(false);
      }
    }

    getUserAndProfile();
  }, []);

  if (isLoading) return null;

  async function handleSave(e) {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    setSaveSuccess(null);

    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("profiles")
        .upsert(
          { id: user.id, email: user.email, full_name: fullName },
          { returning: "representation" }
        )
        .select()
        .single();

      if (error) throw error;
      setSaveSuccess(true);
    } catch (err) {
      console.error("Save profile error", err);
      setSaveSuccess(false);
    } finally {
      setSaving(false);
      setTimeout(() => setSaveSuccess(null), 3000);
    }
  }

  async function handleSignOut() {
    try {
      setSigningOut(true);
      const supabase = createClient();
      const { error } = await supabase.auth.signOut();
      if (error) console.error("Sign out error:", error);
      router.push("/Home");
    } catch (err) {
      console.error("Sign out failed", err);
    } finally {
      setSigningOut(false);
    }
  }

  async function handleDeleteAccountConfirmed() {
    if (!user) return;

    setDeleting(true);
    try {
      const res = await fetch("/api/account/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id }),
      });

      const json = await res.json();
      if (!res.ok) {
        console.error("Account delete failed:", json);
        setDeleting(false);
        return;
      }

      const supabase = createClient();
      await supabase.auth.signOut();
      router.push("/Home");
    } catch (err) {
      console.error("Delete account error:", err);
    } finally {
      setDeleting(false);
      setShowConfirmModal(false);
    }
  }

  async function handleChangePassword(e) {
    e.preventDefault();
    setChangeError("");
    setChangeSuccess(null);

    if (!user) {
      setChangeError("No user session.");
      return;
    }

    if (!lastPassword) {
      setChangeError("Please enter your current password.");
      return;
    }

    if (!newPassword || !confirmPassword) {
      setChangeError("Please enter and confirm your new password.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setChangeError("New password and confirmation do not match.");
      return;
    }

    if (newPassword.length < 6) {
      setChangeError("New password must be at least 6 characters.");
      return;
    }

    setChanging(true);

    try {
      const supabase = createClient();

      const signInResult = await supabase.auth.signInWithPassword({
        email: user.email,
        password: lastPassword,
      });

      if (signInResult.error) {
        setChangeError("Current password is incorrect.");
        setChanging(false);
        return;
      }

      const updateResult = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateResult.error) {
        console.error("Password update error:", updateResult.error);
        setChangeError("Failed to update password. Try again later.");
        setChanging(false);
        return;
      }

      setChangeSuccess(true);
      setLastPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error("Change password error:", err);
      setChangeError("An unexpected error occurred. Try again later.");
      setChangeSuccess(false);
    } finally {
      setChanging(false);
      setTimeout(() => {
        setChangeSuccess(null);
        setChangeError("");
      }, 4000);
    }
  }

  return (
    <>
      <section className="pagetitle">
        <AllNav />
        <div className="py-50 bg-[#00000093] text-white text-center">
          {!fullName ? (
            <h1 className="text-[30px] font-extrabold">Profile</h1>
          ) : (
            <h1 className="text-[30px] font-extrabold">{fullName}</h1>
          )}
          <div>
            <div className="flex items-center justify-center gap-2">
              <Link href={"/Home"}>
                <p className="cursor-pointer">Home</p>
              </Link>
              <span className="w-[5px] h-[5px] rounded-full bg-[#209e2e] block"></span>
              <p className="cursor-pointer">profile</p>
            </div>
          </div>
        </div>
      </section>
      <div className="my-10 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="flex items-center gap-3 mb-3 tracking-tight text-[#333333] font-extrabold text-2xl md:text-3xl">
              <span className="text-2xl md:text-3xl ">🌿</span>
              <span>Profile</span>
            </h2>
            <p className="mt-1 text-sm md:text-base text-[#7a7e9a] animate-pulse max-w-xl">
              Manage your account settings and preferences.
            </p>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-green-50 text-green-700 text-sm font-medium">
              Member
            </span>
            <span className="text-xs text-gray-400">
              Account ID: {user?.id?.slice(0, 8) ?? "—"}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-5">
        <section className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-[#00000045]">
            <h3 className="text-lg font-semibold text-[#333333]">
              Personal Information
            </h3>
            <p className="mt-1 text-sm text-[#7a7e9a]">
              Update your email and display name.
            </p>
          </div>

          <form onSubmit={handleSave}>
            <div className="p-6 space-y-5">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[#7a7e9a]">
                  Email
                </label>
                <input
                  value={user?.email || ""}
                  disabled
                  className="border-1 border-[#8080802a] focus:border-[#209e2e] outline-none w-full p-4 rounded-[5px]"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-[#7a7e9a]">
                  Full Name
                </label>
                <input
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="border-1 border-[#8080802a] focus:border-[#209e2e] outline-none w-full p-4 rounded-[5px]"
                />
              </div>

              <div>
                <AvatarNav />
              </div>

              <div className="pt-1">
                {saving ? (
                  <div className="newtons-cradle">
                    <div className="newtons-cradle__dot"></div>
                    <div className="newtons-cradle__dot"></div>
                    <div className="newtons-cradle__dot"></div>
                    <div className="newtons-cradle__dot"></div>
                  </div>
                ) : (
                  <button
                    type="submit"
                    className="bg-[#209e2e] md:px-5 cursor-pointer p-3 px-6 w-fit text-white rounded-4xl"
                    disabled={saving}
                  >
                    Save Changes
                  </button>
                )}

                <div className="mt-3 min-h-[22px]">
                  {saveSuccess === true && (
                    <div className="text-sm text-green-600">
                      Saved successfully.
                    </div>
                  )}
                  {saveSuccess === false && (
                    <div className="text-sm text-red-600">
                      Failed to save. Check console.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </form>
        </section>

        <section className="bg- rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-[#00000045]">
            <h3 className="text-lg font-semibold text-[#333333]">
              Account Settings
            </h3>
            <p className="mt-1 text-sm text-[#7a7e9a]">
              Security settings for your account.
            </p>
          </div>

          <div className="p-6 space-y-6">
            <div className="p-4">
              <h4 className="text-[#333333] font-[400]  mb-3">
                Change Password
              </h4>

              <form onSubmit={handleChangePassword} className="space-y-3">
                <div>
                  <label className="block text-sm text-[#7a7e9a] mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={lastPassword}
                    onChange={(e) => setLastPassword(e.target.value)}
                    placeholder="Enter your current password"
                    className="border-1 border-[#8080802a] focus:border-[#209e2e] outline-none w-full p-4 rounded-[5px]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-5">
                  <div>
                    <label className="block text-sm text-[#7a7e9a] mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="border-1 border-[#8080802a] focus:border-[#209e2e] outline-none w-full p-4 rounded-[5px]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-[#7a7e9a] mb-1">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      className="border-1 border-[#8080802a] focus:border-[#209e2e] outline-none w-full p-4 rounded-[5px]"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {changing ? (
                    <div className="newtons-cradle">
                      <div className="newtons-cradle__dot"></div>
                      <div className="newtons-cradle__dot"></div>
                      <div className="newtons-cradle__dot"></div>
                      <div className="newtons-cradle__dot"></div>
                    </div>
                  ) : (
                    <button
                      type="submit"
                      className="bg-[#209e2e] md:px-5 cursor-pointer p-3 px-6 w-fit text-white rounded-4xl"
                      disabled={changing}
                    >
                      Change Password
                    </button>
                  )}

                  <div className="min-h-[22px]">
                    {changeSuccess === true && (
                      <div className="text-sm text-green-600">
                        Password updated.
                      </div>
                    )}
                    {changeSuccess === false && (
                      <div className="text-sm text-red-600">
                        Failed to update password.
                      </div>
                    )}
                  </div>
                </div>

                {changeError && (
                  <div className="text-sm text-red-600">{changeError}</div>
                )}
              </form>
            </div>

            <div className="space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-red-600 font-[700]">Delete Account</p>
                  <p className="text-sm text-[#7a7e9a] animate-pulse">
                    Permanently delete your account and all data
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowConfirmModal(true)}
                    className="px-4 py-2 inline-flex items-center justify-center bg-red-600 text-white text-sm hover:bg-red-700 transition rounded-full cursor-pointer"
                    disabled={deleting}
                  >
                    Delete Account
                  </button>

                  <button
                    onClick={handleSignOut}
                    className="px-4 py-2  inline-flex items-center justify-center text-white rounded-full bg-[#e1e100] text-sm hover:bg-[#d1d100] transition cursor-pointer"
                    disabled={signingOut}
                  >
                    {signingOut ? "Signing out..." : "Sign out"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {showConfirmModal && (
        <div className="fixed inset-0 bg-[#000000a1] flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-[5px] shadow-2xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <svg
                className="w-5 text-red-500"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M4.00001 20V14C4.00001 9.58172 7.58173 6 12 6C16.4183 6 20 9.58172 20 14V20H21V22H3.00001V20H4.00001ZM6.00001 14H8.00001C8.00001 11.7909 9.79087 10 12 10V8C8.6863 8 6.00001 10.6863 6.00001 14ZM11 2H13V5H11V2ZM19.7782 4.80761L21.1924 6.22183L19.0711 8.34315L17.6569 6.92893L19.7782 4.80761ZM2.80762 6.22183L4.22183 4.80761L6.34315 6.92893L4.92894 8.34315L2.80762 6.22183Z"></path>
              </svg>
              <span>Confirm Deletion</span>
            </h3>

            <p className="mt-2 text-sm text-[#7a7e9a]">
              Are you sure you want to permanently delete your account? This
              action cannot be undone.
            </p>
            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 border-1 border-[#209e2e] rounded-full cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccountConfirmed}
                className="px-4 py-2 cursor-pointer bg-red-600 rounded-full text-white"
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
      <Subcribe/>
      <Footer/>
    </>
  );
}
