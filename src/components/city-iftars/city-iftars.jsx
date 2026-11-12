"use client";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useNow } from "@/lib/use-now";
import { todayKey } from "@/lib/prayer-times";

const toMinutes = (hhmm) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};
const toHHMM = (minutes) =>
  `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;

/**
 * Bugün iftarın şehirden şehire nasıl kaydığını gösteren nokta grafiği.
 * cities: [{ name, slug, href, days: [{ date, aksam }] }]
 * current: { name, days } — varsa listede vurgulanır ve farklar ona göre yazılır
 */
export default function CityIftars({ cities, current, className }) {
  const now = useNow(60_000);
  const key = now ? todayKey(now) : todayKey();

  const rows = cities
    .map((city) => {
      const day = city.days.find((d) => d.date === key);
      return day ? { ...city, minutes: toMinutes(day.aksam), isCurrent: false } : null;
    })
    .filter(Boolean);

  if (current) {
    const day = current.days.find((d) => d.date === key);
    const existing = rows.find((row) => row.slug === current.slug);
    if (existing) existing.isCurrent = true;
    else if (day) rows.push({ name: current.name, slug: current.slug, minutes: toMinutes(day.aksam), isCurrent: true });
  }

  if (rows.length < 2) return null;
  rows.sort((a, b) => a.minutes - b.minutes);

  const first = rows[0];
  const last = rows[rows.length - 1];
  const lo = Math.floor((first.minutes - 2) / 10) * 10;
  const hi = Math.ceil((last.minutes + 2) / 10) * 10;
  const pos = (minutes) => ((minutes - lo) / (hi - lo)) * 100;
  const ticks = [];
  const step = hi - lo > 60 ? 20 : 10;
  for (let t = Math.ceil(lo / step) * step; t <= hi; t += step) ticks.push(t);

  const reference = rows.find((row) => row.isCurrent);

  return (
    <section aria-labelledby="sehir-iftar-title" className={cn("rounded-3xl bg-card p-5 sm:p-7", className)}>
      <h2 id="sehir-iftar-title" className="font-display text-2xl font-semibold">
        Türkiye&apos;de bugün iftar
      </h2>
      <p className="mt-1 text-muted-foreground">
        Güneş doğuda daha erken batar. {first.name} ile {last.name} arasında {last.minutes - first.minutes} dakika
        fark var.
      </p>

      {/* Zaman ekseni */}
      <div className="mt-6 grid grid-cols-[6.5rem_minmax(0,1fr)_4.5rem] gap-x-3 sm:grid-cols-[8rem_minmax(0,1fr)_5.5rem]">
        <span />
        <div className="figures relative h-5 text-xs text-muted-foreground" aria-hidden>
          {ticks.map((t, index) => (
            <span
              key={t}
              className={cn(
                "absolute -translate-x-1/2",
                index > 0 && index < ticks.length - 1 && "hidden sm:inline"
              )}
              style={{ left: `${pos(t)}%` }}
            >
              {toHHMM(t)}
            </span>
          ))}
        </div>
        <span />
      </div>

      <ol className="mt-1">
        {rows.map((row) => {
          const diff = reference && !row.isCurrent ? row.minutes - reference.minutes : null;
          const name = row.href ? (
            <Link href={row.href} className="truncate hover:underline hover:underline-offset-4">
              {row.name}
            </Link>
          ) : (
            <span className="truncate">{row.name}</span>
          );
          return (
            <li
              key={row.slug}
              className={cn(
                "grid grid-cols-[6.5rem_minmax(0,1fr)_4.5rem] items-center gap-x-3 rounded-xl py-2 sm:grid-cols-[8rem_minmax(0,1fr)_5.5rem]",
                row.isCurrent && "bg-now -mx-2 px-2 sm:-mx-3 sm:px-3"
              )}
            >
              <span className={cn("flex min-w-0", row.isCurrent && "font-semibold")}>{name}</span>
              <div className="relative h-5" aria-hidden>
                {ticks.map((t) => (
                  <span key={t} className="absolute inset-y-0 w-px bg-border" style={{ left: `${pos(t)}%` }} />
                ))}
                <span
                  className={cn(
                    "absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-card",
                    row.isCurrent ? "size-3.5 bg-primary ring-now" : "bg-foreground/70"
                  )}
                  style={{ left: `${pos(row.minutes)}%` }}
                />
              </div>
              <span className="figures text-right text-[0.95rem]">
                <span className={cn(row.isCurrent && "font-semibold")}>{toHHMM(row.minutes)}</span>
                {diff != null && (
                  <span className="block text-xs text-muted-foreground">
                    {diff === 0 ? "aynı" : `${diff > 0 ? "+" : "−"}${Math.abs(diff)} dk`}
                  </span>
                )}
              </span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
