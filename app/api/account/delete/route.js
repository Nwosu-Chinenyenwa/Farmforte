import { createAdminClient } from "@/lib/supabaseAdmin";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { userId } = body || {};

    if (!userId) {
      return NextResponse.json({ error: "userId required" }, { status: 400 });
    }

    const supabase = createAdminClient();


    const tablesToDelete = ["cart_items", "profiles"];
    for (const table of tablesToDelete) {
      const { error: delErr, data: delData } = await supabase
        .from(table)
        .delete()
        .eq(table === "profiles" ? "id" : "user_id", userId);

      if (delErr) {
        console.error(`Error deleting from ${table}:`, delErr);
        return NextResponse.json(
          { error: `Failed to delete ${table}: ${delErr.message || String(delErr)}` },
          { status: 500 }
        );
      }
    }

    const { error: deleteUserError, data: deleteUserData } = await supabase.auth.admin.deleteUser(userId);

    if (deleteUserError) {
      console.error("Error deleting auth user:", deleteUserError);
      return NextResponse.json(
        { error: deleteUserError.message || String(deleteUserError) },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data: { message: "account_deleted", deletedAuthUser: !!deleteUserData },
    });
  } catch (err) {
    console.error("Unexpected account delete error:", err);
    return NextResponse.json({ error: err?.message || String(err) || "unknown error" }, { status: 500 });
  }
}
