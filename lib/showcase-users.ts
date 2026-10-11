/**
 * GitHub handle featured in the hero's phone mockup wallpaper.
 *
 * The wallpaper is no longer fetched live from the image API — that GET
 * added a visible delay before the graph appeared. A GitHub Action
 * (`.github/workflows/update-commit-preview.yml`) regenerates
 * `public/commit-preview.png` (dark background) and
 * `public/commit-preview-light.png` (light) for this user on a schedule and
 * commits them to the repo, so the hero just serves them as static assets.
 */
export const SHOWCASE_USER = "matheusaudibert";

/**
 * Pre-rendered by the GitHub Action above — kept in sync automatically. One
 * per default background, so whichever theme the visitor arrives in, the
 * default wallpaper is a static file.
 */
export const WALLPAPER_URLS = {
  dark: "/commit-preview.png",
  light: "/commit-preview-light.png",
} as const;

/**
 * iPhone 15 Plus / 15 Pro Max / 16 Plus — the mockup's aspect ratio. The
 * GitHub Action requests the source image at this same size.
 */
export const SHOWCASE_WIDTH = 1290;
export const SHOWCASE_HEIGHT = 2796;
