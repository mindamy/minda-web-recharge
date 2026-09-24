/**
 * Server-only catalogue loader.
 *
 * This module is self-guarding: it imports `next/root-params`, which "cannot
 * be used in Client Components" and fails the **build** if it reaches one, so
 * no `server-only` package and no discipline-based convention is required to
 * keep the catalogues off the client graph.
 *
 * The loader map is static, one `import()` per locale. Never make the
 * specifier a template string — a dynamic specifier makes the bundler emit a
 * context module over the whole `messages/` directory, which both ships every
 * locale and erases the compile-time key checking that `Messages` exists for.
 *
 * Because every layout and page under `app/` is a Server Component by
 * default, catalogue size has no effect on the browser bundle: this code runs
 * only on the server and only the resulting HTML is sent.
 */

import { locale as rootLocale } from "next/root-params";

import { DEFAULT_LOCALE, isLocale, type Locale } from "./config";
import type { ClientMessages, Messages } from "./types";

type CatalogueLoader = () => Promise<{ default: Messages }>;

/**
 * The locale -> catalogue map.
 *
 * `Record<Locale, CatalogueLoader>` — deliberately total, not `Partial`.
 * Adding a locale to `LOCALES` without adding its catalogue here is a
 * `tsc --noEmit` failure rather than a page that silently serves English.
 *
 * This annotation is also what enforces catalogue parity: every loader's
 * return is checked against `Messages` (i.e. against `en-GB.json`), so a key
 * that is missing, misspelt, or the wrong kind in a translated file fails the
 * build instead of rendering blank for a reader who cannot report it.
 *
 * Each specifier is a string literal, never a template — a dynamic specifier
 * makes the bundler emit every catalogue into one chunk.
 */
const dictionaries: Record<Locale, CatalogueLoader> = {
  "en-GB": () => import("@/messages/en-GB.json"),
  "ms-MY": () => import("@/messages/ms-MY.json"),
  "id-ID": () => import("@/messages/id-ID.json"),
  "zh-Hans": () => import("@/messages/zh-Hans.json"),
  "zh-Hant": () => import("@/messages/zh-Hant.json"),
  "zh-HK": () => import("@/messages/zh-HK.json"),
  "ja-JP": () => import("@/messages/ja-JP.json"),
};

/**
 * The current locale, read from the root route parameter.
 *
 * Narrowed rather than asserted: `dynamicParams = false` already makes an
 * unknown segment a 404 at the router, so this fallback is defence in depth
 * for contexts the router does not cover (for example `global-not-found`).
 */
export async function getLocale(): Promise<Locale> {
  const value = await rootLocale();
  return isLocale(value) ? value : DEFAULT_LOCALE;
}

/**
 * The catalogue for the current locale.
 *
 * Call it with no argument from any Server Component — there is no prop
 * drilling, and no `params` to thread through. Pass an explicit locale only
 * where there is no root param to read (metadata for a sibling locale, a
 * sitemap enumerating every locale).
 */
export async function getDictionary(locale?: Locale): Promise<Messages> {
  const target = locale ?? (await getLocale());
  const load = dictionaries[target] ?? dictionaries[DEFAULT_LOCALE];

  if (!load) {
    throw new Error(`No message catalogue is registered for locale "${target}".`);
  }

  return (await load()).default;
}

/**
 * The only slice permitted to cross into the client graph.
 *
 * Keeping the selection in one function — rather than inline at the provider
 * call site — means the size of the flight payload is auditable by reading
 * this list, not by reading a bundle report.
 */
export function selectClientMessages(messages: Messages): ClientMessages {
  return {
    nav: messages.chrome.nav,
    localeSwitcher: messages.chrome.localeSwitcher,
    cta: messages.common.cta,
    brand: messages.common.brand,
  };
}
