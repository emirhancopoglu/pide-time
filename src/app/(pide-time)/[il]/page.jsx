import { notFound, redirect } from "next/navigation";
import { getIlceler, getIller } from "@/lib/diyanet";
import { findCenterDistrict, slugify } from "@/lib/turkish";

/**
 * /istanbul          -> /istanbul/istanbul (il merkezi)
 * /istanbul-kartal   -> /istanbul/kartal   (eski sürümdeki bağlantılar için)
 */
export default async function Page({ params }) {
  const { il: rawSlug } = await params;
  const slug = slugify(decodeURIComponent(rawSlug));
  const iller = await getIller();

  const exact = iller.find((item) => item.slug === slug);
  if (exact) {
    const center = findCenterDistrict(exact, await getIlceler(exact.id));
    if (center) redirect(`/${exact.slug}/${center.slug}`);
    notFound();
  }

  const legacy = iller
    .filter((item) => slug.startsWith(`${item.slug}-`))
    .sort((a, b) => b.slug.length - a.slug.length)[0];

  if (legacy) {
    const ilceSlug = slug.slice(legacy.slug.length + 1);
    const ilceler = await getIlceler(legacy.id);
    const ilce = ilceler.find((item) => item.slug === ilceSlug) ?? findCenterDistrict(legacy, ilceler);
    if (ilce) redirect(`/${legacy.slug}/${ilce.slug}`);
  }

  notFound();
}
