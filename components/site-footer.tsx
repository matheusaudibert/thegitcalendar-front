import { SocialLinks } from "@/components/social-links";

const SITE_NAME = "thegitcalendar";
const SITE_TLD = ".com";

export function SiteFooter() {
  return (
    /* Same `px-6` + `max-w-4xl` box as the sections above, so the two ends line
       up with the content. */
    <footer className="shrink-0 px-6 pb-5">
      <div className="mx-auto flex w-full max-w-4xl items-center justify-between gap-4">
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

        <SocialLinks />
      </div>
    </footer>
  );
}
