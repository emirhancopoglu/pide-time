export function placeUrl(ilSlug, ilceSlug) {
  const params = new URLSearchParams({ il: ilSlug });
  if (ilceSlug && ilceSlug !== ilSlug) params.set("ilce", ilceSlug);
  return `/ara?${params}`;
}

export const LAST_LOCATION_COOKIE = "pv-last";

const SLUG = /^[a-z0-9-]+$/;

export function parseLastLocationCookie(value) {
  if (!value) return null;
  let decoded;
  try {
    decoded = decodeURIComponent(value);
  } catch {
    return null;
  }
  const [il, ilce] = decoded.split("/");
  if (!SLUG.test(il ?? "") || !SLUG.test(ilce ?? "")) return null;
  return { il, ilce };
}
