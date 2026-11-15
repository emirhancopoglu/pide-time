import "server-only";
import { DIYANET_BASE_URL, createDiyanetSource } from "@/lib/diyanet-core";

const HEADERS = {
  Accept: "application/json",
  "Accept-Language": "tr-TR,tr;q=0.9",
  "User-Agent": "PideVakti/1.0",
};

const ATTEMPT_TIMEOUT_MS = 4_000;
const BACKGROUND_PAUSE_MS = 20_000;
const SLOW_MS = 2_000;
const RETRYABLE = new Set([408, 425, 429, 500, 502, 503, 504]);

export class DiyanetApiError extends Error {
  constructor(message, status, upstreamStatus) {
    super(message);
    this.name = "DiyanetApiError";
    this.status = status;
    this.upstreamStatus = upstreamStatus;
  }
}

const log = (level, message, details) => console[level](`[diyanet] ${message}`, JSON.stringify(details));
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const lanes = { page: [], background: [] };
const INTERVAL_MS = { page: 600, background: 1_200 };
const CACHE_HIT_MS = 15;
let lastStart = 0;
let backgroundPausedUntil = 0;
let timer = null;

function nextLane(now) {
  if (lanes.page.length) return "page";
  if (lanes.background.length && now >= backgroundPausedUntil) return "background";
  return null;
}

function pump() {
  clearTimeout(timer);
  timer = null;

  const now = Date.now();
  const lane = nextLane(now);
  if (!lane) {
    if (lanes.background.length) timer = setTimeout(pump, Math.max(50, backgroundPausedUntil - now));
    return;
  }

  timer = setTimeout(() => {
    timer = null;
    const current = nextLane(Date.now());
    const job = current ? lanes[current].shift() : null;
    if (job) {
      const before = lastStart;
      const startedAt = Date.now();
      lastStart = startedAt;
      job().then((fromCache) => {
        if (fromCache && lastStart === startedAt) {
          lastStart = before;
          pump();
        }
      });
    }
    pump();
  }, Math.max(0, lastStart + INTERVAL_MS[lane] - now));
}

function schedule(lane, task) {
  return new Promise((resolve, reject) => {
    lanes[lane].push(() =>
      task().then(
        (result) => {
          resolve(result);
          return result.ms < CACHE_HIT_MS;
        },
        (error) => {
          reject(error);
          return false;
        }
      )
    );
    pump();
  });
}

async function fetchOnce(path, revalidate) {
  const started = Date.now();
  try {
    const response = await fetch(`${DIYANET_BASE_URL}${path}`, {
      headers: HEADERS,
      next: { revalidate },
      signal: AbortSignal.timeout(ATTEMPT_TIMEOUT_MS),
    });
    return { response, ms: Date.now() - started };
  } catch (error) {
    throw Object.assign(
      new DiyanetApiError(
        `Vakit servisine ulaşılamadı (${path}): ${error.message}`,
        503,
        error.name === "TimeoutError" ? "timeout" : "network"
      ),
      { ms: Date.now() - started }
    );
  }
}

const inflight = new Map();

function createRequest(lane) {
  const maxAttempts = lane === "page" ? 2 : 1;

  async function send(path, revalidate) {
    for (let attempt = 1; ; attempt++) {
      let result;
      try {
        result = await schedule(lane, () => fetchOnce(path, revalidate));
      } catch (error) {
        log("warn", "istek başarısız", { lane, path, attempt, upstream: error.upstreamStatus, ms: error.ms });
        if (attempt >= maxAttempts) throw error;
        continue;
      }

      const { response, ms } = result;
      if (!response.ok) {
        if (response.status === 429) backgroundPausedUntil = Date.now() + BACKGROUND_PAUSE_MS;
        const willRetry = RETRYABLE.has(response.status) && attempt < maxAttempts;
        log(willRetry ? "warn" : "error", "hatalı yanıt", {
          lane,
          path,
          attempt,
          status: response.status,
          ms,
          cfRay: response.headers.get("cf-ray"),
          willRetry,
        });
        if (willRetry) {
          await sleep(response.status === 429 ? 1_000 : 300);
          continue;
        }
        throw new DiyanetApiError(`Vakit servisi ${response.status} döndü (${path})`, 502, String(response.status));
      }

      if (ms > SLOW_MS) log("warn", "yavaş yanıt", { lane, path, attempt, ms });

      const data = await response.json().catch(() => null);
      if (!Array.isArray(data)) {
        log("error", "beklenmeyen veri", { lane, path, contentType: response.headers.get("content-type") });
        throw new DiyanetApiError(`Vakit servisi beklenmeyen veri döndü (${path})`, 502, "invalid-body");
      }
      return data;
    }
  }

  return function request(path, revalidate) {
    const key = `${lane}:${path}`;
    if (!inflight.has(key)) {
      inflight.set(
        key,
        send(path, revalidate).finally(() => inflight.delete(key))
      );
    }
    return inflight.get(key);
  };
}

export const { getIller, getIlceler, getVakitler, loadPlaceTimes } = createDiyanetSource(createRequest("page"));

export const background = createDiyanetSource(createRequest("background"));

export class DeadlineError extends Error {
  constructor(label, ms) {
    super(`${label} ${ms} ms içinde tamamlanmadı`);
    this.name = "DeadlineError";
  }
}

export function withDeadline(promise, ms, label) {
  let timer;
  const deadline = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new DeadlineError(label, ms)), ms);
  });
  return Promise.race([promise, deadline]).finally(() => clearTimeout(timer));
}
