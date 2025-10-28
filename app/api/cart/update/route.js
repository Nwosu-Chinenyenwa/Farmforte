// app/api/cart/update/route.js
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

export async function PATCH(request) {
  try {
    const supabase = createServerClient(SUPABASE_URL, SUPABASE_KEY, {
      cookies: {
        getAll() {
          return cookies().getAll();
        },
      },
    });

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    const user = userData?.user || null;
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const { cartItemId, quantity } = await request.json();
    if (!cartItemId || quantity == null) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    const { data: cartItem, error: cartErr } = await supabase
      .from("cart_items")
      .select("id, product_id")
      .match({ id: cartItemId, user_id: user.id })
      .single();

    if (cartErr) throw cartErr;
    if (!cartItem) return NextResponse.json({ error: "Cart item not found" }, { status: 404 });

    const { data: product, error: prodErr } = await supabase
      .from("products")
      .select("stock")
      .eq("id", cartItem.product_id)  
      .maybeSingle();

    if (prodErr) throw prodErr;

    const available = Number(product?.stock ?? 0);
    if (Number(quantity) > available) {
      return NextResponse.json({ error: `Only ${available} item(s) available in stock.` }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("cart_items")
      .update({ quantity })
      .match({ id: cartItemId, user_id: user.id })
      .select();

    if (error) throw error;
    return NextResponse.json({ data });
  } catch (err) {
    console.error("Cart update error:", err);
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}
