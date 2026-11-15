"use client";
import { DIYANET_BASE_URL, createDiyanetSource } from "@/lib/diyanet-core";

const TIMEOUT_MS = 8_000;
const memory = new Map();

async function readArray(url) {
  const response = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT_MS) });
  const data = await response.json().catch(() => null);
  if (!response.ok || !Array.isArray(data)) {
    throw new Error(data?.error ?? `İstek başarısız (${response.status})`);
  }
  return data;
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function readDirect(path) {
  for (let attempt = 1; ; attempt++) {
    try {
      return await readArray(`${DIYANET_BASE_URL}${path}`);
    } catch (error) {
      if (attempt >= 3) throw error;
      await sleep(700 * attempt);
    }
  }
}

function directRequest(path) {
  if (!memory.has(path)) {
    memory.set(
      path,
      readDirect(path).catch((error) => {
        memory.delete(path);
        throw error;
      })
    );
  }
  return memory.get(path);
}

const direct = createDiyanetSource(directRequest);

export const loadPlaceTimesInBrowser = direct.loadPlaceTimes;

const CITY_GAP_MS = 400;
const CITY_RETRY_GAP_MS = 1_500;

export async function loadVakitlerSequentially(ilceIds, onEach) {
  const failed = [];
  for (const [index, ilceId] of ilceIds.entries()) {
    if (index > 0) await sleep(CITY_GAP_MS);
    try {
      onEach(ilceId, await direct.getVakitler(ilceId));
    } catch {
      failed.push(ilceId);
    }
  }

  for (const ilceId of failed) {
    await sleep(CITY_RETRY_GAP_MS);
    try {
      onEach(ilceId, await direct.getVakitler(ilceId));
    } catch {
      onEach(ilceId, null);
    }
  }
}

async function withFallback(apiUrl, fallback, failMessage) {
  try {
    return await readArray(apiUrl);
  } catch {
    try {
      return await fallback();
    } catch {
      throw new Error(failMessage);
    }
  }
}

export const fetchIller = () =>
  withFallback("/api/iller", direct.getIller, "İl listesi şu an alınamıyor. Biraz sonra tekrar dene.");

export const fetchIlceler = (ilId) =>
  withFallback(
    `/api/ilceler/${ilId}`,
    () => direct.getIlceler(ilId),
    "İlçe listesi şu an alınamıyor. Biraz sonra tekrar dene."
  );
