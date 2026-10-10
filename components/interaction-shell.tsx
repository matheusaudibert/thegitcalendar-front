"use client";

import { useEffect, type ReactNode } from "react";

import { playTap, preloadTaps } from "@/lib/snd";

/** What counts as hoverable: the same controls that get a pointer cursor. */
const HOVERABLE = [
  "a[href]",
  "button:not(:disabled)",
  '[role="button"]:not([aria-disabled="true"])',
  // Options built as a label around a radio, such as the color swatches.
  'label:has(> input[type="radio"]:not(:disabled))',
].join(", ");

/**
 * Options that change a choice — tabs, radios, swatches, list options. These
 * also tap on click, so picking one is heard as well as hovering it.
 */
const SELECTABLE = [
  '[role="tab"]',
  '[role="radio"]',
  '[role="option"]',
  'label:has(> input[type="radio"])',
].join(", ");

/**
 * Plays a tap whenever the mouse moves onto a button or link. One delegated
 * listener rather than a handler on every control, so beUI's internal buttons
 * (accordion rows, select options, swatches) and any added later sound the
 * same without being touched.
 */
function useHoverTaps() {
  useEffect(() => {
    const onPointerOver = (event: PointerEvent) => {
      // Touch fires `pointerover` on every tap; hover sounds are mouse-only.
      if (event.pointerType !== "mouse") return;
      if (!(event.target instanceof Element)) return;

      const control = event.target.closest(HOVERABLE);
      if (!control) return;
      // Moving between the control's own children re-fires `pointerover`;
      // only entering it from outside counts.
      if (
        event.relatedTarget instanceof Node &&
        control.contains(event.relatedTarget)
      ) {
        return;
      }

      playTap();
    };

    document.addEventListener("pointerover", onPointerOver);
    return () => document.removeEventListener("pointerover", onPointerOver);
  }, []);
}

/** Controls and fields, whose own hover tap already covers them. */
const INTERACTIVE =
  'a, button, input, textarea, select, summary, label, [role="button"]';

/** Plays a tap on clicks on an option, or anywhere outside a control. */
function useClickTaps() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return playTap();

      // A click on a label is replayed on its input; the label's own click
      // already tapped, so the replay must not tap twice.
      if (target instanceof HTMLInputElement && target.closest("label")) return;

      if (target.closest(SELECTABLE) || !target.closest(INTERACTIVE)) {
        playTap();
      }
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);
}

/**
 * Site-wide interaction feedback, after nerdsbrasil.com: a tap sound on hover
 * over controls, and a tap on clicks anywhere else.
 */
export function InteractionShell({ children }: { children: ReactNode }) {
  useEffect(() => {
    preloadTaps();
  }, []);
  useHoverTaps();
  useClickTaps();

  return children;
}
