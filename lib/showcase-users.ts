/**
 * GitHub handle featured in the hero's phone mockup wallpaper.
 *
 * The wallpaper is no longer fetched live from the image API — that GET
 * added a visible delay before the graph appeared. A GitHub Action
 * (`.github/workflows/update-commit-preview.yml`) regenerates
 * `public/commit-preview.png` for this user on a schedule and commits it to
 * the repo, so the hero just serves it as a static asset.
 */
export const SHOWCASE_USER = "matheusaudibert";

/** Pre-rendered by the GitHub Action above — kept in sync automatically. */
export const WALLPAPER_URL = "/commit-preview.png";

/**
 * iPhone 15 Plus / 15 Pro Max / 16 Plus — the mockup's aspect ratio. The
 * GitHub Action requests the source image at this same size.
 */
export const SHOWCASE_WIDTH = 1290;
export const SHOWCASE_HEIGHT = 2796;

export function githubProfileUrl(username: string) {
  return `https://github.com/${username}`;
}
