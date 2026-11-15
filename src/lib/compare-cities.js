import { placeUrl } from "@/lib/place-url";

export const COMPARE_CITIES = [
  { slug: "edirne", name: "Edirne", ilceId: "9419" },
  { slug: "izmir", name: "İzmir", ilceId: "9560" },
  { slug: "istanbul", name: "İstanbul", ilceId: "9541" },
  { slug: "bursa", name: "Bursa", ilceId: "9335" },
  { slug: "antalya", name: "Antalya", ilceId: "9225" },
  { slug: "ankara", name: "Ankara", ilceId: "9206" },
  { slug: "samsun", name: "Samsun", ilceId: "9819" },
  { slug: "gaziantep", name: "Gaziantep", ilceId: "9479" },
  { slug: "trabzon", name: "Trabzon", ilceId: "9905" },
  { slug: "diyarbakir", name: "Diyarbakır", ilceId: "9402" },
  { slug: "erzurum", name: "Erzurum", ilceId: "9451" },
  { slug: "van", name: "Van", ilceId: "9930" },
];

export function toCityRow(city, days) {
  return {
    name: city.name,
    slug: city.slug,
    href: placeUrl(city.slug),
    days: days.map((day) => ({ date: day.date, aksam: day.times.aksam })),
  };
}

export function sortByCompareOrder(rows) {
  const order = new Map(COMPARE_CITIES.map((city, index) => [city.slug, index]));
  return [...rows].sort((a, b) => (order.get(a.slug) ?? 99) - (order.get(b.slug) ?? 99));
}
