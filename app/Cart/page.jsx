"use client";

import { useEffect, useState } from "react";
import AllNav from "../Components/AllNav";
import Link from "next/link";
import pawpaw from "../../public/asset/pawpaw.webp";
import Image from "next/image";
import Subcribe from "../Components/Subcribe";
import Footer from "../Components/Footer";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { FaSpinner } from "react-icons/fa";

export default function Page() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    loadCart();
  }, []);

  async function loadCart() {
    setLoading(true);
    try {
      const res = await fetch("/api/cart/get");
      if (res.ok) {
        const json = await res.json();
        setCartItems(json.data || []);
      } else if (res.status === 401) {
        const raw = localStorage.getItem("local_cart") || "[]";
        const arr = JSON.parse(raw);
        setCartItems(arr);
      } else {
        const json = await res.json().catch(() => ({}));
        console.error("Error loading cart:", json.error);
        toast.error("Failed to load cart");
      }
    } catch (err) {
      console.error("loadCart error", err);
      toast.error("Failed to load cart");
    } finally {
      setLoading(false);
    }
  }

  function formatMoney(n) {
    return Number(n || 0).toFixed(2);
  }

  async function updateQuantity(item, newQty) {
    if (newQty < 1) return;

    setUpdatingId(item.id || item.product_id); // Start loader

    const maxStock = item.stock ?? null;
    if (maxStock !== null && Number(newQty) > Number(maxStock)) {
      toast.error(`Only ${maxStock} item(s) available in stock.`);
      setUpdatingId(null);
      return;
    }

    if (item.id) {
      try {
        const res = await fetch("/api/cart/update", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cartItemId: item.id, quantity: newQty }),
        });

        if (!res.ok) {
          const json = await res.json().catch(() => ({}));
          toast.error(json.error || "Update failed");
          setUpdatingId(null);
          return;
        }

        setCartItems((prev) =>
          prev.map((it) =>
            it.id === item.id ? { ...it, quantity: newQty } : it
          )
        );
      } catch (err) {
        console.error(err);
        toast.error("Could not update quantity");
      } finally {
        setUpdatingId(null);
      }
    } else {
      try {
        const raw = localStorage.getItem("local_cart") || "[]";
        const arr = JSON.parse(raw);
        const idx = arr.findIndex((i) => i.product_id === item.product_id);

        const localStock =
          idx >= 0
            ? (arr[idx].stock ?? item.stock ?? null)
            : (item.stock ?? null);
        if (localStock !== null && Number(newQty) > Number(localStock)) {
          toast.error(`Only ${localStock} item(s) available in stock.`);
          setUpdatingId(null);
          return;
        }

        if (idx >= 0) {
          arr[idx].quantity = newQty;
          if (item.stock !== undefined) arr[idx].stock = item.stock;
          localStorage.setItem("local_cart", JSON.stringify(arr));
          setCartItems(arr);
        }
      } catch (err) {
        console.error("local cart update error", err);
        toast.error("Could not update quantity");
      } finally {
        setUpdatingId(null);
      }
    }
  }

  async function removeItem(item) {
    setDeletingId(item.id || item.product_id);

    if (item.id) {
      try {
        const res = await fetch("/api/cart/remove", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cartItemId: item.id }),
        });

        if (!res.ok) throw new Error("Remove failed");

        setCartItems((prev) => prev.filter((it) => it.id !== item.id));
        toast.success("Item removed successfully");
      } catch (err) {
        console.error(err);
        toast.error("Could not remove item");
      } finally {
        setDeletingId(null);
      }
    } else {
      try {
        const arr = JSON.parse(
          localStorage.getItem("local_cart") || "[]"
        ).filter((i) => i.product_id !== item.product_id);
        localStorage.setItem("local_cart", JSON.stringify(arr));
        setCartItems(arr);
        toast.success("Item removed successfully");
      } catch (err) {
        console.error("Local remove error", err);
        toast.error("Could not remove item");
      } finally {
        setDeletingId(null);
      }
    }
  }

  const subtotal = cartItems.reduce((s, it) => {
    const price =
      Number(
        it.unit_price ??
          parseFloat(String(it.price ?? "0").replace(/[^0-9.]/g, ""))
      ) || 0;
    const qty = Number(it.quantity || 1);
    return s + price * qty;
  }, 0);
  const shipping = 0;
  const total = subtotal + shipping;

  return (
    <>
      <section className="pagetitle">
        <AllNav />
        <div className="py-50 bg-[#00000093] text-white text-center">
          <h1 className="text-[30px] font-extrabold">Cart</h1>
          <div className="flex items-center justify-center gap-2">
            <Link href={"/pages/Home"}></Link>
            <p className="cursor-pointer">Home</p>
            <span className="w-[5px] h-[5px] rounded-full bg-[#209e2e] block"></span>
            <p className="cursor-pointer">Cart</p>
          </div>
        </div>
      </section>

      <section>
        <div className="shadow-lg rajdhani-light my-10 py-5 w-[95vw] overflow-x-auto xl:overflow-x-hidden no-scrollbar m-auto flex xl:items-center xl:justify-center">
          <table className="table-auto w-full border-collapse text-center min-w-[700px] sm:min-w-[800px] md:min-w-[900px] lg:min-w-[1000px] xl:w-[90vw]">
            <thead>
              <tr className="text-[16px] sm:text-[18px] md:text-[20px] py-4 sm:py-6 simpleBorder">
                <th className="px-3 sm:px-4 py-3 sm:py-5">Product</th>
                <th className="px-3 sm:px-4 py-3 sm:py-5">Name</th>
                <th className="px-3 sm:px-4 py-3 sm:py-5">Unit Price</th>
                <th className="px-3 sm:px-4 py-3 sm:py-5">Quantity</th>
                <th className="px-3 sm:px-4 py-3 sm:py-5">Total</th>
              </tr>
            </thead>

            <tbody>
              {!loading && cartItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-20 text-xl text-[#8d8c8c]">
                    Your cart is empty
                  </td>
                </tr>
              ) : (
                cartItems.map((product, index) => (
                  <tr
                    key={product.id ?? product.product_id ?? index}
                    className="text-[14px] sm:text-[17px] md:text-[19px] lg:text-[20px] py-4 sm:py-6 simpleBorder text-center transition"
                  >
                    <td className="px-3 sm:px-4 py-4 sm:py-6">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="max-w-[20vw] sm:max-w-[10vw] md:max-w-[8vw] m-auto"
                        />
                      ) : (
                        <Image
                          className="max-w-[20vw] sm:max-w-[10vw] md:max-w-[8vw] m-auto"
                          src={pawpaw}
                          alt={product.name || "product"}
                        />
                      )}
                    </td>

                    <td className="text-[#666666] font-semibold sm:font-bold px-3 sm:px-4 py-2">
                      {product.name}
                    </td>

                    <td className="text-[#666666] font-semibold sm:font-bold px-3 sm:px-4 py-2">
                      {"$" +
                        formatMoney(product.unit_price ?? product.price ?? 0)}
                    </td>

                    <td className="px-3 sm:px-4 py-2">
                      <div className="flex h-[35px] sm:h-[40px] px-2 sm:px-3 gap-3 sm:gap-5 font-[500] bg-[#f1efef] items-center justify-center">
                        <button
                          onClick={() =>
                            updateQuantity(
                              product,
                              Number(product.quantity || 1) - 1
                            )
                          }
                          className="text-[gray] cursor-pointer hover:text-[#333333] transition text-2xl sm:text-3xl"
                        >
                          -
                        </button>
                        <p className="text-[#333333] font-semibold text-[15px] sm:text-[17px]">
                          {updatingId === (product.id || product.product_id) ? (
                            <FaSpinner className="animate-spin text-gray-400" />
                          ) : (
                            product.quantity || 1
                          )}
                        </p>

                        <button
                          onClick={() =>
                            updateQuantity(
                              product,
                              Number(product.quantity || 1) + 1
                            )
                          }
                          className="text-[gray] cursor-pointer hover:text-[#333333] transition text-2xl sm:text-3xl"
                        >
                          +
                        </button>
                      </div>
                    </td>

                    <td className="px-3 sm:px-4 py-2">
                      <div className="flex gap-3 sm:gap-5 items-center justify-center">
                        <p className="text-[#666666] font-bold text-[15px] sm:text-[17px]">
                          {"$" +
                            formatMoney(
                              Number(
                                (product.unit_price ?? product.price) || 0
                              ) * Number(product.quantity || 1)
                            )}
                        </p>

                        {deletingId === (product.id || product.product_id) ? (
                          <FaSpinner className="animate-spin text-[#ff0000] w-5" />
                        ) : (
                          <svg
                            onClick={() => removeItem(product)}
                            className="w-4 sm:w-5 text-[gray] cursor-pointer hover:text-[#ff0000] transition"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M7 6V3C7 2.44772 7.44772 2 8 2H16C16.5523 2 17 2.44772 17 3V6H22V8H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V8H2V6H7ZM9 4V6H15V4H9Z"></path>
                          </svg>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <section className="w-full flex p-5 justify-end items-center my-10">
          <div className="w-[90vw] shadow-lg md:w-[40vw] rounded-lg p-6 bg-white">
            <h2 className="text-[22px] rajdhani-light font-bold mb-5 text-[#333333]">
              Cart Totals
            </h2>

            <table className="w-full border-collapse">
              <tbody>
                <tr className="border-1 border-[#eaedff] font-mono">
                  <td className="py-3 px-3 text-[16px] text-[#323232]">
                    Subtotal
                  </td>
                  <td className="py-3 px-3 text-[16px] text-right text-[#666666] font-normal">
                    {"$" + formatMoney(subtotal)}
                  </td>
                </tr>
                <tr
                  title="No shipping fee!"
                  className="border-1 border-[#eaedff] font-mono"
                >
                  <td className="py-3 px-3 text-[16px] text-[#323232]">
                    Shipping
                  </td>
                  <td className="py-3 px-3 text-[16px] text-right text-[#666666] font-normal">
                    {"$" + formatMoney(shipping)}
                  </td>
                </tr>

                <tr className="rajdhani-light">
                  <td className="py-5 px-3 text-[16px] font-bold text-[#333333]">
                    Total
                  </td>
                  <td className="py-5 px-3 text-[16px] font-bold text-right text-[#333333]">
                    {"$" + formatMoney(total)}
                  </td>
                </tr>
              </tbody>
            </table>

            <Link href={"/Checkout"}>
              <button
                onClick={() => router.push("/Checkout")}
                className="mt-6 w-full bg-[#28a745] text-white text-[16px] font-semibold py-3 rounded-full hover:bg-[#333333] transition cursor-pointer"
              >
                Proceed To Checkout →
              </button>
            </Link>
          </div>
        </section>
      </section>
      <Toaster />
      <Subcribe />
      <Footer />
    </>
  );
}
