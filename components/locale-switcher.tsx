import { Fragment } from "react";

import { LOCALES, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/**
 * Plain anchors rather than `next/link`: `proxy.ts` writes the locale cookie
 * for any request carrying `?lang=`, and Link's prefetch-on-hover would fire
 * exactly that request — switching the visitor's stored language before they
 * clicked anything. A full navigation also guarantees the cookie round-trip.
 */
export function LocaleSwitcher({ locale }: { locale: Locale }) {
  return (
    <nav className="flex items-center gap-2 text-sm">
      {LOCALES.map((code, index) => {
        const isActive = code === locale;

        return (
          <Fragment key={code}>
            {index > 0 && (
              <span aria-hidden="true" className="text-muted-foreground/40">
                /
              </span>
            )}
            <a
              href={`?lang=${code}`}
              hrefLang={code}
              aria-current={isActive ? "true" : undefined}
              className={cn(
                "rounded transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                isActive
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {code}
            </a>
          </Fragment>
        );
      })}
    </nav>
  );
}
