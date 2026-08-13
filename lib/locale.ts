import { headers } from "next/headers";

import {
  dictionaries,
  isLocale,
  LOCALE_HEADER,
  parseAcceptLanguage,
  type Dictionary,
  type Locale,
} from "@/lib/i18n";

/**
 * Resolves the locale for the current request.
 *
 * The middleware normally decides it (honouring `?lang=` and the locale
 * cookie) and forwards it on `x-locale`; the `Accept-Language` fallback keeps
 * this working for requests the middleware matcher skips.
 */
export async function getLocale(): Promise<Locale> {
  const requestHeaders = await headers();
  const fromMiddleware = requestHeaders.get(LOCALE_HEADER);

  if (isLocale(fromMiddleware)) return fromMiddleware;

  return parseAcceptLanguage(requestHeaders.get("accept-language"));
}

export async function getDictionary(): Promise<{
  locale: Locale;
  t: Dictionary;
}> {
  const locale = await getLocale();
  return { locale, t: dictionaries[locale] };
}
