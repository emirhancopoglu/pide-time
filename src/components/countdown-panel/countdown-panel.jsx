"use client";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { useNow } from "@/lib/use-now";
import { saveLastLocation } from "@/lib/last-location";
import SkyArc from "@/components/sky-arc/sky-arc";
import ReminderButton from "@/components/reminder-button/reminder-button";
import ShareButton from "@/components/share-button/share-button";
import CalendarButton from "@/components/calendar-button/calendar-button";
import {
  PRAYERS,
  RAMAZAN_MONTH,
  TIME_ZONE,
  formatDuration,
  formatRelative,
  formatSpoken,
  getPhaseMarks,
  getStatus,
  todayKey,
} from "@/lib/prayer-times";

const hhmmFormatter = new Intl.DateTimeFormat("tr-TR", {
  timeZone: TIME_ZONE,
  hour: "2-digit",
  minute: "2-digit",
});
const hhmm = (date) => hhmmFormatter.format(date);

const AFTER_IFTAR_MS = 45 * 60 * 1000;

function dayWord(at, now) {
  const diff = Math.round(
    (new Date(`${todayKey(at)}T00:00:00Z`) - new Date(`${todayKey(now)}T00:00:00Z`)) / 86_400_000
  );
  return diff === 0 ? "bugün" : diff === 1 ? "yarın" : "";
}

function Fact({ label, time, note, highlight }) {
  return (
    <div className="flex flex-col">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className={cn("figures font-display text-4xl font-semibold", highlight && "text-sunset-ink")}>{time}</dd>
      <dd className="figures mt-0.5 h-5 text-sm text-muted-foreground">{note}</dd>
    </div>
  );
}

/**
 * place: { il, ilce, ilSlug, ilceSlug, label }
 * label: ekranda gösterilecek ad ("Kartal, İstanbul" ya da "Ankara")
 */
