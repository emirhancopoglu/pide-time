"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useNow } from "@/lib/use-now";
import { readLastLocation, saveLastLocation } from "@/lib/last-location";
import { timeLocative } from "@/lib/turkish";
import {
  PRAYERS,
  TIME_ZONE,
  formatSpoken,
  getPhaseMarks,
  getStatus,
  splitDuration,
  toInstant,
  todayKey,
} from "@/lib/prayer-times";
import SkyArc from "@/components/sky-arc/sky-arc";
import PlaceSwitcher from "@/components/place-switcher/place-switcher";

const timeFormatter = new Intl.DateTimeFormat("tr-TR", { timeZone: TIME_ZONE, hour: "2-digit", minute: "2-digit" });
const hhmm = (date) => timeFormatter.format(date);

const dateFormatter = new Intl.DateTimeFormat("tr-TR", {
  timeZone: TIME_ZONE,
  day: "numeric",
  month: "long",
  year: "numeric",
  weekday: "long",
});
/** "13 Kasım 2026, Cuma" */
function formatToday(now) {
  const parts = Object.fromEntries(dateFormatter.formatToParts(now).map((part) => [part.type, part.value]));
  return `${parts.day} ${parts.month} ${parts.year}, ${parts.weekday}`;
}

/** Şu andan sonraki vakitler (bugün ve yarın). */
function upcomingTimes(days, now, count) {
  const index = days.findIndex((day) => day.date === todayKey(now));
  if (index === -1) return [];
  const list = [];
  for (const day of days.slice(index, index + 2)) {
    for (const prayer of PRAYERS) {
      const at = toInstant(day, prayer.key);
      if (at > now) list.push({ id: `${day.date}-${prayer.key}`, label: prayer.label, at });
    }
  }
  return list.slice(0, count);
}

/** "06:15'te" — saat kalın, ek düz */
function At({ time }) {
  return (
    <>
      <strong className="font-semibold text-foreground">{time}</strong>&apos;{timeLocative(time)}
    </>
  );
}

function Unit({ value, unit, accent }) {
  return (
    <span className="inline-flex items-baseline gap-1.5">
      <span className={cn("text-[clamp(3.75rem,10vw,7.5rem)]", accent && "text-primary")}>{value}</span>
      <span className="text-lg font-medium tracking-normal text-muted-foreground sm:text-xl">{unit}</span>
    </span>
  );
}

const UPCOMING_COUNT = 3;

/**
 * Ana sayfanın üst bölümü: seçili konum için canlı geri sayım ve gökyüzü kartı.
 * initial: { place, days } | null — sunucuda yüklenen varsayılan konum
 * cities: hızlı geçiş için [[ad, slug]]
 */
