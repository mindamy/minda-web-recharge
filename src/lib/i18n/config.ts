/**
 * Locale configuration — the single source of truth for which locales exist.
 *
 * These strings are used three ways and are deliberately identical in all
 * three: as the `[locale]` URL segment, as the `<html lang>` attribute, and as
 * the `hreflang` value in `alternates.languages`. Every one of them is a valid
 * BCP-47 tag, so no mapping layer is needed anywhere.
 *
 * This module is safe to import from Client Components — it contains no
 * catalogue data. The catalogues themselves are reachable only through
 * `./dictionaries`, which is server-only.
 */

/**
 * The supported locales, **in switcher order**.
 *
 * Latin block first, then the CJK block, so a reader scanning for their own
 * script stops scanning early rather than reading all seven. English leads as
 * the default and Malay as the home market; nothing else reads this order —
 * `DEFAULT_LOCALE` is set explicitly below, `generateStaticParams` is
 * order-free, and `alternates.languages` is a map.
 *
 * `zh-Hant` and `zh-HK` are both Traditional and are genuinely different
 * catalogues, not one copied over the other: Hong Kong writes 支援 where
 * Taiwan writes 支持, 計劃 for 方案, 7 日 for 7 天, 毋須 for 免綁.
 */
export const LOCALES = [
  "en-GB",
  "ms-MY",
  "id-ID",
  "zh-Hans",
  "zh-Hant",
  "zh-HK",
  "ja-JP",
] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en-GB";

/**
 * Autonyms for the language switcher — each locale named in its own language,
 * which is the accessibility convention for a language picker. These are not
 * catalogue entries: they read the same whichever locale the page is in.
 *
 * The two Traditional entries carry a region in parentheses. A bare 繁體中文
 * against one of a pair is ambiguous — a Hong Kong reader has no way to tell
 * which of the two is theirs — and the flags alone cannot resolve it for a
 * reader who is scanning the words.
 */
export const LOCALE_LABELS: Record<Locale, string> = {
  "en-GB": "English",
  "ms-MY": "Bahasa Melayu",
  "id-ID": "Bahasa Indonesia",
  "zh-Hans": "简体中文",
  "zh-Hant": "繁體中文（台灣）",
  "zh-HK": "繁體中文（香港）",
  "ja-JP": "日本語",
};

/**
 * The cookie holding a locale the visitor chose **explicitly**, in the
 * switcher.
 *
 * It lives here rather than in `./negotiate` on purpose. The language switcher
 * is a Client Component and writes this cookie on click; `./negotiate` also
 * carries the Accept-Language parser and the country table, and importing the
 * name from there would pull all of that into the browser bundle to read one
 * string. This module is already client-safe and already imported by the
 * switcher, so the constant costs nothing here.
 *
 * `NEXT_LOCALE` is the conventional name. Nothing in the framework reads it —
 * the App Router has no built-in i18n — but a reader who has seen it before
 * will guess right, and a future migration onto a library will find it where
 * it expects to.
 *
 * What it means matters more than where it lives: this cookie is a *decision*,
 * not a cache. `negotiateLocale` therefore ranks it above the IP country, so
 * an English-speaking reader in Kuala Lumpur who picks English once is not
 * flipped back to Malay on their next visit.
 */
export const LOCALE_COOKIE = "NEXT_LOCALE";

/** A year. Long enough that a returning reader keeps their choice. */
export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

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
