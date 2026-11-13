import "server-only";
import { getIlceler, getIller, getVakitler } from "@/lib/diyanet";
import { districtLabel, findCenterDistrict, slugify } from "@/lib/turkish";

function findIl(iller, slug) {
  const exact = iller.find((item) => item.slug === slug);
  if (exact) return { il: exact, legacyIlce: null };

  const legacy = iller
    .filter((item) => slug.startsWith(`${item.slug}-`))
    .sort((a, b) => b.slug.length - a.slug.length)[0];
  return legacy ? { il: legacy, legacyIlce: slug.slice(legacy.slug.length + 1) } : null;
}

export async function loadPlaceTimes(ilSlug, ilceSlug) {
  const found = findIl(await getIller(), slugify(ilSlug ?? ""));
  if (!found) return null;

  const { il } = found;
  const ilceler = await getIlceler(il.id);
  const wanted = slugify(ilceSlug ?? "") || found.legacyIlce;
  const ilce = (wanted && ilceler.find((item) => item.slug === wanted)) || findCenterDistrict(il, ilceler);
  if (!ilce) return null;

  const days = await getVakitler(ilce.id);
  if (!days.length) return null;

  const isCenter = districtLabel(il, ilce) === "Merkez";
  return {
    place: {
      il: { name: il.name, slug: il.slug },
      ilce: { name: ilce.name, slug: ilce.slug },
      isCenter,
      label: isCenter ? il.name : `${il.name}, ${ilce.name}`,
    },
    days,
  };
}
