"use client";
import { toast } from "sonner";
import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ShareButton({ title }) {
  const share = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        /* kullanıcı paylaşımı kapattı */
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Bağlantı kopyalandı");
    } catch {
      toast.error("Bağlantı kopyalanamadı. Adres çubuğundan kopyalayabilirsin.");
    }
  };

  return (
    <Button type="button" variant="ghost" onClick={share} className="h-11 rounded-full px-5 text-[0.95rem]">
      <Share2 /> Paylaş
    </Button>
  );
}
