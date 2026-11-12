import Link from "next/link";
import AccordionComponent from "@/components/accordion/accordion";
import LivePreview from "@/components/live-preview/live-preview";
import LocationPicker from "@/components/location-picker/location-picker";
import { getIlceler, getIller, getVakitler } from "@/lib/diyanet";
import { findCenterDistrict } from "@/lib/turkish";

export const metadata = {
  title: "Konum seç",
};

// Önizleme verisi 6 saatte bir yenilenir; geri sayım tarayıcıda hesaplanır.
export const revalidate = 21600;

const CITIES = [
  ["İstanbul", "istanbul"],
  ["Ankara", "ankara"],
  ["İzmir", "izmir"],
  ["Bursa", "bursa"],
  ["Antalya", "antalya"],
  ["Konya", "konya"],
  ["Adana", "adana"],
  ["Gaziantep", "gaziantep"],
  ["Kocaeli", "kocaeli"],
  ["Diyarbakır", "diyarbakir"],
];

async function loadPreview() {
  try {
    const iller = await getIller();
    const il = iller.find((item) => item.slug === "istanbul");
    if (!il) return null;
    const center = findCenterDistrict(il, await getIlceler(il.id));
    if (!center) return null;
    const days = await getVakitler(center.id);
    return days.length ? { days, href: `/${il.slug}/${center.slug}` } : null;
  } catch {
    return null;
  }
}

export default async function Page() {
  const preview = await loadPreview();

  return (
    <>
      <section className="grid gap-10 pt-10 sm:pt-16 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-14">
        <div className="min-w-0">
          <h1 className="font-display text-[clamp(2.75rem,7vw,5.5rem)] leading-[0.98] font-semibold tracking-[-0.035em] text-balance">
            İftara ne kadar kaldı?
          </h1>
          <p className="mt-5 max-w-xl text-xl text-pretty text-muted-foreground">
            Türkiye&apos;nin 81 ilinde iftar ve sahur vakitleri, Diyanet verileriyle. Konumunu seç, geri sayım
            başlasın.
          </p>
          <div className="mt-8 max-w-xl">
            <LocationPicker />
          </div>
        </div>

        <div className="flex min-w-0 flex-col gap-8">
          {preview && <LivePreview days={preview.days} inPlace="İstanbul'da" href={preview.href} />}

          <nav aria-labelledby="sehirler-title">
            <h2 id="sehirler-title" className="font-display text-xl font-semibold">
              Büyükşehirler
            </h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {CITIES.map(([name, slug]) => (
                <li key={slug}>
                  <Link
                    href={`/${slug}`}
                    className="inline-flex h-10 items-center rounded-full border border-border px-4 text-[0.95rem] transition-colors hover:border-primary hover:text-accent-foreground"
                  >
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </section>

      <section
        aria-labelledby="sss-title"
        className="mt-20 grid gap-6 border-t border-border pt-10 lg:mt-28 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14"
      >
        <div>
          <h2 id="sss-title" className="font-display text-3xl font-semibold tracking-tight">
            Sıkça sorulanlar
          </h2>
          <p className="mt-2 text-muted-foreground">Ramazan&apos;da beslenme ve vakitler hakkında.</p>
        </div>
        <AccordionComponent />
      </section>
    </>
  );
}
