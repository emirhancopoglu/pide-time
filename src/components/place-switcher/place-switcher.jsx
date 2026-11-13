"use client";
import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Loader2, LocateFixed, MapPin, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { detectLocation, LocationError } from "@/lib/geolocation";
import { districtLabel, findCenterDistrict, slugify } from "@/lib/turkish";

async function fetchJson(url) {
  const response = await fetch(url);
  const data = await response.json().catch(() => null);
  if (!response.ok || !Array.isArray(data)) {
    throw new Error(data?.error ?? "Sunucuya ulaşılamadı.");
  }
  return data;
}

/**
 * Seçili konum, il/ilçe seçimi, cihaz konumu ve hızlı geçiş düğmeleri.
 * place: { il: { slug }, label, href } | null
 * cities: [[ad, slug]]
 * onSelect(ilSlug, ilceSlug?): konumu değiştirir (Promise; başarısızsa reddedilir)
 */
export default function PlaceSwitcher({ place, cities, onSelect, pending }) {
  const [open, setOpen] = useState(false);

  const [iller, setIller] = useState([]);
  const [illerError, setIllerError] = useState(null);
  const [illerLoading, setIllerLoading] = useState(false);

  const [ilceler, setIlceler] = useState([]);
  const [ilcelerLoading, setIlcelerLoading] = useState(false);

  const [ilId, setIlId] = useState("");
  const [ilceId, setIlceId] = useState("");
  const [locating, setLocating] = useState(false);

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

  const il = iller.find((item) => item.id === ilId);
  const ilce = ilceler.find((item) => item.id === ilceId);
  const busy = locating || pending;

  const toggle = () => {
    const next = !open;
    setOpen(next);
    if (next && !iller.length && !illerLoading) loadIller().catch(() => {});
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!il) {
      toast.info("Önce bir il seçmelisin.");
      return;
    }
    if (!ilce) {
      toast.info("İlçe listesi yükleniyor, bir saniye…");
      return;
    }
    try {
      await onSelect(il.slug, ilce.slug);
      setOpen(false);
    } catch {
      /* hata mesajını onSelect gösterir */
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

      const ilceList = await fetchJson(`/api/ilceler/${foundIl.id}`);
      const exactIlce = districts
        .map((name) => ilceList.find((item) => item.slug === slugify(name)))
        .find(Boolean);
      const targetIlce = exactIlce ?? findCenterDistrict(foundIl, ilceList);
      if (!targetIlce) throw new LocationError("Bu il için ilçe listesi alınamadı.");

      await onSelect(foundIl.slug, targetIlce.slug);
      setOpen(false);

      if (!exactIlce && districts[0] && slugify(districts[0]) !== foundIl.slug) {
        toast.info(
          `${districts[0]} için Diyanet ayrı vakit yayımlamıyor, ${foundIl.name} merkez vakitleri gösteriliyor.`
        );
      } else {
        toast.success(`Konum bulundu: ${foundIl.name} / ${districtLabel(foundIl, targetIlce)}`);
      }
    } catch (error) {
      if (error instanceof LocationError) toast.error(error.message);
      else if (!error?.handled) toast.error("Konum alınırken bir sorun oluştu.");
    } finally {
      setLocating(false);
    }
  };

  return (
    <section aria-label="Konum" className="rounded-3xl bg-card p-4 sm:p-5">
      <div className="flex items-center gap-3">
        <span className="hidden size-11 shrink-0 place-items-center sm:grid rounded-xl bg-secondary text-muted-foreground">
          <MapPin className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm text-muted-foreground">Konumun</p>
          {place ? (
            <Link
              href={place.href}
              className="block truncate font-display text-lg font-semibold hover:underline hover:underline-offset-4"
            >
              {place.label}
            </Link>
          ) : (
            <p className="font-display text-lg font-semibold">Seçilmedi</p>
          )}
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={toggle}
          aria-expanded={open}
          aria-controls="konum-sec"
          className="h-11 rounded-xl px-4 text-[0.95rem] font-semibold shadow-none"
        >
          {open ? "Kapat" : "Değiştir"}
        </Button>
        <Button
          type="button"
          size="icon"
          onClick={handleLocate}
          disabled={busy}
          aria-label="Konumumu bul"
          title="Konumumu bul"
          className="size-11 rounded-xl shadow-none"
        >
          {locating ? <Loader2 className="size-5 animate-spin" /> : <LocateFixed className="size-5" />}
        </Button>
      </div>

      {open && (
        <div id="konum-sec" className="mt-4 border-t border-border pt-4">
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
            <form onSubmit={handleSubmit} className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]">
              <Select value={ilId} onValueChange={handleIlChange} disabled={illerLoading || busy}>
                <SelectTrigger className="h-11 w-full rounded-xl border-0 bg-secondary px-4 text-base shadow-none" aria-label="İl seç">
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

              <Select value={ilceId} onValueChange={setIlceId} disabled={!ilId || ilcelerLoading || busy}>
                <SelectTrigger className="h-11 w-full rounded-xl border-0 bg-secondary px-4 text-base shadow-none" aria-label="İlçe seç">
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

              <Button type="submit" disabled={!ilce || busy} className="h-11 rounded-xl px-5 text-[0.95rem] font-semibold shadow-none">
                {pending && !locating && <Loader2 className="animate-spin" />}
                Göster
              </Button>
            </form>
          )}
        </div>
      )}

      <nav aria-label="Hızlı geçiş" className="mt-4 flex flex-wrap items-center gap-2 border-t border-border pt-4">
        <span className="mr-1 text-sm text-muted-foreground">Hızlı geçiş</span>
        {cities.map(([name, slug]) => {
          const active = place?.il.slug === slug;
          return (
            <Link
              key={slug}
              href={`/${slug}`}
              aria-current={active ? "true" : undefined}
              onClick={(event) => {
                // Sayfada kalıp geri sayımı değiştir; yeni sekmede açma gibi durumlarda bağlantı çalışsın
                if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
                event.preventDefault();
                if (!active && !busy) onSelect(slug).catch(() => {});
              }}
              className={cn(
                "inline-flex h-9 items-center rounded-full border px-3.5 text-sm transition-colors",
                active
                  ? "border-primary bg-accent font-semibold text-accent-foreground"
                  : "border-border hover:border-primary hover:text-accent-foreground"
              )}
            >
              {name}
            </Link>
          );
        })}
      </nav>
    </section>
  );
}
