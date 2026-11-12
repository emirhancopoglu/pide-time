import { cn } from "@/lib/utils";

/**
 * Pide Vakti işareti: ufukta batan bir Ramazan pidesi. Pide güneşin yerine batar;
 * üstünde parmakla bastırılmış baklava deseni ve çörek otu taneleri.
 * Ufuk çizgisi currentColor kullanır, temaya uyar.
 */
export default function Logo({ className, title }) {
  const clipAbove = "pide-logo-above";
  const clipInner = "pide-logo-inner";

  return (
    <svg
      viewBox="2 16 44 28"
      className={cn("shrink-0", className)}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <defs>
        {/* Ufkun üstünde kalan kısım (ufukla arasında 2 birimlik boşluk) */}
        <clipPath id={clipAbove}>
          <rect x="0" y="0" width="48" height="31" />
        </clipPath>
        <clipPath id={clipInner}>
          <ellipse cx="24" cy="33" rx="13.5" ry="10" />
        </clipPath>
      </defs>

      <g clipPath={`url(#${clipAbove})`}>
        {/* Kabuk */}
        <ellipse cx="24" cy="33" rx="19" ry="15" fill="#E8902E" />
        {/* Desenli iç kısım */}
        <ellipse cx="24" cy="33" rx="13.5" ry="10" fill="#F6B95A" />
        <g clipPath={`url(#${clipInner})`} stroke="#C26A1C" strokeWidth="1.7" strokeLinecap="round">
          <path d="M3 32 L21 14 M9 32 L27 14 M15 32 L33 14 M21 32 L39 14 M27 32 L45 14 M33 32 L51 14" />
          <path d="M-3 14 L15 32 M3 14 L21 32 M9 14 L27 32 M15 14 L33 32 M21 14 L39 32 M27 14 L45 32" />
        </g>
        {/* Çörek otu */}
        <g fill="#2B1B10">
          <circle cx="15" cy="29" r="1" />
          <circle cx="24" cy="26" r="1" />
          <circle cx="33" cy="29" r="1" />
        </g>
      </g>

      {/* Ufuk */}
      <rect x="3" y="33" width="42" height="3" rx="1.5" fill="currentColor" />
      <rect x="11" y="39" width="26" height="3" rx="1.5" fill="currentColor" opacity="0.35" />
    </svg>
  );
}
