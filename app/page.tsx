import { AboutSection } from "@/components/about-section";
import { FaqSection } from "@/components/faq-section";
import { Hero } from "@/components/hero";
import { SiteFooter } from "@/components/site-footer";
import { Testimonial } from "@/components/testimonial";
import { getDictionary } from "@/lib/locale";
import { pickShowcaseUser } from "@/lib/showcase-users";

export default async function Home() {
  const { locale, t } = await getDictionary();
  const username = pickShowcaseUser();

  return (
    <main className="flex flex-1 flex-col">
      <Hero t={t} locale={locale} username={username} />

      {/* One `gap` owns the rhythm between the three sections, so it cannot
          drift the way per-section margins do. `pb` is the run-up to the
          footer, which is a different measurement. */}
      <div className="flex flex-col gap-20 pt-2 pb-24 md:gap-24 md:pt-4 md:pb-32">
        <AboutSection t={t} />
        <Testimonial t={t} />
        <FaqSection t={t} />
      </div>

      <SiteFooter />
    </main>
  );
}
