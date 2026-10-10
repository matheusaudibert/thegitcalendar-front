import { HeroActions } from "@/components/hero-actions";
import { HeroPhone } from "@/components/hero-phone";
import { HeroTitle } from "@/components/hero-title";
import { WizardProvider } from "@/components/wizard-provider";
import type { Dictionary, Locale } from "@/lib/i18n";

const AUTHOR_AVATAR_URL = "https://avatars.githubusercontent.com/u/85813476?v=4";
const AUTHOR_TWITTER_URL = "https://x.com/audibertdev";

export function Hero({ t, locale }: { t: Dictionary; locale: Locale }) {
  // Height comes from the content, never from the viewport. A `min-h-svh` here
  // looked identical at normal zoom — the phone column already fills a screen —
  // but on zoom-out the section grew with the viewport and swallowed the page:
  // at 25% it was 3644px tall, 75% of the whole document, with the content
  // marooned in the middle. Padding alone gives the same first screen and
  // degrades the way animations.dev does.
  return (
    <section className="px-6 py-14 md:py-20">
      <div className="mx-auto w-full max-w-4xl">
        {/* The username typed in the text column drives the phone in the
            other, so both sit under one wizard state. */}
        <WizardProvider>
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

              <HeroTitle title={t.title} />

              <p className="mt-6 max-w-[26rem] text-xl text-pretty text-muted-foreground sm:text-2xl">
                {t.subtitle}
              </p>

              <HeroActions t={t} />
            </div>

            <div className="flex justify-center md:justify-end">
              <HeroPhone t={t} locale={locale} />
            </div>
          </div>
        </WizardProvider>
      </div>
    </section>
  );
}
