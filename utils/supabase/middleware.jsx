import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";

export async function updateSession(request) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createMiddlewareClient({ req: request, res: response });

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

  const adminPages = [
    "/admin",
    "/Accounts",
    "/AddProducts",
    "/AdminProfile",
    "/AdminSetting",
    "/Transactions",
  ];

  if (adminPages.some((page) => pathname.startsWith(page)) && !isAdmin) {
    return NextResponse.redirect(new URL("/Login", request.url));
  }

  return response;
}
