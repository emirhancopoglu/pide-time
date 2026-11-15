import "server-only";
import { background } from "@/lib/diyanet";
import { COMPARE_CITIES, sortByCompareOrder, toCityRow } from "@/lib/compare-cities";

const WAIT_MS = 2_500;

export function loadCityIftars(cities = COMPARE_CITIES) {
  const started = Date.now();
  const rows = [];

  const tasks = cities.map((city) =>
    background
      .getVakitler(city.ilceId)
      .then((days) => {
        if (days.length) rows.push(toCityRow(city, days));
      })
      .catch((error) => {
        console.warn("[cities] şehir alınamadı", JSON.stringify({ slug: city.slug, message: error.message }));
      })
  );

  const finished = Promise.allSettled(tasks).then(() => {
    if (rows.length < cities.length) {
      console.warn(
        "[cities] karşılaştırma eksik",
        JSON.stringify({ loaded: rows.length, total: cities.length, ms: Date.now() - started })
      );
    }
  });

  const snapshot = Promise.race([finished, new Promise((resolve) => setTimeout(resolve, WAIT_MS))]).then(() =>
    sortByCompareOrder(rows)
  );

  return { cities: snapshot, finished };
}
