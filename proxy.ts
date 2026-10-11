import { NextResponse, type NextRequest } from "next/server";

import { isLocale } from "@/lib/i18n";

/**
 * Development-only language override: `?lang=en` or `?lang=pt` stands in for
 * the browser's `Accept-Language` and the footer toggle's cookie, so either
 * translation can be checked without changing browser settings. In production
 * the parameter is ignored (see `lib/locale.ts`).
 */
export function proxy(request: NextRequest) {
  if (process.env.NODE_ENV !== "development") return NextResponse.next();

  const lang = request.nextUrl.searchParams.get("lang");
  if (!isLocale(lang)) return NextResponse.next();

  const headers = new Headers(request.headers);
  headers.set("accept-language", lang);
  // The toggle's cookie outranks the header, so it is dropped for this request.
  headers.delete("cookie");
  return NextResponse.next({ request: { headers } });
}

export const config = {
  // Only requests that carry the parameter, so ordinary traffic never runs it.
  matcher: [{ source: "/:path*", has: [{ type: "query", key: "lang" }] }],
};
