"use client";
import { startTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({ error, reset }) {
  const router = useRouter();

  const retry = () =>
    startTransition(() => {
      router.refresh();
      reset();
    });

  useEffect(() => {
    console.error("[ara] sayfa hatası", { message: error?.message, digest: error?.digest });
  }, [error]);

  return (
    <div className="mt-16 flex max-w-lg flex-col items-start gap-4">
      <h1 className="font-display text-4xl font-semibold tracking-tight">Vakitler yüklenemedi</h1>
      <p className="text-muted-foreground">
        Bağlantı kesildi ya da vakit servisi şu an yanıt vermiyor. Birkaç saniye sonra tekrar dene.
      </p>
      <Button onClick={retry} className="h-11 rounded-full px-5 text-base">
        <RotateCw /> Tekrar dene
      </Button>
    </div>
  );
}
