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
  template: "%s | Farmforte Agriculture",
  keywords: [
    "Farmforte",
    "Farmforte Nigeria",
    "Farmforte Africa",
    "Farmforte Agriculture",
    "Farmforte Agritech",
    "Farmforte Foods",
    "Farmforte Products",
    "Farmforte Export",
    "Farmforte Marketplace",
    "Farmforte Shop",
    "Farmforte Farmers",
    "Farmforte Cocoa",
    "Farmforte Cashew",
    "Farmforte Palm Oil",
    "Farmforte Agribusiness",
    "Farmforte AgriHub",
    "Farmforte Sustainable Development",
    "Farmforte Investments",
    "Farmforte Partnerships",
    "Farmforte Supply Chain",
    "Farmforte Innovation",
    "Farmforte Technology",
    "Farmforte Food Security",
    "Farmforte Organic Farming",
    "Farmforte Green Agriculture",
    "Farmforte Modern Farming",
    "Farmforte Smart Farming",
    "Farmforte Sustainability",
    "Farmforte Agro Processing",
    "Farmforte Farm Produce",
    "Farmforte Healthy Food",
    "Farmforte Organic Food",
    "Farmforte Export Farming",
    "Farmforte Value Chain",
    "Farmforte Climate Action",
    "Farmforte Eco Friendly",
    "Farmforte Rural Development",
    "Farmforte Agriculture Nigeria",
    "Farmforte Food Production",
    "Farmforte Organic Produce",
    "Farmforte Farm to Table",
    "Farmforte Farmers Network",
    "Farmforte Agri Investment",
    "Farmforte Agro Innovation",
    "Farmforte Agritech Solutions",
    "Farmforte Crop Production",
    "Farmforte Livestock",
    "Farmforte Poultry",
    "Farmforte Dairy Farming",
    "Farmforte Cassava",
    "Farmforte Yam",
    "Farmforte Maize",
    "Farmforte Rice",
    "Farmforte Plantain",
    "Farmforte Pineapple",
    "Farmforte Ginger",
    "Farmforte Sesame",
    "Farmforte Shea Butter",
    "Farmforte Honey",
    "Farmforte Export Products",
    "Farmforte Logistics",
    "Farmforte Packaging",
    "Farmforte Farmers Training",
    "Farmforte Empowerment",
    "Farmforte Sustainability Goals",
    "Farmforte Renewable Farming",
    "Farmforte Local Farmers",
    "Farmforte Organic Practices",
    "Farmforte Climate Smart Agriculture",
    "Farmforte Agro Value Chain",
    "Farmforte Investment Opportunities",
    "Farmforte Digital Farming",
    "Farmforte Precision Farming",
    "Farmforte Smart Agriculture",
    "Farmforte Agricultural Exports",
    "Farmforte Agrifood",
    "Farmforte Food Processing",
    "Farmforte Supply Management",
    "Farmforte Distribution",
    "Farmforte Warehousing",
    "Farmforte Cold Chain",
    "Farmforte E-commerce",
    "Farmforte Food Innovation",
    "Farmforte Organic Supply",
    "Farmforte Export Quality",
    "Farmforte Farm Management",
    "Farmforte Agro Education",
    "Farmforte Technology Hub",
    "Farmforte Sustainability Program",
    "Farmforte Local Development",
    "Farmforte Global Trade",
    "Farmforte Sustainable Food",
    "Farmforte Agricultural Research",
    "Farmforte Smart Solutions",
    "Farmforte Eco Agriculture",
    "Farmforte Circular Economy",
    "Farmforte Environmental Impact",
    "Farmforte Organic Certification",
    "Farmforte SDGs",
    "Farmforte Africa Growth",
    "Farmforte Nigeria Farmers",
    "Farmforte Rural Empowerment",
    "Farmforte Green Economy",
    "Farmforte Impact Investment",
    "Farmforte Sustainable Growth",
    "Farmforte Export Business",
    "Farmforte Agriculture Projects",
    "Farmforte Eco Farming",
    "Farmforte Organic Growth",
    "Farmforte Agro Export",
    "Farmforte Agri Supply",
    "Farmforte Farm Management System",
    "Farmforte Smart Technology",
    "Farmforte Food Chain",
    "Farmforte Community Development",
    "Farmforte Rural Agriculture",
    "Farmforte Sustainable Agribusiness",
    "Farmforte African Agriculture",
    "Farmforte Food Distribution",
    "Farmforte Farm Innovation",
    "Farmforte Agricultural Solutions",
    "Farmforte Farmers Support",
    "Farmforte Export Logistics",
    "Farmforte Farming Initiative",
    "Farmforte Global Market",
    "Farmforte Agri Exporters",
    "Farmforte Organic Produce Export",
    "Farmforte Agro Distribution",
    "Farmforte Global Partnerships",
    "Farmforte African Farmers",
    "Farmforte Agricultural Empowerment",
    "Farmforte Organic Exports",
    "Farmforte Green Energy",
    "Farmforte Solar Farming",
    "Farmforte Carbon Neutral",
    "Farmforte Sustainability Initiative",
    "Farmforte Global Goals",
    "Farmforte Women in Agriculture",
    "Farmforte Youth in Agribusiness",
    "Farmforte Education for Farmers",
    "Farmforte Food Supply",
    "Farmforte Export Solutions",
    "Farmforte Agricultural Training",
    "Farmforte Farm Equipment",
    "Farmforte Farm Inputs",
    "Farmforte Agro Products",
    "Farmforte Farming Solutions",
    "Farmforte Farm Innovation Hub",
    "Farmforte Agricultural Marketplace",
    "Farmforte Eco Solutions",
    "Farmforte FarmTech",
    "Farmforte Food Ecosystem",
    "Farmforte Organic System",
    "Farmforte Agri Chain",
    "Farmforte Agro Trade",
    "Farmforte Food Safety",
    "Farmforte Nutrition",
    "Farmforte Fresh Produce",
    "Farmforte Export Quality Produce",
    "Farmforte Agri Platform",
    "Farmforte Technology Driven Agriculture",
    "Farmforte Export Hub",
    "Farmforte Smart Supply Chain",
    "Farmforte Agri Logistics",
    "Farmforte Global Exporters",
    "Farmforte Nigeria Export",
    "Farmforte West Africa",
    "Farmforte Food Business",
    "Farmforte Agriculture Sustainability",
    "Farmforte Organic Farming Nigeria",
    "Farmforte Healthy Eating",
    "Farmforte Local Produce",
    "Farmforte Farm Network",
    "Farmforte Smart Solutions",
    "Farmforte Export Processing",
    "Farmforte Agro Services",
    "Farmforte Environmental Sustainability",
    "Farmforte Global Agriculture",
    "Farmforte Food Hub",
    "Farmforte Farmers Hub",
    "Farmforte Climate Innovation",
    "Farmforte Clean Agriculture",
    "Farmforte Agricultural Growth",
    "Farmforte Organic Agribusiness",
    "Farmforte Crop Science",
    "Farmforte Food Chain Solutions",
    "Farmforte Future of Farming",
    "Farmforte Technology Innovation",
    "Farmforte Agri Partnerships",
    "Farmforte Agricultural Impact",
    "Farmforte Organic Market",
    "Farmforte Global Investors",
    "Farmforte Export Market",
    "Farmforte Farmers Market",
    "Farmforte Agricultural Development",
    "Farmforte Sustainable Future",
    "Farmforte Organic Chain",
    "Farmforte Green Supply Chain",
    "Farmforte Farm to Market",
    "Farmforte Export Opportunities",
    "Farmforte Agro Entrepreneurship",
    "Farmforte Africa Export",
    "Farmforte Agri Enterprise",
    "Farmforte Future Agriculture",
    "Farmforte Organic Innovation",
    "Farmforte Modern Agribusiness",
  ],
  icons: {
    icon: [
      { url: "/favicon.png" },
      { url: "/favicon.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.png", sizes: "16x16", type: "image/png" },
    ],
    apple: { url: "/favicon.png", sizes: "180x180" },
  },

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
        url: "/favicon.png",
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
    images: ["/favicon.png"],
    creator: "@Farmforte",
  },
  metadataBase: new URL("https://farmforte.vercel.app"),
  alternates: {
    canonical: "/",
    verification: {
      google: "googleafeb13ba76b27ddf.html",
    },
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
              url: "https://farmforte.vercel.app",
              logo: "https://farmforte.vercel.app/favicon.png",
              sameAs: [
                "http://Wa.me/2348147186916",
                "https://www.facebook.com/share/1FdAZsmyJ7/",
                "https://x.com/Farmforte_?t=MP0FWyznlVo9xfNUmWmMKA&s=09",
              ],
              potentialAction: {
                "@type": "SearchAction",
                target:
                  "https://www.farmforte.vercel.app/search?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
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
