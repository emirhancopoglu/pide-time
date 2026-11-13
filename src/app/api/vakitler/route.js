import { NextResponse } from "next/server";
import { loadPlaceTimes } from "@/lib/places";

const SLUG = /^[a-z0-9-]+$/;

/** GET /api/vakitler?il=istanbul&ilce=kartal (ilçe isteğe bağlı; yoksa il merkezi) */
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const il = searchParams.get("il") ?? "";
  const ilce = searchParams.get("ilce") || null;

  if (!SLUG.test(il) || (ilce && !SLUG.test(ilce))) {
    return NextResponse.json({ error: "Geçersiz konum." }, { status: 400 });
  }

  try {
    const result = await loadPlaceTimes(il, ilce);
    if (!result) {
      return NextResponse.json({ error: "Bu konum için vakit bulunamadı." }, { status: 404 });
    }
    return NextResponse.json(result, {
      headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=21600" },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Vakitler şu an alınamıyor." }, { status: error.status ?? 500 });
  }
}
