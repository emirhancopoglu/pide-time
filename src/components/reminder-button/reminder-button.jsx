"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Bell, BellRing } from "lucide-react";
import { Button } from "@/components/ui/button";

const KEY = "pide-vakti:reminder";
const LEAD_MS = 15 * 60 * 1000;

function readEnabled() {
  try {
    return localStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}

function writeEnabled(value) {
  try {
    if (value) localStorage.setItem(KEY, "1");
    else localStorage.removeItem(KEY);
  } catch {
  }
}

export default function ReminderButton({ iftarAt, sahurAt, placeName }) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const supported = typeof window !== "undefined" && "Notification" in window;
    setEnabled(supported && Notification.permission === "granted" && readEnabled());
  }, []);

  const iftarKey = iftarAt ? Math.floor(iftarAt.getTime() / 60000) : null;
  const sahurKey = sahurAt ? Math.floor(sahurAt.getTime() / 60000) : null;

  useEffect(() => {
    if (!enabled || iftarKey == null || sahurKey == null) return;
    const now = Date.now();
    const timers = [
      [iftarKey * 60000, "İftara 15 dakika kaldı"],
      [sahurKey * 60000, "Sahurun bitmesine 15 dakika kaldı"],
    ]
      .map(([at, title]) => [at - LEAD_MS - now, title])
      .filter(([delay]) => delay > 0 && delay < 2 ** 31 - 1)
      .map(([delay, title]) =>
        setTimeout(() => {
          try {
            new Notification(title, { body: placeName, tag: title });
          } catch {
            toast(title, { description: placeName });
          }
        }, delay)
      );
    return () => timers.forEach(clearTimeout);
  }, [enabled, iftarKey, sahurKey, placeName]);

  const toggle = async () => {
    if (enabled) {
      writeEnabled(false);
      setEnabled(false);
      toast("Hatırlatma kapatıldı");
      return;
    }
    if (!("Notification" in window)) {
      toast.error("Bu tarayıcı bildirimleri desteklemiyor.");
      return;
    }
    const permission =
      Notification.permission === "granted" ? "granted" : await Notification.requestPermission();
    if (permission !== "granted") {
      toast.error("Bildirim izni verilmedi. İzni tarayıcının site ayarlarından açabilirsin.");
      return;
    }
    writeEnabled(true);
    setEnabled(true);
    toast.success("Hatırlatma açıldı", {
      description: "Bu sekme açık kaldıkça iftardan ve sahurdan 15 dakika önce bildirim gelir.",
    });
  };

  return (
    <Button
      type="button"
      variant={enabled ? "default" : "outline"}
      aria-pressed={enabled}
      onClick={toggle}
      className="h-11 rounded-full px-5 text-[0.95rem]"
    >
      {enabled ? <BellRing /> : <Bell />}
      {enabled ? "Hatırlatma açık" : "15 dk önce hatırlat"}
    </Button>
  );
}
