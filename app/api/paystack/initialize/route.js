import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req) {
  try {
    const body = await req.json();
    const { billing, user_id } = body;

    if (!user_id) {
      return NextResponse.json({ error: "Missing user_id" }, { status: 400 });
    }

    const { data: cartItems, error: cartErr } = await supabaseAdmin
      .from("cart_items")
      .select("id, product_id, name, price, quantity, metadata")
      .eq("user_id", user_id);

    if (cartErr) throw cartErr;
    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const item_count = cartItems.reduce((s, it) => s + (it.quantity || 1), 0);
    const amountDecimal = cartItems.reduce(
      (s, it) => s + Number(it.price || 0) * (it.quantity || 1),
      0
    );
    const amount = Number(amountDecimal.toFixed(2));

    const { data: order, error: orderInsertErr } = await supabaseAdmin
      .from("orders")
      .insert([
        {
          user_id,
          status: "pending",
          amount,
          item_count,
          currency: "NGN",
          metadata: { cart: cartItems, billing },
        },
      ])
      .select()
      .single();

    if (orderInsertErr) throw orderInsertErr;

    const paystackAmount = Math.round(amount * 100);

    const paystackRes = await fetch(
      "https://api.paystack.co/transaction/initialize",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: billing.email || "no-reply@example.com",
          amount: paystackAmount,
          currency: "NGN",
          callback_url: `${process.env.NEXT_PUBLIC_BASE_URL || ""}/CheckoutSuccess`,
          metadata: { order_id: order.id, user_id },
        }),
      }
    );

    const paystackJson = await paystackRes.json();
    if (!paystackJson.status) {
      console.error("Paystack initialize failed", paystackJson);
      throw new Error(paystackJson.message || "Paystack initialize failed");
    }

    await supabaseAdmin
      .from("orders")
      .update({ stripe_session_id: paystackJson.data.reference })
      .eq("id", order.id);

    return NextResponse.json({
      authorization_url: paystackJson.data.authorization_url,
    });
  } catch (err) {
    console.error("initialize error", err);
    return NextResponse.json({ error: err.message || err }, { status: 500 });
  }
}
