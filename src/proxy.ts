import { NextResponse, type NextRequest } from "next/server";

import { LOGIN_PATH } from "@/lib/routes";

const AUTH_COOKIES = ["accessToken", "refreshToken"];

export function proxy(request: NextRequest) {
  if (AUTH_COOKIES.some((name) => request.cookies.has(name))) {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL(LOGIN_PATH, request.url));
}

export const config = {
  matcher: ["/student/:path*", "/mentor/:path*"],
};
