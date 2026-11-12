"use client";
import Link from "next/link";
import { useNow } from "@/lib/use-now";
import SkyArc from "@/components/sky-arc/sky-arc";
import { TIME_ZONE, formatSpoken, getPhaseMarks, getStatus, todayKey } from "@/lib/prayer-times";

const hhmmFormatter = new Intl.DateTimeFormat("tr-TR", { timeZone: TIME_ZONE, hour: "2-digit", minute: "2-digit" });
const hhmm = (date) => hhmmFormatter.format(date);

/** Ana sayfada bir şehrin canlı durumu: gökyüzü yayı ve kalan süre. */
export default function LivePreview({ days, inPlace, href }) {
  const now = useNow();
  const status = now ? getStatus(days, now) : null;
  const today = status?.today ?? days.find((day) => day.date === todayKey()) ?? days[0];
  const isIftar = status?.phase.type !== "sahur";

  return (
    <SkyArc
      night={!isIftar}
      progress={status?.phase.progress}
      marks={status ? getPhaseMarks(days, status.phase) : []}
      start={{ label: isIftar ? "İmsak" : "İftar", time: status ? hhmm(status.phase.start) : today.times.imsak }}
      end={{ label: isIftar ? "İftar" : "İmsak", time: status ? hhmm(status.phase.target) : today.times.aksam }}
      footer={
        <Link href={href} className="flex items-baseline justify-between gap-3 hover:underline hover:underline-offset-4">
          <span>
            Şu an {inPlace} {isIftar ? "iftara" : "sahura"}{" "}
            <span className="font-semibold text-current">{status ? formatSpoken(status.phase.remaining) : "…"}</span> var
          </span>
        </Link>
      }
    />
  );
}
