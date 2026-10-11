import { Lock, Palette, Smartphone, Workflow, type LucideIcon } from "lucide-react";

import { BouncyAccordion } from "@/components/motion/bouncy-accordion";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import type { Dictionary, FaqItem } from "@/lib/i18n";
import { renderRichText } from "@/lib/rich-text";

type FaqId = Dictionary["faq"][number]["id"];

/** Keyed by id, so a question added without an icon fails to compile. */
const FAQ_ICONS: Record<FaqId, LucideIcon> = {
  customize: Palette,
  private: Lock,
  devices: Smartphone,
  how: Workflow,
};

export function FaqSection({ t }: { t: Dictionary }) {
  // Widened from the tuple of literals so `.map` sees one array type rather
  // than a union of the en/pt tuples, while keeping the ids literal.
  const items: readonly (FaqItem & { id: FaqId })[] = t.faq;

  return (
    /* Vertical rhythm lives on the wrapper in `app/page.tsx` so all three
       sections share one gap. */
    <section className="px-6">
      <ScrollReveal className="mx-auto w-full max-w-4xl" amount={0.1}>
        {/* Matches the About heading: medium weight, same sizes. */}
        <h2 className="mb-5 text-2xl font-medium tracking-[-0.02em] text-foreground sm:text-3xl">
          {t.faqTitle}
        </h2>

        {/* Closed panels stay mounted at zero height, so the answers still
            reach the server-rendered HTML for crawlers. */}
        <BouncyAccordion
          items={items.map(({ id, question, answer }) => {
            const Icon = FAQ_ICONS[id];
            return {
              id,
              title: question,
              description: renderRichText(answer),
              icon: <Icon className="size-[18px]" />,
            };
          })}
          classNames={{
            trigger: "min-h-[60px]",
            title: "whitespace-normal text-base sm:text-lg font-normal",
            // Bold links (`[**x**](url)`) get the same hover as the Shortcuts
            // `StoreLink`; plain links elsewhere stay undecorated.
            description:
              "text-base leading-[1.65] text-foreground/80 [&_a:has(strong)]:hover:opacity-80",
          }}
        />
      </ScrollReveal>
    </section>
  );
}
