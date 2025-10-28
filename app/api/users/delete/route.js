import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabaseAdmin";

export async function DELETE(req) {
  try {
    const { ids } = await req.json();

    if (!ids || !Array.isArray(ids)) {
      return NextResponse.json({
        success: false,
        error: "Invalid request body",
      });
    }

    const supabase = createAdminClient();

    for (const id of ids) {
      const { error } = await supabase.auth.admin.deleteUser(id);
      if (error) throw error;
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Delete users error:", err.message);
    return NextResponse.json({ success: false, error: err.message });
  }
}
