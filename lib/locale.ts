import { cookies, headers } from "next/headers";

import {
  dictionaries,
  isLocale,
  parseAcceptLanguage,
  type Dictionary,
  type Locale,
} from "@/lib/i18n";
import { LOCALE_COOKIE } from "@/lib/locale-cookie";

/**
 * Resolves the locale for the current request: the language picked in the
 * footer toggle (`LOCALE_COOKIE`) if there is one, otherwise the browser's
 * `Accept-Language` header. In development only, `proxy.ts` lets `?lang=`
 * stand in for both.
 */
export async function getLocale(): Promise<Locale> {
  const [requestCookies, requestHeaders] = await Promise.all([
    cookies(),
    headers(),
  ]);
  const chosen = requestCookies.get(LOCALE_COOKIE)?.value;
  if (isLocale(chosen)) return chosen;
  return parseAcceptLanguage(requestHeaders.get("accept-language"));
}

export async function getDictionary(): Promise<{
  locale: Locale;
  t: Dictionary;
}> {
  const locale = await getLocale();
  return { locale, t: dictionaries[locale] };
}
