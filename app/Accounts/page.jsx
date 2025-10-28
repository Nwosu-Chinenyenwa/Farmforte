"use client";
import React, { useEffect, useState, useMemo } from "react";
import AdminNav from "../Components/AdminNav";
import Aside from "../Components/Aside";
import { GoFilter } from "react-icons/go";
import { IoSearchOutline } from "react-icons/io5";
import Image from "next/image";
import { FaCheck } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";
import toast, { Toaster } from "react-hot-toast";

export default function Page() {
  const [accounts, setAccounts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch("/api/users/get");
        const json = await res.json();
        if (json.success) setAccounts(json.users);
        else throw new Error(json.error);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    }
    fetchUsers();
  }, []);

  const filteredAccounts = useMemo(() => {
    return accounts.filter(
      (a) =>
        a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.company.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [accounts, searchTerm]);

  const totalPages = Math.ceil(filteredAccounts.length / itemsPerPage);
  const displayedAccounts = filteredAccounts.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const toggleSelectAll = (checked) => {
    setSelectedIds(checked ? displayedAccounts.map((a) => a.id) : []);
  };

  const toggleSelectOne = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const deleteSelected = async () => {
    if (selectedIds.length === 0) {
      toast.error("No users selected");
      return;
    }
    if (!confirm("Are you sure you want to delete selected users?")) return;

    try {
      const res = await fetch("/api/users/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedIds }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Deleted successfully!");
        setAccounts((prev) => prev.filter((a) => !selectedIds.includes(a.id)));
        setSelectedIds([]);
      } else throw new Error(json.error);
    } catch (err) {
      toast.error("Failed to delete users: " + err.message);
    }
  };

  return (
    <section className="bg-[#e6e8ec] h-[100vh] overflow-y-scroll no-scrollbar">
      <div className="flex">
        <Aside />
        <div>
          <AdminNav />

          <div className="w-[70vw] m-auto">
            <div className="py-10">
              <div className="flex justify-between">
                <h3 className="text-[#1C252E] text-[24px] font-[700]">Users</h3>
                <div className="flex gap-[8px] items-center text-[#1c252e] font-[500]">
                  <h3>Dashboard</h3>
                  <span>/</span>
                  <h3 className="text-[#209e2f98]">Accounts</h3>
                </div>
              </div>

              <div className="mt-10 p-5 rounded-2xl bg-[#ffffff]">
                <div className="flex justify-between items-center">
                  <div className="flex bg-[#f5f7fa] items-center gap-2 p-3 rounded-[5px] hover:border-1 hover:border-[#82b440]">
                    <IoSearchOutline className="text-[#a2a6b0] w-[30px] text-[20px]" />
                    <input
                      type="text"
                      placeholder="Search for something"
                      className="text-[8ba3cb] w-[100%] placeholder:text-[#00000058] outline-0"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-4 items-center">
                    <GoFilter className="text-[#637381] w-[20px] text-[20px]" />
                    <MdDelete
                      className="h-[22px] w-[22px] cursor-pointer text-[#637381] hover:text-[#FF5630]"
                      onClick={deleteSelected}
                    />
                  </div>
                </div>

                <div className="w-full max-w-[1280px] mt-10 relative">
                  <div
                    className="grid items-center bg-[#F4F6F8] rounded-[5px] py-4 px-5 text-[#637381] font-medium"
                    style={{
                      gridTemplateColumns: "40px 2fr 2fr 1.5fr 1fr 1fr 40px",
                    }}
                  >
                    <input
                      type="checkbox"
                      className="w-4 h-4"
                      checked={
                        displayedAccounts.length > 0 &&
                        selectedIds.length === displayedAccounts.length
                      }
                      onChange={(e) => toggleSelectAll(e.target.checked)}
                    />
                    <div>Name</div>
                    <div>Company</div>
                    <div>Role</div>
                    <div>Verified</div>
                    <div>Status</div>
                    <div></div>
                  </div>

                  <div>
                    {displayedAccounts.map((account) => (
                      <div
                        key={account.id}
                        className="grid items-center font-[400] text-left text-[#1C252E] text-[14px] py-4 px-5"
                        style={{
                          gridTemplateColumns:
                            "40px 2fr 2fr 1.5fr 1fr 1fr 40px",
                        }}
                      >
                        <input
                          type="checkbox"
                          className="w-4 h-4"
                          checked={selectedIds.includes(account.id)}
                          onChange={() => toggleSelectOne(account.id)}
                        />

                        <div className="flex gap-2 items-center overflow-hidden">
                          {account.image_url &&
                          account.image_url !== "/default-avatar.png" ? (
                            <Image
                              className="w-[30px] h-[30px] rounded-full flex-shrink-0"
                              src={account.image_url}
                              alt={account.name}
                              width={30}
                              height={30}
                            />
                          ) : (
                            <div className="w-[30px] h-[30px] rounded-full flex-shrink-0 bg-[#22C55E] text-white flex items-center justify-center font-bold text-[12px] uppercase">
                              {account.name
                                .split(" ")
                                .slice(0, 2)
                                .map((n) => n[0])
                                .join("")}
                            </div>
                          )}
                          <h3 className="truncate">{account.name}</h3>
                        </div>

                        <h3 className="truncate">N/A</h3>
                        <h3 className="truncate">{account.role}</h3>

                        <div className="flex justify-center">
                          {account.verified ? (
                            <FaCheck className="bg-[#22C55E] h-[22px] w-[22px] rounded-full text-white p-1" />
                          ) : (
                            "-"
                          )}
                        </div>

                        <h3 className="text-[#118D57] bg-[#22c55e29] font-[700] text-[12px] rounded-[6px] h-[24px] min-w-[24px] flex items-center justify-center text-center p-2">
                          {account.status}
                        </h3>

                        <div className="flex justify-center">
                          <MdDelete
                            className="h-[20px] w-[20px] cursor-pointer text-[#637381] hover:text-[#FF5630]"
                            onClick={() => deleteSelected([account.id])}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-end justify-end py-2 text-[#374151]">
                    <div className="flex items-center gap-4">
                      <div className="text-sm">
                        {page}–{totalPages} of {filteredAccounts.length}
                      </div>
                      <button
                        className="p-2 cursor-pointer rounded-full disabled:opacity-40"
                        disabled={page === 1}
                        onClick={() => setPage(page - 1)}
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
                        className="p-2 cursor-pointer rounded-full"
                        disabled={page === totalPages}
                        onClick={() => setPage(page + 1)}
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
      <Toaster />
    </section>
  );
}
