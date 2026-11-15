import "server-only";
import { background } from "@/lib/diyanet";
import { findCenterDistrict } from "@/lib/turkish";
import { placeUrl } from "@/lib/place-url";

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

const WAIT_MS = 3_000;
const FRESH_MS = 6 * 60 * 60 * 1000;
const RETRY_AFTER_FAILURE_MS = 60_000;

const ready = new Map();
const loading = new Map();
const failedAt = new Map();

async function fetchCity(slug) {
  const iller = await background.getIller();
  const il = iller.find((item) => item.slug === slug);
  if (!il) return null;
  const center = findCenterDistrict(il, await background.getIlceler(il.id));
  if (!center) return null;
  const days = await background.getVakitler(center.id);
  return {
    name: il.name,
    slug: il.slug,
    href: placeUrl(il.slug),
    days: days.map((day) => ({ date: day.date, aksam: day.times.aksam })),
  };
}

function refresh(slug) {
  if (loading.has(slug)) return loading.get(slug);
  if (Date.now() - (failedAt.get(slug) ?? 0) < RETRY_AFTER_FAILURE_MS) return null;

  const task = fetchCity(slug)
    .then((value) => {
      if (value) ready.set(slug, { value, at: Date.now() });
    })
    .catch((error) => {
      failedAt.set(slug, Date.now());
      console.warn("[cities] şehir alınamadı", JSON.stringify({ slug, message: error.message }));
    })
    .finally(() => loading.delete(slug));
  loading.set(slug, task);
  return task;
}

export function loadCityIftars(slugs = COMPARE_CITIES) {
  const tasks = slugs
    .filter((slug) => Date.now() - (ready.get(slug)?.at ?? 0) > FRESH_MS)
    .map(refresh)
    .filter(Boolean);

  const finished = Promise.allSettled(tasks);
  const snapshot = () => slugs.map((slug) => ready.get(slug)?.value).filter(Boolean);

  const cities = tasks.length
    ? Promise.race([finished, new Promise((resolve) => setTimeout(resolve, WAIT_MS))]).then(snapshot)
    : Promise.resolve(snapshot());

  return { cities, finished };
}
