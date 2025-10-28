"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { newPasswordSchema } from "@/lib/utils/validation";
import { updatePassword } from "@/lib/utils/auth-helpers";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

import { createClient } from "@/utils/supabase/client";
import AllNav from "../Components/AllNav";

export default function NewPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [userEmail, setUserEmail] = useState(null);
  const [isvisible, setisvisible] = useState(false);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    const supabase = createClient();

    async function checkSession() {
      try {
        const { data } = await supabase.auth.getSession();

        if (!data.session) {
          router.push("/ForgottenPassword");
          return;
        }

        if (data.session.user?.email) {
          setUserEmail(data.session.user.email);
        }
      } catch (err) {
        router.push("/ForgottenPassword");
      }
    }

    checkSession();
  }, [router]);

  async function onSubmit(formData) {
    if (!userEmail) return;

    setIsLoading(true);
    setError(null);

    try {
      await updatePassword(formData.password);

      if (userEmail) {
        await fetch("/api/resend", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "password-reset-confirmation",
            email: userEmail,
            origin: window.location.origin,
          }),
        });
      }

      const supabase = createClient();
      await supabase.auth.signOut();

      setIsSuccess(true);

      sessionStorage.removeItem("isPasswordReset");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  }

  if (isSuccess) {
    return (
      <div className="text-center space-y-4">
        <div className="text-green-600 text-xl font-medium">
          Password Updated
        </div>
        <p>
          Your password has been successfully updated. You can now sign in with
          your new password.
        </p>
        <div className="mt-4">
          <Link href="/Login">
            <p className="inline-block px-6 py-2 bg-green-600 text-white rounded-md">
              Sign in
            </p>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="pagetitle">
        <AllNav />
        <div className="py-50 bg-[#00000093] text-white text-center">
          <h1 className="text-[30px] font-extrabold">Reset Password</h1>
          <div>
            <div className="flex items-center justify-center gap-2">
              <Link href={"/Home"}>
                <p className="cursor-pointer">Home</p>
              </Link>
              <span className="w-[5px] h-[5px] rounded-full bg-[#209e2e] block"></span>
              <p className="cursor-pointer">Reset Password</p>
            </div>
          </div>
        </div>
      </section>

      <div>
        <div className="py-10 px-2 mt-10 md:flex md:items-center md:justify-center ">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="md:shadow-sm  md:px-8 py-8 px-2 md:w-[60vw] xl:w-[40vw]"
          >
            <div className="mb-[30px]">
              <h3 className="text-[28px]  text-center  font-bold text-[#333333]">
                Reset Password
              </h3>
              <p className="mt-1 text-center text-[#33333397]">
                Get a new password
              </p>
            </div>
            <div className="grid gap-5">
              <div className="flex flex-col space-y-1">
                <label className="font-medium">New Password</label>
                <div className="flex border-1 border-[#8080802a] focus:border-[#209e2e] outline-none w-full p-4 rounded-[5px]">
                  <input
                    {...register("password")}
                    type={isvisible ? "text" : "password"}
                    placeholder="••••••••"
                    className="focus:border-[#209e2e] outline-none w-full rounded-[5px]"
                    aria-invalid={errors.password ? "true" : "false"}
                    aria-describedby={
                      errors.password ? "password-error" : undefined
                    }
                  />
                  <button
                    className="cursor-pointer text-[#595c72]"
                    type="button"
                    onClick={() => setisvisible(!isvisible)}
                  >
                    {isvisible ? <Eye /> : <EyeOff />}
                  </button>
                </div>
              </div>

              <div className="flex flex-col space-y-1">
                <label className="font-medium">Confirm New Password</label>
                <input
                  {...register("confirmPassword")}
                  type={isvisible ? "text" : "password"}
                  placeholder="••••••••"
                  className="border-1 border-[#8080802a] placeholder:text-[#7a7e9a] focus:border-1 focus:border-[#209e2e] outline-none w-full p-4 rounded-[5px]"
                  aria-invalid={errors.confirmPassword ? "true" : "false"}
                  aria-describedby={
                    errors.confirmPassword ? "confirmPassword-error" : undefined
                  }
                />
                {errors.confirmPassword && (
                  <p
                    id="confirmPassword-error"
                    className="text-sm text-red-600 mt-1"
                  >
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {isLoading ? (
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
                  Updata now
                </button>
              )}
            </div>

            <span className="flex mt-5 text-[#7a7e9a]">
              <p>Remembered password</p>
              <Link href={"/Login"}>
                <p className="text-[#209e2e] ml-1 cursor-pointer"> Login!</p>
              </Link>
            </span>
          </form>
        </div>
      </div>
    </div>
  );
}
