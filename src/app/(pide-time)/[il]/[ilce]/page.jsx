import { Suspense } from "react";
import { notFound } from "next/navigation";
import CityIftars from "@/components/city-iftars/city-iftars";
import CountdownPanel from "@/components/countdown-panel/countdown-panel";
import FastingChart from "@/components/fasting-chart/fasting-chart";
import ImsakiyeTable from "@/components/imsakiye-table/imsakiye-table";
import RamazanMeter from "@/components/ramazan-meter/ramazan-meter";
import { getCityIftars } from "@/lib/cities";
import { getVakitler, resolvePlace } from "@/lib/diyanet";
import { formatLongDate, todayKey } from "@/lib/prayer-times";
import { districtLabel } from "@/lib/turkish";

// HTML her istekte üretilir (bugünün tarihi doğru olsun); API yanıtları ise data cache'te tutulur.
export const dynamic = "force-dynamic";

async function loadPage(params) {
  const { il: ilSlug, ilce: ilceSlug } = await params;
  const place = await resolvePlace(decodeURIComponent(ilSlug), decodeURIComponent(ilceSlug));
  if (!place?.ilce) notFound();
  return place;
}

const placeLabel = (il, ilce) => (districtLabel(il, ilce) === "Merkez" ? il.name : `${ilce.name}, ${il.name}`);

export async function generateMetadata({ params }) {
  const { il, ilce } = await loadPage(params);
  const name = placeLabel(il, ilce);
  return {
    title: `${name} iftar ve sahur vakitleri`,
    description: `${name} için Diyanet verileriyle iftar ve sahur geri sayımı, günlük namaz vakitleri ve 30 günlük imsakiye.`,
  };
}

/** Şehir karşılaştırması ayrı yüklenir; sayfanın geri kalanını bekletmez. */
async function CityComparison({ current }) {
  const cities = await getCityIftars();
  return <CityIftars cities={cities} current={current} />;
}

export default async function Page({ params }) {
  const { il, ilce } = await loadPage(params);
  const days = await getVakitler(ilce.id);
  const place = {
    il: il.name,
    ilce: ilce.name,
    ilSlug: il.slug,
    ilceSlug: ilce.slug,
    label: placeLabel(il, ilce),
  };
  const today = days.find((day) => day.date === todayKey());

  // Karşılaştırmada bu ilçe kendi adıyla vurgulanır; il merkeziyse listedeki ilin satırı vurgulanır.
  const isCenter = districtLabel(il, ilce) === "Merkez";
  const current = {
    name: isCenter ? il.name : ilce.name,
    slug: isCenter ? il.slug : `${il.slug}-${ilce.slug}`,
    days: days.map((day) => ({ date: day.date, aksam: day.times.aksam })),
  };

  return (
    <div className="flex flex-col gap-10 pt-8 sm:pt-12">
      {today && (
        <p className="text-muted-foreground">
          {formatLongDate(today.date)}
          <span className="mx-2 text-border" aria-hidden>
            /
          </span>
          {today.hijri}
        </p>
      )}

      {days.length > 0 ? (
        <>
          <CountdownPanel days={days} place={place} />

          <div className="grid items-start gap-6 lg:grid-cols-2">
            <div className="flex flex-col gap-6">
              <FastingChart days={days} />
              <RamazanMeter days={days} />
            </div>
            <Suspense fallback={<div className="min-h-96 animate-pulse rounded-3xl bg-card" aria-hidden />}>
              <CityComparison current={current} />
            </Suspense>
          </div>
          <ImsakiyeTable days={days} />
        </>
      ) : (
        <p className="rounded-2xl bg-card p-6 text-muted-foreground">
          Bu konum için vakit verisi yok. Listeden başka bir ilçe seç.
        </p>
      )}
    </div>
  );
}
