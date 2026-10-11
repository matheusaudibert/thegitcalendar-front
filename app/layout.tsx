import type { Metadata } from "next";
import { Geist } from "next/font/google";
import localFont from "next/font/local";

import "./globals.css";
import { ContributionDecor } from "@/components/contribution-decor";
import { InteractionShell } from "@/components/interaction-shell";
import { cn } from "@/lib/utils";
import { dictionaries } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";
import { PAGE_ZOOM_SCRIPT } from "@/lib/page-zoom";
import { REVEAL_GUARD_SCRIPT } from "@/lib/reveal-guard";
import { THEME_SCRIPT } from "@/lib/theme";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

// Only used by the phone lock screen. Single weight, so `weight` is pinned to
// stop the browser synthesising a fake bold from it.
const sfPro = localFont({
  src: "./fonts/sf-pro-semibold-soft.otf",
  variable: "--font-sf-pro",
  weight: "600",
  style: "normal",
  display: "swap",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

/**
 * What the tab and the address bar call this site. A domain, so unlike the
 * dictionary copy it reads the same in every locale and stays out of `i18n.ts`.
 */
const SITE_NAME = "thegitcalendar.com";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  // `title` in the dictionary is the hero's `<h1>` — the product headline, not
  // the site's name. Social cards want that headline; the tab wants the domain.
  const { title: headline, metaDescription } = dictionaries[locale];

  return {
    metadataBase: new URL(siteUrl),
    title: SITE_NAME,
    description: metaDescription,
    openGraph: {
      title: headline,
      description: metaDescription,
      url: "/",
      siteName: SITE_NAME,
      type: "website",
      locale: locale === "pt" ? "pt_BR" : "en_US",
      images: [
        { url: "/preview.png", width: 2400, height: 1260, alt: headline },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: headline,
      description: metaDescription,
      images: ["/preview.png"],
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const locale = await getLocale();

  return (
    // The `dark` class is toggled by `THEME_SCRIPT` before first paint, not
    // rendered here: the server cannot know the visitor's choice or OS theme.
    <html
      lang={locale}
      className={cn(
        "h-full font-sans antialiased",
        geist.variable,
        sfPro.variable
      )}
      // The scripts below set a class, an attribute and styles here before
      // React hydrates.
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
        <script dangerouslySetInnerHTML={{ __html: REVEAL_GUARD_SCRIPT }} />
        <script dangerouslySetInnerHTML={{ __html: PAGE_ZOOM_SCRIPT }} />
      </head>
      <body className="flex min-h-full flex-col">
        <ContributionDecor />
        <InteractionShell>{children}</InteractionShell>
      </body>
    </html>
  );
}
