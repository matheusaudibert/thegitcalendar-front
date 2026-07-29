"use client";

import type { MouseEvent } from "react";

type StoreLinkProps = {
  label: string;
  /** Store page — used on desktop and when the app isn't installed. */
  storeUrl: string;
  /** URL scheme that opens the installed app directly on iOS. */
  appScheme?: string;
};

/** How long to wait before assuming the scheme failed and falling back to the store. */
const FALLBACK_DELAY_MS = 1500;

function isIOS() {
  if (typeof navigator === "undefined") return false;
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    // iPadOS reports itself as a Mac, so check for touch support too.
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
}

export function StoreLink({ label, storeUrl, appScheme }: StoreLinkProps) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    if (!appScheme || !isIOS()) return;

    event.preventDefault();

    const fallback = setTimeout(() => {
      window.location.href = storeUrl;
    }, FALLBACK_DELAY_MS);

    // If the app opens, this page goes to the background — cancel the fallback.
    const cancelFallback = () => {
      if (!document.hidden) return;
      clearTimeout(fallback);
      document.removeEventListener("visibilitychange", cancelFallback);
    };
    document.addEventListener("visibilitychange", cancelFallback);

    window.location.href = appScheme;
  }

  return (
    <a
      href={storeUrl}
      onClick={handleClick}
      target="_blank"
      rel="noopener noreferrer"
      className="font-semibold text-white underline underline-offset-4 hover:opacity-80"
    >
      {label}
    </a>
  );
}
