/**
 * The color theme. `system` follows the OS and is the default; `light` and
 * `dark` pin one regardless of it. The choice lives in `localStorage`, and what
 * it resolves to is the `dark` class on `<html>` — the palette in `globals.css`
 * and beUI's `dark:` styles both key off that class.
 */
export const THEMES = ["system", "light", "dark"] as const;

export type Theme = (typeof THEMES)[number];

export const THEME_STORAGE_KEY = "theme";

const DARK_QUERY = "(prefers-color-scheme: dark)";

export function isTheme(value: unknown): value is Theme {
  return THEMES.includes(value as Theme);
}

/**
 * ES5 on purpose, like the reveal guard: it runs inline before first paint, so
 * a dark page never flashes light. It also keeps following the OS while the
 * choice is `system`, whether or not the toggle is mounted. Storage can throw
 * (private mode, blocked site data), in which case it falls back to `system`.
 */
export const THEME_SCRIPT = `(function(){var r=document.documentElement,m=window.matchMedia("${DARK_QUERY}");function t(){try{var v=localStorage.getItem("${THEME_STORAGE_KEY}");return v==="light"||v==="dark"?v:"system"}catch(e){return"system"}}function a(){var v=t(),d=v==="dark"||(v==="system"&&m.matches);r.classList.toggle("dark",d);r.style.colorScheme=d?"dark":"light"}a();if(m.addEventListener)m.addEventListener("change",a);else if(m.addListener)m.addListener(a)})();`;

export function readTheme(): Theme {
  try {
    const value = localStorage.getItem(THEME_STORAGE_KEY);
    return isTheme(value) ? value : "system";
  } catch {
    return "system";
  }
}

export function applyTheme(theme: Theme) {
  const dark =
    theme === "dark" ||
    (theme === "system" && window.matchMedia(DARK_QUERY).matches);
  const root = document.documentElement;
  root.classList.toggle("dark", dark);
  root.style.colorScheme = dark ? "dark" : "light";
}

export function storeTheme(theme: Theme) {
  try {
    if (theme === "system") localStorage.removeItem(THEME_STORAGE_KEY);
    else localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Not persisted, but still applied for this visit.
  }
  applyTheme(theme);
}
