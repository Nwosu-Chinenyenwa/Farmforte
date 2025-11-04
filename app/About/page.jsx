"use client";

import React from "react";
import Nav from "../Components/Nav";
import pagetitle from "../../public/img/page-title-bg.jpg";
import rag1 from "../../public/img/shape-2 (1).png";
import about from "../../public/img/admin.jpg";
import about1 from "../../public/img/about1 (1).png"
import about2 from "../../public/img/about2.png";
import about3 from "../../public/img/about3.png";
import Image from "next/image";
import team1 from "../../public/img/1_180x.avif";
import team2 from "../../public/img/2_180x.webp";
import team3 from "../../public/img/3_180x.avif";
import feedBack from "../../public/img/6_370x.webp";
import { FaCogs, FaTools, FaWrench } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import Footer from "../Components/Footer";
import AllNav from "../Components/AllNav";
import Subcribe from "../Components/Subcribe";
import Link from "next/link";
import blog1 from "../../public/asset/blogs1.jpg";
import blog2 from "../../public/asset/blogs2.jpg";
import blog3 from "../../public/asset/blogs3.jpg";
import blog4 from "../../public/asset/blogs4.jpg";

import "swiper/css";
import "swiper/css/navigation";
export default function page() {
  const features = [
    {
      icon: <FaCogs className="text-[#80b500] text-5xl" />,
      title: "All Farm Solutions",
      desc: "We provide modern agricultural tools and smart systems that help farmers improve productivity and sustainability.",
    },
    {
      icon: <FaTools className="text-[#80b500] text-5xl" />,
      title: "Agro Product Support",
      desc: "Farmforte ensures proper crop management and soil care with trusted methods that increase long-term farm yields.",
    },
    {
      icon: <FaWrench className="text-[#80b500] text-5xl" />,
      title: "Sustainable Growth",
      desc: "We promote eco-friendly farming practices and empower local farmers through innovation and agricultural training.",
    },
  ];

  const feedbacks = [
    {
      id: 1,
      name: "Chinedu Okafor",
      role: "Farm Manager",
      roleColor: "text-green-600",
      img: blog1,
      text: "Farmforte has transformed the way we manage our crops. Their support and technology made our harvests more efficient than ever before.",
    },
    {
      id: 2,
      name: "Aisha Bello",
      role: "Customer",
      roleColor: "text-green-600",
      img: blog3,
      text: "Working with Farmforte has been inspiring. The team truly understands the needs of local farmers and brings real solutions to the field.",
    },
    {
      id: 3,
      name: "Emeka Uzo",
      role: "Customer",
      roleColor: "text-blue-600",
      img: blog2,
      text: "I ordered farm produce through Farmforte and received fresh, quality goods right on time. Their service is simply outstanding.",
    },
    {
      id: 4,
      name: "Ngozi Adeyemi",
      role: "Customer",
      roleColor: "text-blue-600",
      img: blog4,
      text: "I love how Farmforte supports small farmers and promotes organic produce. Their dedication to quality and growth is unmatched.",
    },
  ];

  return (
    <>
      <section className="pagetitle">
        <AllNav />
        <div className="py-50 bg-[#00000093] text-white text-center">
          <h1 className="text-[30px] font-extrabold">About us</h1>
          <div>
            <div className="flex items-center justify-center gap-2">
              <Link href={"/Home"}>
                <p className="cursor-pointer">Home</p>
              </Link>
              <span className="w-[5px] h-[5px] rounded-full bg-[#209e2e] block"></span>
              <p className="cursor-pointer">About</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f4faf4] ">
        <Image src={rag1} alt="rag1" />

        <div className="pb-10 ">
          <div>
            <div className="lg:flex items-center lg:w-[90vw] xl:w-[80vw] m-auto my-[30px] pl-1 md:w-[90vw] md:py-10 md:m-auto md:pt-10">
              <span className="w-[60vw]">
                <span className="text-[#209e2e] text-[14px] lg:text-[15px] block mb-[8px]">
                  KNOW ABOUT US
                </span>
                <h2 className="text-[25px] rajdhani-light lg:text-[30px] xl:text-[38px] font-[700] text-[#333333]">
                  Our farms ensure fresh vegetables are easy to access safely.
                </h2>
              </span>

              <span className="lg:border-l-1 border-[#7a7e9a]">
                <p className="leading-[1.8]  xl:text-[14px] lg:pl-10 text-[#7a7e9a] font-[400] text-[16px] lg:max-w-[600px]">
                  There are many varieties of fresh vegetables and fruits
                  available, but the majority are carefully grown, harvested,
                  and selected to ensure quality and taste.
                </p>
              </span>
            </div>

            <div className="flex flex-col lg:flex-row md:gap-0 gap-10 xl:gap-10 lg:gap-5 justify-center items-center">
              <Image
                className="w-[90vw] lg:w-[40vw] lg:h-[50vh] xl:h-[90vh] xl:w-[40vw]"
                src={about}
                alt="seller"
              />

              <div className="xl:w-[40vw] lg:w-[50vw] p-2 xl:p-0  lg:p-0">
                <div className="flex flex-col gap-3 ">
               <div className="flex lg:w-[50vw] xl:w-[40vw] w-[95vw] md:w-[90vw] lg:justify-start justify-center items-center gap-3 overflow-x-scroll no-scrollbar">
  <div>
    <Image
      className="w-[90vw] md:w-[45vw] xl:w-[20vw] h-auto relative top-2"
      src={about1}
      alt="seller"
    />
    <div className="w-[90vw] md:w-[45vw] lg:w-[20vw] border-1 border-dashed border-t-0 py-5 px-3 rounded-sm border-[#209e2e] bg-[#fdfdfd] flex flex-col item-center gap-2 h-[160px] ">
      <li className="flex gap-2 items-center">
        <p className="bg-[#209e2e] rounded-4xl block w-3 h-3"></p>
        <p className="text-[#209e2e] text-[15px] leading-1 font-[500]">
          Sustainable Agriculture
        </p>
      </li>
      <h3 className="text-[#333333] font-[800]">
        Empowering farmers through innovation and eco-friendly practices.
      </h3>
    </div>
  </div>

  <div>
    <Image
      className="w-[90vw] md:w-[45vw] lg:w-[20vw] h-auto relative top-2"
      src={about2}
      alt="seller"
    />
    <div className="w-[90vw] md:w-[45vw] lg:w-[20vw] border-1 border-dashed border-t-0 py-5 px-3 rounded-sm border-[#209e2e] bg-[#fdfdfd] flex flex-col item-center gap-2 h-[160px] ">
      <li className="flex gap-2 items-center">
        <p className="bg-[#209e2e] rounded-4xl block w-3 h-3"></p>
        <p className="text-[#209e2e] text-[15px] leading-1 font-[500]">
          Quality Farm Produce
        </p>
      </li>
      <h3 className="text-[#333333] font-[800]">
        Delivering fresh, nutrient rich, and responsibly grown food for all.
      </h3>
    </div>
  </div>

  <div>
    <Image
      className="w-[90vw] md:w-[45vw] lg:w-[20vw] h-auto relative top-2"
      src={about3}
      alt="seller"
    />
    <div className="w-[90vw] md:w-[45vw] lg:w-[20vw] border-1 border-dashed border-t-0 py-5 px-3 rounded-sm border-[#209e2e] bg-[#fdfdfd] flex flex-col item-center gap-2 h-[160px]">
      <li className="flex gap-2 items-center">
        <p className="bg-[#209e2e] rounded-4xl block w-3 h-3"></p>
        <p className="text-[#209e2e] text-[15px] leading-1 font-[500]">
          Agritech Solutions
        </p>
      </li>
      <h3 className="text-[#333333] font-[800]">
        Transforming agriculture with data-driven insights 
      </h3>
    </div>
  </div>
</div>

                  <h3 className="text-[#333333] text-[25px] p-2 lg:p-0 font-bold">
                    Farming is not just growth it's how we nourish the world.
                  </h3>
                  <p className="text-[#7a7e9a] text-[14px] p-2 lg:p-0  lg:text-[16px] font-[400] leading-[1.8]">
                    Farmforte stands for modern agriculture, empowering farmers
                    and producing quality food for every home and community
                    around the world.
                  </p>
                  <ul className="flex gap-2 p-2 lg:p-0 flex-col flex-wrap">
                    <span className="flex lg:flex-row flex-col gap-2 lg:gap-5">
                      <li className="flex items-center gap-2">
                        <svg
                          className="border-1 w-[35px] p-2 rounded-4xl border-[#209e2e] text-[#209e2e] bg-[#eafef1]"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M11.602 13.7599L13.014 15.1719L21.4795 6.7063L22.8938 8.12051L13.014 18.0003L6.65 11.6363L8.06421 10.2221L10.189 12.3469L11.6025 13.7594L11.602 13.7599ZM11.6037 10.9322L16.5563 5.97949L17.9666 7.38977L13.014 12.3424L11.6037 10.9322ZM8.77698 16.5873L7.36396 18.0003L1 11.6363L2.41421 10.2221L3.82723 11.6352L3.82604 11.6363L8.77698 16.5873Z"></path>
                        </svg>
                        <p className="text-[16px] font-[400]">
                          Get Back to Healthy Life
                        </p>
                      </li>
                      <li className="flex items-center gap-2">
                        <svg
                          className="border-1 w-[35px] p-2 rounded-4xl border-[#209e2e] text-[#209e2e] bg-[#eafef1]"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M11.602 13.7599L13.014 15.1719L21.4795 6.7063L22.8938 8.12051L13.014 18.0003L6.65 11.6363L8.06421 10.2221L10.189 12.3469L11.6025 13.7594L11.602 13.7599ZM11.6037 10.9322L16.5563 5.97949L17.9666 7.38977L13.014 12.3424L11.6037 10.9322ZM8.77698 16.5873L7.36396 18.0003L1 11.6363L2.41421 10.2221L3.82723 11.6352L3.82604 11.6363L8.77698 16.5873Z"></path>
                        </svg>
                        <p className="text-[16px] font-[400]">
                          {" "}
                          Wake up Refreshed
                        </p>
                      </li>
                    </span>
                    <span className="flex lg:flex-row flex-col gap-2 lg:gap-5">
                      <li className="flex items-center gap-2">
                        <svg
                          className="border-1 w-[35px] p-2 rounded-4xl border-[#209e2e] text-[#209e2e] bg-[#eafef1]"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M11.602 13.7599L13.014 15.1719L21.4795 6.7063L22.8938 8.12051L13.014 18.0003L6.65 11.6363L8.06421 10.2221L10.189 12.3469L11.6025 13.7594L11.602 13.7599ZM11.6037 10.9322L16.5563 5.97949L17.9666 7.38977L13.014 12.3424L11.6037 10.9322ZM8.77698 16.5873L7.36396 18.0003L1 11.6363L2.41421 10.2221L3.82723 11.6352L3.82604 11.6363L8.77698 16.5873Z"></path>
                        </svg>
                        <p className="text-[16px] font-[400]">
                          Set a Healthier Lifestyle
                        </p>
                      </li>
                      <li className="flex items-center gap-2">
                        <svg
                          className="border-1 w-[35px] p-2 rounded-4xl border-[#209e2e] text-[#209e2e] bg-[#eafef1]"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M11.602 13.7599L13.014 15.1719L21.4795 6.7063L22.8938 8.12051L13.014 18.0003L6.65 11.6363L8.06421 10.2221L10.189 12.3469L11.6025 13.7594L11.602 13.7599ZM11.6037 10.9322L16.5563 5.97949L17.9666 7.38977L13.014 12.3424L11.6037 10.9322ZM8.77698 16.5873L7.36396 18.0003L1 11.6363L2.41421 10.2221L3.82723 11.6352L3.82604 11.6363L8.77698 16.5873Z"></path>
                        </svg>
                        <p className="text-[16px] font-[400]">
                          Boost Energy & Metabolism
                        </p>
                      </li>
                    </span>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center items-center">
          <ul className="flex flex-col md:grid md:grid-cols-2 xl:flex lg:flex lg:gap-0 gap-5 lg:flex-row items-center justify-center w-[90vw] lg:w-[85vw] bg-[#ffffff] rounded-[5px] relative top-20 py-10 fun-facts-content-area">
            <li className="flex  lg:w-[25%] border-dashed lg:border-r-1 border-[#209e2e] flex-col items-center text-[#209e2e]  font-[300] text-[50px]">
              <span>120+</span>
              <p className="text-[16px] font-[400]">Category Vegetable</p>
            </li>
            <li className="flex  lg:w-[25%] border-dashed lg:border-r-1 border-[#209e2e] flex-col items-center text-[#209e2e] font-[300] text-[50px]">
              <span>560+</span>
              <p className="text-[16px] font-[400]">Home Supplier</p>
            </li>
            <li className="flex  lg:w-[25%] border-dashed lg:border-r-1 border-[#209e2e] flex-col items-center text-[#209e2e] font-[300] text-[50px]">
              <span>145+</span>
              <p className="text-[16px] font-[400]">Seasonal Vegetables</p>
            </li>
            <li className="flex lg:w-[25%]  flex-col items-center text-[#209e2e] font-[300] text-[50px]">
              <span>200+</span>
              <p className="text-[16px] font-[400]">Attended Event</p>
            </li>
          </ul>
        </div>
      </section>

      <section className="py-[20px] mt-[200px] flex flex-col items-center justify-center gap-5">
        <div className="font-bold text-[33px] flex flex-col items-center justify-center text-center gap-1">
          <p className="text-[#209e2e] rajdhani-light lg:text-[15px] font-[400] text-[14px]">
            FARMFORTE
          </p>
          <span className="flex items-center">
            <h3 className="text-[#333333] rajdhani-light lg:text-[36px] text-[26px] font-bold">
              We are on the map
            </h3>
            <p className="text-[#209e2e] text-[50px]">!</p>
          </span>
        </div>
        <div className="w-[90vw] h-[450px]">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3971.576849635824!2d7.544376273982893!3d5.480959594498789!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1042c5a3b597c15f%3A0x9654b1f3cace9baa!2sUmuariaga%20Primary%20School!5e0!3m2!1sen!2sng!4v1761515598894!5m2!1sen!2sng"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </section>

      <section className="bg-[#f7f5eb] py-12 px-6 md:px-12">
        <div className="text-center mb-10">
          <p className="text-[#7ed957] font-semibold rajdhani-light">
            // FEATURES //
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold rajdhani-light text-[#0f1b0f]">
            Why Choose Us<span className="text-[#7ed957]">!</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((item, index) => (
            <div
              key={index}
              className="bg-white shadow-md p-6 flex flex-col gap-4 hover:shadow-lg transition"
            >
              {item.icon}
              <h3 className="text-[25px] md:text-xl lg:text-[28px] font-bold text-[#0f1b0f]">
                {item.title}
              </h3>
              <p className="text-[#555] text-sm md:text-base leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-[100px] flex flex-col gap-10">
        <h2 className="text-3xl md:text-4xl rajdhani-light text-center font-extrabold text-[#0f1b0f]">
          Team Members
        </h2>

        <div>
          <div className="flex flex-wrap items-center justify-center gap-10">
            <div className="w-fit group hover:bg-[#071c1f] transition items-center justify-center md:shadow-lg px-10 py-15 flex flex-col text-center">
              <div className="w-[40vw] sm:w-[30vw] md:w-[20vw] lg:w-[15vw] aspect-square flex items-center justify-center mb-[30px]">
                <Image
                  className="w-full h-full object-cover rounded-full group-hover:scale-110 transition"
                  src={team1}
                  alt="team1"
                />
              </div>

              <h6 className="text-[#80b500] mb-[15px] rajdhani-light leading-1.3 font-[700] text-[16px]">
                CEO/FOUNDER
              </h6>

              <h4 className="text-[#071c1f] group-hover:text-white transition mb-[15px] rajdhani-light leading-1.3 font-[700] text-[20px]">
                Nwosu C. Emmanuel
              </h4>
            </div>
            <div className="w-fit group hover:bg-[#071c1f] transition md:shadow-lg px-10 py-15 flex flex-col text-center  items-center justify-center">
              <div className="w-[40vw] sm:w-[30vw] md:w-[20vw] lg:w-[15vw] aspect-square flex items-center justify-center mb-[30px]">
                <Image
                  className="w-full h-full object-cover rounded-full group-hover:scale-110 transition"
                  src={team2}
                  alt="team1"
                />
              </div>

              <h6 className="text-[#80b500] mb-[15px] rajdhani-light leading-1.3 font-[700] text-[16px]">
                Developer
              </h6>

              <h4 className="text-[#071c1f] group-hover:text-white transition mb-[15px] rajdhani-light leading-1.3 font-[700] text-[20px]">
                Nwosu Chinenyenwa
              </h4>
            </div>
            <div className="w-fit group hover:bg-[#071c1f] transition md:shadow-lg px-10 py-15 flex flex-col text-center items-center justify-center">
              <div className="w-[40vw] sm:w-[30vw] md:w-[20vw] lg:w-[15vw] aspect-square flex items-center justify-center mb-[30px]">
                <Image
                  className="w-full h-full object-cover rounded-full group-hover:scale-110 transition"
                  src={team3}
                  alt="team1"
                />
              </div>

              <h6 className="text-[#80b500] mb-[15px] rajdhani-light leading-1.3 font-[700] text-[16px]">
                CEO/FOUNDER
              </h6>

              <h4 className="text-[#071c1f] group-hover:text-white transition mb-[15px] rajdhani-light leading-1.3 font-[700] text-[20px]">
                Nwosu C. Emmanuel
              </h4>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10  bg-[#f2f6f7]">
        <p className="rajdhani-light text-center text-[#80b500] text-[16px] leading-1.3 font-[700]">
          TESTIMONIAL
        </p>
        <h2 className="text-center rajdhani-light text-[30px] lg:text-[50px] text-[#071c1f] leading-1.2 font-[700] mb-10">
          Customer Feedback
        </h2>

        <Swiper
          modules={[Navigation, Autoplay]}
          navigation
          spaceBetween={30}
          slidesPerView={1}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          breakpoints={{
            480: { slidesPerView: 1 },
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 3 },
            1536: { slidesPerView: 4 },
          }}
          className="px-5 relative"
        >
          {feedbacks.map((item) => (
            <SwiperSlide key={item.id}>
              <div className="p-1">
                <div className="max-w-[639px] flex p-[20px] sm:p-[30px] md:p-[40px] gap-5 shadow-sm mx-auto relative">
                  <svg
                    className="absolute right-0 bottom-0 w-20 sm:w-24 md:w-30 text-[#8cb2b23d]"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22H2L4.92893 19.0711C3.11929 17.2614 2 14.7614 2 12ZM6.82843 20H12C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 14.1524 4.85124 16.1649 6.34315 17.6569L7.75736 19.0711L6.82843 20ZM8 13H16C16 15.2091 14.2091 17 12 17C9.79086 17 8 15.2091 8 13Z"></path>
                  </svg>
                  <Image
                    src={item.img}
                    alt={item.name}
                    className="w-12 h-12 sm:w-16 sm:h-16 object-cover"
                  />
                  <div>
                    <p className="hyphens-auto mb-[15px] text-sm sm:text-base">
                      {item.text}
                    </p>
                    <h4 className="text-[#071c1f] group-hover:text-white transition mb-[10px] rajdhani-light leading-1.3 font-[700] text-[16px] sm:text-[20px]">
                      {item.name}
                    </h4>
                    <p className="text-[#7ed957] rajdhani-light font-semibold text-sm sm:text-base">
                      {item.role}
                    </p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <style jsx global>{`
          .swiper-button-next,
          .swiper-button-prev {
            color: #7ed957 !important;
            font-weight: bold;
            width: 10%;
          }
        `}</style>
      </section>
      <Subcribe />
      <Footer />
    </>
  );
}
