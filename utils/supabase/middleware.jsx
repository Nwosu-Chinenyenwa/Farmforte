import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const updateSession = async (request) => {
  let response = NextResponse.next({
    request: { headers: request.headers },
  });

  if (!supabaseUrl || !supabaseKey) {
    console.error("❌ Missing Supabase environment variables");
    return response;
  }

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  let user = null;

  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) {
      console.error("Session error:", sessionError.message);
    } else if (session?.user) {
      user = session.user;
    }
  } catch (err) {
    console.error("Middleware session fetch failed:", err.message);
  }

  const pathname = request.nextUrl.pathname;
  const isNewPasswordPage = pathname === "/ResetPassword";

  if (user && pathname.startsWith("/Login") && !isNewPasswordPage) {
    return NextResponse.redirect(new URL("/Home", request.url));
  }

  if (!user && (pathname.startsWith("/Checkout") || pathname.startsWith("/Profile"))) {
    return NextResponse.redirect(new URL("/Login", request.url));
  }

  let isAdmin = false;

  if (user) {
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!error && profile?.role === "admin") {
      isAdmin = true;
    }
  }

  const adminPaths = [
    "/admin",
    "/Accounts",
    "/AddProducts",
    "/AdminProfile",
    "/AdminSetting",
    "/Transactions",
  ];

  if (adminPaths.some((path) => pathname.startsWith(path)) && !isAdmin) {
    return NextResponse.redirect(new URL("/Login", request.url));
  }

  return response;
};
