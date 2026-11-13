const LOCALE = "tr-TR";

export function toTitleCase(value = "") {
  return value
    .toLocaleLowerCase(LOCALE)
    .split(/(\s+|-)/)
    .map((part) =>
      part ? part.charAt(0).toLocaleUpperCase(LOCALE) + part.slice(1) : part
    )
    .join("");
}

export function slugify(value = "") {
  return value
    .toLocaleLowerCase(LOCALE)
    .replace(/ı/g, "i")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function sortByName(list) {
  return [...list].sort((a, b) => a.name.localeCompare(b.name, LOCALE));
}

export function findCenterDistrict(il, ilceler) {
  return ilceler.find((ilce) => ilce.slug === il.slug) ?? ilceler[0] ?? null;
}

export function districtLabel(il, ilce) {
  return ilce.slug === il.slug ? "Merkez" : ilce.name;
}

const UNIT_SUFFIX = ["da", "de", "de", "te", "te", "te", "da", "de", "de", "da"];
const TENS_SUFFIX = ["da", "da", "de", "da", "ta", "de"];
const numberLocative = (n) => (n % 10 ? UNIT_SUFFIX[n % 10] : TENS_SUFFIX[n / 10]);

export function timeLocative(hhmm) {
  const [hours, minutes] = hhmm.split(":").map(Number);
  return numberLocative(minutes || hours);
}
