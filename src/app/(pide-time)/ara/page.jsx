import { cache } from "react";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { after } from "next/server";
import AccordionComponent from "@/components/accordion/accordion";
import PlaceView from "@/components/place-view/place-view";
import { loadCityIftars } from "@/lib/cities";
import { loadPlaceTimes, withDeadline } from "@/lib/diyanet";
import { LAST_LOCATION_COOKIE, parseLastLocationCookie } from "@/lib/place-url";

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
const PLACE_DEADLINE_MS = 5_000;

export const maxDuration = 30;

const param = (value) => (Array.isArray(value) ? value[0] : value) || null;

const loadPlace = cache(async (il, ilce) => {
  const started = Date.now();
  try {
    const data = await withDeadline(loadPlaceTimes(il, ilce), PLACE_DEADLINE_MS, "konum vakitleri");
    return { data, failed: false };
  } catch (error) {
    console.error(
      "[ara] konum sunucuda yüklenemedi, tarayıcıda denenecek",
      JSON.stringify({ il, ilce, message: error.message, upstream: error.upstreamStatus, ms: Date.now() - started })
    );
    return { data: null, failed: true };
  }
});

async function loadPage(searchParams) {
  const query = await searchParams;
  const urlIl = param(query.il);
  const remembered = urlIl ? null : parseLastLocationCookie((await cookies()).get(LAST_LOCATION_COOKIE)?.value);
  const il = urlIl ?? remembered?.il ?? DEFAULT_IL;
  const ilce = urlIl ? param(query.ilce) : (remembered?.ilce ?? null);
  const { data, failed } = await loadPlace(il, ilce);
  return { data, failed, fromUrl: Boolean(urlIl), query: { il, ilce } };
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
  const { data, fromUrl, failed, query } = await loadPage(searchParams);
  if (fromUrl && !data && !failed) notFound();

  const { cities: citiesPromise, finished } = loadCityIftars();
  after(() => finished);

  return (
    <>
      <PlaceView
        key={`${query.il}/${query.ilce ?? ""}`}
        data={data}
        failed={failed}
        query={query}
        fromUrl={fromUrl}
        quickCities={CITIES}
        citiesPromise={citiesPromise}
      />

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
