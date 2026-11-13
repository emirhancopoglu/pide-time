import { NextResponse } from "next/server";

export function middleware(req) {
  const parts = req.nextUrl.pathname.split("/").filter(Boolean);

  if (parts.length === 0) {
    return NextResponse.redirect(new URL("/ara", req.url));
  }

  if (parts.length <= 2) {
    const url = new URL("/ara", req.url);
    url.searchParams.set("il", decodeURIComponent(parts[0]));
    if (parts[1]) url.searchParams.set("ilce", decodeURIComponent(parts[1]));
    return NextResponse.redirect(url, 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/((?!ara(?:/|$)|api/|_next/|.*\\.).*)"],
};
