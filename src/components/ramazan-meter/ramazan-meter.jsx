"use client";
import { cn } from "@/lib/utils";
import { useNow } from "@/lib/use-now";
import { RAMAZAN_MONTH, daysBetween, findNextRamazan, formatLongDate, todayKey } from "@/lib/prayer-times";

const RAMAZAN_DAYS = 30;

/** Ramazan'daysa kaçıncı gün olduğunu, değilse Ramazan'a kalan günü gösterir. */
export default function RamazanMeter({ days }) {
  const now = useNow(60_000);
  if (!now) return <div className="h-[7.5rem]" aria-hidden />;

  const key = todayKey(now);
  const today = days.find((day) => day.date === key);

  if (today?.hijriMonth === RAMAZAN_MONTH) {
    const dayNo = parseInt(today.hijri, 10);
    return (
      <section aria-labelledby="ramazan-title" className="rounded-2xl bg-card p-5 sm:p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
          <h2 id="ramazan-title" className="font-display text-xl font-semibold sm:text-2xl">
            Ramazan&apos;ın {dayNo}. günü
          </h2>
          <p className="text-muted-foreground">
            {dayNo >= 29 ? "Bayram yaklaşıyor" : `Bayrama yaklaşık ${RAMAZAN_DAYS - dayNo} gün`}
          </p>
        </div>
        <ol className="mt-4 grid grid-cols-[repeat(30,minmax(0,1fr))] gap-[3px]" aria-label={`30 günün ${dayNo}. günü`}>
          {Array.from({ length: RAMAZAN_DAYS }, (_, index) => (
            <li
              key={index}
              className={cn(
                "h-6 rounded-[3px]",
                index + 1 < dayNo && "bg-primary",
                index + 1 === dayNo && "bg-sunset",
                index + 1 > dayNo && "bg-secondary"
              )}
            />
          ))}
        </ol>
      </section>
    );
  }

  const next = findNextRamazan(days, key);
  if (!next) return null;
  const remaining = daysBetween(key, next.date);

  return (
    <section
      aria-labelledby="ramazan-title"
      className="flex flex-col gap-1 rounded-2xl bg-card p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6"
    >
      <h2 id="ramazan-title" className="font-display text-xl font-semibold sm:text-2xl">
        Ramazan&apos;a {next.exact ? "" : "yaklaşık "}
        <span className="figures">{remaining}</span> gün var
      </h2>
      <p className="text-muted-foreground">
        {next.exact ? "Diyanet takvimine göre" : "Tahmini başlangıç"} {formatLongDate(next.date)}
      </p>
    </section>
  );
}
