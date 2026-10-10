"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import { ActionSwapBlurButton } from "@/components/motion/action-swap-blur";
import type { Dictionary } from "@/lib/i18n";

/** How long the button stays in its "copied" state before reverting. */
const COPIED_RESET_MS = 1500;

/**
 * The generated image URL plus a copy button. Shown as its own wizard step and
 * again inline wherever the instructions ask the user to paste it.
 */
export function UrlLine({ t, url }: { t: Dictionary; url: string }) {
  const [copied, setCopied] = useState(false);
  const urlRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), COPIED_RESET_MS);
    return () => clearTimeout(timer);
  }, [copied]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      // Clipboard access can be denied (insecure context, permissions). The
      // URL is selected instead, so copying it by hand is one keystroke.
      if (urlRef.current)
        window.getSelection()?.selectAllChildren(urlRef.current);
    }
  }

  return (
    <div className="flex items-center gap-2 rounded-xl border border-border bg-background py-1.5 pr-1.5 pl-3">
      <code
        ref={urlRef}
        className="min-w-0 flex-1 truncate font-mono text-xs text-foreground"
      >
        {url}
      </code>
      {/* Controlled and non-cycling: the click copies, and only a successful
          copy swaps the label. */}
      <ActionSwapBlurButton
        variant="secondary"
        size="sm"
        cycle={false}
        value={copied ? "copied" : "copy"}
        items={[
          {
            id: "copy",
            label: t.wizard.copy,
            icon: <Copy className="size-3.5" />,
          },
          {
            id: "copied",
            label: t.wizard.copied,
            icon: <Check className="size-3.5 text-primary" />,
          },
        ]}
        onClick={handleCopy}
        className="shrink-0"
      />
    </div>
  );
}
