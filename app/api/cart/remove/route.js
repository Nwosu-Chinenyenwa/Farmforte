import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

export async function POST(request) {
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

    const { cartItemId } = await request.json();
    if (!cartItemId) return NextResponse.json({ error: "cartItemId required" }, { status: 400 });

    const { data, error } = await supabase.from("cart_items").delete().match({ id: cartItemId, user_id: user.id });

    if (error) throw error;
    return NextResponse.json({ data });
  } catch (err) {
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}
