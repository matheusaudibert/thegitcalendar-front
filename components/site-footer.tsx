import { LanguageToggle } from "@/components/language-toggle";
import { SocialLinks } from "@/components/social-links";
import { ThemeToggle } from "@/components/theme-toggle";
import type { Dictionary, Locale } from "@/lib/i18n";

const SITE_NAME = "thegitcalendar";
const SITE_TLD = ".com";

export function SiteFooter({ t, locale }: { t: Dictionary; locale: Locale }) {
  return (
    /* Same `px-6` + `max-w-4xl` box as the sections above, so the two ends line
       up with the content. */
    <footer className="shrink-0 px-6 pb-5">
      {/* Wraps on narrow phones, where the wordmark, the toggle and the icons
          do not fit on one line. */}
      <div className="mx-auto flex w-full max-w-4xl flex-wrap items-center justify-between gap-x-4 gap-y-3">
        {/* A wordmark, not prose: the arrow reads better than a text caret. */}
        <div className="flex cursor-default items-center gap-2 text-muted-foreground">
          {/* The favicon is a plain disc, so it is redrawn here in
              `currentColor` rather than tinted as an image — it then tracks the
              same grey as the icons opposite. */}
          <span aria-hidden className="size-3.5 shrink-0 rounded-full bg-current" />
          <span className="text-sm">
            <span className="font-semibold">{SITE_NAME}</span>
            {SITE_TLD}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <LanguageToggle locale={locale} t={t.language} />
          <ThemeToggle t={t.theme} />
          <SocialLinks />
        </div>
      </div>
    </footer>
  );
}
