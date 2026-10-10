"use client";

import { useEffect, useState } from "react";

import { NumberTicker } from "@/components/motion/number-ticker";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { INTL_LOCALES, type Locale } from "@/lib/i18n";

/** Marks this browser session as counted, so reloads don't inflate the total. */
const COUNTED_KEY = "visit-counted";

function readCounted() {
  try {
    return sessionStorage.getItem(COUNTED_KEY) === "1";
  } catch {
    // Storage can be blocked (private mode, site-data settings); counting
    // once per load is the honest fallback there.
    return false;
  }
}

function writeCounted(counted: boolean) {
  try {
    if (counted) sessionStorage.setItem(COUNTED_KEY, "1");
    else sessionStorage.removeItem(COUNTED_KEY);
  } catch {
    // See `readCounted`.
  }
}

/**
 * Counts this visit once per session and shows the running total. The server
 * renders the current total; the client then counts the visit and rolls the
 * number up to include it. `null` means the counter is unavailable (no store
 * configured, or it failed), shown as a dash rather than a wrong number.
 */
export function VisitsSection({
  label,
  locale,
  initialVisits,
}: {
  label: string;
  locale: Locale;
  initialVisits: number | null;
}) {
  const [visits, setVisits] = useState(initialVisits);

  useEffect(() => {
    if (readCounted()) return;
    // Flagged before the request, so React running this effect twice in
    // development cannot count the same visit twice.
    writeCounted(true);

    fetch("/api/visits", { method: "POST" })
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then(({ visits }: { visits: number }) => setVisits(visits))
      .catch(() => writeCounted(false));
  }, []);

  const formatter = new Intl.NumberFormat(INTL_LOCALES[locale]);

  return (
    <section className="px-6">
      <ScrollReveal className="mx-auto flex w-full max-w-4xl flex-col items-center text-center">
        <p className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
          {label}
        </p>
        {/* Display-sized, with the hero title's weight and tracking, so the
            number reads as a headline rather than a stat. */}
        <p className="mt-3 text-7xl leading-none font-bold tracking-[-0.04em] text-foreground tabular-nums sm:text-8xl md:text-9xl">
          {visits === null ? (
            "—"
          ) : (
            <NumberTicker value={visits} format={formatter.format} />
          )}
        </p>
      </ScrollReveal>
    </section>
  );
}
