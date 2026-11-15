import { districtLabel, findCenterDistrict, slugify, sortByName, toTitleCase } from "@/lib/turkish";

export const DIYANET_BASE_URL = "https://ezanvakti.emushaf.net";
const TURKIYE_ID = 2;
const DAY = 60 * 60 * 24;

const toPlace = (id, rawName) => {
  const name = toTitleCase(rawName);
  return { id: String(id), name, slug: slugify(name) };
};

const toIsoDate = (value) => {
  const [day, month, year] = value.split(".");
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
};

const toUtcOffset = (hours = 3) => {
  const sign = hours < 0 ? "-" : "+";
  const abs = Math.abs(hours);
  const h = String(Math.floor(abs)).padStart(2, "0");
  const m = String(Math.round((abs % 1) * 60)).padStart(2, "0");
  return `${sign}${h}:${m}`;
};

const parseVakitler = (data) =>
  data
    .filter((item) => item?.MiladiTarihKisa && item?.Imsak && item?.Aksam)
    .map((item) => ({
      date: toIsoDate(item.MiladiTarihKisa),
      offset: toUtcOffset(item.GreenwichOrtalamaZamani),
      hijri: item.HicriTarihUzun,
      hijriMonth: Number(item.HicriTarihKisa?.split(".")[1]) || null,
      times: {
        imsak: item.Imsak,
        gunes: item.Gunes,
        ogle: item.Ogle,
        ikindi: item.Ikindi,
        aksam: item.Aksam,
        yatsi: item.Yatsi,
      },
    }))
    .sort((a, b) => a.date.localeCompare(b.date));

function findIl(iller, slug) {
  const exact = iller.find((item) => item.slug === slug);
  if (exact) return { il: exact, legacyIlce: null };

  const legacy = iller
    .filter((item) => slug.startsWith(`${item.slug}-`))
    .sort((a, b) => b.slug.length - a.slug.length)[0];
  return legacy ? { il: legacy, legacyIlce: slug.slice(legacy.slug.length + 1) } : null;
}

export function createDiyanetSource(request) {
  const isId = (value) => /^\d+$/.test(String(value));

  async function getIller() {
    const data = await request(`/sehirler/${TURKIYE_ID}`, 30 * DAY);
    return sortByName(data.map((item) => toPlace(item.SehirID, item.SehirAdi)));
  }

  async function getIlceler(ilId) {
    if (!isId(ilId)) return [];
    const data = await request(`/ilceler/${ilId}`, 30 * DAY);
    return sortByName(data.map((item) => toPlace(item.IlceID, item.IlceAdi)));
  }

  async function getVakitler(ilceId) {
    if (!isId(ilceId)) return [];
    return parseVakitler(await request(`/vakitler/${ilceId}`, DAY / 4));
  }

  async function loadPlaceTimes(ilSlug, ilceSlug) {
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

  return { getIller, getIlceler, getVakitler, loadPlaceTimes };
}
