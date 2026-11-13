import { NextResponse } from "next/server";
import { getIlceler } from "@/lib/diyanet";

export async function GET(_request, { params }) {
  const { ilId } = await params;

  if (!/^\d+$/.test(ilId)) {
    return NextResponse.json({ error: "Geçersiz il." }, { status: 400 });
  }

  try {
    const ilceler = await getIlceler(ilId);
    return NextResponse.json(ilceler, {
      headers: { "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800" },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "İlçe listesi şu an alınamıyor." },
      { status: error.status ?? 500, headers: { "X-Upstream-Status": error.upstreamStatus ?? "unknown" } }
    );
  }
}
