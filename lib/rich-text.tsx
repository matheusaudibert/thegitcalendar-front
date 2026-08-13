import type { ReactNode } from "react";

import { StoreLink } from "@/components/store-link";

/**
 * Dictionary copy is stored as plain strings so it stays easy to edit and
 * translate. Four lightweight markups are understood here:
 *
 *   `**bold**`            → <strong>
 *   `` `code` ``          → <code>, for file paths and filenames
 *   `[label](url)`        → <a>, styled exactly like the surrounding text
 *   `https://example.com` → <a>, underlined, showing the raw URL
 *
 * The bare-URL branch deliberately ends on a non-punctuation character,
 * otherwise a link that closes a sentence would swallow its full stop. The
 * `[label](url)` alternative comes first so its URL is never eaten by it.
 */
const TOKEN_PATTERN =
  /(\[[^\]]+\]\(https?:\/\/[^)]+\)|\*\*[^*]+\*\*|`[^`]+`|https?:\/\/[^\s<>()[\]]*[^\s<>()[\].,;:!?'"])/g;

const MARKDOWN_LINK = /^\[([^\]]+)\]\((https?:\/\/[^)]+)\)$/;

/**
 * Store pages that have an app we can jump to directly. When a `[label](url)`
 * points at one of these, the link becomes a `StoreLink`, which tries the URL
 * scheme first and falls back to the store listing. Android has no equivalent
 * of `shortcuts://` for opening MacroDroid, so it is a plain store link.
 */
const APP_SCHEMES: Record<string, string> = {
  "https://apps.apple.com/app/id915249334": "shortcuts://",
};

/** Keyboard users still need to see where focus is; this never shows on hover. */
const FOCUS_RING =
  "rounded focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none";

export function renderRichText(text: string): ReactNode[] {
  return text.split(TOKEN_PATTERN).map((chunk, index) => {
    const link = chunk.match(MARKDOWN_LINK);

    if (link) {
      const [, label, href] = link;

      if (href in APP_SCHEMES) {
        return (
          <StoreLink
            key={index}
            label={label}
            storeUrl={href}
            appScheme={APP_SCHEMES[href]}
          />
        );
      }

      return (
        <a
          key={index}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          /* Deliberately undecorated — it should read as ordinary text, with
             only the pointer giving it away. */
          className={`cursor-pointer ${FOCUS_RING}`}
        >
          {label}
        </a>
      );
    }

    if (chunk.startsWith("**") && chunk.endsWith("**")) {
      return (
        <strong key={index} className="font-semibold text-foreground">
          {chunk.slice(2, -2)}
        </strong>
      );
    }

    if (chunk.startsWith("`") && chunk.endsWith("`")) {
      return (
        <code
          key={index}
          className="rounded bg-muted px-1 py-0.5 font-mono text-xs text-foreground"
        >
          {chunk.slice(1, -1)}
        </code>
      );
    }

    if (/^https?:\/\//.test(chunk)) {
      return (
        <a
          key={index}
          href={chunk}
          target="_blank"
          rel="noopener noreferrer"
          className={`break-all underline underline-offset-3 hover:text-foreground ${FOCUS_RING}`}
        >
          {chunk}
        </a>
      );
    }

    return chunk;
  });
}
