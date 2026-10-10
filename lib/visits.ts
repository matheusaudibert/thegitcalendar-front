/**
 * Site-wide visit counter, kept in Upstash Redis through its REST API.
 *
 * Server-only: the token is read from non-public env vars. Vercel's Upstash
 * integration provides `KV_REST_API_URL` / `KV_REST_API_TOKEN`; a store made
 * on upstash.com directly provides the `UPSTASH_REDIS_REST_*` pair.
 *
 * Without either, `next dev` falls back to an in-memory counter seeded from
 * `DEV_VISITS_SEED` (set it in `.env.local`), so the section can be worked on
 * locally. Production never takes that path: there the counter is just
 * unavailable until a store is connected.
 */

const KEY = "visits";

function credentials() {
  const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;
  return url && token ? { url, token } : null;
}

type Command = "get" | "incr";

/**
 * Lives for as long as the dev server process; restarting it resets the
 * count, which is all a local preview needs. Held on `globalThis` because the
 * page and the API route can load separate copies of this module in dev, and
 * both must see the same count.
 */
const devStore = globalThis as typeof globalThis & { __devVisits?: number };

function devCounter(command: Command) {
  devStore.__devVisits ??= Number(process.env.DEV_VISITS_SEED ?? 0);
  if (command === "incr") devStore.__devVisits += 1;
  return devStore.__devVisits;
}

/** Runs one Redis command, or returns `null` when it cannot. */
async function redis(command: Command): Promise<number | null> {
  const creds = credentials();
  if (!creds) {
    return process.env.NODE_ENV === "development" ? devCounter(command) : null;
  }

  try {
    const res = await fetch(`${creds.url}/${command}/${KEY}`, {
      headers: { Authorization: `Bearer ${creds.token}` },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const { result } = (await res.json()) as { result: string | number | null };
    // GET on a key that was never set returns null: nobody has visited yet.
    return result === null ? 0 : Number(result);
  } catch {
    // A counter outage must never take the page down with it.
    return null;
  }
}

export function getVisits() {
  return redis("get");
}

export function incrementVisits() {
  return redis("incr");
}
