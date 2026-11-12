"use client";

export class LocationError extends Error {
  constructor(message) {
    super(message);
    this.name = "LocationError";
  }
}

function getPosition() {
  return new Promise((resolve, reject) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      reject(new LocationError("Tarayıcın konum özelliğini desteklemiyor."));
      return;
    }
    if (!window.isSecureContext) {
      reject(new LocationError("Konum yalnızca güvenli (https) bağlantıda kullanılabilir."));
      return;
    }

    navigator.geolocation.getCurrentPosition(resolve, (error) => {
      const messages = {
        1: "Konum izni verilmedi. Tarayıcı ayarlarından izin verebilir ya da il seçebilirsin.",
        2: "Konumun belirlenemedi. Lütfen il ve ilçeyi elle seç.",
        3: "Konum alma zaman aşımına uğradı. Tekrar dene.",
      };
      reject(new LocationError(messages[error.code] ?? "Konum alınamadı."));
    }, {
      // Şehir/ilçe düzeyi yeterli; yüksek hassasiyet mobilde gereksiz gecikme yaratıyor.
      enableHighAccuracy: false,
      timeout: 15_000,
      maximumAge: 10 * 60 * 1000,
    });
  });
}

/** OpenStreetMap Nominatim: Türkiye'de il = `province`, ilçe = `town` / `county`. */
async function reverseWithNominatim(lat, lon) {
  const url = new URL("https://nominatim.openstreetmap.org/reverse");
  url.search = new URLSearchParams({
    lat,
    lon,
    format: "jsonv2",
    zoom: "10",
    "accept-language": "tr",
  });
  const response = await fetch(url, { signal: AbortSignal.timeout(8000) });
  if (!response.ok) throw new Error(`Nominatim ${response.status}`);
  const { address = {} } = await response.json();

  return {
    countryCode: address.country_code?.toUpperCase(),
    province: address.province ?? address.state ?? address.city,
    districts: [address.town, address.county, address.city_district, address.municipality, address.city],
  };
}

/** Yedek servis: BigDataCloud (anahtarsız, istemci tarafı). */
async function reverseWithBigDataCloud(lat, lon) {
  const url = new URL("https://api.bigdatacloud.net/data/reverse-geocode-client");
  url.search = new URLSearchParams({ latitude: lat, longitude: lon, localityLanguage: "tr" });
  const response = await fetch(url, { signal: AbortSignal.timeout(8000) });
  if (!response.ok) throw new Error(`BigDataCloud ${response.status}`);
  const data = await response.json();
  const admin = data.localityInfo?.administrative ?? [];

  return {
    countryCode: data.countryCode,
    province: data.principalSubdivision,
    districts: [admin.find((item) => item.adminLevel === 6)?.name, data.city, data.locality],
  };
}

/** Kullanıcının konumundan il ve ilçe adı adaylarını döndürür. */
export async function detectLocation() {
  const position = await getPosition();
  const { latitude, longitude } = position.coords;

  let place;
  try {
    place = await reverseWithNominatim(latitude, longitude);
  } catch {
    try {
      place = await reverseWithBigDataCloud(latitude, longitude);
    } catch {
      throw new LocationError("Konumun adrese çevrilemedi. Lütfen il ve ilçeyi elle seç.");
    }
  }

  if (place.countryCode && place.countryCode !== "TR") {
    throw new LocationError("Konumun Türkiye dışında görünüyor. Lütfen bir il seç.");
  }
  if (!place.province) {
    throw new LocationError("Bulunduğun il tespit edilemedi. Lütfen elle seç.");
  }

  return { province: place.province, districts: place.districts.filter(Boolean) };
}