export default function HomeHero({ initial, cities }) {
  const [data, setData] = useState(initial);
  const [pending, setPending] = useState(false);
  const requestRef = useRef(0);
  const now = useNow();

  const select = useCallback(async (ilSlug, ilceSlug, { quiet = false } = {}) => {
    const id = ++requestRef.current;
    setPending(true);
    try {
      const params = new URLSearchParams({ il: ilSlug });
      if (ilceSlug) params.set("ilce", ilceSlug);
      const response = await fetch(`/api/vakitler?${params}`);
      const body = await response.json().catch(() => null);
      if (!response.ok || !body?.days) throw new Error(body?.error ?? "Vakitler alınamadı.");
      if (id !== requestRef.current) return;
      setData(body);
      saveLastLocation({ il: body.place.il, ilce: body.place.ilce });
    } catch (error) {
      if (id === requestRef.current && !quiet) toast.error(error.message);
      error.handled = true;
      throw error;
    } finally {
      if (id === requestRef.current) setPending(false);
    }
  }, []);

  // Daha önce bakılan bir yer varsa onunla aç
  useEffect(() => {
    const last = readLastLocation();
    if (!last) return;
    const place = initial?.place;
    if (place && place.il.slug === last.il.slug && place.ilce.slug === last.ilce.slug) return;
    select(last.il.slug, last.ilce.slug, { quiet: true }).catch(() => {});
  }, [initial, select]);

  const days = data?.days ?? [];
  const place = data?.place ?? null;
  const status = now && days.length ? getStatus(days, now) : null;
  const missingToday = Boolean(now && days.length && !status);
  const isIftar = status ? status.phase.type === "iftar" : true;
  const today = status?.today ?? days.find((day) => day.date === todayKey()) ?? days[0];

  const remaining = status ? splitDuration(status.phase.remaining) : null;
  const upcoming = status ? upcomingTimes(days, now, UPCOMING_COUNT) : [];
  const muted = isIftar ? "text-day-sky-muted" : "text-night-sky-muted";

  let summary = " ";
  if (status) {
    const target = hhmm(status.phase.target);
    const start = hhmm(status.phase.start);
    summary = isIftar ? (
      <>
        İftar <At time={target} />. Oruç bugün <At time={start} /> başladı.
      </>
    ) : (
      <>
        İmsak <At time={target} />. {todayKey(status.phase.start) === todayKey(now) ? "Bugün" : "Dün"} iftar{" "}
        <At time={start} /> açıldı.
      </>
    );
  } else if (missingToday) {
    summary = "Bu konum için bugünün vakitleri henüz yayımlanmadı.";
  } else if (!days.length) {
    summary = "Vakitler şu an alınamadı. Aşağıdan bir konum seçebilirsin.";
  }

  return (
    <section
      className={cn(
        "grid gap-8 pt-8 sm:pt-12 lg:gap-12",
        today && "lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]"
      )}
    >
      <div className="flex min-w-0 flex-col">
        <div className={cn("transition-opacity", pending && "opacity-50")} aria-busy={pending}>
          <p className="figures min-h-5 text-sm text-muted-foreground">
            {now ? `${formatToday(now)} · Şu an ${hhmm(now)}` : " "}
          </p>
          <h1 className="mt-2 font-display text-[clamp(2.25rem,5vw,3.75rem)] leading-[1.02] font-semibold tracking-[-0.03em] text-balance">
            {isIftar ? "İftara" : "Sahura"} ne kadar kaldı?
          </h1>

          {days.length > 0 && !missingToday && (
            <p
              role="timer"
              aria-label={status ? `${formatSpoken(status.phase.remaining)} kaldı` : undefined}
              className="figures mt-5 flex flex-wrap items-baseline gap-x-4 font-display leading-[0.9] font-semibold tracking-[-0.045em] sm:gap-x-6"
            >
              <Unit value={remaining?.hours ?? "––"} unit="sa" />
              <Unit value={remaining?.minutes ?? "––"} unit="dk" />
              <Unit value={remaining?.seconds ?? "––"} unit="sn" accent />
            </p>
          )}

          <p className="figures mt-5 min-h-7 text-lg text-pretty text-muted-foreground">{summary}</p>
        </div>

        <div className="mt-8">
          <PlaceSwitcher place={place} cities={cities} onSelect={select} pending={pending} />
        </div>
      </div>

      {today && (
        <SkyArc
          night={!isIftar}
          progress={status?.phase.progress}
          marks={status ? getPhaseMarks(days, status.phase) : []}
          start={{
            label: isIftar ? "İmsak" : "İftar",
            time: status ? hhmm(status.phase.start) : today.times.imsak,
          }}
          end={{
            label: isIftar ? "İftar" : "İmsak",
            time: status ? hhmm(status.phase.target) : today.times.aksam,
          }}
          header={
            <div className="mb-2 flex items-baseline justify-between gap-3">
              <p className="font-display text-lg font-semibold">{isIftar ? "Bugün" : "Bu gece"}</p>
              {status && (
                <p className={cn("figures text-sm font-semibold", isIftar ? "text-sunset-ink" : "text-moon")}>
                  %{Math.floor(status.phase.progress * 100)} geçti
                </p>
              )}
            </div>
          }
          fit
          className={cn("transition-opacity", pending && "opacity-50")}
        >
          <ol
            aria-label="Sıradaki vakitler"
            className={cn(
              "figures mt-4 flex flex-col gap-1 border-t pt-4",
              isIftar ? "border-day-sky-foreground/10" : "border-night-sky-foreground/15"
            )}
          >
            {Array.from({ length: UPCOMING_COUNT }, (_, index) => {
              const item = upcoming[index];
              const first = index === 0;
              return (
                <li
                  key={item?.id ?? index}
                  className={cn(
                    "flex items-center justify-between gap-3 rounded-xl border px-3.5 py-2.5",
                    first && item
                      ? isIftar
                        ? "border-day-sky-foreground/25 bg-day-sky-foreground/5"
                        : "border-night-sky-foreground/25 bg-night-sky-foreground/5"
                      : "border-transparent"
                  )}
                >
                  <span className="min-w-0">
                    <span className="font-medium">{item?.label ?? " "}</span>
                    {first && item && <span className={cn("text-sm", muted)}> · sıradaki</span>}
                  </span>
                  <span className="font-display text-lg font-semibold">{item ? hhmm(item.at) : ""}</span>
                </li>
              );
            })}
          </ol>
        </SkyArc>
      )}
    </section>
  );
}
