"use client";

import { motion, useReducedMotion } from "motion/react";
import { SiGithub } from "react-icons/si";

import { TextReveal } from "@/components/motion/text-reveal";
import { EASE_OUT } from "@/lib/ease";

/**
 * The word reveal, spelled out once so the title and the icon share it. These
 * are TextReveal's own defaults, passed explicitly: the icon has to move
 * exactly like the words, so it cannot rely on values hidden in the component.
 */
const REVEAL = {
  stagger: 0.09,
  blur: 12,
  yOffset: "40%",
  spring: { stiffness: 140, damping: 26, mass: 1.2 },
} as const;

/** TextReveal's fixed opacity and blur timings, which it takes no props for. */
const OPACITY_DURATION = 0.7;
const BLUR_DURATION = 0.9;

/**
 * The hero's `<h1>`: the title revealed word by word, then the GitHub icon
 * revealed as if it were one more word.
 */
export function HeroTitle({ title }: { title: string }) {
  const reduce = useReducedMotion();
  // The icon lands in the slot after the last word.
  const delay = title.trim().split(/\s+/).length * REVEAL.stagger;

  return (
    /* TextReveal renders each line as a `.block` span. `[&>.block]:inline`
       lets the line flow inline, so the icon passed as children sits right
       after the last word instead of dropping to a line of its own. It targets
       `.block` alone: the icon's own wrapper must stay `inline-block`, or the
       browser ignores its transform and breaks it onto the next line. */
    <TextReveal
      as="h1"
      text={title}
      {...REVEAL}
      className="text-6xl font-bold tracking-[-0.04em] text-balance text-foreground sm:text-7xl lg:text-[5rem] lg:leading-[0.95] [&>.block]:inline"
    >
      <motion.span
        aria-hidden
        data-reveal=""
        className="ml-[0.18em] inline-block will-change-transform"
        initial={
          reduce
            ? { opacity: 0 }
            : { y: REVEAL.yOffset, opacity: 0, filter: `blur(${REVEAL.blur}px)` }
        }
        animate={reduce ? { opacity: 1 } : { y: 0, opacity: 1, filter: "blur(0px)" }}
        transition={
          reduce
            ? { opacity: { duration: 0.25, ease: EASE_OUT, delay: delay * 0.3 } }
            : {
                y: { type: "spring", ...REVEAL.spring, delay },
                opacity: { duration: OPACITY_DURATION, ease: EASE_OUT, delay },
                filter: { duration: BLUR_DURATION, ease: EASE_OUT, delay },
              }
        }
      >
        {/* Cap height in `em`, so it matches the letters at every breakpoint. */}
        <SiGithub className="size-[0.72em] align-baseline text-foreground" />
      </motion.span>
    </TextReveal>
  );
}
