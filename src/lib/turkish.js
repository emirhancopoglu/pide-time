const LOCALE = "tr-TR";

/** "KAHRAMANMARAŞ" -> "Kahramanmaraş" */
export function toTitleCase(value = "") {
  return value
    .toLocaleLowerCase(LOCALE)
    .split(/(\s+|-)/)
    .map((part) =>
      part ? part.charAt(0).toLocaleUpperCase(LOCALE) + part.slice(1) : part
    )
    .join("");
}

/**
 * URL ve eşleştirme için: "Büyükçekmece" -> "buyukcekmece", "İSTANBUL" -> "istanbul".
 * API'deki ASCII yazımlar ("ARNAVUTKOY") ile Türkçe yazımlar ("Arnavutköy") aynı slug'a düşer.
 */
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

/** İl merkezi ilçesi (ör. İstanbul -> "İSTANBUL" ilçesi). Yoksa ilk ilçe. */
export function findCenterDistrict(il, ilceler) {
  return ilceler.find((ilce) => ilce.slug === il.slug) ?? ilceler[0] ?? null;
}

export function districtLabel(il, ilce) {
  return ilce.slug === il.slug ? "Merkez" : ilce.name;
}
