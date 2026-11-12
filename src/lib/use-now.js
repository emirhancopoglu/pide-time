"use client";
import { useEffect, useState } from "react";

/**
 * Her saniye güncellenen "şu an". Sunucu ile istemci saatinin farklı olmasından
 * doğan hydration hatalarını önlemek için ilk render'da null döner.
 */
export function useNow(intervalMs = 1000) {
  const [now, setNow] = useState(null);

  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const id = setInterval(tick, intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  return now;
}
