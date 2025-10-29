import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import toast, { Toaster } from "react-hot-toast";
import TabTitleWatcher from "./Components/TabTitleWatcher";
import Link from "next/link";
import ChatbaseWidget from "./Components/Chatbase";

export const metadata = {
  title: "Farmforte Agriculture",
  description: "Nourishing the planet",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <meta
        name="google-site-verification"
        content="rszEqQis_kfUgJSnfECtDkudVyIW5GdWVkOhAAHmY7o"
      />
      <head>
      </head>
      <body>
        <TabTitleWatcher />
        <Link href={"/Shop"}>
          <button className="bg-[#82b440] text-white fixed  right-10 xl:right-5 z-10 cursor-pointer top-70 shake-btn rounded-4xl p-1.5 px-4 font-medium hover:bg-[#15803d] xl:p-2 xl:px-5">
            Buy Now
          </button>
        </Link>
        {children}
        <Toaster />
        <ChatbaseWidget/>
      </body>
    </html>
  );
}
