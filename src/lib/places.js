import "server-only";
import { getVakitler, resolvePlace } from "@/lib/diyanet";
import { districtLabel, findCenterDistrict } from "@/lib/turkish";

/**
 * Bir yerin adı ve vakitleri. İlçe verilmezse ya da bulunamazsa il merkezi kullanılır.
 * İl bulunamazsa ya da vakit yoksa null döner.
 */
export async function loadPlaceTimes(ilSlug, ilceSlug) {
  const resolved = await resolvePlace(ilSlug, ilceSlug);
  if (!resolved) return null;

  const { il, ilceler } = resolved;
  const ilce = resolved.ilce ?? findCenterDistrict(il, ilceler);
  if (!ilce) return null;

  const days = await getVakitler(ilce.id);
  if (!days.length) return null;

  return {
    place: {
      il: { name: il.name, slug: il.slug },
      ilce: { name: ilce.name, slug: ilce.slug },
      label: districtLabel(il, ilce) === "Merkez" ? il.name : `${il.name}, ${ilce.name}`,
      href: `/${il.slug}/${ilce.slug}`,
    },
    days,
  };
}
