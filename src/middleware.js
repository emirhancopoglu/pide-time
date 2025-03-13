import { NextResponse } from "next/server";

export function middleware(req) {
  if (req.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/ara", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/",
};
