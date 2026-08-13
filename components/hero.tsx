import { InstallButtons } from "@/components/install-buttons";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { PhoneMockup } from "@/components/phone-mockup";
import type { Dictionary, Locale } from "@/lib/i18n";
import { buildWallpaperUrl, githubProfileUrl } from "@/lib/showcase-users";

const AUTHOR_AVATAR_URL = "https://avatars.githubusercontent.com/u/85813476?v=4";
const AUTHOR_TWITTER_URL = "https://x.com/audibertdev";

export function Hero({
  t,
  locale,
  username,
}: {
  t: Dictionary;
  locale: Locale;
  username: string;
}) {
  // Height comes from the content, never from the viewport. A `min-h-svh` here
  // looked identical at normal zoom — the phone column already fills a screen —
  // but on zoom-out the section grew with the viewport and swallowed the page:
  // at 25% it was 3644px tall, 75% of the whole document, with the content
  // marooned in the middle. Padding alone gives the same first screen and
  // degrades the way animations.dev does.
  return (
    <section className="px-6 py-14 md:py-20">
      <div className="relative mx-auto w-full max-w-4xl">
        {/* Lifted out of the flow on desktop and pinned to the top-left, which
            lands it on exactly the phone's top edge: the phone column is the
            taller of the two, so the grid's top is the phone's top. Costing no
            height is the point — in flow it pushed the whole hero down. The
            text column is centred and shorter, so nothing collides. On mobile
            the grid stacks and it simply sits above. */}
        <div className="mb-8 flex md:absolute md:top-0 md:left-0 md:mb-0">
          <LocaleSwitcher locale={locale} />
        </div>

        {/* The text column gets the wider share so the oversized title can
            break into two lines without crowding the phone. */}
        <div className="grid items-center gap-12 md:grid-cols-[1.1fr_0.9fr] md:gap-16">
          <div className="flex flex-col items-center text-center md:items-start md:text-left">
            <div className="mb-6 flex items-center gap-2.5">
              {/* Decorative: the adjacent text already names the author, so an
                  alt here would just be announced twice. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={AUTHOR_AVATAR_URL}
                alt=""
                width={32}
                height={32}
                className="size-8 rounded-full"
              />
              <p className="text-sm text-muted-foreground">
                {t.builtBy}{" "}
                <a
                  href={AUTHOR_TWITTER_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded font-medium text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                >
                  Matheus Audibert
                </a>
              </p>
            </div>

            <h1 className="text-6xl font-bold tracking-[-0.04em] text-balance text-foreground sm:text-7xl lg:text-[5rem] lg:leading-[0.95]">
              {t.title}
            </h1>

            <p className="mt-6 max-w-[26rem] text-xl text-pretty text-muted-foreground sm:text-2xl">
              {t.subtitle}
            </p>

            <InstallButtons t={t} />
          </div>

          <div className="flex justify-center md:justify-end">
            {/* Nested column so the credit centres under the phone rather than
                under the whole grid cell. */}
            <div className="flex flex-col items-center gap-5">
              <PhoneMockup
                imageUrl={buildWallpaperUrl(username)}
                alt={t.wallpaperAlt}
                locale={locale}
              />
              <a
                href={githubProfileUrl(username)}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              >
                @{username}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
