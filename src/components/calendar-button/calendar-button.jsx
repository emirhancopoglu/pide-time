"use client";
import { toast } from "sonner";
import { CalendarPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toInstant, todayKey } from "@/lib/prayer-times";

const escapeText = (value) => value.replace(/\\/g, "\\\\").replace(/([,;])/g, "\\$1");
const stamp = (date) => date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

function buildCalendar(days, place) {
  const now = stamp(new Date());
  const label = escapeText(place.label);
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Pide Vakti//TR",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:${escapeText(`Pide Vakti (${place.label})`)}`,
  ];

  const events = [
    { key: "aksam", summary: "İftar", alarm: "-PT15M", alarmText: "İftara 15 dakika kaldı" },
    { key: "imsak", summary: "İmsak (sahur sonu)", alarm: "-PT30M", alarmText: "Sahurun bitmesine 30 dakika kaldı" },
  ];

  for (const day of days.filter((d) => d.date >= todayKey())) {
    for (const event of events) {
      const start = toInstant(day, event.key);
      const end = new Date(start.getTime() + 15 * 60 * 1000);
      lines.push(
        "BEGIN:VEVENT",
        `UID:${day.date}-${event.key}-${place.ilSlug}-${place.ilceSlug}@pidevakti`,
        `DTSTAMP:${now}`,
        `DTSTART:${stamp(start)}`,
        `DTEND:${stamp(end)}`,
        `SUMMARY:${escapeText(event.summary)} ${day.times[event.key]}`,
        `LOCATION:${label}`,
        "BEGIN:VALARM",
        "ACTION:DISPLAY",
        `DESCRIPTION:${escapeText(event.alarmText)}`,
        `TRIGGER:${event.alarm}`,
        "END:VALARM",
        "END:VEVENT"
      );
    }
  }

  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}

export default function CalendarButton({ days, place }) {
  const download = () => {
    const blob = new Blob([buildCalendar(days, place)], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `pide-vakti-${place.ilSlug}-${place.ilceSlug}.ics`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    toast.success("Takvim dosyası indirildi", {
      description: "Dosyayı açınca iftar ve imsak vakitleri takvimine eklenir.",
    });
  };

  return (
    <Button type="button" variant="ghost" onClick={download} className="h-11 rounded-full px-5 text-[0.95rem]">
      <CalendarPlus /> Takvime ekle
    </Button>
  );
}
