"use client";

import React, { useEffect, useRef, useState } from "react";
import Aside from "../Components/Aside";
import {
  IoSearchOutline,
  IoSettingsOutline,
  IoNotificationsSharp,
} from "react-icons/io5";
import user from "../../public/asset/avatar-CDT9_MFd.jpg";
import Image from "next/image";
import { Mail } from "lucide-react";
import AdminNav from "../Components/AdminNav";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";
import Rocket from "../../public/404.png";
import { TbCurrencyNaira } from "react-icons/tb";
import { AiFillProduct } from "react-icons/ai";
import { useRouter } from "next/navigation";
import { CiMenuKebab } from "react-icons/ci";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
} from "recharts";

import { createClient } from "@/utils/supabase/client";
import Adminshort from "../Components/Adminshort";
const supabase = createClient();

export default function page() {
  const route = useRouter();

  const [totalEarning, setTotalEarning] = useState(0);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);

  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [messages, setMessages] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [aside, setaside] = useState(false);
  const [showProfile, setshowProfile] = useState(false);
  const [percentages, setPercentages] = useState({
    earning: 0,
    users: 0,
    products: 0,
  });

  const updata = [
    { month: "jen", value1: 20, value2: 30, sold: 50 },
    { month: "feb", value1: 20, value2: 30, sold: 50 },
    { month: "mar", value1: 20, value2: 30, sold: 50 },
    { month: "Apr", value1: 20, value2: 30, sold: 50 },
    { month: "May", value1: 80, value2: 60, sold: 120 },
    { month: "Jun", value1: 300, value2: 100, sold: 210 },
    { month: "Jul", value1: 250, value2: 200, sold: 340 },
    { month: "Aug", value1: 500, value2: 300, sold: 460 },
    { month: "Sep", value1: 270, value2: 320, sold: 390 },
    { month: "Oct", value1: 350, value2: 330, sold: 400 },
    { month: "Nov", value1: 200, value2: 250, sold: 310 },
    { month: "Dec", value1: 500, value2: 400, sold: 480 },
  ];

  async function fetchMessagesForOrder(orderId) {
    try {
      const { data, error } = await supabase
        .from("chats")
        .select("*")
        .eq("order_id", orderId)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching messages:", error);
        setMessages([]);
      } else {
        setMessages(data || []);
      }
    } catch (err) {
      console.error("fetchMessagesForOrder error:", err);
      setMessages([]);
    }
  }

  async function testSupabaseConnection() {
    try {
      console.log("Testing Supabase connection...");

      const { data, error } = await supabase
        .from("orders")
        .select("id")
        .limit(1);

      if (error) {
        console.error("Supabase connection test failed:", {
          message: error.message,
          code: error.code,
          details: error.details,
        });
        return false;
      }

      console.log("Supabase connection successful");
      return true;
    } catch (err) {
      console.error("Connection test error:", err);
      return false;
    }
  }

  async function fetchTotalsAndChart() {
    try {
      console.log("Starting fetchTotalsAndChart...");

      const isConnected = await testSupabaseConnection();
      if (!isConnected) {
        toast.error("Database connection failed");
        return;
      }

      const { count: orderCount, error: countErr } = await supabase
        .from("orders")
        .select("*", { count: "exact", head: true });

      if (countErr) {
        console.warn("Could not fetch orders count:", countErr);
        setTotalTransactions(0);
      } else {
        setTotalTransactions(orderCount ?? 0);
        console.log("Orders count:", orderCount);
      }

      let allOrders = [];
      let allOrdersError = null;

      try {
        const { data, error } = await supabase
          .from("orders")
          .select("id, amount, created_at, user_id")
          .order("created_at", { ascending: true });

        if (error) {
          allOrdersError = error;
          console.error("Supabase orders fetch error details:", {
            message: error.message,
            code: error.code,
            details: error.details,
            hint: error.hint,
          });

          if (error.message?.includes("JWT") || error.code === "PGRST301") {
            console.error("Authentication error - check Supabase credentials");
          }
          if (
            error.message?.includes("does not exist") ||
            error.code === "42P01"
          ) {
            console.error("Orders table might not exist");
          }
        } else {
          allOrders = data || [];
          console.log("Fetched orders:", allOrders.length);
        }
      } catch (fetchErr) {
        allOrdersError = fetchErr;
        console.error("Orders fetch exception:", fetchErr);
      }

      if (allOrdersError) {
        console.error("All orders fetch failed:", allOrdersError);
        setTotalEarning(0);
        setOrders([]);

        try {
          console.log("Trying alternative sum calculation...");
          const { data: sumData, error: sumError } = await supabase
            .from("orders")
            .select("amount")
            .limit(1000);

          if (!sumError && sumData) {
            const fallbackTotal = sumData.reduce((sum, order) => {
              const amount = parseFloat(order.amount) || 0;
              return sum + amount;
            }, 0);
            setTotalEarning(fallbackTotal);
            console.log("Fallback total earnings:", fallbackTotal);
          }
        } catch (fallbackErr) {
          console.error("Fallback calculation also failed:", fallbackErr);
        }
      } else {
        const rows = allOrders;

        const totalEarnings = rows.reduce((sum, order) => {
          const amountValue = order.amount || order.total || 0;

          let parsedAmount = 0;

          if (typeof amountValue === "number") {
            parsedAmount = amountValue;
          } else if (typeof amountValue === "string") {
            const cleanAmount = amountValue.replace(/[$,₦\s]/g, "").trim();
            parsedAmount = parseFloat(cleanAmount) || 0;
          }

          return sum + parsedAmount;
        }, 0);

        setTotalEarning(totalEarnings);
        setOrders(rows.slice().reverse());
        console.log("Total earnings calculated:", totalEarnings);

        const months = Array.from({ length: 12 }, () => ({
          earning: 0,
          usersSet: new Set(),
        }));
        rows.forEach((r) => {
          const created = r.created_at ? new Date(r.created_at) : null;
          const monthIndex = created ? created.getMonth() : 0;

          const amountValue = r.amount || r.total || 0;
          let monthlyAmount = 0;

          if (typeof amountValue === "number") {
            monthlyAmount = amountValue;
          } else if (typeof amountValue === "string") {
            const cleanAmount = amountValue.replace(/[$,₦\s]/g, "").trim();
            monthlyAmount = parseFloat(cleanAmount) || 0;
          }

          months[monthIndex].earning += monthlyAmount;
          if (r.user_id != null)
            months[monthIndex].usersSet.add(String(r.user_id));
        });

        const monthNames = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];
        const computed = months.map((m, i) => ({
          month: monthNames[i],
          value1: Math.round(m.earning),
          value2: m.usersSet.size,
          earning: Math.round(m.earning),
          users: m.usersSet.size,
        }));
        setChartData(computed);
      }

      const { count: prodCount, error: prodErr } = await supabase
        .from("products")
        .select("id", { count: "exact", head: true });
      if (prodErr) {
        console.warn("products count err", prodErr);
        setTotalProducts(0);
      } else {
        setTotalProducts(prodCount ?? 0);
      }

      let usersCount = 0;

      try {
        const res = await fetch("/api/users/get");
        const json = await res.json();
        if (json.success && Array.isArray(json.users)) {
          usersCount = json.users.length;
          console.log("Got users count from API:", usersCount);
        } else {
          console.warn("API returned no users data");
        }
      } catch (err) {
        console.warn("API users fetch failed:", err);
      }

      if (usersCount === 0) {
        console.log("Trying direct Supabase tables for users count...");
        const tablesToTry = ["profiles", "users", "user", "accounts"];

        for (const table of tablesToTry) {
          try {
            const { count, error } = await supabase
              .from(table)
              .select("id", { count: "exact", head: true });

            if (!error && count !== null) {
              usersCount = count;
              console.log(`Found users in ${table}:`, usersCount);
              break;
            } else if (error) {
              console.log(`Table ${table} not found or error:`, error.message);
            }
          } catch (tableErr) {
            console.log(`Error querying table ${table}:`, tableErr);
          }
        }
      }

      if (usersCount === 0) {
        try {
          const { data: authUsers, error: authError } =
            await supabase.auth.admin.listUsers();
          if (!authError && authUsers && authUsers.users) {
            usersCount = authUsers.users.length;
            console.log("Got users count from auth:", usersCount);
          }
        } catch (authErr) {
          console.warn("Auth users count failed:", authErr);
        }
      }

      setTotalUsers(usersCount);
      console.log("Final users count:", usersCount);
    } catch (err) {
      console.error("fetchTotalsAndChart thrown", err);
      toast.error("Error fetching totals/chart");
    }
  }

  async function fetchOrdersList() {
    setOrdersLoading(true);
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("fetchOrdersList error", error);
        toast.error("Could not fetch orders");
        setOrders([]);
      } else {
        setOrders(data || []);
      }
    } catch (err) {
      console.error("fetchOrdersList thrown", err);
      setOrders([]);
    } finally {
      setOrdersLoading(false);
    }
  }

  useEffect(() => {
    testSupabaseConnection().then((isConnected) => {
      if (isConnected) {
        fetchTotalsAndChart();
        fetchOrdersList();
      } else {
        toast.error("Database connection failed");
      }
    });

    const ordersChannel = supabase
      .channel("public:orders")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        (payload) => {
          const evt = payload.eventType;
          const newRecord = payload.new;
          const oldRecord = payload.old;

          if (evt === "INSERT") {
            setOrders((prev) => [newRecord, ...(prev || [])]);
            toast.success("New order received");
            fetchTotalsAndChart();
          } else if (evt === "UPDATE") {
            setOrders((prev) =>
              (prev || []).map((o) =>
                String(o.id) === String(newRecord.id) ? newRecord : o
              )
            );
            if (
              selectedOrder &&
              String(selectedOrder.id) === String(newRecord.id)
            ) {
              setSelectedOrder(newRecord);
              fetchMessagesForOrder(newRecord.id);
            }
            fetchTotalsAndChart();
          } else if (evt === "DELETE") {
            setOrders((prev) =>
              (prev || []).filter((o) => String(o.id) !== String(oldRecord.id))
            );
            if (
              selectedOrder &&
              String(selectedOrder.id) === String(oldRecord.id)
            ) {
              setSelectedOrder(null);
              setMessages([]);
            }
            fetchTotalsAndChart();
          }
        }
      )
      .subscribe();

    const chatsChannel = supabase
      .channel("public:chats")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "chats" },
        (payload) => {
          const evt = payload.eventType;
          const newRecord = payload.new;
          const oldRecord = payload.old;
          if (evt === "INSERT") {
            if (
              selectedOrder &&
              String(selectedOrder.id) === String(newRecord.order_id)
            ) {
              setMessages((prev) => [...(prev || []), newRecord]);
            }
          } else if (evt === "UPDATE") {
            setMessages((prev) =>
              (prev || []).map((m) =>
                String(m.id) === String(newRecord.id) ? newRecord : m
              )
            );
          } else if (evt === "DELETE") {
            setMessages((prev) =>
              (prev || []).filter((m) => String(m.id) !== String(oldRecord.id))
            );
          }
        }
      )
      .subscribe();

    return () => {
      try {
        supabase.removeChannel(ordersChannel);
        supabase.removeChannel(chatsChannel);
      } catch (err) {}
    };
  }, [selectedOrder?.id]);

  useEffect(() => {
    if (selectedOrder) fetchMessagesForOrder(selectedOrder.id);
  }, [selectedOrder?.id]);

  useEffect(() => {
    async function fetchChartData() {
      try {
        const months = Array.from({ length: 12 }, () => ({
          earning: 0,
          usersSet: new Set(),
        }));

        const { data: orders, error } = await supabase
          .from("orders")
          .select("amount, created_at, user_id");

        if (error) {
          console.error("Error fetching orders:", error);
          return;
        }

        orders.forEach((order) => {
          const date = new Date(order.created_at);
          const monthIndex = date.getMonth();
          const amount = parseFloat(order.amount) || 0;

          months[monthIndex].earning += amount;
          months[monthIndex].usersSet.add(order.user_id);
        });

        const monthNames = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];

        const computed = months.map((m, i) => ({
          month: monthNames[i],
          earning: Math.round(m.earning),
          users: m.usersSet.size,
        }));

        setChartData(computed);
      } catch (err) {
        console.error("Unexpected error:", err);
      }
    }

    fetchChartData();
  }, []);

  const year = new Date().getFullYear();

  useEffect(() => {
    const sumAll = totalEarning + totalUsers + totalProducts;

    if (sumAll > 0) {
      setPercentages({
        earning: Math.round((totalEarning / sumAll) * 100),
        users: Math.round((totalUsers / sumAll) * 100),
        products: Math.round((totalProducts / sumAll) * 100),
      });
    } else {
      setPercentages({ earning: 0, users: 0, products: 0 });
    }
  }, [totalEarning, totalUsers, totalProducts]);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error("Error logging out:", error.message);
        alert("Logout failed. Please try again.");
      } else {
        console.log("router.push to loging")
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };

  return (
    <>
      <section className="">
        <div className="flex">
          {aside && (
            <div className="xl:hidden">
              <Aside />
            </div>
          )}

          <div className="hidden xl:block">
            <Aside />
          </div>

          <div>
            <div className="xl:w-[80vw] border-b-[#dfeaf2] border-1 w-[100vw]">
              <header className="">
                <nav className="bg-[#ffffff] flex justify-between py-5 px-5 lg:px-7 items-center">
                  <span className="hidden lg:flex items-center gap-3 xl:hidden">
                  <CiMenuKebab
                    onClick={() => setaside(!aside)}
                    className="text-[30px]"
                  />
                       <h2 className="text-[#343c6a] font-[600] text-[28px]">
                    Overview
                  </h2>
                  </span>
                  <h2 className="text-[#343c6a] font-[600] text-[0px] lg:text-[28px] hidden xl:block">
                    Overview
                  </h2>
                  <CiMenuKebab
                    onClick={() => setaside(!aside)}
                    className="text-[35px] lg:hidden"
                  />
                  <div className="flex items-center gap-3">
                    <div className="flex bg-[#f5f7fa] items-center gap-2 p-3 rounded-full">
                      <IoSearchOutline className="text-[#a2a6b0] w-[30px] text-[20px]" />
                      <input
                        type="text"
                        placeholder="Search for something"
                        className="text-[8ba3cb] w-[100%] placeholder:text-[#00000058] outline-0"
                      />
                    </div>

                    <Link href={"/AdminSetting"}>
                      <IoSettingsOutline className="bg-[#f5f7fa] hidden md:block lg:block p-3 text-[45px] cursor-pointer rounded-full text-[#00000058] " />
                    </Link>
                    <IoNotificationsSharp className="bg-[#f5f7fa] hidden md:block lg:block p-3 text-[45px] cursor-pointer rounded-full text-[#fe5c73] animate-pulse" />

                    <div>
                      <Image
                        onClick={() => setshowProfile(!showProfile)}
                        className="w-[40px] h-[40px]  rounded-full cursor-pointer"
                        src={user}
                        alt="You"
                      />
                    </div>
                  </div>
                </nav>

                {showProfile && (
                <Adminshort/>
                )}
              </header>
            </div>

            <div className="xl:w-[70vw] m-auto">
              <div>
                <nav className="flex justify-between p-3 ">
                  <div className="flex flex-col text-[#27272a]">
                    <span className="flex gap-2 mb-3">
                      <p
                        onClick={() => route.back()}
                        className="text-[#718096] cursor-pointer"
                      >
                        Back
                      </p>
                      <p>/</p>
                      <p>Dashboard</p>
                    </span>

                    <span className="lg:flex hidden items-center gap-1">
                      <svg
                        className="w-5 text-[gold]"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M2.80577 5.20006L7.00505 7.99958L11.1913 2.13881C11.5123 1.6894 12.1369 1.58531 12.5863 1.90631C12.6761 1.97045 12.7546 2.04901 12.8188 2.13881L17.0051 7.99958L21.2043 5.20006C21.6639 4.89371 22.2847 5.01788 22.5911 5.47741C22.7228 5.67503 22.7799 5.91308 22.7522 6.14895L21.109 20.1164C21.0497 20.62 20.6229 20.9996 20.1158 20.9996H3.8943C3.38722 20.9996 2.9604 20.62 2.90115 20.1164L1.25792 6.14895C1.19339 5.60045 1.58573 5.10349 2.13423 5.03896C2.37011 5.01121 2.60816 5.06832 2.80577 5.20006ZM12.0051 14.9996C13.1096 14.9996 14.0051 14.1042 14.0051 12.9996C14.0051 11.895 13.1096 10.9996 12.0051 10.9996C10.9005 10.9996 10.0051 11.895 10.0051 12.9996C10.0051 14.1042 10.9005 14.9996 12.0051 14.9996Z"></path>
                      </svg>
                      <h2 className="font-bold">Admin Dashboard</h2>
                    </span>
                  </div>

                  <div className="lg:flex md:block gap-5 items-center hidden">
                    <span className="flex gap-2">
                      <Link href={"/Signup"}>
                        <button className="border-2 cursor-pointer border-[#1C4532] p-1 px-8 rounded-4xl font-bold text-[#1C4532]">
                          Sign up
                        </button>
                      </Link>
                      <Link href={"/Login"}>
                        <button className="text-[#718096] p-1 cursor-pointer">
                          Sign in
                        </button>
                      </Link>
                    </span>
                  </div>
                </nav>

                <div className="p-1">
                  <div className="lg:flex gap-3 lg:m-auto lg:gap-7 lg:items-center lg:justify-center">
                    <div className="grid grid-cols-2 xl:w-[35vw] lg:w-[40vw] gap-3">
                      <div className="bg-[#1C4532] xl:w-[15vw] lg:w-[20vw] p-5 flex flex-col gap-3 text-[white] rounded-2xl shadow-sm">
                        <TbCurrencyNaira className="text-[40px] bg-[white] p-2 rounded-4xl text-[black]" />
                        <span className="flex justify-between items-center">
                          <p className="text-[white] font-bold text-2xl">
                            {typeof totalEarning === "number"
                              ? `₦${totalEarning.toLocaleString("en-NG", { maximumFractionDigits: 0 })}`
                              : "..."}
                          </p>
                        </span>
                        <p>Total earning</p>
                      </div>
                      <div className="bg-[#27272a] lg:w-[20vw] xl:w-[15vw] p-5 flex flex-col gap-3 text-[white] rounded-2xl shadow-sm">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-10 bg-[white] p-2 rounded-4xl text-[black]"
                        >
                          <path d="M5 3V19H21V21H3V3H5ZM19.9393 5.93934L22.0607 8.06066L16 14.1213L13 11.121L9.06066 15.0607L6.93934 12.9393L13 6.87868L16 9.879L19.9393 5.93934Z"></path>
                        </svg>

                        <span className="flex justify-between items-center">
                          <p className="text-[white] font-bold text-2xl">
                            {totalTransactions}
                          </p>
                        </span>
                        <p>Total Transactions</p>
                      </div>

                      <div className="bg-[#27272a] xl:w-[15vw] lg:w-[20vw] p-5 flex flex-col gap-3 text-[white] rounded-2xl shadow-sm">
                        <AiFillProduct className="text-[40px] bg-[white] p-2 rounded-4xl text-[black]" />

                        <span className="flex justify-between items-center">
                          <p className="text-[white] font-bold text-2xl">
                            {totalProducts}
                          </p>
                        </span>
                        <p>Total products</p>
                      </div>

                      <div className="bg-[#1C4532] xl:w-[15vw] lg:w-[20vw] p-5 flex flex-col gap-3 text-[white] rounded-2xl shadow-sm">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-10 bg-[white] p-2 rounded-4xl text-[black]"
                        >
                          <path d="M2 22C2 17.5817 5.58172 14 10 14C14.4183 14 18 17.5817 18 22H2ZM10 13C6.685 13 4 10.315 4 7C4 3.685 6.685 1 10 1C13.315 1 16 3.685 16 7C16 10.315 13.315 13 10 13ZM17.3628 15.2332C20.4482 16.0217 22.7679 18.7235 22.9836 22H20C20 19.3902 19.0002 17.0139 17.3628 15.2332ZM15.3401 12.9569C16.9728 11.4922 18 9.36607 18 7C18 5.58266 17.6314 4.25141 16.9849 3.09687C19.2753 3.55397 21 5.57465 21 8C21 10.7625 18.7625 13 16 13C15.7763 13 15.556 12.9853 15.3401 12.9569Z"></path>
                        </svg>
                        <span className="flex justify-between items-center">
                          <p className="text-[white] font-bold text-2xl">
                            {totalUsers === 0 ? "..." : totalUsers}
                          </p>
                        </span>
                        <p>Total users</p>
                      </div>
                    </div>
                    <div className="w-full xl:w-[37vw] lg:w-[50vw] lg:mt-0 mt-5 shadow-sm rounded-2xl bg-white p-5 flex flex-col gap-5">
                      <h1 className="font-bold text-[#1c1b1bf0] text-xl sm:text-lg">
                        Reviews
                      </h1>

                      <div className="flex flex-col gap-3">
                        <div className="flex flex-col gap-1">
                          <span className="flex justify-between text-sm sm:text-base">
                            <h2>Earning Percentage</h2>
                            <p className="text-[#718096] font-bold">
                              {percentages.earning}%
                            </p>
                          </span>
                          <span className="bg-[whitesmoke] w-full sm:w-[80%] md:w-full xl:w-[33vw] h-[1vh] rounded-4xl">
                            <p
                              className="bg-[#1C4532] h-[1.3vh] rounded-4xl"
                              style={{ width: `${percentages.earning}%` }}
                            ></p>
                          </span>
                        </div>

                        <div className="flex flex-col gap-1">
                          <span className="flex justify-between text-sm sm:text-base">
                            <h2>Users Percentage</h2>
                            <p className="text-[#718096] font-bold">
                              {percentages.users}%
                            </p>
                          </span>
                          <span className="bg-[whitesmoke] w-full sm:w-[80%] md:w-full xl:w-[33vw] h-[1vh] rounded-4xl">
                            <p
                              className="bg-[#1C4532] h-[1.3vh] rounded-4xl"
                              style={{ width: `${percentages.users}%` }}
                            ></p>
                          </span>
                        </div>

                        <div className="flex flex-col gap-1">
                          <span className="flex justify-between text-sm sm:text-base">
                            <h2>Products Percentage</h2>
                            <p className="text-[#718096] font-bold">
                              {percentages.products}%
                            </p>
                          </span>
                          <span className="bg-[whitesmoke] w-full sm:w-[80%] md:w-full xl:w-[33vw] h-[1vh] rounded-4xl">
                            <p
                              className="bg-[#1C4532] h-[1.3vh] rounded-4xl"
                              style={{ width: `${percentages.products}%` }}
                            ></p>
                          </span>
                        </div>
                      </div>

                      <div>
                        <p className="text-[#718096] text-sm sm:text-base leading-relaxed">
                          More than <strong>1,500,000</strong> developers used
                          Creative Tim's products and over{" "}
                          <strong>700,000</strong> projects were created.
                        </p>
                      </div>
                    </div>
                  </div>

                  <section className="py-10">
                    <div className="bg-white shadow-sm rounded-2xl p-6">
                      <h3 className="text-lg font-semibold text-gray-800">
                        Sales overview
                      </h3>
                      <p className="text-sm text-gray-500 mb-4">
                        <span className="text-indigo-600 font-semibold">
                          In this year
                        </span>{" "}
                        {year}
                      </p>

                      <div className="h-80 w-full outline-0">
                        <ResponsiveContainer>
                          <LineChart
                            data={chartData}
                            margin={{
                              top: 20,
                              right: 20,
                              left: 0,
                              bottom: 0,
                              outline: "none",
                            }}
                          >
                            <CartesianGrid
                              strokeDasharray="3 3"
                              vertical={false}
                              stroke="#f3f4f6"
                            />

                            <XAxis
                              dataKey="month"
                              axisLine={false}
                              tickLine={false}
                              tick={{ fill: "#9ca3af" }}
                            />
                            <YAxis
                              axisLine={false}
                              tickLine={false}
                              tick={{ fill: "#9ca3af" }}
                            />
                            <Tooltip />

                            <Line
                              type="monotone"
                              dataKey="earning"
                              stroke="#1C4532"
                              strokeWidth={3}
                              dot={{ r: 4 }}
                              activeDot={{ r: 6 }}
                            />
                            <Line
                              type="monotone"
                              dataKey="users"
                              stroke="#ec4899"
                              strokeWidth={2}
                              dot={false}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Toaster />
      </section>
    </>
  );
}
