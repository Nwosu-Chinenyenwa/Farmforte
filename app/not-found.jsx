import React from "react";
import Link from "next/link";
import Image from "next/image";
import fourOfour from "../public/404.png";

export default function notfound() {
  return (
    <>
      <section className="flex justify-center items-center h-[100vh] p-5">
        <div>
          <div className="grid justify-center items-center text-center">
            <div className="max-w-[700px]">
              <Image
                className="max-w-[100%] m-auto"
                src={fourOfour}
                alt="404"
              />
            </div>
            <h3 className="font-[800] text-[#333333] text-[40px] mt-[45px] mb-[15px]">
              Page Not Found
            </h3>
            <p className="max-w-[520px] m-auto text-[#7a7e9a] mb-[15px] font-[500] text-[16px] leading-1.8">
              The page you are looking for might have been removed had its name
              changed or is temporarily unavailable.
            </p>
          </div>

          <Link href={"/Home"}>
            <button className="text-white font-bold bg-[#209e2e] flex items-center justify-center uppercase py-[14px] px-[30px] rounded-full w-auto m-auto cursor-pointer">
              Go To HOME
            </button>
          </Link>
        </div>
      </section>
    </>
  );
}
