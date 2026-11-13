import { cn } from "@/lib/utils";
import { PRAYERS, formatRelative } from "@/lib/prayer-times";

export default function TodayTimes({ today, status }) {
  return (
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
              className={cn("relative px-4 py-4 sm:px-5 sm:py-5", isCurrent ? "bg-now" : "bg-card")}
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
              <p
                className={cn(
                  "figures mt-1 min-h-5 text-sm leading-snug",
                  isCurrent ? "text-accent-foreground" : "text-muted-foreground"
                )}
              >
                {isCurrent ? "şu an" : isNext ? `${formatRelative(status.next.remaining)} sonra` : ""}
              </p>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
