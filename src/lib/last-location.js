"use client";

const KEY = "pide-vakti:last-location";

export function saveLastLocation(location) {
  try {
    localStorage.setItem(KEY, JSON.stringify(location));
  } catch {
    /* gizli sekme vb. */
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
