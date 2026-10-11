import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

function redirectWithSession(request: NextRequest, sessionResponse: NextResponse, pathname: string) {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  const redirectResponse = NextResponse.redirect(url);
  sessionResponse.cookies.getAll().forEach(({ name, value, ...options }) => {
    redirectResponse.cookies.set(name, value, options);
  });
  return redirectResponse;
}

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  const isClient = path.startsWith("/clientDashboard");
  const isProvider = path.startsWith("/providerDashboard");
  const isAuthPage = path.startsWith("/signIn") || path.startsWith("/signUp");

  if (!user && (isClient || isProvider)) {
    return redirectWithSession(request, supabaseResponse, "/signIn");
  }

  if (user && (isClient || isProvider || isAuthPage)) {
    const { data: roleRow } = await supabase
      .from("Users")
      .select("role")
      .eq("auth_user_id", user.id)
      .maybeSingle();
    const role = roleRow?.role;

    if (role === "admin" && (isClient || isAuthPage)) {
      return redirectWithSession(request, supabaseResponse, "/providerDashboard");
    }

    if (role === "user" && (isProvider || isAuthPage)) {
      return redirectWithSession(request, supabaseResponse, "/clientDashboard");
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
