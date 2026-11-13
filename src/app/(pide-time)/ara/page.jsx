import AccordionComponent from "@/components/accordion/accordion";
import CityIftars from "@/components/city-iftars/city-iftars";
import HomeHero from "@/components/home-hero/home-hero";
import { getCityIftars } from "@/lib/cities";
import { loadPlaceTimes } from "@/lib/places";

export const metadata = {
  title: "Konum seç",
};

// Varsayılan konumun verisi 6 saatte bir yenilenir; geri sayım tarayıcıda hesaplanır.
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

/** Daha önce konum seçmemiş ziyaretçiye İstanbul gösterilir. */
async function loadDefaultPlace() {
  try {
    return await loadPlaceTimes("istanbul");
  } catch {
    return null;
  }
}

export default async function Page() {
  const [initial, cities] = await Promise.all([loadDefaultPlace(), getCityIftars()]);

  return (
    <>
      <HomeHero initial={initial} cities={CITIES} />

      {cities.length > 1 && <CityIftars cities={cities} className="mt-16 lg:mt-24" />}

      <section
        aria-labelledby="sss-title"
        className="mt-16 grid gap-6 lg:mt-24 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14"
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
