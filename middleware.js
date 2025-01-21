import { NextResponse } from "next/server";

const protectedRoutes = ["/account", "/clankerius", "/feed-agent"];
const protectedApiRoutes = ["/api/chats"];

export function middleware(request) {
  const url = request.nextUrl.clone();
  const privyToken = request.cookies.get("privy-token")?.value || request.headers.get("privy-token");

  console.log("Middleware Debug:");
  console.log("Requested Path:", url.pathname);
  console.log("Privy Token from Cookies:", privyToken);

  // Если нет токена, проверяем, является ли маршрут защищенным
  if (!privyToken) {
    if (protectedRoutes.includes(url.pathname)) {
      console.log("Redirecting to home: No Privy Token for protected route.");
      url.pathname = "/";
      const response = NextResponse.redirect(url);
      response.cookies.set(
        "auth_message",
        encodeURIComponent("Authorization required. Please connect your wallet."),
        { path: "/", maxAge: 10 }
      );
      return response;
    }

    if (protectedApiRoutes.some((route) => url.pathname.startsWith(route))) {
      console.log("API Access Denied: No Privy Token.");
      return new NextResponse(
        JSON.stringify({ error: "Unauthorized. Please log in." }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }
  }

  console.log("Access Granted.");
  return NextResponse.next();
}

export const config = {
  matcher: ["/account", "/clankerius", "/feed-agent", "/api/:path*"],
};
