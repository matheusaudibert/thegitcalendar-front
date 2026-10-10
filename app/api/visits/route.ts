import { incrementVisits } from "@/lib/visits";

/**
 * Counts one visit. Called from the browser rather than during render, so
 * crawlers and link-preview bots — which do not run JavaScript — stay out of
 * the count.
 */
export async function POST() {
  const visits = await incrementVisits();
  if (visits === null) {
    return Response.json({ error: "Counter unavailable" }, { status: 503 });
  }
  return Response.json({ visits });
}
