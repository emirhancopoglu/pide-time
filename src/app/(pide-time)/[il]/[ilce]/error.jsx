"use client";
import Link from "next/link";
import { RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({ reset }) {
  return (
    <div className="mt-16 max-w-lg">
      <h1 className="font-display text-4xl font-semibold tracking-tight">Vakitler alınamadı</h1>
      <p className="mt-2 text-muted-foreground">
        Diyanet vakit servisi şu an yanıt vermiyor. Birkaç saniye sonra tekrar dene ya da başka bir konum seç.
      </p>
      <div className="mt-6 flex flex-wrap gap-2">
        <Button onClick={() => reset()} className="h-11 rounded-full px-5 text-base">
          <RotateCw /> Tekrar dene
        </Button>
        <Button variant="outline" asChild className="h-11 rounded-full px-5 text-base">
          <Link href="/ara">Konum değiştir</Link>
        </Button>
      </div>
    </div>
  );
}