export default function CountdownPanel({ days, place }) {
  const now = useNow();
  const status = now ? getStatus(days, now) : null;

  // Baktığı yeri hatırla (ana sayfada "Son baktığın yer" olarak çıkar)
  useEffect(() => {
    saveLastLocation({
      il: { name: place.il, slug: place.ilSlug },
      ilce: { name: place.ilce, slug: place.ilceSlug },
    });
  }, [place.il, place.ilSlug, place.ilce, place.ilceSlug]);

  // Sekme başlığında geri sayım
  useEffect(() => {
    if (!status) return;
    const label = status.phase.type === "iftar" ? "İftara" : "Sahura";
    const previous = document.title;
    document.title = `${label} ${formatDuration(status.phase.remaining)} | ${place.label}`;
    return () => {
      document.title = previous;
    };
  });

  const fallbackDay = days.find((day) => day.date === todayKey()) ?? days[0];
  const today = status?.today ?? fallbackDay;

  if (now && !status) {
    return (
      <p className="rounded-2xl bg-card p-6 text-muted-foreground">
        Bugünün vakitleri henüz yayımlanmadı. Diyanet yeni ayın verisini yayımlayınca burada görünecek.
      </p>
    );
  }

  const isIftar = status?.phase.type !== "sahur";
  const isRamazan = today.hijriMonth === RAMAZAN_MONTH;
  const justBroke = status && isRamazan && !isIftar && now - status.phase.start < AFTER_IFTAR_MS;
  const phaseWord = isIftar ? "İftara" : "Sahura";

  let headline = `İftar ${today.times.aksam}`;
  let subline = " ";
  if (status) {
    headline = justBroke ? "Hayırlı iftarlar." : `${phaseWord} ${formatSpoken(status.phase.remaining)} var.`;
    subline = justBroke
      ? `Sahura ${formatSpoken(status.phase.remaining)} var.`
      : formatDuration(status.phase.remaining);
  }

  const marks = status ? getPhaseMarks(days, status.phase) : [];
  const next = status?.next;

  return (
    <div className="flex flex-col gap-10">
      <section className="grid gap-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-12">
        <div className="flex min-w-0 flex-col justify-between gap-8">
          <div>
            <h1 className="font-display font-semibold">
              <span className="block text-lg font-medium text-muted-foreground sm:text-xl">{place.label}</span>
              <span className="mt-3 block text-[clamp(2.75rem,7.5vw,5.75rem)] leading-[0.98] tracking-[-0.035em] text-balance">
                {headline}
              </span>
            </h1>
            <p className="figures mt-4 text-2xl text-muted-foreground" aria-hidden={!justBroke}>
              {subline}
            </p>
          </div>

          <div className="flex flex-col gap-6">
            <dl className="grid grid-cols-2 gap-6 border-t border-border pt-6 sm:max-w-md">
              <Fact
                label="İftar"
                time={status ? hhmm(status.iftar.at) : today.times.aksam}
                note={status ? `${dayWord(status.iftar.at, now)}, ${formatRelative(status.iftar.remaining)} sonra` : ""}
                highlight
              />
              <Fact
                label="Sahur"
                time={status ? hhmm(status.sahur.at) : today.times.imsak}
                note={status ? `${dayWord(status.sahur.at, now)}, ${formatRelative(status.sahur.remaining)} sonra` : ""}
              />
            </dl>
            <div className="flex flex-wrap items-center gap-2">
              <ReminderButton iftarAt={status?.iftar.at} sahurAt={status?.sahur.at} placeName={place.label} />
              <CalendarButton days={days} place={place} />
              <ShareButton title={`${place.label} iftar ve sahur vakitleri`} />
            </div>
          </div>
        </div>

        <SkyArc
          night={!isIftar}
          progress={status?.phase.progress}
          marks={marks}
          start={{
            label: isIftar ? "İmsak" : "İftar",
            time: status ? hhmm(status.phase.start) : today.times.imsak,
          }}
          end={{
            label: isIftar ? "İftar" : "İmsak",
            time: status ? hhmm(status.phase.target) : today.times.aksam,
          }}
          footer={
            next
              ? `Sıradaki vakit ${next.label.toLocaleLowerCase("tr")}, ${hhmm(next.at)} (${formatRelative(next.remaining)} sonra)`
              : " "
          }
          className="lg:self-stretch"
        />
      </section>

      <section aria-labelledby="bugun-title">
        <h2 id="bugun-title" className="font-display text-2xl font-semibold">
          Bugünün vakitleri
        </h2>
        <ol className="mt-4 grid grid-cols-3 gap-px overflow-hidden rounded-2xl bg-border lg:grid-cols-6">
          {PRAYERS.map((prayer) => {
            const isCurrent = status?.currentKey === prayer.key;
            const isNext = status && !status.next.tomorrow && status.next.key === prayer.key;
            return (
              <li
                key={prayer.key}
                aria-current={isCurrent ? "time" : undefined}
                className={cn(
                  "relative px-4 py-4 sm:px-5 sm:py-5",
                  isCurrent ? "bg-now" : "bg-card"
                )}
              >
                {isCurrent && <span aria-hidden className="absolute inset-x-0 top-0 h-[3px] bg-primary" />}
                <p className="flex items-baseline gap-1.5">
                  <span className="font-medium">{prayer.label}</span>
                  {prayer.hint && (
                    <span className="hidden text-sm text-muted-foreground sm:inline">
                      {prayer.hint.toLocaleLowerCase("tr")}
                    </span>
                  )}
                </p>
                <p
                  className={cn(
                    "figures mt-1 font-display text-[1.75rem] leading-tight font-semibold sm:text-3xl",
                    prayer.key === "aksam" && "text-sunset-ink"
                  )}
                >
                  {today.times[prayer.key]}
                </p>
                <p className={cn("figures mt-1 min-h-5 text-sm leading-snug", isCurrent ? "text-accent-foreground" : "text-muted-foreground")}>
                  {isCurrent ? "şu an" : isNext ? `${formatRelative(status.next.remaining)} sonra` : ""}
                </p>
              </li>
            );
          })}
        </ol>
      </section>
    </div>
  );
}
