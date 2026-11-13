export function placeUrl(ilSlug, ilceSlug) {
  const params = new URLSearchParams({ il: ilSlug });
  if (ilceSlug && ilceSlug !== ilSlug) params.set("ilce", ilceSlug);
  return `/ara?${params}`;
}
