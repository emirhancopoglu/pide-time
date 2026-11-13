import { NextResponse } from "next/server";

/**
 * /                  -> /ara
 * /istanbul          -> /ara?il=istanbul
 * /istanbul/kartal   -> /ara?il=istanbul&ilce=kartal
 * /istanbul-kartal   -> /ara?il=istanbul-kartal (eski biçim; sayfa il ve ilçeyi ayırır)
 *
 * İl ve ilçe sayfaları kaldırıldı; eski bağlantılar kalıcı yönlendirmeyle /ara'ya gider.
 */
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
  // /ara, API, Next dosyaları ve uzantılı dosyalar (icon.svg vb.) yönlendirilmez
  matcher: ["/", "/((?!ara(?:/|$)|api/|_next/|.*\\.).*)"],
};
