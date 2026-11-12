import { notFound } from "next/navigation";
import CountdownPanel from "@/components/countdown-panel/countdown-panel";
import ImsakiyeTable from "@/components/imsakiye-table/imsakiye-table";
import RamazanMeter from "@/components/ramazan-meter/ramazan-meter";
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
          <RamazanMeter days={days} />
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
