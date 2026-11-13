import { notFound } from "next/navigation";
import AccordionComponent from "@/components/accordion/accordion";
import PlaceView from "@/components/place-view/place-view";
import { getCityIftars } from "@/lib/cities";
import { loadPlaceTimes } from "@/lib/places";

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

const DEFAULT_IL = "istanbul";

const param = (value) => (Array.isArray(value) ? value[0] : value) || null;

async function loadPage(searchParams) {
  const query = await searchParams;
  const il = param(query.il);
  const ilce = param(query.ilce);
  try {
    const data = await loadPlaceTimes(il ?? DEFAULT_IL, ilce);
    return { data, fromUrl: Boolean(il), failed: false };
  } catch {
    return { data: null, fromUrl: Boolean(il), failed: true };
  }
}

export async function generateMetadata({ searchParams }) {
  const { data, fromUrl } = await loadPage(searchParams);
  if (!fromUrl || !data) return { title: "İftar ve sahur vakitleri" };
  const name = data.place.label;
  return {
    title: `${name} iftar ve sahur vakitleri`,
    description: `${name} için Diyanet verileriyle iftar ve sahur geri sayımı, günlük namaz vakitleri ve imsakiye.`,
  };
}

export default async function Page({ searchParams }) {
  const [{ data, fromUrl, failed }, cities] = await Promise.all([loadPage(searchParams), getCityIftars()]);
  if (fromUrl && !data && !failed) notFound();

  return (
    <>
      <PlaceView data={data} fromUrl={fromUrl} quickCities={CITIES} compareCities={cities} />

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
