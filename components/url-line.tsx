"use client";

import { useEffect, useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Dictionary } from "@/lib/i18n";

/** How long the button stays in its "copied" state before reverting. */
const COPIED_RESET_MS = 1500;

/**
 * The generated image URL plus a copy button. Shown as its own wizard step and
 * again inline wherever the instructions ask the user to paste it.
 */
export function UrlLine({ t, url }: { t: Dictionary; url: string }) {
  const [copied, setCopied] = useState(false);

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
      // URL is on screen and selectable, so there is nothing to recover from.
    }
  }

  return (
    <div className="flex items-center gap-2 rounded-md bg-muted px-3 py-2">
      <code className="min-w-0 flex-1 truncate font-mono text-xs text-foreground">
        {url}
      </code>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleCopy}
        className="shrink-0"
      >
        {copied ? <Check className="text-emerald-500" /> : <Copy />}
        {copied ? t.wizard.copied : t.wizard.copy}
      </Button>
    </div>
  );
}
