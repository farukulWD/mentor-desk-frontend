"use client";

import { useCallback, useEffect, useState } from "react";

export function useCooldown() {
  const [endsAt, setEndsAt] = useState<number | null>(null);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (endsAt === null) return;

    const id = window.setInterval(() => {
      const current = Date.now();
      setNow(current);
      if (current >= endsAt) setEndsAt(null);
    }, 1000);

    return () => window.clearInterval(id);
  }, [endsAt]);

  const start = useCallback((seconds: number) => {
    const current = Date.now();
    setNow(current);
    setEndsAt(current + seconds * 1000);
  }, []);

  const secondsLeft =
    endsAt === null ? 0 : Math.max(0, Math.ceil((endsAt - now) / 1000));

  return { isCoolingDown: secondsLeft > 0, secondsLeft, start };
}
