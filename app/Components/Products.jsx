"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client";
import toast, { Toaster } from "react-hot-toast";

import eggplant from "../../public/img/eggplant.png";
import milk from "../../public/img/milk.png";
import Link from "next/link";
const supabase = createClient();

const FALLBACK_THREE = ["Fresh Milk", "Fresh Vegetable", "Fresh Fish"];

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(FALLBACK_THREE);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [addingToCartId, setAddingToCartId] = useState(null);

  // auth & likes
  const [user, setUser] = useState(null);
  const [likedSet, setLikedSet] = useState(new Set()); // stores string ids
  const [likedMap, setLikedMap] = useState({}); // pidStr -> like row id

  useEffect(() => {
    // load products, categories, and user likes
    let mounted = true;
    async function loadAll() {
      setLoading(true);

      let catData = null;
      try {
        // fetch categories (non-null)
        const { data: categoryRows, error: catError } = await supabase
          .from("products")
          .select("category")
          .not("category", "is", null);

        if (!catError && categoryRows) {
          const uniqueCategories = [
            ...new Set(
              categoryRows.map((item) => (item.category || "").trim())
            ),
          ].filter(Boolean);

          if (uniqueCategories.length) {
            // use only first 3 categories
            catData = uniqueCategories.slice(0, 3);
            if (mounted) setCategories(catData);
            // ensure activeIndex in range
            setActiveIndex((i) => (i < catData.length ? i : 0));
          }
        } else {
          if (catError) console.warn("categories fetch error:", catError);
        }
      } catch (err) {
        console.warn("categories fetch threw (falling back):", err);
      }

      try {
        // fetch products
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Supabase fetch error:", error);
          if (mounted) {
            setProducts([]);
            if (!catData) setCategories(FALLBACK_THREE);
            setActiveIndex(0);
          }
        } else {
          const rows = data || [];
          if (mounted) {
            setProducts(rows);
            // if categories from earlier step were empty, derive first 3 from rows
            if (!catData) {
              const cats = Array.from(
                new Set(
                  rows.map((r) => (r.category || "").trim()).filter(Boolean)
                )
              ).slice(0, 3);
              if (cats.length) {
                setCategories(cats);
                setActiveIndex((i) => (i < cats.length ? i : 0));
              } else {
                setCategories(FALLBACK_THREE);
                setActiveIndex(0);
              }
            }
          }
        }
      } catch (err) {
        console.error("Load error:", err);
        if (mounted) {
          setProducts([]);
          if (!catData) setCategories(FALLBACK_THREE);
          setActiveIndex(0);
        }
      } finally {
        if (mounted) setLoading(false);
      }

      // user & likes
      try {
        const {
          data: { user: currentUser },
        } = await supabase.auth.getUser();
        if (!mounted) return;
        setUser(currentUser || null);

        if (currentUser) {
          const { data: likesData, error: likesError } = await supabase
            .from("product_likes")
            .select("product_id, id")
            .eq("user_id", currentUser.id);

          if (!likesError && likesData) {
            const s = new Set();
            const m = {};
            likesData.forEach((l) => {
              const pidStr = String(l.product_id);
              s.add(pidStr);
              m[pidStr] = l.id;
            });
            if (mounted) {
              setLikedSet(s);
              setLikedMap(m);
            }
          } else {
            if (likesError) console.warn("likes fetch error:", likesError);
            if (mounted) {
              setLikedSet(new Set());
              setLikedMap({});
            }
          }
        } else {
          if (mounted) {
            setLikedSet(new Set());
            setLikedMap({});
          }
        }
      } catch (err) {
        console.warn("Could not fetch user/likes:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadAll();
    return () => {
      mounted = false;
    };
  }, []);

  // filter active products by the current (first-three) categories
  const activeCategory = categories[activeIndex] || categories[0];
  const activeProducts = useMemo(
    () =>
      products.filter((p) =>
        (p.category || "")
          .toString()
          .toLowerCase()
          .includes((activeCategory || "").toString().toLowerCase())
      ),
    [products, activeCategory]
  );

  const handleNext = () => {
    if (activeIndex < categories.length - 1) setActiveIndex((prev) => prev + 1);
  };
  const handlePrev = () => {
    if (activeIndex > 0) setActiveIndex((prev) => prev - 1);
  };

  function parsePrice(price) {
    if (price == null) return 0;
    const n = parseFloat(String(price).replace(/[^0-9.]/g, ""));
    return Number.isFinite(n) ? n : 0;
  }

  async function addToCart(product) {
    try {
      setAddingToCartId(product.id);

      if (product?.stock !== undefined && Number(product.stock) <= 0) {
        toast.error("This product is out of stock.");
        setAddingToCartId(null);
        return;
      }

      const payload = {
        product_id: product.id,
        name: product.name,
        unit_price: parsePrice(product.price),
        quantity: 1,
        image_url: product.image_url || "",
        stock: product.stock ?? null,
      };

      await new Promise((r) => setTimeout(r, 700));

      const res = await fetch("/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok || res.status === 401) {
        setSelectedProduct(product);
        toast.success("Product added to cart");
      } else {
        const json = await res.json().catch(() => ({}));
        throw new Error(json?.error || "Failed to add to cart");
      }
    } catch (err) {
      console.error("addToCart error", err);
      toast.error("Failed to add to cart " + (err?.message || err));
    } finally {
      setAddingToCartId(null);
    }
  }

  function computeStars(likesCount = 0) {
    const fullStars = Math.floor(likesCount / 2);
    const hasHalf = likesCount % 2 === 1;
    const stars = [];
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) stars.push("full");
      else if (i === fullStars && hasHalf) stars.push("half");
      else stars.push("empty");
    }
    return stars;
  }

  async function toggleLove(product) {
    try {
      // ensure we have latest user
      const { data: userData } = await supabase.auth.getUser();
      const currentUser = userData?.user || user;
      if (!currentUser) {
        toast.error("Please sign in to love products.");
        return;
      }

      const pid = product.id || product.product_id;
      const pidStr = String(pid);
      const alreadyLiked = likedSet.has(pidStr);

      // optimistic UI: update products' likes_count locally
      const newLikedSet = new Set(likedSet);
      const updatedProducts = products.map((p) => {
        if (String(p.id || p.product_id) !== pidStr) return p;
        const copy = { ...p };
        if (alreadyLiked) {
          newLikedSet.delete(pidStr);
          copy.likes_count = Math.max(0, (copy.likes_count || 0) - 1);
        } else {
          newLikedSet.add(pidStr);
          copy.likes_count = (copy.likes_count || 0) + 1;
        }
        return copy;
      });

      setProducts(updatedProducts);
      setLikedSet(newLikedSet);

      if (alreadyLiked) {
        const { error } = await supabase
          .from("product_likes")
          .delete()
          .match({ product_id: pid, user_id: currentUser.id });

        if (error) {
          toast.error("Could not remove love. Try again.");
          setProducts(products);
          setLikedSet(likedSet);
          console.error("unlike error", error);
        } else {
          toast.success("Removed love");
        }
      } else {
        const { data: insertData, error } = await supabase
          .from("product_likes")
          .insert({ product_id: pid, user_id: currentUser.id })
          .select("id")
          .single();

        if (error) {
          // unique violation may happen if duplicate like already exists
          if (error.code && error.code === "23505") {
            toast.success("Loved");
          } else {
            toast.error("Could not love product. Try again.");
            setProducts(products);
            setLikedSet(likedSet);
            console.error("like error", error);
          }
        } else {
          // record the new like id
          const likeRowId = insertData?.id;
          setLikedMap((m) => ({ ...m, [pidStr]: likeRowId }));
          toast.success("Loved");
        }
      }
    } catch (err) {
      toast.error("Action failed. Try again.");
      console.error("toggleLove err", err);
    }
  }

  function ProductQuickView({ product, onClose }) {
    if (!product) return null;
    return (
      <div className="fixed inset-0 bg-[#000000a8] flex justify-center items-center z-50">
        <div className="flex flex-col sm:flex-row relative py-8 items-center sm:items-start gap-10 bg-white px-6 sm:px-10 w-[90vw] sm:w-[70vw] md:w-[60vw] lg:w-[50vw] max-h-[90vh] overflow-y-auto">
          <svg
            onClick={onClose}
            className="absolute w-7 cursor-pointer rounded-4xl bg-[#209e2e] right-[20px] text-white"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M11.9997 10.5865L16.9495 5.63672L18.3637 7.05093L13.4139 12.0007L18.3637 16.9504L16.9495 18.3646L11.9997 13.4149L7.04996 18.3646L5.63574 16.9504L10.5855 12.0007L5.63574 7.05093L7.04996 5.63672L11.9997 10.5865Z"></path>
          </svg>

          <div>
            <img
              src={product.image_url || eggplant.src || ""}
              alt={product.name}
              className="max-w-[15vw]"
            />
          </div>

          <div>
            <h5 className="text-[18px] font-[700] mb-[5px] capitalize">
              {product.name}
            </h5>
            <p className="text-[14px] mb-[5px]">{product.description}</p>
            <p className="text-[16px] mb-[10px]">
              <span className="font-[600]">Weight:</span> {product.weight}kg
            </p>
            <div className="flex gap-5">
              <Link href={"/Checkout"}>
                <button className="bg-[#209e2e] cursor-pointer text-white py-1 px-5">
                  Checkout
                </button>
              </Link>
              <Link href={"/Cart"}>
                <button className="bg-[#071c1f] cursor-pointer text-white py-1 px-5">
                  View cart
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <section className="mt-30 py-30 flex flex-col items-center justify-center gap-0 lg:gap-5">
        <p className="text-[#209e2e] text-center lg:text-[15px] font-[400] text-[14px]">
          VISIT OUR SHOP
        </p>
        <h2 className="text-[38px] text-center font-[700] text-[#333333]">
          Buy our product
        </h2>
        <p className="text-[#7a7e9a] text-[16px] font-[400] leading-[1.8] text-center md:max-w-[605px] lg:max-w-[605px] m-auto">
          Discover premium, hand-selected products crafted to elevate your
          lifestyle and deliver exceptional quality every day.
        </p>

        <span className="flex my-5 lg:mt-10 gap-5 lg:gap-0">
          {/* show only the three categories */}
          {categories.map((catName, idx) => (
            <button
              key={catName}
              onClick={() => setActiveIndex(idx)}
              className={`border-dashed lg:border-r cursor-pointer border-[#209e2e] lg:px-[20px] text-[18px] font-[400] transition ${
                activeIndex === idx ? "text-[#209e2e]" : "text-[#8d8c8c]"
              }`}
            >
              {catName}
            </button>
          ))}
        </span>

        <div>
          {loading ? (
            <div className="col-span-full flex items-center justify-center w-full h-full">
              <div className="flex flex-col gap-4 items-center justify-center">
                <div className="w-20 h-20 border-4 border-transparent animate-spin border-t-blue-400 rounded-full flex items-center justify-center">
                  <div className="w-16 h-16 border-4 border-transparent animate-spin border-t-[#209e2e] rounded-full flex items-center justify-center"></div>
                </div>
              </div>
            </div>
          ) : activeProducts.length > 0 ? (
            <div className="flex flex-wrap gap-6 justify-center">
              {activeProducts.map((product) => (
                <div
                  key={product.product_id || product.id}
                  className="bg-[#d2ecd5] rounded-sm py-10 group  border-1 border-dashed  w-[90vw] md:w-[45vw] lg:w-[30vw] xl:w-[20vw] lg:relative lg:right-3  text-center border-[#209e2e]  hover:bg-white transition"
                >
                  <div className=" flex flex-col gap-3 text-center items-center">
                    <div className="w-[30vw] md:w-[20vw] lg:w-[12vw] h-[150px] overflow-hidden flex items-center justify-center">
                      <img
                        className="w-full h-full object-cover"
                        src={product.image_url || eggplant.src}
                        alt={product.name}
                      />
                    </div>

                    <h3 className="text-[#616161] group-hover:text-[#209e2e]   font-extrabold text-[20px] transition">
                      {product.name}
                    </h3>
                    <div>
                      <div className="flex gap-2 text-center">
                        <span className="text-[#ff000098] text-[18px] line-through font-bold transition">
                          ₦{product.discount_price}
                        </span>
                        <span className="text-[#000000b1]">/</span>
                        <span className="text-[#209e2e] text-[18px] font-bold transition">
                          ₦{parsePrice(product.price).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center  gap-2 lg:w-[20vw] justify-between">
                      <span className="w-[25vw] lg:w-[10vw] md:w-[10vw] block bg-[#209e2e] h-[1px]"></span>

                      <span className="flex gap-1">
                        {computeStars(product.likes_count).map((s, idx) => {
                          if (s === "full") {
                            return (
                              <svg
                                key={idx}
                                className="text-[#f4a708] w-[20px] group-hover:text-[#209e2e] transition"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                              >
                                <path d="M23.9996 12.0235C17.5625 12.4117 12.4114 17.563 12.0232 24H11.9762C11.588 17.563 6.4369 12.4117 0 12.0235V11.9765C6.4369 11.5883 11.588 6.43719 11.9762 0H12.0232C12.4114 6.43719 17.5625 11.5883 23.9996 11.9765V12.0235Z"></path>
                              </svg>
                            );
                          } else if (s === "half") {
                            return (
                              <svg
                                key={idx}
                                className="text-[#f4a708] w-[20px] group-hover:text-[#209e2e] transition"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                              >
                                <path d="M12.0006 15.968L16.2473 18.3451L15.2988 13.5717L18.8719 10.2674L14.039 9.69434L12.0006 5.27502V15.968ZM12.0006 18.26L4.94715 22.2082L6.52248 14.2799L0.587891 8.7918L8.61493 7.84006L12.0006 0.5L15.3862 7.84006L23.4132 8.7918L17.4787 14.2799L19.054 22.2082L12.0006 18.26Z"></path>
                              </svg>
                            );
                          } else {
                            return (
                              <svg
                                key={idx}
                                className="text-[#f4a708] w-[20px] group-hover:text-[#209e2e] transition"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                              >
                                <path d="M12.0006 18.26L4.94715 22.2082L6.52248 14.2799L0.587891 8.7918L8.61493 7.84006L12.0006 0.5L15.3862 7.84006L23.4132 8.7918L17.4787 14.2799L19.054 22.2082L12.0006 18.26ZM12.0006 15.968L16.2473 18.3451L15.2988 13.5717L18.8719 10.2674L14.039 9.69434L12.0006 5.27502L9.96214 9.69434L5.12921 10.2674L8.70231 13.5717L7.75383 18.3451L12.0006 15.968Z"></path>
                              </svg>
                            );
                          }
                        })}
                      </span>

                      <span className="w-[25vw]  md:w-[10vw] lg:w-[10vw] block bg-[#209e2e] h-[1px]"></span>
                    </div>

                    <div className="flex justify-center items-center gap-3 mt-5">
                      <svg
                        className="w-10 bg-[#eafef1] text-[#209e2e] border-1 p-2 hover:text-white hover:bg-[#209e2e] rounded-4xl transition cursor-pointer"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M18.031 16.6168L22.3137 20.8995L20.8995 22.3137L16.6168 18.031C15.0769 19.263 13.124 20 11 20C6.032 20 2 15.968 2 11C2 6.032 6.032 2 11 2C15.968 2 20 6.032 20 11C20 13.124 19.263 15.0769 18.031 16.6168ZM16.0247 15.8748C17.2475 14.6146 18 12.8956 18 11C18 7.1325 14.8675 4 11 4C7.1325 4 4 7.1325 4 11C4 14.8675 7.1325 18 11 18C12.8956 18 14.6146 17.2475 15.8748 16.0247L16.0247 15.8748Z"></path>
                      </svg>
                      <div className="relative">
                        {addingToCartId === product.id ? (
                          <div className="w-12 h-12 border-4 border-[#209e2e] border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <svg
                            onClick={() => addToCart(product)}
                            disabled={
                              product.stock !== undefined &&
                              Number(product.stock) <= 0
                            }
                            className={`w-12 bg-[#eafef1] text-[#209e2e] border-1 p-2 hover:text-white hover:bg-[#209e2e] rounded-4xl transition ${
                              product.stock !== undefined &&
                              Number(product.stock) <= 0
                                ? "text-gray-400 cursor-not-allowed"
                                : "text-[#209e2e] cursor-pointer"
                            }`}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M13.0001 10.9999L22.0002 10.9997L22.0002 12.9997L13.0001 12.9999L13.0001 21.9998L11.0001 21.9998L11.0001 12.9999L2.00004 13.0001L2 11.0001L11.0001 10.9999L11 2.00025L13 2.00024L13.0001 10.9999Z"></path>
                          </svg>
                        )}
                      </div>

                      <svg
                        onClick={() => toggleLove(product)}
                        className={`w-10 bg-[#eafef1] ${
                          likedSet.has(String(product.id || product.product_id))
                            ? "text-white bg-[#209e2e]"
                            : "text-[#209e2e]"
                        } border-1 p-2 hover:text-white hover:bg-[#209e2e] rounded-4xl transition cursor-pointer`}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        role="button"
                        aria-pressed={likedSet.has(
                          String(product.id || product.product_id)
                        )}
                        aria-label={`${product.likes_count || 0} loves`}
                      >
                        <path d="M12.001 4.52853C14.35 2.42 17.98 2.49 20.2426 4.75736C22.5053 7.02472 22.583 10.637 20.4786 12.993L11.9999 21.485L3.52138 12.993C1.41705 10.637 1.49571 7.01901 3.75736 4.75736C6.02157 2.49315 9.64519 2.41687 12.001 4.52853ZM18.827 6.1701C17.3279 4.66794 14.9076 4.60701 13.337 6.01687L12.0019 7.21524L10.6661 6.01781C9.09098 4.60597 6.67506 4.66808 5.17157 6.17157C3.68183 7.66131 3.60704 10.0473 4.97993 11.6232L11.9999 18.6543L19.0201 11.6232C20.3935 10.0467 20.319 7.66525 18.827 6.1701Z"></path>
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="col-span-full text-center">
              <p className="text-[25px] my-20 font-bold text-[#8d8c8c]">
                No products in this category
              </p>
            </div>
          )}
        </div>

        <Link href={"/Shop"}>
          <button className="bg-[#209e2e] mt-10 w-fit px-5 flex justify-center items-center lg:px-8 gap-1 text-white cursor-pointer transition p-3 rounded-4xl hover:bg-white hover:text-[#209e2e] border-1 border-[#209e2e]">
            <p className="font-medium lg:text-[17px]">All Products</p>
            <svg
              className="w-6"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M11 11V5H13V11H19V13H13V19H11V13H5V11H11Z"></path>
            </svg>
          </button>
        </Link>
      </section>

      {selectedProduct && (
        <ProductQuickView
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
      <Toaster />
    </>
  );
}
