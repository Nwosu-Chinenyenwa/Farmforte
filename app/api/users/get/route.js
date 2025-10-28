import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabaseAdmin"; 

export async function GET() {
  try {
    const supabaseAdmin = createAdminClient();

    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.listUsers();
    if (authError) throw authError;

    const { data: profiles, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("id, full_name, role, avatar_url");

    if (profileError) throw profileError;

    const users = authData.users.map((u) => {
      const profile = profiles.find((p) => p.id === u.id);

      return {
        id: u.id,
        name: profile?.full_name || u.user_metadata?.full_name || "No name",
        role: profile?.role || "User",
        verified: !!u.email_confirmed_at,
        status: u.banned_until ? "Banned" : "Active",
        image_url: profile?.avatar_url || u.user_metadata?.avatar_url || "/default-avatar.png",
        email: u.email,
      };
    });

    return NextResponse.json({ success: true, users });
  } catch (err) {
    console.error("Fetch users error:", err.message);
    return NextResponse.json({ success: false, error: err.message });
  }
}
