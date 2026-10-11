/**
 * The visitor's language choice from the footer toggle. Kept apart from
 * `lib/locale.ts`, which imports `next/headers` and so cannot reach the client.
 */
export const LOCALE_COOKIE = "locale";
