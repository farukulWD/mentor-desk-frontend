import { NextResponse, type NextRequest } from "next/server";

import { LOGIN_PATH } from "@/lib/routes";

const AUTH_COOKIE = "accessToken";

export function proxy(request: NextRequest) {
  if (request.cookies.has(AUTH_COOKIE)) return NextResponse.next();

  return NextResponse.redirect(new URL(LOGIN_PATH, request.url));
}

export const config = {
  matcher: ["/student/:path*", "/mentor/:path*"],
};
