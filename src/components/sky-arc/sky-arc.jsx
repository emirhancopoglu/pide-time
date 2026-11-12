import { cn } from "@/lib/utils";

// Yay geometrisi (viewBox birimleri)
const CX = 160;
const HORIZON = 150;
const R = 128;

const pointAt = (t) => ({
  x: CX - R * Math.cos(Math.PI * t),
  y: HORIZON - R * Math.sin(Math.PI * t),
});

const arcTo = (t) => {
  const p = pointAt(t);
  return `M ${CX - R} ${HORIZON} A ${R} ${R} 0 0 1 ${p.x.toFixed(2)} ${p.y.toFixed(2)}`;
};

/**
 * Fazın gökyüzü kartı. Oruç fazında yay imsaktan iftara uzanır ve üstünde güneş,
 * gece fazında iftardan imsaka uzanır ve üstünde ay ilerler. Kartın rengi fazı gösterir.
 *
 * marks: fazın içine düşen diğer vakitler [{ key, label, t }]
 */
export default function SkyArc({ night, progress, marks = [], start, end, footer, className }) {
  const t = Math.min(1, Math.max(0, progress ?? 0));
  const body = pointAt(t);

  return (
    <figure
      className={cn(
        "relative flex flex-col overflow-hidden rounded-3xl p-5 sm:p-6",
        night ? "bg-night-sky text-night-sky-foreground" : "bg-day-sky text-day-sky-foreground",
        className,
      )}
    >
      <div className="flex flex-1 items-center">
        <svg viewBox="0 0 320 168" className="block h-auto w-full" aria-hidden>
          {/* Ufuk */}
          <line x1="8" x2="312" y1={HORIZON} y2={HORIZON} stroke="currentColor" strokeOpacity="0.18" strokeWidth="1" />

          {/* Kalan yol */}
          <path
            d={arcTo(1)}
            fill="none"
            stroke="currentColor"
            strokeOpacity="0.22"
            strokeWidth="1.5"
            strokeDasharray="2 5"
            strokeLinecap="round"
          />
          {/* Geçilen yol */}
          {progress != null && t > 0 && (
            <path
              d={arcTo(t)}
              fill="none"
              stroke={night ? "var(--moon)" : "var(--sunset)"}
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          )}

          {/* Ara vakitler */}
          {marks.map((mark) => {
            const p = pointAt(mark.t);
            const passed = mark.t <= t;
            return (
              <g key={`${mark.key}-${mark.t}`}>
                <circle
                  cx={p.x}
                  cy={p.y}
                  r="3.5"
                  fill={night ? "var(--night-sky)" : "var(--day-sky)"}
                  stroke="currentColor"
                  strokeOpacity={passed ? 0.9 : 0.4}
                  strokeWidth="1.5"
                />
                {/* Etiket yayın iç tarafına, merkeze doğru yazılır ki çizgiye binmesin */}
                <text
                  x={mark.t < 0.4 ? p.x + 9 : mark.t > 0.6 ? p.x - 9 : p.x}
                  y={mark.t < 0.4 || mark.t > 0.6 ? p.y + 4 : p.y + 18}
                  textAnchor={mark.t < 0.4 ? "start" : mark.t > 0.6 ? "end" : "middle"}
                  fontSize="10"
                  fill="currentColor"
                  fillOpacity="0.6"
                >
                  {mark.label}
                </text>
              </g>
            );
          })}

          {/* Güneş ya da ay */}
          {progress != null &&
            (night ? (
              <g>
                <circle cx={body.x} cy={body.y} r="16" fill="var(--moon)" fillOpacity="0.12" />
                <circle cx={body.x} cy={body.y} r="8.5" fill="var(--moon)" />
                <circle cx={body.x + 4} cy={body.y - 3} r="7" fill="var(--night-sky)" />
              </g>
            ) : (
              <g>
                <circle cx={body.x} cy={body.y} r="18" fill="var(--sunset)" fillOpacity="0.16" />
                <circle cx={body.x} cy={body.y} r="9" fill="var(--sunset)" />
              </g>
            ))}
        </svg>
      </div>

      <figcaption className="figures mt-1 flex items-start justify-between gap-3">
        <span>
          <span className={cn("block text-sm", night ? "text-night-sky-muted" : "text-day-sky-muted")}>
            {start.label}
          </span>
          <span className="block font-display text-2xl font-semibold">{start.time}</span>
        </span>
        <span className="text-right">
          <span className={cn("block text-sm", night ? "text-night-sky-muted" : "text-day-sky-muted")}>
            {end.label}
          </span>
          <span className="block font-display text-2xl font-semibold">{end.time}</span>
        </span>
      </figcaption>

      {footer && (
        <p
          className={cn(
            "mt-4 border-t pt-4 text-[0.95rem]",
            night
              ? "border-night-sky-foreground/15 text-night-sky-muted"
              : "border-day-sky-foreground/10 text-day-sky-muted",
          )}
        >
          {footer}
        </p>
      )}
    </figure>
  );
}
