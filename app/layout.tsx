import type { Metadata } from "next";
import { Geist } from "next/font/google";
import localFont from "next/font/local";

import "./globals.css";
import { cn } from "@/lib/utils";
import { dictionaries } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";

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
    // Dark-only site, so the `dark` class is fixed rather than toggled. The
    // palette itself lives on `:root`; the class is here so that any shadcn
    // component added later that ships `dark:` styles picks them up.
    <html
      lang={locale}
      className={cn(
        "dark h-full font-sans antialiased",
        geist.variable,
        sfPro.variable
      )}
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
