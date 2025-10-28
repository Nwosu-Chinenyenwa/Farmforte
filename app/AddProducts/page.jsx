"use client";

import React, { useState, useRef, useEffect } from "react";
import AdminNav from "../Components/AdminNav";
import Aside from "../Components/Aside";
import eggplant from "../../public/img/eggplant.png";
import Image from "next/image";
import { MdDriveFileRenameOutline, MdDiscount } from "react-icons/md";
import { IoIosPricetag } from "react-icons/io";
import { DiScriptcs } from "react-icons/di";
import { FaWeightScale } from "react-icons/fa6";
import { BiCategoryAlt } from "react-icons/bi";
import toast, { Toaster } from "react-hot-toast";


import { createClient } from "@/utils/supabase/client";
const supabase = createClient();

const FALLBACK_CATEGORIES = [
  "Grains",
  "Vegetables",
  "Herbs",
  "Legumes",
  "Cashcrops",
  "Livestock",
];

export default function page() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  function handleFile(file) {
    if (!file) return;
    setFile(file);
    const url = URL.createObjectURL(file);
    setPreview(url);
  }

  function onChange(e) {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
  }

  function onDrop(e) {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) handleFile(f);
  }

  function onDragOver(e) {
    e.preventDefault();
  }

  function clear() {
    setFile(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = null;
  }

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [weight, setWeight] = useState("");
  const [category, setCategory] = useState(""); // string
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState(0);
  const [loading, setLoading] = useState(false);

  const [categories, setCategories] = useState(FALLBACK_CATEGORIES);
  const [newCategoryText, setNewCategoryText] = useState("");
  const [loadingCategories, setLoadingCategories] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    setLoadingCategories(true);
    try {
      const { data: catData, error: catErr } = await supabase
        .from("category")
        .select("name")
        .order("name", { ascending: true });

      if (!catErr && Array.isArray(catData) && catData.length > 0) {
        const list = catData.map((r) => String(r.name).trim()).filter(Boolean);
        setCategories(list);
        if (!category && list.length) setCategory(list[0]);
        setLoadingCategories(false);
        return;
      }

      const { data: prodData, error: prodErr } = await supabase
        .from("products")
        .select("category");

      if (!prodErr && Array.isArray(prodData)) {
        const set = new Set();
        prodData.forEach((r) => {
          const c = (r?.category || "").toString().trim();
          if (c) set.add(c);
        });
        const list = Array.from(set);
        if (list.length) {
          setCategories(list);
          if (!category) setCategory(list[0]);
        } else {
          setCategories(FALLBACK_CATEGORIES);
          if (!category) setCategory(FALLBACK_CATEGORIES[0]);
        }
      } else {
        setCategories(FALLBACK_CATEGORIES);
        if (!category) setCategory(FALLBACK_CATEGORIES[0]);
      }
    } catch (err) {
      console.error("loadCategories error", err);
      setCategories(FALLBACK_CATEGORIES);
      if (!category) setCategory(FALLBACK_CATEGORIES[0]);
    } finally {
      setLoadingCategories(false);
    }
  }

  async function addNewCategory(e) {
    e?.preventDefault();
    const newCat = (newCategoryText || "").trim();
    if (!newCat) return;

    if (!categories.includes(newCat)) {
      setCategories((s) => [newCat, ...s]);
    }
    setNewCategoryText("");
    setCategory(newCat);

    try {
      const { error } = await supabase
        .from("category")
        .insert([{ name: newCat }]);
      if (error) {
        console.warn(
          "Could not insert new category into categories table:",
          error.message || error
        );
      } else {
        loadCategories();
      }
    } catch (err) {
      console.warn("addNewCategory catch:", err);
    }
  }

  function slugify(s) {
    return String(s)
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-_]/g, "")
      .slice(0, 150);
  }

  async function uploadToStorage(fileToUpload) {
    if (!fileToUpload) return { path: null, publicURL: null };
    const ext = fileToUpload.name.split(".").pop();
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}.${ext}`;

    const bucket = "product-images";
    const path = `${bucket}/${filename}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(path, fileToUpload, { cacheControl: "3600", upsert: false });

    if (uploadError) {
      throw uploadError;
    }

    const { data: publicData } = await supabase.storage
      .from(bucket)
      .getPublicUrl(path);
    const publicURL =
      (publicData && (publicData.publicUrl || publicData.public_url)) || null;
    return { path, publicURL };
  }

  async function handleSave(e) {
    e.preventDefault();

    if (loading) return;

    setLoading(true);

    try {
      if (!name) {
        toast.error("Product name is required");
        setLoading(false);
        return;
      }
      if (!price || Number(price) <= 0) {
        toast.error("Valid price is required");
        setLoading(false);
        return;
      }

      let image_path = null;
      let image_url = null;
      if (file) {
        const uploaded = await uploadToStorage(file);
        image_path = uploaded.path;
        image_url = uploaded.publicURL;
      }

      const product_id = `${slugify(name)}-${Date.now().toString().slice(-6)}`;

      const payload = {
        product_id,
        name,
        slug: slugify(name),
        description,
        category: category || null,
        price: Number(price),
        discount_price: discountPrice ? Number(discountPrice) : null,
        weight: weight ? Number(weight) : null,
        image_path,
        image_url,
        stock: Number(stock) || 0,
        visibility: true,
      };

      const res = await fetch("/api/products/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json?.error || `Create product failed (${res.status})`);
      }

      toast.success("Product created successfully!");
      setName("");
      setPrice("");
      setDiscountPrice("");
      setWeight("");
      setCategory(categories[0] || "");
      setDescription("");
      setStock(0);
      clear();
    } catch (err) {
      console.error("Add product error:", err);
      toast.error("Failed to create product: " + (err.message || err));
    } finally {
      setLoading(false);
    }
  }

  function handleCancel(e) {
    e.preventDefault();
    setName("");
    setPrice("");
    setDiscountPrice("");
    setWeight("");
    setCategory(categories[0] || "");
    setDescription("");
    setStock(0);
    clear();
  }

  return (
    <section className="bg-[#e6e8ec] ">
      <div className="flex">
        <Aside />

        <div>
          <AdminNav />

          <div className="w-[70vw] m-auto">
            <div className="py-10">
              <div className="flex justify-between">
                <h3 className="text-[#1C252E] text-[24px] font-[700]">
                  Add Products
                </h3>
                <div className="flex gap-[8px] items-center text-[#1c252e] font-[500]">
                  <h3>Dashboard</h3>
                  <span>/</span>
                  <h3 className="text-[#209e2f98]">Add Products</h3>
                </div>
              </div>

              <div className="my-10">
                <div className="flex gap-5">
                  <div className="bg-[#ffff] h-fit shadow-md rounded-2xl p-5">
                    <div>
                      <div className=" rounded-sm py-10  border-1 border-dashed  w-[90vw] md:w-[45vw] xl:w-[20vw] border-[#209e2e]  hover:bg-white transition">
                        <div className=" flex flex-col gap-3  items-center">
                          {preview ? (
                            <img
                              src={preview}
                              alt="preview"
                              className="w-[40vw] md:w-[20vw] lg:w-[12vw] mb-4 h-auto"
                            />
                          ) : (
                            <Image
                              className="w-[40vw] md:w-[20vw] lg:w-[12vw] mb-4 h-auto"
                              src={eggplant}
                              alt="shape1"
                            />
                          )}

                          <h3 className="text-[#616161] group-hover:text-[#209e2e] text-center  font-extrabold text-[20px] transition">
                            {name || "Bunch Fresh Fish"}
                          </h3>
                          <div className="flex gap-2 text-center">
                            <span className="text-[gray] text-[18px] line-through font-bold transition">
                              {discountPrice ? `$${discountPrice}` : ""}
                            </span>
                            <span className="text-[#209e2e] text-[18px] font-bold transition">
                              ${price || "0.00"}
                            </span>
                          </div>
                          <h1 className="text-[#616161] flex font-bold mb-3 text-[14px]">
                            Stock: {stock ?? 0}
                          </h1>
                          <div className="p-2">
                            <h1 className="text-[#616161] flex font-bold mb-3 text-[14px]">
                              Weight: {weight ? `${weight}kg` : "200kg"}
                            </h1>
                            <span>
                              <h1 className="text-[#616161] font-bold flex text-[14px]">
                                Product Description:
                              </h1>
                              <p className="text-[#6b7280] text-sm leading-relaxed max-w-2xl mx-auto">
                                {description ||
                                  "Lorem ipsum dolor sit amet, consectetur adipiscing elit."}
                              </p>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-5 w-full">
                    <div className="h-fit bg-white  w-full rounded-xl shadow-md overflow-hidden">
                      <div className="font-[500] text-[#111928] px-5 py-5  border-b-1 border-[#00000014]">
                        <h3>Add product phote</h3>
                      </div>

                      <div className="p-6 space-y-4">
                        <div
                          onDrop={onDrop}
                          onDragOver={onDragOver}
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full cursor-pointer hover:border-2 hover:border-[#209e2e] transition rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 p-8 flex flex-col items-center justify-center text-center"
                        >
                          <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center mb-4">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="w-8 h-8 text-slate-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 9l5-5 5 5M12 4v12"
                              />
                            </svg>
                          </div>

                          <div className="flex items-center gap-1">
                            <div className="text-sm text-slate-500">
                              Drag your image here,
                            </div>

                            <label
                              htmlFor="file-input"
                              className="cursor-pointer text-sm text-[#209e2e] font-medium"
                            >
                              Or Click to Browser
                            </label>
                          </div>

                          <div className="text-xs text-slate-400 mt-4">
                            SVG, PNG, JPG or GIF (max, 800 X 800px)
                          </div>

                          <input
                            id="file-input"
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={onChange}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Product info + category select */}
                    <div className="bg-white shadow-md w-full pb-5 rounded-2xl">
                      <div className="font-[500] text-[#111928] px-5 py-5  border-b-1 border-[#00000014]">
                        <h3>Product Information</h3>
                      </div>
                      <form
                        className="flex flex-col justify-center gap-5 py-8"
                        onSubmit={handleSave}
                      >
                        <div className="flex items-center justify-center gap-5 w-[35vw] m-auto">
                          <div className="flex flex-col gap-2">
                            <label className="font-[600]">Product Name</label>
                            <span className="bg-[#ffffff] flex border-2 hover:border-2 hover:border-[#209e2e] rounded-[5px] pl-3 border-[#e6ebf1] py-2">
                              <MdDriveFileRenameOutline className="text-2xl text-[#afbaca]" />
                              <input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                type="text"
                                className="placeholder:text-[#afbaca] ml-2 placeholder:font-[500] outline-none"
                                placeholder="Rice Vegetable"
                              />
                            </span>
                          </div>
                          <div className="flex flex-col gap-2">
                            <label className="font-[600] ">
                              Original price
                            </label>
                            <span className="bg-[#ffffff] flex border-2 hover:border-2 hover:border-[#209e2e] rounded-[5px] pl-3 border-[#e6ebf1] py-2">
                              <IoIosPricetag className="text-2xl text-[#afbaca]" />
                              <input
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                type="number"
                                className="placeholder:text-[#afbaca]  ml-2 placeholder:font-[500] outline-none"
                                placeholder="$00.000"
                              />
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-center gap-5 w-[35vw] m-auto">
                          <div className="flex flex-col gap-2">
                            <label className="font-[600]">Discount price</label>
                            <span className="bg-[#ffffff] flex border-2 hover:border-2 hover:border-[#209e2e] rounded-[5px] pl-3 border-[#e6ebf1] py-2">
                              <MdDiscount className="text-2xl text-[#afbaca]" />
                              <input
                                value={discountPrice}
                                onChange={(e) =>
                                  setDiscountPrice(e.target.value)
                                }
                                type="number"
                                className="placeholder:text-[#afbaca] ml-2 placeholder:font-[500] outline-none"
                                placeholder="$20.000"
                              />
                            </span>
                          </div>
                          <div className="flex flex-col gap-2 w-[35vw] m-auto">
                            <label className="font-[600] ">
                              Product Weight
                            </label>
                            <span className="bg-[#ffffff] flex border-2 hover:border-2 hover:border-[#209e2e] rounded-[5px] pl-3 border-[#e6ebf1] py-2">
                              <FaWeightScale className="text-2xl text-[#afbaca]" />
                              <input
                                value={weight}
                                onChange={(e) => setWeight(e.target.value)}
                                type="number"
                                className="placeholder:text-[#afbaca] ml-2 placeholder:font-[500] outline-none"
                                placeholder="Weight in kg"
                              />
                            </span>
                          </div>
                        </div>

                        {/* Category selector + inline create */}
                        <div className="flex flex-col gap-2 w-[35vw] m-auto">
                          <label className="font-[600] ">Categories</label>
                          <span className="bg-[#ffffff] flex items-center gap-2 border-2 hover:border-2 hover:border-[#209e2e] rounded-[5px] pl-3 border-[#e6ebf1] py-2">
                            <BiCategoryAlt className="text-2xl text-[#afbaca]" />

                            <select
                              value={category}
                              onChange={(e) => setCategory(e.target.value)}
                              className="w-full cursor-pointer placeholder:text-[#afbaca] ml-2 placeholder:font-[500] outline-none"
                            >
                              {/* show a placeholder */}
                              <option value="" disabled>
                                {loadingCategories
                                  ? "Loading categories..."
                                  : "Select a category"}
                              </option>
                              {categories.map((c) => (
                                <option key={c} value={c}>
                                  {c}
                                </option>
                              ))}
                            </select>
                          </span>

                          <div className="flex gap-2 mt-2">
                            <input
                              value={newCategoryText}
                              onChange={(e) =>
                                setNewCategoryText(e.target.value)
                              }
                              placeholder="Add new category (e.g. Fish)"
                              className="flex-1 outline-none border-2 hover:border-2 hover:border-[#209e2e] rounded-[5px] pl-3 border-[#e6ebf1] py-2"
                            />
                            <button
                              onClick={addNewCategory}
                              className="bg-[#209e2e] text-white rounded px-3 py-2"
                              type="button"
                            >
                              Add
                            </button>
                          </div>

                          <div className="flex flex-col gap-2 w-[35vw] m-auto">
                            <label className="font-[600]">Stock quantity</label>
                            <span className="bg-[#ffffff] flex border-2 hover:border-2 hover:border-[#209e2e] rounded-[5px] pl-3 border-[#e6ebf1] py-2">
                              <input
                                value={stock}
                                onChange={(e) => setStock(e.target.value)}
                                type="number"
                                min="0"
                                className="placeholder:text-[#afbaca] ml-2 placeholder:font-[500] outline-none w-full"
                                placeholder="Stock (e.g. 10)"
                              />
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2 w-[35vw] m-auto">
                          <label className="font-[600] ">
                            Product discription
                          </label>
                          <span className="bg-[#ffffff] flex border-2 hover:border-2 hover:border-[#209e2e] rounded-[5px] pl-3 border-[#e6ebf1] py-2">
                            <DiScriptcs className="text-2xl text-[#afbaca]" />
                            <textarea
                              value={description}
                              onChange={(e) => setDescription(e.target.value)}
                              type="text"
                              className="placeholder:text-[#afbaca] h-[150px] w-full ml-2 placeholder:font-[500] outline-none"
                              placeholder="Write your discription here.."
                            />
                          </span>
                        </div>

                        <div className="font-[500] text-[#1c252e] flex justify-end px-8 gap-5">
                          <button
                            type="button"
                            onClick={handleCancel}
                            className="border-1 border-[#e6ebf1] rounded-[8px] py-2 px-4 cursor-pointer px[#e6ebf1]"
                          >
                            Cancle
                          </button>
                          <button
                            type="submit"
                            disabled={loading}
                            className="bg-[#209e2e] text-white rounded-[8px] py-2 px-4 cursor-pointer px[#e6ebf1]"
                          >
                            {loading ? "Saving..." : "Save"}
                          </button>
                        </div>
                      </form>
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
