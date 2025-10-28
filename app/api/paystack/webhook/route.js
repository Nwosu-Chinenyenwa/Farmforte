import { NextResponse } from "next/server";
import crypto from "crypto";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const POST = async (req) => {
  const raw = await req.text();
  const signature = req.headers.get("x-paystack-signature") || "";

  const secret = process.env.NEXT_PUBLIC_PAYSTACK_SECRET_KEY; // your secret key
  const expected = crypto
    .createHmac("sha512", secret)
    .update(raw)
    .digest("hex");

  if (signature !== expected) {
    console.warn("Invalid Paystack signature", { signature, expected });
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  let payload;
  try {
    payload = JSON.parse(raw);
  } catch (err) {
    console.error("Invalid JSON payload", err);
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const event =
    payload.event || payload.event === undefined ? payload.event : null;
  try {
    if (
      payload.event === "charge.success" ||
      payload.event === "transaction.success"
    ) {
      const data = payload.data;

      const orderId =
        data.metadata?.order_id ?? data.customer?.metadata?.order_id ?? null;
      const userId = data.metadata?.user_id ?? null;
      const amountPaid = (data.amount ?? 0) / 100;
      const currency = data.currency ?? "NGN";
      const paystackRef = data.reference ?? data.transaction?.reference ?? null;

      if (!orderId) {
        console.warn("No order_id in paystack metadata", data);
      } else {
        await supabaseAdmin
          .from("orders")
          .update({ status: "paid", updated_at: new Date().toISOString() })
          .eq("id", orderId);

        const { data: existing } = await supabaseAdmin
          .from("payments")
          .select("id")
          .eq("stripe_payment_intent", paystackRef)
          .maybeSingle();

        if (!existing) {
          await supabaseAdmin.from("payments").insert([
            {
              order_id: orderId,
              user_id: userId,
              stripe_payment_intent: paystackRef,
              stripe_charge_id: paystackRef,
              amount: amountPaid,
              currency,
              payment_method: data.channel || "card",
              status: "succeeded",
              raw_event: payload,
            },
          ]);
        }

        if (userId) {
          try {
            await supabaseAdmin.rpc("increment_total_purchases", {
              p_user_id: userId,
              p_amount: amountPaid,
            });
          } catch (rpcErr) {
            console.warn(
              "RPC failed; fallback update profiles.total_purchases",
              rpcErr
            );
            const { data: profile } = await supabaseAdmin
              .from("profiles")
              .select("total_purchases")
              .eq("id", userId)
              .maybeSingle();

            const current = Number(profile?.total_purchases ?? 0);
            await supabaseAdmin
              .from("profiles")
              .update({ total_purchases: current + amountPaid })
              .eq("id", userId);
          }
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("webhook processing error", err);
    return NextResponse.json({ error: err.message || err }, { status: 500 });
  }
};
