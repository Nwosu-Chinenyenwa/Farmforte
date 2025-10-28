import { NextResponse } from "next/server";
import { createAdminClient, debugSupabase } from "@/lib/supabaseAdmin";

export async function POST(req) {
  try {
    console.log("DEBUG: Supabase connection →", debugSupabase());
    const payload = await req.json();

    const supabase = createAdminClient();

    const { id, full_name, role } = payload;

    const { data, error } = await supabase
      .from("admin_profiles")
      .insert([{ id, full_name, role }]);

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ success: false, message: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
