"use client";

import React, { useState } from "react";
import AllNav from "../Components/AllNav";
import Subcribe from "../Components/Subcribe";
import Footer from "../Components/Footer";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { login } from "../../lib/utils/auth-helpers";
import { Eye, EyeOff } from "lucide-react";
import { createClient } from "../../utils/supabase/client"; 

export default function page() {
  const [load, setLoad] = useState(false);
  const [message, setmessage] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [isvisible, setisvisible] = useState(false)
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoad(true);
    setmessage("");

    try {
      await login(email, password);
      toast.success("Logged in successfully");

      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user && user.id) {
          const { data: profile, error } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .single();

          if (!error && profile?.role === "admin") {
            router.push("/Loader");
            return;
          }
        }
      } catch (innerErr) {
      }
      router.push("/Loader");
    } catch (err) {
      const errMsg =
        err instanceof Error ? err.message : "Invalid email or password";
      setmessage(errMsg);
      toast.error(errMsg);
    } finally {
      setLoad(false);
    }
  }

  return (
    <>
      <section className="pagetitle">
        <AllNav />
        <div className="py-50 bg-[#00000093] text-white text-center">
          <h1 className="text-[30px] font-extrabold">Login</h1>
          <div>
            <div className="flex items-center justify-center gap-2">
              <Link href={"/Home"}>
                <p className="cursor-pointer">Home</p>
              </Link>
              <span className="w-[5px] h-[5px] rounded-full bg-[#209e2e] block"></span>
              <p className="cursor-pointer">Login</p>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="py-10 px-2 mt-10 md:flex md:items-center md:justify-center ">
          <form
            onSubmit={handleSubmit} 
            className="md:shadow-sm  md:px-8 py-8 px-2 md:w-[60vw] xl:w-[40vw]"
          >
            <div className="mb-[30px]">
              <h3 className="text-[28px]  text-center  font-bold text-[#333333]">
                Welcome Back
              </h3>
              <p className="mt-1 text-center text-[#33333397]">
                Please login to your account.
              </p>
            </div>


            <div className="grid gap-5">
              <input
                className="border-1 border-[#8080802a] placeholder:text-[#7a7e9a] focus:border-1 focus:border-[#209e2e] outline-none w-full p-4 rounded-[5px]"
                type="text"
                placeholder="Email"
                value={email}
                onChange={(e) => setemail(e.target.value)}
              />
              <div className="flex border-1 border-[#8080802a] focus:border-[#209e2e] outline-none w-full p-4 rounded-[5px]">
                <input
                  className="focus:border-[#209e2e] outline-none w-full rounded-[5px]"
                  type={isvisible ? "text" : "password"}
                  placeholder="Password"
                  onChange={(e) => setpassword(e.target.value)}
                  required
                />

                <button
                  className="cursor-pointer text-[#595c72]"
                  type="button"
                  onClick={() => setisvisible(!isvisible)}
                >
                  {isvisible ? <Eye/> : <EyeOff/>}
                </button>
              </div>
              <span className="flex justify-end">
                <Link href={"/ForgottenPassword"}>
                  <p className="underline text-[#7a7e9a] font-[400] cursor-pointer">
                    Forgot Password?
                  </p>
                </Link>
              </span>

              {load ? (
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
                >
                  Login Now
                </button>
              )}
            </div>

            <span className="flex mt-5 text-[#7a7e9a]">
              <p>Don't have account?</p>
              <Link href={"/Signup"}>
                <p className="text-[#209e2e] ml-1 cursor-pointer"> Signup!</p>
              </Link>
            </span>
          </form>
        </div>
      </section>
      <Toaster />
      <Subcribe />
      <Footer />
    </>
  );
}
