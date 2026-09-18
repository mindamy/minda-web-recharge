/**
 * Locale configuration — the single source of truth for which locales exist.
 *
 * These strings are used three ways and are deliberately identical in all
 * three: as the `[locale]` URL segment, as the `<html lang>` attribute, and as
 * the `hreflang` value in `alternates.languages`. `en-GB`, `zh-Hans` and
 * `zh-Hant` are valid BCP-47 tags, so no mapping layer is needed anywhere.
 *
 * This module is safe to import from Client Components — it contains no
 * catalogue data. The catalogues themselves are reachable only through
 * `./dictionaries`, which is server-only.
 */

export const LOCALES = ["en-GB", "zh-Hans", "zh-Hant"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en-GB";

/**
 * Autonyms for the language switcher — each locale named in its own language,
 * which is the accessibility convention for a language picker. These are not
 * catalogue entries: they read the same whichever locale the page is in.
 */
export const LOCALE_LABELS: Record<Locale, string> = {
  "en-GB": "English",
  "zh-Hans": "简体中文",
  "zh-Hant": "繁體中文",
};

/** Narrows an arbitrary string (a URL segment, a cookie) to a supported locale. */
export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}

/**
 * Prefixes an app-relative path with a locale segment.
 *
 * Route slugs stay in English across every locale (`/zh-Hant/how-it-works`),
 * so this is a pure string concatenation with no lookup table — and therefore
 * no way for a language switch to land on a 404.
 *
 *   localePath("zh-Hant", "/plans") -> "/zh-Hant/plans"
 *   localePath("en-GB", "/")        -> "/en-GB"
 */
export function localePath(locale: Locale, path: string): string {
  if (path === "/" || path === "") return `/${locale}`;
  return `/${locale}${path.startsWith("/") ? path : `/${path}`}`;
}
