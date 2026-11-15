"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Loader2, LocateFixed, MapPin, RotateCw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { detectLocation, LocationError } from "@/lib/geolocation";
import { districtLabel, findCenterDistrict, slugify } from "@/lib/turkish";
import { placeUrl } from "@/lib/place-url";
import { fetchIlceler, fetchIller } from "@/lib/diyanet-client";
import { Bone } from "@/components/place-view/place-skeleton";

const SLOT = "min-w-0 flex-1 basis-[calc(50%-0.25rem)] sm:basis-0";

function SelectBone({ label }) {
  return (
    <span role="status" className={cn(SLOT, "h-11")}>
      <span className="sr-only">{label}</span>
      <Bone className="size-full rounded-xl" />
    </span>
  );
}

const SWAP_IN = "animate-in fade-in duration-200 ease-out motion-reduce:animate-none";

export default function PlaceSwitcher({ place, cities, onSelect, pending }) {
  const [open, setOpen] = useState(false);
  const [touched, setTouched] = useState(false);

  const [iller, setIller] = useState([]);
  const [illerError, setIllerError] = useState(null);
  const [illerLoading, setIllerLoading] = useState(false);

  const [ilceler, setIlceler] = useState([]);
  const [ilcelerLoading, setIlcelerLoading] = useState(false);

  const [ilId, setIlId] = useState("");
  const [ilceId, setIlceId] = useState("");
  const [locating, setLocating] = useState(false);

  const ilceRequestRef = useRef(0);

  const loadIller = useCallback(async () => {
    setIllerLoading(true);
    setIllerError(null);
    try {
      const data = await fetchIller();
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

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event) => {
      if (event.key === "Escape" && !document.querySelector('[data-slot="select-content"]')) setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const openPicker = () => {
    setTouched(true);
    setOpen(true);
    if (!iller.length && !illerLoading) loadIller().catch(() => {});
  };

  const handleIlChange = async (value) => {
    const requestId = ++ilceRequestRef.current;
    setIlId(value);
    setIlceId("");
    setIlceler([]);
    setIlcelerLoading(true);

    try {
      const data = await fetchIlceler(value);
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

      const ilceList = await fetchIlceler(foundIl.id);
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
      {open ? (
        <div className={cn("flex min-h-12 flex-wrap items-center gap-2 sm:flex-nowrap", SWAP_IN, "slide-in-from-bottom-1")}>
          {illerError ? (
            <>
              <p className="min-w-0 flex-1 text-sm">
                <span className="font-semibold">İl listesi yüklenemedi.</span>{" "}
                <span className="text-muted-foreground">{illerError}</span>
              </p>
              <Button
                type="button"
                variant="outline"
                onClick={() => loadIller().catch(() => {})}
                className="h-11 rounded-xl px-4 shadow-none"
              >
                <RotateCw /> Tekrar dene
              </Button>
            </>
          ) : (
            <form onSubmit={handleSubmit} className="contents">
              {illerLoading ? (
                <SelectBone label="İller yükleniyor" />
              ) : (
                <div className={SLOT}>
                  <Select value={ilId} onValueChange={handleIlChange} disabled={busy}>
                    <SelectTrigger
                      autoFocus
                      className="h-11 w-full rounded-xl border-0 bg-secondary px-4 text-base shadow-none"
                      aria-label="İl seç"
                    >
                      <SelectValue placeholder="İl seç" />
                    </SelectTrigger>
                    <SelectContent className="max-h-72">
                      {iller.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {ilcelerLoading ? (
                <SelectBone label="İlçeler yükleniyor" />
              ) : (
                <div className={SLOT}>
                  <Select value={ilceId} onValueChange={setIlceId} disabled={!ilId || busy}>
                    <SelectTrigger
                      className="h-11 w-full rounded-xl border-0 bg-secondary px-4 text-base shadow-none"
                      aria-label="İlçe seç"
                    >
                      <SelectValue placeholder="İlçe seç" />
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
                </div>
              )}

              <Button
                type="submit"
                disabled={!ilce || busy}
                className="h-11 flex-1 rounded-xl px-5 text-[0.95rem] font-semibold shadow-none sm:flex-none"
              >
                {pending && !locating && <Loader2 className="animate-spin" />}
                Göster
              </Button>
            </form>
          )}
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => setOpen(false)}
            aria-label="Vazgeç"
            title="Vazgeç"
            className="size-11 rounded-xl shadow-none"
          >
            <X className="size-5" />
          </Button>
        </div>
      ) : (
        <div className={cn("flex min-h-12 items-center gap-3", touched && [SWAP_IN, "slide-in-from-top-1"])}>
          <span className="hidden size-11 shrink-0 place-items-center rounded-xl bg-secondary text-muted-foreground sm:grid">
            <MapPin className="size-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm text-muted-foreground">Konumun</p>
            {busy ? (
              <Bone className="mt-1 h-6 w-36" />
            ) : place ? (
              <p className="truncate font-display text-lg font-semibold">{place.label}</p>
            ) : (
              <p className="font-display text-lg font-semibold">Seçilmedi</p>
            )}
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={openPicker}
            className="h-11 rounded-xl px-4 text-[0.95rem] font-semibold shadow-none"
          >
            Değiştir
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
      )}

      <nav aria-label="Hızlı geçiş" className="mt-4 flex flex-wrap items-center gap-2 border-t border-border pt-4">
        <span className="mr-1 text-sm text-muted-foreground">Hızlı geçiş</span>
        {cities.map(([name, slug]) => {
          const active = place?.il.slug === slug;
          return (
            <Link
              key={slug}
              href={placeUrl(slug)}
              aria-current={active ? "true" : undefined}
              onClick={(event) => {
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
