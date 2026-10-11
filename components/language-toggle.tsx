"use client";

import { useRouter } from "next/navigation";
import { useOptimistic, useTransition, type ComponentType } from "react";

import { BrazilFlag, UsFlag } from "@/components/flags";
import { Tooltip } from "@/components/motion/tooltip";
import type { Dictionary, Locale } from "@/lib/i18n";
import { LOCALE_COOKIE } from "@/lib/locale-cookie";
import { cn } from "@/lib/utils";

const OPTIONS: {
  locale: Locale;
  Flag: ComponentType<{ className?: string }>;
}[] = [
  { locale: "pt", Flag: BrazilFlag },
  { locale: "en", Flag: UsFlag },
];

/** A year: the choice should outlive the visit, like the theme's. */
const MAX_AGE = 60 * 60 * 24 * 365;

/**
 * Português / English, styled like the theme toggle beside it. The copy is
 * rendered on the server, so picking one stores it in a cookie (which
 * `getLocale` prefers over `Accept-Language`) and refreshes the server tree;
 * client state such as the wizard survives the refresh.
 */
export function LanguageToggle({
  locale,
  t,
}: {
  locale: Locale;
  t: Dictionary["language"];
}) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  // Shows the new choice at once, while the refreshed copy is on its way.
  const [current, setCurrent] = useOptimistic(locale);

  function select(next: Locale) {
    if (next === current) return;
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=${MAX_AGE}; samesite=lax`;
    startTransition(() => {
      setCurrent(next);
      router.refresh();
    });
  }

  return (
    <div
      role="radiogroup"
      aria-label={t.label}
      className="flex items-center gap-0.5 rounded-full border border-border p-0.5"
    >
      {OPTIONS.map(({ locale: option, Flag }) => {
        const active = current === option;
        return (
          <Tooltip key={option} content={t[option]}>
            <button
              type="button"
              role="radio"
              aria-checked={active}
              aria-label={t[option]}
              onClick={() => select(option)}
              className={cn(
                "flex rounded-full p-1.5 transition-[background-color,opacity] focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                active ? "bg-foreground/10" : "opacity-50 hover:opacity-100"
              )}
            >
              {/* Same 14px height as the theme icons, so both pills match. */}
              <Flag className="h-3.5 w-5 rounded-[2px]" />
            </button>
          </Tooltip>
        );
      })}
    </div>
  );
}
