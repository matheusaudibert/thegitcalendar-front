import { CalendarSync, Link2, Workflow, type LucideIcon } from "lucide-react";

import { ScrollReveal } from "@/components/motion/scroll-reveal";
import type { Dictionary } from "@/lib/i18n";

type StepId = keyof Dictionary["howSteps"];

/** The steps in order, each with its icon; the copy lives in the dictionary. */
const STEPS: readonly { id: StepId; icon: LucideIcon }[] = [
  { id: "copy", icon: Link2 },
  { id: "automate", icon: Workflow },
  { id: "daily", icon: CalendarSync },
];

export function HowItWorksSection({ t }: { t: Dictionary }) {
  return (
    /* Vertical rhythm lives on the wrapper in `app/page.tsx` so all the
       sections share one gap. */
    <section className="px-6">
      <ScrollReveal className="mx-auto w-full max-w-4xl">
        {/* Matches the About heading: medium weight, same sizes. */}
        <h2 className="mb-5 text-2xl font-medium tracking-[-0.02em] text-foreground sm:text-3xl">
          {t.howTitle}
        </h2>

        <ol className="grid gap-3 sm:grid-cols-3">
          {STEPS.map(({ id, icon: Icon }, index) => {
            const step = t.howSteps[id];
            return (
              <li
                key={id}
                className="flex flex-col rounded-2xl border border-border bg-card p-5"
              >
                <div className="flex items-center justify-between">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  {/* The list is already ordered for assistive tech, so the
                      visible number is decoration. */}
                  <span
                    aria-hidden
                    className="font-mono text-sm text-muted-foreground tabular-nums"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mt-5 text-lg font-medium text-foreground">
                  {step.title}
                </h3>
                <p className="mt-1.5 leading-[1.6] text-muted-foreground">
                  {step.description}
                </p>
              </li>
            );
          })}
        </ol>
      </ScrollReveal>
    </section>
  );
}
