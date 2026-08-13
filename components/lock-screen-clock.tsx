"use client";

import { useSyncExternalStore } from "react";

import type { Locale } from "@/lib/i18n";

// Intl wants a full BCP 47 tag to pick the right abbreviations. `en-US` rather
// than `en-GB` because CLDR abbreviates September as "Sept" for en-GB, while
// iOS shows "Sep". The order is fixed by `formatToParts` below, so en-US's
// month-first default never reaches the screen.
const INTL_LOCALES: Record<Locale, string> = {
  en: "en-US",
  pt: "pt-BR",
};

/**
 * Ticks once a minute. The snapshot is the current minute rather than the
 * current millisecond, so it stays referentially stable between renders and
 * only wakes React when the displayed value actually changes.
 */
const subscribe = (onStoreChange: () => void) => {
  const id = window.setInterval(onStoreChange, 1000);
  return () => window.clearInterval(id);
};

const getSnapshot = (): number | null => Math.floor(Date.now() / 60_000);

// The server has no business guessing the visitor's clock, so it renders
// nothing and the real time appears right after hydration.
const getServerSnapshot = (): number | null => null;

/**
 * CLDR abbreviates with a trailing period and in lower case for some locales
 * (pt-BR gives "qui." and "ago."), but iOS renders them bare and capitalised:
 * "Qui 13 Ago".
 */
function tidyAbbreviation(value: string, locale: string) {
  return value
    .replace(/\.$/, "")
    .replace(/^./, (first) => first.toLocaleUpperCase(locale));
}

/**
 * `formatToParts` gives us the locale's own abbreviations (the same CLDR data
 * iOS uses) while letting us fix the order as weekday → day → month, which is
 * what the iPhone lock screen shows.
 */
function formatDate(date: Date, locale: string) {
  const parts = new Intl.DateTimeFormat(locale, {
    weekday: "short",
    day: "numeric",
    month: "short",
  }).formatToParts(date);

  const partValue = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "";

  const weekday = tidyAbbreviation(partValue("weekday"), locale);
  const month = tidyAbbreviation(partValue("month"), locale);

  return `${weekday} ${partValue("day")} ${month}`;
}

function formatTime(date: Date, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(date);
}

export function LockScreenClock({ locale }: { locale: Locale }) {
  const minute = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  if (minute === null) return null;

  const now = new Date(minute * 60_000);
  const intlLocale = INTL_LOCALES[locale];

  return (
    <div
      /* Sizes and offsets are multiples of `--u`, the same unit the phone frame
         scales with, so the clock keeps iPhone proportions at every size.
         The ratios come off a real 1290x2796 lock-screen capture: the digits
         are 9.7% of the screen height, the date cap-height 1.7%. */
      className="pointer-events-none absolute inset-x-0 top-[calc(32*var(--u))] flex select-none flex-col items-center font-apple text-white"
    >
      {/* Geist rather than the SF file: that file has a single weight, so a
          lighter `font-*` would render identically to semibold. At this size
          the typeface difference is imperceptible but the weight drop reads. */}
      <span className="font-sans text-[calc(9*var(--u))] leading-none font-medium">
        {formatDate(now, intlLocale)}
      </span>
      <span
        className="mt-[calc(1*var(--u)+5px)] text-[calc(50*var(--u))] leading-none font-semibold tracking-[-0.02em] tabular-nums sm:mt-[calc(1*var(--u))]"

        /* The bundled SF Pro only ships Semibold, and asking for 700 would make
           the browser synthesise a smeared fake bold. A hairline stroke in the
           text's own colour thickens the stems cleanly instead, and scales with
           the mockup because it is expressed in `--u`. */
        style={{ WebkitTextStroke: "calc(1.3 * var(--u)) currentColor" }}
      >
        {formatTime(now, intlLocale)}
      </span>
    </div>
  );
}
