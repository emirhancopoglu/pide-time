import "server-only";
import { getIlceler, getIller, getVakitler } from "@/lib/diyanet";
import { findCenterDistrict } from "@/lib/turkish";

/** Batıdan doğuya, karşılaştırma için seçilmiş iller. */
export const COMPARE_CITIES = [
  "edirne",
  "izmir",
  "istanbul",
  "bursa",
  "antalya",
  "ankara",
  "samsun",
  "gaziantep",
  "trabzon",
  "diyarbakir",
  "erzurum",
  "van",
];

/**
 * İl merkezlerinin iftar vakitleri. Sayfaya yalnızca gereken alanlar gönderilir.
 * Bir il alınamazsa listeden düşer; hepsi başarısızsa boş dizi döner.
 */
export async function getCityIftars(slugs = COMPARE_CITIES) {
  let iller;
  try {
    iller = await getIller();
  } catch {
    return [];
  }

  const results = await Promise.all(
    slugs.map(async (slug) => {
      const il = iller.find((item) => item.slug === slug);
      if (!il) return null;
      try {
        const center = findCenterDistrict(il, await getIlceler(il.id));
        if (!center) return null;
        const days = await getVakitler(center.id);
        return {
          name: il.name,
          slug: il.slug,
          href: `/${il.slug}/${center.slug}`,
          days: days.map((day) => ({ date: day.date, aksam: day.times.aksam })),
        };
      } catch {
        return null;
      }
    })
  );

  return results.filter(Boolean);
}
