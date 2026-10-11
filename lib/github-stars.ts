// `FETCHED_STARS` is rewritten by .github/workflows/update-github-stars.yml —
// do not edit it by hand.
// Refreshed once a day so the page never calls the GitHub API at runtime.
const FETCHED_STARS = 0;

/** `NEXT_PUBLIC_GITHUB_STARS` in `.env.local` overrides it for local previews. */
export const GITHUB_STARS =
  Number(process.env.NEXT_PUBLIC_GITHUB_STARS) || FETCHED_STARS;
