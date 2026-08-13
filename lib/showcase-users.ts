import { buildImageUrl } from "@/lib/build-image-url";

/**
 * GitHub handles featured in the hero's phone mockup. One is drawn at random
 * on every page load and its contribution graph becomes the wallpaper.
 *
 * ─────────────────────────────────────────────────────────────────────────
 *  Want to be featured? Open a PR adding your GitHub username to this list.
 *  Username only — no `@`, no URL, no trailing slash.
 * ─────────────────────────────────────────────────────────────────────────
 */
export const SHOWCASE_USERS = [
  "matheusaudibert",
  "srizzon",
  "gildaciolopes",
];

/** iPhone 15 Plus / 15 Pro Max / 16 Plus — the mockup's aspect ratio. */
const SHOWCASE_WIDTH = 1290;
const SHOWCASE_HEIGHT = 2796;

/** The hero mockup shows the defaults, so this is `buildImageUrl` with them applied. */
export function buildWallpaperUrl(username: string) {
  return buildImageUrl({
    username,
    width: SHOWCASE_WIDTH,
    height: SHOWCASE_HEIGHT,
    background: "github",
    color: "green",
    shape: "rounded",
  });
}

export function githubProfileUrl(username: string) {
  return `https://github.com/${username}`;
}

/**
 * Called from a Server Component on a dynamic route, so this runs once per
 * request: every reload shows a different graph, and there is no client-side
 * randomness to cause a hydration mismatch.
 */
export function pickShowcaseUser() {
  const index = Math.floor(Math.random() * SHOWCASE_USERS.length);
  return SHOWCASE_USERS[index];
}
