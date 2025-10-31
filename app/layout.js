import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import toast, { Toaster } from "react-hot-toast";
import TabTitleWatcher from "./Components/TabTitleWatcher";
import Link from "next/link";
import ChatbaseWidget from "./Components/Chatbase";

export const metadata = {
  title: "Farmforte Agriculture | Nourishing the Planet",
  description:
    "Farmforte Agriculture empowering sustainable farming practices, promoting food security, and nourishing the planet through innovative agricultural solutions.",
  keywords: [
    "Farmforte",
    "Agriculture",
    "Farming",
    "Sustainability",
    "Food Security",
    "AgriTech",
    "Farm Produce",
    "Sustainable Agriculture",
    "Organic Farming",
    "Agricultural Innovation",
    "Green Farming",
    "Farmforte Nigeria",
    "Farmforte Africa",
    "Agribusiness",
    "Smart Farming",
    "Climate-Smart Agriculture",
    "Crop Production",
    "Livestock Farming",
    "Agro Processing",
    "Export Farming",
    "Farmforte Products",
    "Healthy Food",
    "Organic Food",
    "Farmforte Shop",
    "Buy Farm Produce Online",
    "Farmforte Foods",
    "Agro Investment",
    "Agricultural Technology",
    "Modern Farming",
    "Farmforte Marketplace",
    "Farmforte Export",
    "Agricultural Sustainability",
    "Farm to Table",
    "Farmforte Innovation",
    "Sustainable Food Systems",
    "Agro Value Chain",
    "Farmforte Farmers",
    "Rural Development",
    "Farmforte Supply Chain",
    "Farmforte Agritech",
    "Agricultural Exports",
    "Food Production",
    "Eco-Friendly Farming",
    "Farmforte Cocoa",
    "Farmforte Cashew",
    "Farmforte Palm Oil",
    "Farmforte Partnerships",
    "Farmforte Investments",
    "Farmforte Agriculture Nigeria",
    "Farmforte Sustainable Development",
    "Farmforte AgriHub",
  ],
  authors: [{ name: "Farmforte Agriculture" }],
  metadataBase: new URL("https://farmforte.vercel.app/"),
  alternates: {
    canonical: "https://farmforte.vercel.app/",
  },
  openGraph: {
    title: "Farmforte Agriculture | Nourishing the Planet",
    description:
      "Empowering sustainable farming and innovation in agriculture to nourish the world.",
    url: "https://farmforte.vercel.app/",
    siteName: "Farmforte Agriculture",
    images: [
      {
        url: "https://farmforte.vercel.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FFARMFORTE%205.6e2d3acf.jpg&w=3840&q=75",
        width: 1200,
        height: 630,
        alt: "Farmforte Agriculture",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Farmforte Agriculture | Nourishing the Planet",
    description:
      "Sustainable agriculture and innovative food solutions from Farmforte.",
    images: ["https://your-domain.com/og-image.jpg"],
    creator: "@Farmforte",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta
          name="google-site-verification"
          content="rszEqQis_kfUgJSnfECtDkudVyIW5GdWVkOhAAHmY7o"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#82b440" />
        <meta name="author" content="Farmforte Agriculture" />
        <link rel="canonical" href="https://farmforte.vercel.app/" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Farmforte Agriculture",
              url: "https://farmforte.vercel.app/",
              logo: "https://farmforte.vercel.app/logo.png",
              sameAs: [
                "http://Wa.me/2348147186916",
                "https://www.facebook.com/share/1FdAZsmyJ7/",
                "https://x.com/Farmforte_?t=MP0FWyznlVo9xfNUmWmMKA&s=09",
              ],
              description:
                "Farmforte Agriculture is committed to sustainable farming and innovation in food production.",
              contactPoint: [
                {
                  "@type": "ContactPoint",
                  telephone: "+2348147186916",
                  contactType: "Customer Support",
                  areaServed: "NG",
                  availableLanguage: "English",
                },
              ],
            }),
          }}
        />
      </head>

      <body>
        <TabTitleWatcher />

        <Link href={"/Shop"}>
          <button className="bg-[#82b440] text-white fixed right-10 xl:right-5 z-10 cursor-pointer top-70 shake-btn rounded-4xl p-1.5 px-4 font-medium hover:bg-[#15803d] xl:p-2 xl:px-5">
            Buy Now
          </button>
        </Link>

        {children}
        <Toaster />
        <ChatbaseWidget />
      </body>
    </html>
  );
}
