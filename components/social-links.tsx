"use client";

import { FaDiscord, FaInstagram, FaXTwitter } from "react-icons/fa6";
// The official GitHub mark: Font Awesome's draws the Octocat's tail dotted.
import { SiGithub } from "react-icons/si";

import { Tooltip } from "@/components/motion/tooltip";
import { GITHUB_URL } from "@/lib/site";

const LINKS = [
  { label: "X (Twitter)", href: "https://x.com/audibertdev", Icon: FaXTwitter },
  { label: "Discord", href: "https://discord.com/users/161092845040566272", Icon: FaDiscord },
  {
    label: "Instagram",
    href: "https://instagram.com/audibert.dev",
    Icon: FaInstagram,
  },
  { label: "GitHub", href: GITHUB_URL, Icon: SiGithub },
] as const;

/**
 * A client component so the anchors are created inside the client boundary.
 * Handed in as `children` from the server footer, they reach the SSR pass as
 * lazy elements, which beUI's tooltip does not recognise — the server then
 * skipped the tooltip wrapper the client rendered, and hydration failed.
 */
export function SocialLinks() {
  return (
    /* `-mr-2` cancels the last icon's padding so it sits optically flush with
       the container's right edge. */
    <nav aria-label="Social" className="-mr-2 flex items-center gap-0.5">
      {LINKS.map(({ label, href, Icon }) => (
        <Tooltip key={label} content={label}>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="flex rounded-lg p-2 text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            <Icon className="size-[1.15rem]" />
          </a>
        </Tooltip>
      ))}
    </nav>
  );
}
