"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";

import { Tooltip } from "@/components/motion/tooltip";
import type { Dictionary } from "@/lib/i18n";
import { THEMES, readTheme, storeTheme, type Theme } from "@/lib/theme";
import { cn } from "@/lib/utils";

const ICONS = { system: Monitor, light: Sun, dark: Moon } as const;

/** Notifies this tab's toggles of a change; `storage` covers the other tabs. */
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = () => {
    storeTheme(readTheme());
    listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function select(theme: Theme) {
  storeTheme(theme);
  listeners.forEach((listener) => listener());
}

/**
 * System / Light / Dark, as a segmented radio group. The server cannot know the
 * stored choice, so it renders `system` and the client corrects it after
 * hydration; the page itself is already themed by `THEME_SCRIPT`.
 */
export function ThemeToggle({ t }: { t: Dictionary["theme"] }) {
  const current = useSyncExternalStore(subscribe, readTheme, () => "system");

  return (
    <div
      role="radiogroup"
      aria-label={t.label}
      className="flex items-center gap-0.5 rounded-full border border-border p-0.5"
    >
      {THEMES.map((theme) => {
        const Icon = ICONS[theme];
        const active = current === theme;
        return (
          <Tooltip key={theme} content={t[theme]}>
            <button
              type="button"
              role="radio"
              aria-checked={active}
              aria-label={t[theme]}
              onClick={() => select(theme)}
              className={cn(
                "flex rounded-full p-1.5 transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                active
                  ? "bg-foreground/10 text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="size-3.5" />
            </button>
          </Tooltip>
        );
      })}
    </div>
  );
}
