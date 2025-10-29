import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY 
);
export async function POST(req) {
  try {
    const body = await req.json();
    console.log("Received body:", body);

    const { data, error } = await supabase
      .from("orders")
      .insert([
        {
          user_id: body.user_id,
          status: body.status,
          currency: body.currency,
          amount: body.amount,
          item_count: body.item_count,
          metadata: body.metadata,
          stripe_session_id: body.stripe_session_id ?? null,
        },
      ]);

    if (error) {
      console.error("Supabase error:", error);
      return new Response(JSON.stringify({ error }), { status: 400 });
    }

    return new Response(JSON.stringify({ data }), { status: 200 });
  } catch (err) {
    console.error("Server error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
