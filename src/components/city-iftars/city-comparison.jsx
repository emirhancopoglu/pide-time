"use client";
import { use, useEffect, useState } from "react";
import { COMPARE_CITIES, sortByCompareOrder, toCityRow } from "@/lib/compare-cities";
import { loadVakitlerSequentially } from "@/lib/diyanet-client";
import { CityIftarsSkeleton } from "@/components/place-view/place-skeleton";
import CityIftars from "./city-iftars";

export default function CityComparison({ citiesPromise, current }) {
  const serverRows = use(citiesPromise);
  const [browserRows, setBrowserRows] = useState([]);
  const [done, setDone] = useState(serverRows.length >= COMPARE_CITIES.length);

  useEffect(() => {
    const have = new Set(serverRows.map((row) => row.slug));
    const missing = COMPARE_CITIES.filter((city) => !have.has(city.slug));
    if (!missing.length) return;

    let cancelled = false;
    const byId = new Map(missing.map((city) => [city.ilceId, city]));
    loadVakitlerSequentially(
      missing.map((city) => city.ilceId),
      (ilceId, days) => {
        if (cancelled || !days?.length) return;
        setBrowserRows((rows) => [...rows, toCityRow(byId.get(ilceId), days)]);
      }
    ).finally(() => {
      if (!cancelled) setDone(true);
    });

    return () => {
      cancelled = true;
    };
  }, [serverRows]);

  const rows = sortByCompareOrder([...serverRows, ...browserRows]);

  if (rows.length > 1) return <CityIftars cities={rows} current={current} />;
  if (!done) return <CityIftarsSkeleton />;

  return (
    <section className="flex flex-col justify-center rounded-3xl bg-card p-5 sm:p-7">
      <h2 className="font-display text-2xl font-semibold">Türkiye&apos;de bugün iftar</h2>
      <p className="mt-1 text-muted-foreground">Şehir karşılaştırması şu an yüklenemedi. Sayfayı yenileyince tekrar denenir.</p>
    </section>
  );
}
