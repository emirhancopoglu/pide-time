import "server-only";
import { slugify, sortByName, toTitleCase } from "@/lib/turkish";

const BASE_URL = "https://ezanvakti.emushaf.net";
const TURKIYE_ID = 2;

const DAY = 60 * 60 * 24;

export class DiyanetApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "DiyanetApiError";
    this.status = status;
  }
}

async function request(path, revalidate) {
  let response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      headers: { Accept: "application/json" },
      next: { revalidate },
      signal: AbortSignal.timeout(10_000),
    });
  } catch (error) {
    throw new DiyanetApiError(`Vakit servisine ulaşılamadı (${path}): ${error.message}`, 503);
  }

  if (!response.ok) {
    throw new DiyanetApiError(`Vakit servisi ${response.status} döndü (${path})`, 502);
  }

  const data = await response.json().catch(() => null);
  if (!Array.isArray(data)) {
    throw new DiyanetApiError(`Vakit servisi beklenmeyen veri döndü (${path})`, 502);
  }
  return data;
}

const toPlace = (id, rawName) => {
  const name = toTitleCase(rawName);
  return { id: String(id), name, slug: slugify(name) };
};

export async function getIller() {
  const data = await request(`/sehirler/${TURKIYE_ID}`, 30 * DAY);
  return sortByName(data.map((item) => toPlace(item.SehirID, item.SehirAdi)));
}

export async function getIlceler(ilId) {
  if (!/^\d+$/.test(String(ilId))) return [];
  const data = await request(`/ilceler/${ilId}`, 30 * DAY);
  return sortByName(data.map((item) => toPlace(item.IlceID, item.IlceAdi)));
}

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

export async function getVakitler(ilceId) {
  if (!/^\d+$/.test(String(ilceId))) return [];
  const data = await request(`/vakitler/${ilceId}`, DAY / 4);

  return data
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
}

export async function resolvePlace(ilSlug, ilceSlug) {
  const iller = await getIller();
  const il = iller.find((item) => item.slug === ilSlug);
  if (!il) return null;

  const ilceler = await getIlceler(il.id);
  const ilce = ilceSlug ? ilceler.find((item) => item.slug === ilceSlug) : null;
  return { il, ilce, ilceler, iller };
}
