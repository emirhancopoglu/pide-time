import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mt-16 max-w-lg">
      <h1 className="font-display text-4xl font-semibold tracking-tight">Bu konum bulunamadı</h1>
      <p className="mt-2 text-muted-foreground">
        Bağlantı hatalı olabilir ya da Diyanet bu ilçe için ayrı vakit yayımlamıyor olabilir. Listeden il ve
        ilçeni seçerek devam et.
      </p>
      <Button asChild className="mt-6 h-11 rounded-full px-5 text-base">
        <Link href="/ara">Konum seç</Link>
      </Button>
    </div>
  );
}
