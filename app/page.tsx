import { AboutSection } from "@/components/about-section";
import { FaqSection } from "@/components/faq-section";
import { Hero } from "@/components/hero";
import { HowItWorksSection } from "@/components/how-it-works-section";
import { SiteFooter } from "@/components/site-footer";
import { Testimonial } from "@/components/testimonial";
import { VisitsSection } from "@/components/visits-section";
import { getDictionary } from "@/lib/locale";
import { getVisits } from "@/lib/visits";

export default async function Home() {
  const [{ locale, t }, visits] = await Promise.all([
    getDictionary(),
    getVisits(),
  ]);

  return (
    <main className="flex flex-1 flex-col">
      <Hero t={t} locale={locale} />

      {/* One `gap` owns the rhythm between the sections, so it cannot
          drift the way per-section margins do. `pb` is the run-up to the
          footer, which is a different measurement. */}
      <div className="flex flex-col gap-20 pt-2 pb-24 md:gap-24 md:pt-4 md:pb-32">
        <AboutSection t={t} />
        <HowItWorksSection t={t} />
        <Testimonial t={t} />
        <VisitsSection
          label={t.visitsLabel}
          locale={locale}
          initialVisits={visits}
        />
        <FaqSection t={t} />
      </div>

      <SiteFooter />
    </main>
  );
}
