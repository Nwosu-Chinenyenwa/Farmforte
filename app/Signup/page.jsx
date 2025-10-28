"use client";

import React, { useState } from "react";
import AllNav from "../Components/AllNav";
import Subcribe from "../Components/Subcribe";
import Footer from "../Components/Footer";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
import * as z from "zod";

export default function page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [comfirm, setComfirm] = useState("");
  const [load, setLoad] = useState(false);
  const [isvisible, setisvisible] = useState(false);
  const router = useRouter();

  const signupSchema = z.object({
    email: z.string().email({ message: "Please enter a valid email address" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, and one number",
      }),
  });

  const handleSignup = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoad(true);

    if (comfirm !== password) {
      setLoad(false);
      return;
    }

    const result = signupSchema.safeParse({ email, password });
    if (!result.success) {
      const first = result.error?.issues?.[0];
      const msg = first?.message || "Validation failed";
      setMessage(msg);
      toast.error(msg);
      setLoad(false);
      return;
    }

    try {
      sessionStorage.setItem("verificationEmail", email);
      sessionStorage.removeItem("isPasswordReset");

      const resp = await fetch("/api/resend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "verification",
          email,
          password,
          isPasswordReset: false,
          origin:
            typeof window !== "undefined" ? window.location.origin : undefined,
        }),
      });

      const json = await resp.json();

      if (!resp.ok) {
        const errMsg = json?.error || "Failed to send verification email";
        toast.error(errMsg);
        setMessage(errMsg);
        setLoad(false);
        return;
      }

      toast.success("Verification email sent. Check your inbox.");
      router.push("/Verify");
    } catch (err) {
      console.error(err);
      const msg =
        err && err.message ? err.message : "An error occurred during signup";
      toast.error(msg);
      setMessage(msg);
    } finally {
      setLoad(false);
    }
  };

  return (
    <>
      <section className="pagetitle">
        <AllNav />
        <div className="py-50 bg-[#00000093] text-white text-center">
          <h1 className="text-[30px] font-extrabold">SignUp</h1>
          <div>
            <div className="flex items-center justify-center gap-2">
              <Link href={"/Home"}></Link>
              <p className="cursor-pointer">Home</p>
              <span className="w-[5px] h-[5px] rounded-full bg-[#209e2e] block"></span>
              <p className="cursor-pointer">Signup</p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="py-10 px-2 mt-10 md:flex md:items-center md:justify-center">
          <form
            onSubmit={handleSignup}
            className="md:shadow-sm md:px-8 py-8 px-2 md:w-[60vw] xl:w-[40vw]"
          >
            <div className="mb-[30px]">
              <h3 className="text-[28px] text-center font-bold">
                Create Your Account
              </h3>
              <p className="mt-1 text-center text-[#33333397]">
                Create an account with farmforte
              </p>
            </div>
            <div className="grid gap-5">
              <input
                className="border-1 border-[#8080802a] focus:border-[#209e2e] outline-none w-full p-4 rounded-[5px]"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <div className="flex border-1 border-[#8080802a] focus:border-[#209e2e] outline-none w-full p-4 rounded-[5px]">
                <input
                  className="focus:border-[#209e2e] outline-none w-full rounded-[5px]"
                  type={isvisible ? "text" : "password"}
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <button
                  className="cursor-pointer text-[#595c72]"
                  type="button"
                  onClick={() => setisvisible(!isvisible)}
                >
                  {isvisible ? <Eye /> : <EyeOff />}
                </button>
              </div>

              <input
                className="border-1 border-[#8080802a] focus:border-[#209e2e] outline-none w-full p-4 rounded-[5px]"
                type="password"
                placeholder="Comfirm Password"
                onChange={(e) => setComfirm(e.target.value)}
                required
              />
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
                  Signup Now
                </button>
              )}
            </div>

            <span className="flex mt-5 text-[#7a7e9a]">
              <p>Already a registered user?</p>
              <Link href={"/Login"}>
                <p className="text-[#209e2e] ml-1">Login!</p>
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
