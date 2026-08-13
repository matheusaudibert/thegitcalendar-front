import { NextResponse, type NextRequest } from "next/server";

import {
  isLocale,
  LOCALE_COOKIE,
  LOCALE_HEADER,
  parseAcceptLanguage,
} from "@/lib/i18n";

const ONE_YEAR_IN_SECONDS = 60 * 60 * 24 * 365;

export function proxy(request: NextRequest) {
  const requested = request.nextUrl.searchParams.get("lang");
  const explicit = isLocale(requested) ? requested : null;

  const stored = request.cookies.get(LOCALE_COOKIE)?.value;
  const remembered = isLocale(stored) ? stored : null;

  const locale =
    explicit ??
    remembered ??
    parseAcceptLanguage(request.headers.get("accept-language"));

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(LOCALE_HEADER, locale);

  const response = NextResponse.next({ request: { headers: requestHeaders } });

  if (explicit && explicit !== remembered) {
    response.cookies.set(LOCALE_COOKIE, explicit, {
      path: "/",
      maxAge: ONE_YEAR_IN_SECONDS,
      sameSite: "lax",
    });
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};
