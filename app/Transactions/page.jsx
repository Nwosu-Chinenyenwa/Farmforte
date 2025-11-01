"use client";

import React, { useEffect, useState, useRef, useMemo } from "react";
import AdminNav from "../Components/AdminNav";
import Aside from "../Components/Aside";
import { IoIosArrowForward } from "react-icons/io";
import { IoSearchOutline, IoNotificationsSharp } from "react-icons/io5";
import veg2 from "../../public/img/veg2.png";
import Image from "next/image";
import { MdDelete } from "react-icons/md";
import { FaCheck } from "react-icons/fa6";
import toast from "react-hot-toast";
import { createClient } from "@supabase/supabase-js";
import { CiMenuKebab } from "react-icons/ci";
import Link from "next/link";
import user from "../../public/asset/avatar-CDT9_MFd.jpg";
import {
  IoSettingsOutline,
} from "react-icons/io5";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function page() {
  const [transactions, setTransactions] = useState([]);
  const [loadingTx, setLoadingTx] = useState(false);
  const [pageNum, setPageNum] = useState(1);
  const perPage = 10;
  const [totalCount, setTotalCount] = useState(null);

  const [query, setQuery] = useState("");
  const searchDebounce = useRef(null);

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [aside, setaside] = useState(false)
    const [showProfile, setshowProfile] = useState(false);
  

  const fallbackAccounts = [
    {
      id: "f1",
      name: "John Doe",
      product: "pawpaw",
      date: "May 19,2025",
      payment: "Credit Card",
      amount: "$13.43",
      img: veg2,
    },
    {
      id: "f2",
      name: "Jane Smith",
      product: "tomatoes",
      date: "May 19,2025",
      payment: "Paystack",
      amount: "$22.00",
      img: veg2,
    },
  ];

  const loadTransactions = async (page = 1) => {
    setLoadingTx(true);
    try {
      const from = (page - 1) * perPage;
      const to = from + perPage - 1;
      const { data, error, count } = await supabase
        .from("orders")
        .select(
          `
            id,
            user_id,
            amount,
            item_count,
            payment_method,
            payment_channel,
            payment_reference,
            created_at,
            metadata
          `,
          { count: "exact" }
        )
        .order("created_at", { ascending: false })
        .range(from, to);

      if (error) {
        console.error("Supabase select error:", error);
        toast.error("Could not load transactions (Supabase). Using fallback.");
        setTransactions(fallbackAccounts);
        setTotalCount(null);
      } else {
        const mapped = (data || []).map((r) => {
          const md = r.metadata || {};
          const displayName = md.first_name
            ? `${md.first_name} ${md.last_name ?? ""}`.trim()
            : (md.email ?? r.user_id ?? "Customer");
          let product =
            md.items && Array.isArray(md.items) && md.items.length > 0
              ? (md.items[0].name ?? md.items[0].product_name ?? "Product")
              : md.items && typeof md.items === "string"
                ? md.items
                : "Products";

          const amountNum = Number(r.amount ?? 0);
          const amountStr = isNaN(amountNum)
            ? String(r.amount)
            : `$${amountNum.toFixed(2)}`;

          return {
            id: r.id,
            name: displayName,
            product,
            date: new Date(r.created_at).toLocaleString(),
            payment: r.payment_method ?? r.payment_channel ?? "—",
            amount: amountStr,
            raw: r,
            img: veg2,
            metadata: md,
          };
        });

        setTransactions(mapped);
        setTotalCount(count ?? mapped.length);
      }
    } catch (err) {
      console.error("Error loading transactions:", err);
      toast.error("Unexpected error loading transactions. See console.");
      setTransactions(fallbackAccounts);
      setTotalCount(null);
    } finally {
      setLoadingTx(false);
    }
  };

  const loadNotifications = async () => {
    setLoadingNotifications(true);
    try {
      const { data, error } = await supabase
        .from("notifications")
        .select("id, title, body, is_read, created_at")
        .order("created_at", { ascending: false })
        .limit(20);

      if (error) {
        console.warn(
          "No notifications table or permission issue:",
          error.message
        );
        const mocks = [
          {
            id: "m1",
            title: "Welcome",
            body: "Your dashboard is ready",
            is_read: false,
            created_at: new Date().toISOString(),
          },
          {
            id: "m2",
            title: "Order paid",
            body: "Order #1234 was paid",
            is_read: false,
            created_at: new Date().toISOString(),
          },
        ];
        setNotifications(mocks);
        setUnreadCount(mocks.filter((n) => !n.is_read).length);
      } else {
        setNotifications(data || []);
        setUnreadCount((data || []).filter((n) => !n.is_read).length);
      }
    } catch (err) {
      console.error("Error loading notifications:", err);
      toast.error("Failed to load notifications");
    } finally {
      setLoadingNotifications(false);
    }
  };

  const markNotificationRead = async (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
    setUnreadCount((c) => Math.max(0, c - 1));

    try {
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("id", id);
      if (error) {
        console.warn(
          "Could not update notification read status:",
          error.message
        );
      }
    } catch (err) {
      console.error("Error updating notification:", err);
    }
  };

  const markAllRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    setUnreadCount(0);
    try {
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .neq("is_read", true);
      if (error) console.warn("Error marking all read:", error.message);
    } catch (err) {
      console.error("Error marking all notifications read:", err);
    }
  };

  const deleteTransaction = async (id) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
    toast.success("Deleted transaction locally.");

    try {
      const { error } = await supabase.from("orders").delete().eq("id", id);
      if (error) {
        console.warn("Could not delete from Supabase:", error.message);
      } else {
        toast.success("Deleted from Supabase.");
      }
    } catch (err) {
      console.error("Error deleting transaction:", err);
    }
  };

  const handlePrev = () => {
    if (pageNum <= 1) return;
    const next = pageNum - 1;
    setPageNum(next);
    loadTransactions(next);
  };
  const handleNext = () => {
    if (totalCount != null) {
      const maxPage = Math.max(1, Math.ceil(totalCount / perPage));
      if (pageNum >= maxPage) return;
    }
    const next = pageNum + 1;
    setPageNum(next);
    loadTransactions(next);
  };

  useEffect(() => {
    loadTransactions(pageNum);
    loadNotifications();

    let orderSub = null;
    let notifSub = null;

    try {
      orderSub = supabase
        .channel("public:orders")
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "orders" },
          (payload) => {
            const r = payload?.new;
            if (!r) return;
            const md = r.metadata || {};
            const displayName = md.first_name
              ? `${md.first_name} ${md.last_name ?? ""}`.trim()
              : (md.email ?? r.user_id ?? "Customer");
            const product =
              md.items && md.items[0]
                ? (md.items[0].name ?? md.items[0].product_name ?? "Product")
                : "Products";
            const amountNum = Number(r.amount ?? 0);
            const amountStr = isNaN(amountNum)
              ? String(r.amount)
              : `$${amountNum.toFixed(2)}`;
            const mapped = {
              id: r.id,
              name: displayName,
              product,
              date: new Date(r.created_at).toLocaleString(),
              payment: r.payment_method ?? r.payment_channel ?? "—",
              amount: amountStr,
              raw: r,
              img: veg2,
              metadata: md,
            };
            setTransactions((prev) => [mapped, ...prev].slice(0, perPage));
            setTotalCount((c) => (typeof c === "number" ? c + 1 : c));
            toast.success("New order received");
          }
        )
        .subscribe();
    } catch (err) {
      console.warn("Realtime orders subscription failed (may be fine):", err);
    }

    try {
      notifSub = supabase
        .channel("public:notifications")
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "notifications" },
          (payload) => {
            const r = payload?.new;
            if (!r) return;
            setNotifications((prev) => [r, ...(prev || [])].slice(0, 20));
            setUnreadCount((c) => c + 1);
            toast.success("New notification");
          }
        )
        .subscribe();
    } catch (err) {
      console.warn(
        "Realtime notifications subscription failed (may be fine):",
        err
      );
    }

    return () => {
      try {
        orderSub && supabase.removeChannel(orderSub);
        notifSub && supabase.removeChannel(notifSub);
      } catch (e) {}
    };
  }, []);

  const [visibleTransactions, setVisibleTransactions] = useState([]);
  useEffect(() => {
    if (searchDebounce.current) clearTimeout(searchDebounce.current);
    searchDebounce.current = setTimeout(() => {
      const q = (query || "").trim().toLowerCase();
      if (!q) {
        setVisibleTransactions(transactions);
      } else {
        const filtered = transactions.filter((t) => {
          const fields = [
            t.name,
            t.product,
            t.payment,
            t.amount,
            (t.metadata && t.metadata.email) || "",
            (t.metadata &&
              (Array.isArray(t.metadata.items)
                ? t.metadata.items
                    .map((it) => it.name || it.product_name)
                    .join(" ")
                : t.metadata.items)) ||
              "",
          ]
            .join(" ")
            .toLowerCase();
          return fields.includes(q);
        });
        setVisibleTransactions(filtered);
      }
    }, 220);
    return () => {
      if (searchDebounce.current) clearTimeout(searchDebounce.current);
    };
  }, [query, transactions]);

  useEffect(() => {
    if (!query) setVisibleTransactions(transactions);
  }, [transactions, query]);

  const toggleNotifications = () => {
    const next = !showNotifications;
    setShowNotifications(next);
    if (next) loadNotifications();
  };

  const handleNotificationClick = async (n) => {
    if (!n.is_read) await markNotificationRead(n.id);
    toast.success(n.title + (n.body ? ` — ${n.body}` : ""));
  };

  const pageText = useMemo(() => {
    const from = (pageNum - 1) * perPage + 1;
    let to = (pageNum - 1) * perPage + (visibleTransactions.length || 0);
    if (visibleTransactions.length === 0) return "0 items";
    if (totalCount != null) {
      to = Math.min(totalCount, pageNum * perPage);
      return `${from}–${to} of ${totalCount}`;
    }
    return `${from}–${to}`;
  }, [pageNum, perPage, visibleTransactions, totalCount]);

  
    const handleLogout = async () => {
      try {
        const { error } = await supabase.auth.signOut();
  
        if (error) {
          console.error("Error logging out:", error.message);
          alert("Logout failed. Please try again.");
        } else {
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      }
    };

  return (
    <section className="bg-[#e6e8ec] h-[100vh]">
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
               <div className="xl:w-[80vw] w-[100vw]">
              <header className="">
                <nav className="bg-[#ffffff] flex justify-between py-5 px-5 lg:px-7 items-center">
                  <span className="hidden lg:flex items-center gap-3 xl:hidden ">
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
                  <div className="relative z-10">
                    <div className="absolute top-2 right-10 w-[280px] bg-white rounded-[12px] shadow-md py-4 px-7">
                      <h3 className="text-[#343c6a] text-[14px] font-[700] mb-3">
                        User Profile
                      </h3>

                      <div className="flex items-center gap-5 border-b border-[#e5e7eb] pb-4">
                        <Image
                          src={user}
                          alt="Profile"
                          width={48}
                          height={48}
                          className="rounded-full w-[50px] h-[50px] "
                        />
                        <div className="flex flex-col gap-1">
                          <h6 className="text-[#343c6a] text-[14px] font-[600]">
                            Charlene Reed
                          </h6>
                          <p className="text-[#8ba3cb] text-[12px] font-[500]">
                            Designer
                          </p>
                          <div className="flex items-center gap-1 text-[#8ba3cb] text-[12px]">
                            <Mail size={12} />
                            <span>info@dashbank.com</span>
                          </div>
                        </div>
                      </div>

                      <Link href={"/AdminProfile"}>
                        <div className="flex items-center gap-2 my-4 cursor-pointer">
                          <div className="bg-[#e7edff] p-2 rounded-[8px]">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="w-[20px] h-[20px] text-[#718ebf]"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5.121 17.804A4 4 0 016 17h12a4 4 0 01.879.804M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                          </div>
                          <div>
                            <h6 className="text-[#343c6a] text-[13px] font-[600]">
                              My Profile
                            </h6>
                            <p className="text-[#8ba3cb] text-[12px] font-[500]">
                              Account Settings
                            </p>
                          </div>
                        </div>
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="w-full border-1 border-[#ff5e5e] text-[#ff5e5e] font-[600] py-2 rounded-full hover:bg-[#ff5e5e17] cursor-pointer  transition"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </header>
            </div>

          <div className="xl:w-[70vw] m-auto">
            <div className="py-10">
              <div className="flex justify-between">
                <h3 className="text-[#1C252E] text-[24px] font-[700]">
                  Transactions
                </h3>
                <div className="flex gap-[8px] items-center text-[#1c252e] font-[500]">
                  <h3>Dashboard</h3>
                  <span>/</span>
                  <h3 className="text-[#209e2f98]">Transactions</h3>
                </div>
              </div>

              <div>
                <div className="py-5">
                  <div className="flex justify-between">
                    <div className="text-[gray] flex items-center text-[14px] gap-3">
                      <span className="flex items-center">
                        <IoIosArrowForward />
                        <IoIosArrowForward />
                      </span>
                      <h6>{new Date().toLocaleDateString()}</h6>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="relative inline-block">
                        <IoNotificationsSharp
                          onClick={toggleNotifications}
                          className="p-3 text-[45px] cursor-pointer rounded-full text-gray-500 hover:bg-gray-100 transition"
                        />

                        {unreadCount > 0 && (
                          <span className="absolute top-2 right-2 block w-[12px] h-[12px] bg-[#209e2f98] rounded-full border-[2px] border-white animate-pulse"></span>
                        )}

                        {showNotifications && (
                          <div className="absolute right-0 mt-16 w-[360px] bg-white rounded shadow-lg z-50 p-3">
                            <div className="flex items-center justify-between mb-2">
                              <strong>Notifications</strong>
                              <button
                                onClick={markAllRead}
                                className="text-sm text-[#209e2e] hover:underline"
                              >
                                Mark all read
                              </button>
                            </div>

                            <div className="max-h-72 overflow-auto">
                              {loadingNotifications ? (
                                <div className="text-sm text-gray-500">
                                  Loading…
                                </div>
                              ) : notifications.length === 0 ? (
                                <div className="text-sm text-gray-500">
                                  No notifications
                                </div>
                              ) : (
                                notifications.map((n) => (
                                  <div
                                    key={n.id}
                                    onClick={() => handleNotificationClick(n)}
                                    className={`p-2 rounded hover:bg-[#f5f7fa] cursor-pointer ${n.is_read ? "opacity-70" : "font-semibold"}`}
                                  >
                                    <div className="flex items-center justify-between">
                                      <div>
                                        <div className="text-sm">{n.title}</div>
                                        <div className="text-xs text-gray-500">
                                          {n.body}
                                        </div>
                                      </div>
                                      <div className="text-xs text-gray-400">
                                        {new Date(
                                          n.created_at
                                        ).toLocaleString()}
                                      </div>
                                    </div>
                                  </div>
                                ))
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex bg-[#f5f7fa] items-center gap-2 p-3 rounded-full">
                        <IoSearchOutline className="text-[#a2a6b0] w-[30px] text-[20px]" />
                        <input
                          type="text"
                          value={query}
                          onChange={(e) => setQuery(e.target.value)}
                          placeholder="Search for something"
                          className="text-[8ba3cb] w-[100%] placeholder:text-[#00000058] outline-0"
                        />
                      </div>
                    </div>
                  </div>

                  <h3 className="font-[500] text-2xl mt-3 text-[#1c252e]">
                    Recent Transaction
                  </h3>
                </div>
                <div>
                  <div>
                    <h3 className="text-[#ff5e5e] flex items-start flex-col font-[700] after:block after:w-[25px] after:h-[2px] after:bg-[red]">
                      All
                    </h3>
                  </div>

                  <div className="w-full max-w-[1280px] bg-[#ffffff] rounded-2xl p-5 mt-10 relative overflow-hidden">
                    <div
                      className="grid border-b border-[#00000019] py-3 px-6 text-[#637381] font-medium text-left items-center"
                      style={{
                        gridTemplateColumns:
                          "minmax(200px, 2fr) minmax(150px, 2fr) minmax(150px, 1.5fr) minmax(120px, 1.5fr) minmax(100px, 1fr)",
                      }}
                    >
                      <div className="truncate pr-4">Items</div>
                      <div className="truncate pr-4">Product</div>
                      <div className="truncate pr-4">Date</div>
                      <div className="truncate pr-4">Payment method</div>
                      <div className="truncate text-right">Amount</div>
                    </div>

                    <div>
                      {loadingTx ? (
                        <div className="p-6 text-gray-500">
                          Loading transactions…
                        </div>
                      ) : visibleTransactions.length === 0 ? (
                        <div className="p-6 text-gray-500">
                          No transactions found
                        </div>
                      ) : (
                        visibleTransactions.map((account, index) => (
                          <div
                            key={account.id ?? index}
                            className="grid items-center border-b border-[#0000001c] py-4 text-[#1C252E] text-[14px] px-6"
                            style={{
                              gridTemplateColumns:
                                "minmax(200px, 2fr) minmax(150px, 2fr) minmax(150px, 1.5fr) minmax(120px, 1.5fr) minmax(100px, 1fr)",
                            }}
                          >
                            <div className="flex items-center gap-3 overflow-hidden pr-4">
                              <Image
                                className="w-[30px] h-[30px] rounded-full flex-shrink-0"
                                src={account.img}
                                alt={account.name}
                                width={30}
                                height={30}
                              />
                              <h3 className="font-bold truncate">
                                {account.name}
                              </h3>
                            </div>

                            <div className="text-[gray] font-[400] truncate pr-4">
                              {account.product}/M
                            </div>

                            <div className="text-[gray] font-[400] truncate pr-4">
                              {account.date}
                            </div>

                            <div className="text-[gray] font-[400] truncate pr-4">
                              {account.payment}
                            </div>

                            <div className="flex items-center justify-end gap-2">
                              <h3 className="font-bold text-[14px] truncate">
                                {account.amount}
                              </h3>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    <div className="flex items-center justify-between py-3 px-6 text-[#374151] border-t border-[#00000019]">
                      <div className="text-sm text-gray-500">
                        {visibleTransactions.length > 0
                          ? `Showing ${visibleTransactions.length} transaction(s)`
                          : "No transactions"}
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-sm">{pageText}</div>
                        <button
                          onClick={handlePrev}
                          className="p-2 cursor-pointer rounded-full hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                          disabled={pageNum <= 1}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24">
                            <path
                              d="M15 18l-6-6 6-6"
                              stroke="#111827"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              fill="none"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={handleNext}
                          className="p-2 cursor-pointer rounded-full hover:bg-gray-100 transition-colors"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24">
                            <path
                              d="M9 6l6 6-6 6"
                              stroke="#111827"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              fill="none"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
