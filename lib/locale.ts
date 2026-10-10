import { headers } from "next/headers";

import {
  dictionaries,
  parseAcceptLanguage,
  type Dictionary,
  type Locale,
} from "@/lib/i18n";

/**
 * Resolves the locale for the current request from the browser's
 * `Accept-Language` header. There is deliberately no override for visitors —
 * no cookie, no switcher: they always get their own language. In development
 * only, `proxy.ts` lets `?lang=` stand in for the header.
 */
export async function getLocale(): Promise<Locale> {
  const requestHeaders = await headers();
  return parseAcceptLanguage(requestHeaders.get("accept-language"));
}

export async function getDictionary(): Promise<{
  locale: Locale;
  t: Dictionary;
}> {
  const locale = await getLocale();
  return { locale, t: dictionaries[locale] };
}
