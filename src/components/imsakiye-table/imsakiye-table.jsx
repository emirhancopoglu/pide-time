"use client";
import { cn } from "@/lib/utils";
import { useNow } from "@/lib/use-now";
import { PRAYERS, RAMAZAN_MONTH, formatShortDate, todayKey } from "@/lib/prayer-times";

export default function ImsakiyeTable({ days }) {
  // Dakikada bir yeterli; gün dönünce bugün satırı kendiliğinden kayar.
  const now = useNow(60_000);
  // İlk render'da (saat henüz yokken) da bugünden başla ki geçmiş günler bir an görünüp kaybolmasın
  const today = now ? todayKey(now) : todayKey();
  const rows = days.filter((day) => day.date >= today);
  const hasRamazan = rows.some((day) => day.hijriMonth === RAMAZAN_MONTH);

  return (
    <section className="flex flex-col gap-4" aria-labelledby="imsakiye-title">
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-1">
        <div>
          <h2 id="imsakiye-title" className="font-display text-2xl font-semibold">
            {hasRamazan ? "Ramazan imsakiyesi" : "İmsakiye"}
          </h2>
          <p className="text-muted-foreground">Önümüzdeki {rows.length} günün vakitleri</p>
        </div>
        {hasRamazan && (
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="size-2 rounded-full bg-sunset" /> Ramazan günleri
          </p>
        )}
      </div>

      <div className="overflow-hidden rounded-2xl bg-card">
        <div className="overflow-x-auto">
          <table className="figures w-full min-w-[40rem]">
            <thead>
              <tr className="border-b border-border text-sm text-muted-foreground">
                <th scope="col" className="sticky left-0 z-10 bg-card px-5 py-3.5 text-left font-medium">
                  Tarih
                </th>
                {PRAYERS.map((prayer) => (
                  <th key={prayer.key} scope="col" className="px-3 py-3.5 text-right font-medium last:pr-5">
                    {prayer.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((day) => {
                const isToday = day.date === today;
                const isRamazan = day.hijriMonth === RAMAZAN_MONTH;
                return (
                  <tr
                    key={day.date}
                    aria-current={isToday ? "date" : undefined}
                    className={cn("border-t border-border first:border-t-0", isToday && "bg-now")}
                  >
                    <th
                      scope="row"
                      className={cn(
                        "sticky left-0 z-10 px-5 py-3 text-left font-normal whitespace-nowrap",
                        isToday ? "bg-now" : "bg-card"
                      )}
                    >
                      <span className="flex items-center gap-2.5">
                        <span
                          className={cn("size-1.5 shrink-0 rounded-full", isRamazan ? "bg-sunset" : "bg-transparent")}
                          role={isRamazan ? "img" : undefined}
                          aria-label={isRamazan ? "Ramazan günü" : undefined}
                        />
                        <span className={cn(isToday && "font-semibold")}>{formatShortDate(day.date)}</span>
                        {isToday && <span className="text-sm text-accent-foreground">bugün</span>}
                      </span>
                    </th>
                    {PRAYERS.map((prayer) => (
                      <td
                        key={prayer.key}
                        className={cn(
                          "px-3 py-3 text-right last:pr-5",
                          prayer.key === "aksam" && "font-semibold text-sunset-ink",
                          prayer.key === "imsak" && "font-semibold",
                          prayer.key !== "aksam" && prayer.key !== "imsak" && !isToday && "text-muted-foreground"
                        )}
                      >
                        {day.times[prayer.key]}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
