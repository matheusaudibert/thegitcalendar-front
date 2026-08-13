import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { Dictionary, FaqItem } from "@/lib/i18n";
import { renderRichText } from "@/lib/rich-text";

export function FaqSection({ t }: { t: Dictionary }) {
  // Widened from the tuple of literals so `.map` sees one array type rather
  // than a union of the en/pt tuples.
  const items: readonly FaqItem[] = t.faq;

  return (
    /* Vertical rhythm lives on the wrapper in `app/page.tsx` so all three
       sections share one gap. */
    <section className="px-6">
      <div className="mx-auto w-full max-w-4xl">
        {/* Matches the About heading: medium weight, same sizes. */}
        <h2 className="mb-5 text-2xl font-medium tracking-[-0.02em] text-foreground sm:text-3xl">
          {t.faqTitle}
        </h2>

        {/* Without this the panels are unmounted while closed, so the answers
            never reach the server-rendered HTML. `hidden="until-found"` keeps
            them in the DOM: crawlers index them and browser find-in-page can
            reveal them. */}
        <Accordion hiddenUntilFound>
          {items.map(({ question, answer }) => (
            <AccordionItem key={question} value={question}>
              {/* Overrides the `font-medium` baked into the base component. */}
              <AccordionTrigger className="text-lg font-normal">
                {question}
              </AccordionTrigger>
              <AccordionContent className="text-base leading-[1.65] text-foreground/90">
                {renderRichText(answer)}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
