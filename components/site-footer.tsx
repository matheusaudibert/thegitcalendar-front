import {
  FaDiscord,
  FaGithub,
  FaInstagram,
  FaXTwitter,
} from "react-icons/fa6";

const SITE_NAME = "thegitcalendar";
const SITE_TLD = ".com";

const LINKS = [
  { label: "X (Twitter)", href: "https://x.com/audibertdev", Icon: FaXTwitter },
  { label: "Discord", href: "https://discord.com/users/161092845040566272", Icon: FaDiscord },
  {
    label: "Instagram",
    href: "https://instagram.com/audibert.dev",
    Icon: FaInstagram,
  },
  { label: "GitHub", href: "https://github.com/matheusaudibert/thegitcalendar", Icon: FaGithub },
] as const;

export function SiteFooter() {
  return (
    /* Same `px-6` + `max-w-4xl` box as the sections above, so the two ends line
       up with the content. */
    <footer className="shrink-0 px-6 pb-5">
      <div className="mx-auto flex w-full max-w-4xl items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          {/* The favicon is a plain disc, so it is redrawn here in
              `currentColor` rather than tinted as an image — it then tracks the
              same grey as the icons opposite. */}
          <span aria-hidden className="size-3.5 shrink-0 rounded-full bg-current" />
          <span className="text-sm">
            <span className="font-semibold">{SITE_NAME}</span>
            {SITE_TLD}
          </span>
        </div>

        {/* `-mr-2` cancels the last icon's padding so it sits optically flush
            with the container's right edge. */}
        <nav aria-label="Social" className="-mr-2 flex items-center gap-0.5">
          {LINKS.map(({ label, href, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="rounded-lg p-2 text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              <Icon className="size-[1.15rem]" />
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
