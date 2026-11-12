export const TIME_ZONE = "Europe/Istanbul";

export const PRAYERS = [
  { key: "imsak", label: "İmsak", hint: "Sahur biter" },
  { key: "gunes", label: "Güneş" },
  { key: "ogle", label: "Öğle" },
  { key: "ikindi", label: "İkindi" },
  { key: "aksam", label: "Akşam", hint: "İftar" },
  { key: "yatsi", label: "Yatsı" },
];

const dateKeyFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

/** Türkiye saatine göre bugünün YYYY-MM-DD karşılığı (kullanıcı nerede olursa olsun). */
export const todayKey = (now = new Date()) => dateKeyFormatter.format(now);

export const toInstant = (day, key) =>
  new Date(`${day.date}T${day.times[key]}:00${day.offset ?? "+03:00"}`);

const longDate = new Intl.DateTimeFormat("tr-TR", {
  day: "numeric",
  month: "long",
  year: "numeric",
  weekday: "long",
  timeZone: "UTC",
});
const shortDate = new Intl.DateTimeFormat("tr-TR", {
  day: "numeric",
  month: "short",
  weekday: "short",
  timeZone: "UTC",
});

export const formatLongDate = (isoDate) => longDate.format(new Date(`${isoDate}T00:00:00Z`));
export const formatShortDate = (isoDate) => shortDate.format(new Date(`${isoDate}T00:00:00Z`));

export const RAMAZAN_MONTH = 9;

export function splitDuration(ms) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const pad = (n) => String(n).padStart(2, "0");
  return {
    hours: pad(Math.floor(total / 3600)),
    minutes: pad(Math.floor((total % 3600) / 60)),
    seconds: pad(total % 60),
  };
}

export function formatDuration(ms) {
  const { hours, minutes, seconds } = splitDuration(ms);
  return `${hours}:${minutes}:${seconds}`;
}

/** Başlık cümlesi için: "2 saat 14 dakika", "14 dakika", "37 saniye". */
export function formatSpoken(ms) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  if (h > 0) return m > 0 ? `${h} saat ${m} dakika` : `${h} saat`;
  if (m > 0) return `${m} dakika`;
  return `${total % 60} saniye`;
}

/** Fazın (oruç ya da gece) içine düşen vakitler, fazdaki konumlarıyla (0–1). */
export function getPhaseMarks(days, phase) {
  const span = phase.target - phase.start;
  const marks = [];
  for (const day of days) {
    for (const prayer of PRAYERS) {
      const at = toInstant(day, prayer.key);
      if (at > phase.start && at < phase.target) {
        marks.push({ ...prayer, at, t: (at - phase.start) / span });
      }
    }
  }
  return marks;
}

const hijriFormatter = new Intl.DateTimeFormat("tr-TR-u-ca-islamic-umalqura", {
  day: "numeric",
  month: "numeric",
  timeZone: "UTC",
});

/**
 * Bir sonraki 1 Ramazan. Diyanet verisinde varsa kesin tarih, yoksa Ümmü'l-Kurâ takviminden tahmin.
 * Dönen tarih YYYY-MM-DD.
 */
export function findNextRamazan(days, fromKey) {
  const known = days.find((day) => day.date >= fromKey && day.hijriMonth === RAMAZAN_MONTH && parseInt(day.hijri, 10) === 1);
  if (known) return { date: known.date, exact: true };

  const cursor = new Date(`${fromKey}T12:00:00Z`);
  for (let i = 0; i < 400; i++) {
    const parts = Object.fromEntries(hijriFormatter.formatToParts(cursor).map((p) => [p.type, p.value]));
    if (Number(parts.month) === RAMAZAN_MONTH && Number(parts.day) === 1) {
      return { date: cursor.toISOString().slice(0, 10), exact: false };
    }
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return null;
}

export const daysBetween = (fromKey, toKey) =>
  Math.round((new Date(`${toKey}T00:00:00Z`) - new Date(`${fromKey}T00:00:00Z`)) / 86_400_000);

/** "1 sa 12 dk" gibi kısa metin. */
export function formatRelative(ms) {
  const totalMinutes = Math.max(0, Math.ceil(ms / 60000));
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  if (h === 0) return `${m} dk`;
  return m === 0 ? `${h} sa` : `${h} sa ${m} dk`;
}

/**
 * Şu anki duruma göre iftar / sahur geri sayımını ve sıradaki vakti hesaplar.
 * Gün dönümünde bir sonraki günün imsak vakti kullanılır (eski kodda bugünün imsakı +1 gün alınıyordu).
 */
export function getStatus(days, now) {
  const index = days.findIndex((day) => day.date === todayKey(now));
  if (index === -1) return null;

  const today = days[index];
  const tomorrow = days[index + 1];
  const yesterday = days[index - 1];

  const imsak = toInstant(today, "imsak");
  const aksam = toInstant(today, "aksam");
  const DAY_MS = 24 * 60 * 60 * 1000;
  const nextImsak = tomorrow ? toInstant(tomorrow, "imsak") : new Date(imsak.getTime() + DAY_MS);
  const nextAksam = tomorrow ? toInstant(tomorrow, "aksam") : new Date(aksam.getTime() + DAY_MS);
  const prevAksam = yesterday ? toInstant(yesterday, "aksam") : new Date(aksam.getTime() - DAY_MS);

  let phase;
  if (now < imsak) {
    phase = { type: "sahur", target: imsak, start: prevAksam };
  } else if (now < aksam) {
    phase = { type: "iftar", target: aksam, start: imsak };
  } else {
    phase = { type: "sahur", target: nextImsak, start: aksam };
  }

  const span = phase.target - phase.start;
  const progress = span > 0 ? Math.min(1, Math.max(0, (now - phase.start) / span)) : 0;

  const iftarTarget = now < aksam ? aksam : nextAksam;
  const sahurTarget = now < imsak ? imsak : nextImsak;

  // Sıradaki ve şu anki vakit
  const todayInstants = PRAYERS.map((prayer) => ({ ...prayer, at: toInstant(today, prayer.key) }));
  let next = todayInstants.find((prayer) => prayer.at > now);
  if (!next) {
    next = { ...PRAYERS[0], at: nextImsak, tomorrow: true };
  }
  const passed = todayInstants.filter((prayer) => prayer.at <= now);
  const currentKey = passed.length ? passed[passed.length - 1].key : "yatsi";

  return {
    today,
    phase: { ...phase, remaining: phase.target - now, progress },
    iftar: { at: iftarTarget, remaining: iftarTarget - now },
    sahur: { at: sahurTarget, remaining: sahurTarget - now },
    next: { ...next, remaining: next.at - now },
    currentKey,
  };
}
