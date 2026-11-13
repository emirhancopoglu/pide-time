import { NextResponse } from "next/server";
import { getIller } from "@/lib/diyanet";

export const revalidate = 2592000;

export async function GET() {
  try {
    const iller = await getIller();
    return NextResponse.json(iller, {
      headers: { "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800" },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "İl listesi şu an alınamıyor." },
      { status: error.status ?? 500 }
    );
  }
}
