"use client";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useNow } from "@/lib/use-now";
import { RAMAZAN_MONTH, formatShortDate, toInstant, todayKey } from "@/lib/prayer-times";

const formatMinutes = (total) => {
  const h = Math.floor(total / 60);
  const m = Math.round(total % 60);
  return m === 0 ? `${h} sa` : `${h} sa ${m} dk`;
};

/** Önümüzdeki günlerde oruç süresi (imsak → iftar). Tek seri: çizgi + %10 alan. */
export default function FastingChart({ days, className }) {
  const now = useNow(60_000);
  const plotRef = useRef(null);
  const [active, setActive] = useState(null);

  const key = now ? todayKey(now) : todayKey();
  const points = days
    .filter((day) => day.date >= key)
    .map((day) => ({
      date: day.date,
      imsak: day.times.imsak,
      aksam: day.times.aksam,
      ramazan: day.hijriMonth === RAMAZAN_MONTH,
      minutes: (toInstant(day, "aksam") - toInstant(day, "imsak")) / 60000,
    }));

  if (points.length < 2) return null;

  const values = points.map((p) => p.minutes);
  const min = Math.min(...values);
  const max = Math.max(...values);
  let lo = Math.floor((min - 3) / 10) * 10;
  let hi = Math.ceil((max + 3) / 10) * 10;
  if (hi - lo < 30) {
    const pad = (30 - (hi - lo)) / 2;
    lo -= Math.ceil(pad / 10) * 10;
    hi += Math.ceil(pad / 10) * 10;
  }
  const ticks = [lo, (lo + hi) / 2, hi];

  const n = points.length;
  const x = (i) => (i / (n - 1)) * 100;
  const y = (minutes) => ((hi - minutes) / (hi - lo)) * 100;
  const line = points.map((p, i) => `${x(i).toFixed(2)},${y(p.minutes).toFixed(2)}`).join(" ");
  const area = `M0,100 L${line.replaceAll(" ", " L")} L100,100 Z`;

  const first = points[0];
  const last = points[n - 1];
  const change = Math.round(last.minutes - first.minutes);
  const trend =
    change === 0
      ? `${n} gün boyunca aynı kalıyor.`
      : `${n} gün içinde ${Math.abs(change)} dakika ${change < 0 ? "kısalıyor" : "uzuyor"}.`;

  // Ramazan günlerini arka planda bant olarak göster
  const ramazanStart = points.findIndex((p) => p.ramazan);
  const ramazanEnd = points.findLastIndex((p) => p.ramazan);

  const pickIndex = (clientX) => {
    const rect = plotRef.current?.getBoundingClientRect();
    if (!rect) return;
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    setActive(Math.round(ratio * (n - 1)));
  };

  const onKeyDown = (event) => {
    if (event.key === "ArrowRight") setActive((i) => Math.min(n - 1, (i ?? -1) + 1));
    else if (event.key === "ArrowLeft") setActive((i) => Math.max(0, (i ?? 1) - 1));
    else if (event.key === "Home") setActive(0);
    else if (event.key === "End") setActive(n - 1);
    else return;
    event.preventDefault();
  };

  const shown = active != null ? points[active] : null;

  return (
    <section aria-labelledby="oruc-title" className={cn("flex flex-col rounded-3xl bg-card p-5 sm:p-7", className)}>
      <h2 id="oruc-title" className="font-display text-2xl font-semibold">
        Oruç süresi
      </h2>
      <p className="mt-1 text-muted-foreground">
        Bugün {formatMinutes(first.minutes)}. {trend}
      </p>

      <div className="mt-7 flex flex-1 flex-col">
        <div className="relative min-h-56 flex-1 sm:min-h-64">
          {/* Izgara ve etiketler */}
          {ticks.map((t) => (
            <div
              key={t}
              className="pointer-events-none absolute inset-x-0 border-t border-border"
              style={{ top: `${y(t)}%` }}
              aria-hidden
            >
              <span className="figures absolute -top-5 left-0 text-xs text-muted-foreground">{formatMinutes(t)}</span>
            </div>
          ))}

          {ramazanStart !== -1 && (
            <div
              className="pointer-events-none absolute inset-y-0 bg-sunset/10"
              style={{ left: `${x(ramazanStart)}%`, width: `${Math.max(x(ramazanEnd) - x(ramazanStart), 1)}%` }}
              aria-hidden
            >
              <span className="absolute top-1 left-2 text-xs text-muted-foreground">Ramazan</span>
            </div>
          )}

          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 size-full overflow-visible" aria-hidden>
            <path d={area} fill="var(--primary)" fillOpacity="0.1" />
            <polyline
              points={line}
              fill="none"
              stroke="var(--primary)"
              strokeWidth="2"
              strokeLinejoin="round"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          {/* Bugün ve son gün noktaları */}
          {[0, n - 1].map((i) => (
            <span
              key={i}
              aria-hidden
              className="pointer-events-none absolute size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary ring-2 ring-card"
              style={{ left: `${x(i)}%`, top: `${y(points[i].minutes)}%` }}
            />
          ))}

          {/* Etkileşim katmanı: imleç en yakın güne oturur */}
          <div
            ref={plotRef}
            role="slider"
            tabIndex={0}
            aria-label="Günlere göre oruç süresi"
            aria-valuemin={0}
            aria-valuemax={n - 1}
            aria-valuenow={active ?? 0}
            aria-valuetext={
              shown ? `${formatShortDate(shown.date)}: ${formatMinutes(shown.minutes)}` : `Bugün: ${formatMinutes(first.minutes)}`
            }
            className="absolute inset-0 cursor-crosshair rounded-md"
            onPointerMove={(event) => pickIndex(event.clientX)}
            onPointerDown={(event) => pickIndex(event.clientX)}
            onPointerLeave={() => setActive(null)}
            onFocus={() => setActive((i) => i ?? 0)}
            onBlur={() => setActive(null)}
            onKeyDown={onKeyDown}
          />

          {shown && (
            <>
              <span
                aria-hidden
                className="pointer-events-none absolute inset-y-0 w-px bg-foreground/40"
                style={{ left: `${x(active)}%` }}
              />
              <span
                aria-hidden
                className="pointer-events-none absolute size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary ring-2 ring-card"
                style={{ left: `${x(active)}%`, top: `${y(shown.minutes)}%` }}
              />
              <div
                aria-hidden
                className={cn(
                  "pointer-events-none absolute top-0 z-10 w-max rounded-xl bg-popover px-3 py-2 text-sm shadow-lg ring-1 ring-border",
                  x(active) > 60 ? "-translate-x-[calc(100%+10px)]" : "translate-x-[10px]"
                )}
                style={{ left: `${x(active)}%` }}
              >
                <p className="figures text-base font-semibold">{formatMinutes(shown.minutes)}</p>
                <p className="text-muted-foreground">{active === 0 ? "Bugün" : formatShortDate(shown.date)}</p>
                <p className="figures text-muted-foreground">
                  İmsak {shown.imsak}, iftar {shown.aksam}
                </p>
              </div>
            </>
          )}
        </div>

        <div className="figures mt-2 flex justify-between text-xs text-muted-foreground" aria-hidden>
          <span>Bugün</span>
          <span>{formatShortDate(points[Math.floor((n - 1) / 2)].date)}</span>
          <span>{formatShortDate(last.date)}</span>
        </div>
      </div>

      <table className="sr-only">
        <caption>Günlere göre oruç süresi</caption>
        <thead>
          <tr>
            <th scope="col">Tarih</th>
            <th scope="col">Süre</th>
          </tr>
        </thead>
        <tbody>
          {points.map((p) => (
            <tr key={p.date}>
              <th scope="row">{formatShortDate(p.date)}</th>
              <td>{formatMinutes(p.minutes)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
