import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const updateSession = async (request) => {
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          request.cookies.set(name, value);
        });

        supabaseResponse = NextResponse.next({ request });

        cookiesToSet.forEach(({ name, value, options }) => {
          supabaseResponse.cookies.set(name, value, options);
        });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const isNewPasswordPage = pathname === "/ResetPassword";

  if (user && pathname.startsWith("/Login") && !isNewPasswordPage) {
    return NextResponse.redirect(new URL("/Home", request.url));
  }

  if (!user && (pathname.startsWith("/Checkout") || pathname.startsWith("/Profile"))) {
    return NextResponse.redirect(new URL("/Login", request.url));
  }

  if (!user && (pathname.startsWith("/ResetPassword") || pathname.startsWith("/Profile"))) {
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

  if (pathname.startsWith("/admin") && !isAdmin) {
    return NextResponse.redirect(new URL("/Login", request.url));
  }
  if (pathname.startsWith("/Accounts") && !isAdmin) {
    return NextResponse.redirect(new URL("/Login", request.url));
  }
  if (pathname.startsWith("/AddProducts") && !isAdmin) {
    return NextResponse.redirect(new URL("/Login", request.url));
  }
  if (pathname.startsWith("/AdminProfile") && !isAdmin) {
    return NextResponse.redirect(new URL("/Login", request.url));
  }
  if (pathname.startsWith("/AdminSetting") && !isAdmin) {
    return NextResponse.redirect(new URL("/Login", request.url));
  }
  if (pathname.startsWith("/Transactions") && !isAdmin) {
    return NextResponse.redirect(new URL("/Login", request.url));
  }

  return supabaseResponse;
};
