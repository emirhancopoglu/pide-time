"use client";
import { LAST_LOCATION_COOKIE } from "@/lib/place-url";

const KEY = "pide-vakti:last-location";
const ONE_YEAR = 60 * 60 * 24 * 365;

export function saveLastLocation(location) {
  try {
    localStorage.setItem(KEY, JSON.stringify(location));
  } catch {
  }
  try {
    const value = encodeURIComponent(`${location.il.slug}/${location.ilce.slug}`);
    document.cookie = `${LAST_LOCATION_COOKIE}=${value}; path=/; max-age=${ONE_YEAR}; samesite=lax`;
  } catch {
  }
}

export function readLastLocation() {
  try {
    const value = JSON.parse(localStorage.getItem(KEY));
    return value?.il?.slug && value?.ilce?.slug ? value : null;
  } catch {
    return null;
  }
}
