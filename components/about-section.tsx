import type { Dictionary } from "@/lib/i18n";
import { renderRichText } from "@/lib/rich-text";

export function AboutSection({ t }: { t: Dictionary }) {
  // Widened from the tuple of string literals so `.map` sees one array type
  // rather than a union of the en/pt tuples.
  const paragraphs: readonly string[] = t.aboutParagraphs;

  return (
    /* Vertical rhythm lives on the wrapper in `app/page.tsx` so all three
       sections share one gap. */
    <section className="px-6">
      <div className="mx-auto w-full max-w-4xl">
        {/* animations.dev keeps section headings at medium weight rather than
            bold — the size carries the hierarchy, not the weight. */}
        <h2 className="text-2xl font-medium tracking-[-0.02em] text-foreground sm:text-3xl">
          {t.aboutTitle}
        </h2>

        {/* `text-foreground/90` and `leading-[1.65]` mirror their `.article p`
            treatment. */}
        <div className="mt-5 space-y-5">
          {paragraphs.map((paragraph) => (
            <p
              key={paragraph}
              className="text-lg leading-[1.65] text-foreground/90"
            >
              {renderRichText(paragraph)}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
