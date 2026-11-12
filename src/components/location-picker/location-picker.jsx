"use client";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { History, Loader2, LocateFixed, RotateCw, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { detectLocation, LocationError } from "@/lib/geolocation";
import { readLastLocation, saveLastLocation } from "@/lib/last-location";
import { districtLabel, findCenterDistrict, slugify } from "@/lib/turkish";

async function fetchJson(url) {
  const response = await fetch(url);
  const data = await response.json().catch(() => null);
  if (!response.ok || !Array.isArray(data)) {
    throw new Error(data?.error ?? "Sunucuya ulaşılamadı.");
  }
  return data;
}

export default function LocationPicker() {
  const router = useRouter();
  const [isNavigating, startTransition] = useTransition();

  const [iller, setIller] = useState([]);
  const [illerError, setIllerError] = useState(null);
  const [illerLoading, setIllerLoading] = useState(true);

  const [ilceler, setIlceler] = useState([]);
  const [ilcelerLoading, setIlcelerLoading] = useState(false);

  const [ilId, setIlId] = useState("");
  const [ilceId, setIlceId] = useState("");
  const [locating, setLocating] = useState(false);
  const [lastLocation, setLastLocation] = useState(null);

  // Hızlı il değişimlerinde eski isteğin sonucunu yok saymak için
  const ilceRequestRef = useRef(0);

  const loadIller = useCallback(async () => {
    setIllerLoading(true);
    setIllerError(null);
    try {
      const data = await fetchJson("/api/iller");
      setIller(data);
      return data;
    } catch (error) {
      setIllerError(error.message);
      throw error;
    } finally {
      setIllerLoading(false);
    }
  }, []);

  useEffect(() => {
    loadIller().catch(() => {});
    setLastLocation(readLastLocation());
  }, [loadIller]);

  const il = iller.find((item) => item.id === ilId);
  const ilce = ilceler.find((item) => item.id === ilceId);

  const goTo = (targetIl, targetIlce) => {
    saveLastLocation({
      il: { name: targetIl.name, slug: targetIl.slug },
      ilce: { name: targetIlce.name, slug: targetIlce.slug },
    });
    startTransition(() => router.push(`/${targetIl.slug}/${targetIlce.slug}`));
  };

  const handleIlChange = async (value) => {
    const requestId = ++ilceRequestRef.current;
    setIlId(value);
    setIlceId("");
    setIlceler([]);
    setIlcelerLoading(true);

    try {
      const data = await fetchJson(`/api/ilceler/${value}`);
      if (requestId !== ilceRequestRef.current) return;
      setIlceler(data);
      const selectedIl = iller.find((item) => item.id === value);
      const center = selectedIl && findCenterDistrict(selectedIl, data);
      if (center) setIlceId(center.id);
    } catch (error) {
      if (requestId === ilceRequestRef.current) toast.error(error.message);
    } finally {
      if (requestId === ilceRequestRef.current) setIlcelerLoading(false);
    }
  };

  const handleLocate = async () => {
    setLocating(true);
    try {
      const { province, districts } = await detectLocation();
      const list = iller.length ? iller : await loadIller();

      const foundIl = list.find((item) => item.slug === slugify(province));
      if (!foundIl) {
        throw new LocationError(`"${province}" için vakit bulunamadı. Lütfen il seç.`);
      }

      ilceRequestRef.current++;
      const ilceList = await fetchJson(`/api/ilceler/${foundIl.id}`);
      const exactIlce = districts
        .map((name) => ilceList.find((item) => item.slug === slugify(name)))
        .find(Boolean);
      const targetIlce = exactIlce ?? findCenterDistrict(foundIl, ilceList);
      if (!targetIlce) throw new LocationError("Bu il için ilçe listesi alınamadı.");

      setIlId(foundIl.id);
      setIlceler(ilceList);
      setIlceId(targetIlce.id);
      setIlcelerLoading(false);

      if (!exactIlce && districts[0] && slugify(districts[0]) !== foundIl.slug) {
        toast.info(
          `${districts[0]} için Diyanet ayrı vakit yayımlamıyor, ${foundIl.name} merkez vakitleri gösteriliyor.`
        );
      } else {
        toast.success(`Konum bulundu: ${foundIl.name} / ${districtLabel(foundIl, targetIlce)}`);
      }

      goTo(foundIl, targetIlce);
    } catch (error) {
      toast.error(error instanceof LocationError ? error.message : "Konum alınırken bir sorun oluştu.");
    } finally {
      setLocating(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!il) {
      toast.info("Önce bir il seçmelisin.");
      return;
    }
    if (!ilce) {
      toast.info("İlçe listesi yükleniyor, bir saniye…");
      return;
    }
    goTo(il, ilce);
  };

  const busy = locating || isNavigating;

  return (
    <section aria-labelledby="konum-title" className="rounded-3xl bg-card p-5 sm:p-7">
      <h2 id="konum-title" className="font-display text-2xl font-semibold">
        Konumunu seç
      </h2>
      <p className="mt-1 text-muted-foreground">Konumunu paylaş ya da il ve ilçeni listeden seç.</p>

      {lastLocation && (
        <Link
          href={`/${lastLocation.il.slug}/${lastLocation.ilce.slug}`}
          className="mt-5 flex items-center gap-3 rounded-2xl bg-accent px-4 py-3 transition-colors hover:bg-accent/70"
        >
          <History className="size-5 shrink-0 text-accent-foreground" />
          <span className="min-w-0 flex-1">
            <span className="block text-sm text-muted-foreground">Son baktığın yer</span>
            <span className="block truncate font-medium">
              {lastLocation.ilce.slug === lastLocation.il.slug
                ? lastLocation.il.name
                : `${lastLocation.ilce.name}, ${lastLocation.il.name}`}
            </span>
          </span>
        </Link>
      )}

      <Button
        type="button"
        size="lg"
        onClick={handleLocate}
        disabled={busy}
        className="mt-5 h-12 w-full rounded-full text-base font-semibold shadow-none"
      >
        {locating ? <Loader2 className="animate-spin" /> : <LocateFixed />}
        {locating ? "Konum aranıyor…" : "Konumumu bul"}
      </Button>

      <div className="my-5 flex items-center gap-3 text-sm text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        ya da elle seç
        <span className="h-px flex-1 bg-border" />
      </div>

      {illerError ? (
        <div className="flex flex-col items-start gap-3 rounded-2xl bg-destructive/10 p-4">
          <p>
            <span className="font-bold">İl listesi yüklenemedi.</span>{" "}
            <span className="text-muted-foreground">{illerError}</span>
          </p>
          <Button variant="outline" size="sm" onClick={() => loadIller().catch(() => {})}>
            <RotateCw /> Tekrar dene
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex min-w-0 flex-col gap-1.5">
              <span className="text-sm text-muted-foreground">İl</span>
              <Select value={ilId} onValueChange={handleIlChange} disabled={illerLoading || busy}>
                <SelectTrigger className="h-12 w-full rounded-xl border-0 bg-secondary px-4 text-base shadow-none" aria-label="İl seç">
                  <SelectValue placeholder={illerLoading ? "Yükleniyor…" : "İl seç"} />
                </SelectTrigger>
                <SelectContent className="max-h-72">
                  {iller.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </label>

            <label className="flex min-w-0 flex-col gap-1.5">
              <span className="text-sm text-muted-foreground">İlçe</span>
              <Select
                value={ilceId}
                onValueChange={setIlceId}
                disabled={!ilId || ilcelerLoading || busy}
              >
                <SelectTrigger className="h-12 w-full rounded-xl border-0 bg-secondary px-4 text-base shadow-none" aria-label="İlçe seç">
                  <SelectValue placeholder={ilcelerLoading ? "Yükleniyor…" : "İlçe seç"} />
                </SelectTrigger>
                <SelectContent className="max-h-72">
                  {il &&
                    ilceler.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {districtLabel(il, item)}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </label>
          </div>

          <Button
            type="submit"
            variant="outline"
            size="lg"
            disabled={!ilce || busy}
            className="mt-1 h-12 w-full rounded-full text-base font-semibold shadow-none"
          >
            {isNavigating && !locating ? <Loader2 className="animate-spin" /> : <Search />}
            Vakitleri göster
          </Button>
        </form>
      )}
    </section>
  );
}
