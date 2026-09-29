/**
 * Locale negotiation — choosing a locale for a request that arrived without
 * one.
 *
 * ---------------------------------------------------------------------------
 * NOTHING CALLS THIS RIGHT NOW. THAT IS ON PURPOSE, AND IT IS REVERSIBLE.
 *
 * Its one caller was `src/proxy.ts`, deleted when the site moved to a static
 * export for Firebase Hosting (claim 005) — Proxy is on the framework's
 * unsupported-for-export list and the build refuses to run while the file
 * exists. The six locale-less entry paths are now answered by a fixed
 * redirect to `en-GB` in `firebase.json`, so the bare domain no longer adapts
 * to the visitor at all.
 *
 * The module is kept rather than deleted because it is the decision, not the
 * plumbing: the priority order below was argued out with the product owner,
 * and the q-value parsing, the country table and the untrusted-input guards
 * are each backed by the assertion harness the file carries. Re-wiring it is
 * one adapter — restore `src/proxy.ts` from git (`git log -- src/proxy.ts`),
 * drop `output: "export"`, and move to a host that runs a server.
 *
 * Read the rest of this comment as a description of how it decides, not of
 * what the deployed site currently does.
 * ---------------------------------------------------------------------------
 *
 * Every real URL on this site carries a locale segment (`/en-GB/plans`), so
 * this module exists for exactly one moment: a visitor lands on `/` or on a
 * bare route and something has to pick for them. The caller redirects; this
 * file decides.
 *
 * **Deliberately framework-free.** Nothing here imports from `next/*`, takes
 * a `NextRequest`, or touches the cookies API. Every function takes plain
 * values — a `Headers`, a string, `null` — and returns plain values. Two
 * reasons: the decision can be exercised in a plain script with no request
 * object and no server, and the proxy stays a thin adapter whose only
 * job is to read a cookie, read a header and build a redirect. A rule that is
 * hard to reach is a rule nobody checks, and a wrong redirect is invisible to
 * the person it happens to — they simply get a site in the wrong language and
 * leave.
 *
 * ## The priority order
 *
 *   1. cookie  — an explicit prior choice
 *   2. country — the CDN's IP geolocation
 *   3. language — the browser's `Accept-Language`
 *   4. `DEFAULT_LOCALE`
 *
 * **IP country outranks `Accept-Language`, and that is a product decision,
 * not an oversight.** The usual engineering advice is the reverse, because
 * `Accept-Language` is a statement about the person while an IP address is a
 * statement about where their packets entered the network. The trade-off was
 * put to the product owner with the failure case spelled out — a traveller or
 * VPN user with a Japanese browser sitting in Kuala Lumpur gets Malay on
 * their first page — and country-first was chosen anyway, knowingly.
 *
 * No measurement backs that choice and none is claimed here; it is a judgement
 * about this product's audience, recorded in
 * `.planning/quick/quick-kayinleong-004/CLAIM.md`. Do not reorder these
 * without revisiting it there, and do not invent a justification for it in
 * this comment later — if the reasoning is ever written down, it belongs in
 * the claim, with whatever evidence prompted it.
 *
 * The first visit is the only one this can get wrong. The language switcher
 * writes `NEXT_LOCALE`, and step 1 then beats step 2 forever after — which is
 * the whole reason the cookie sits above everything. An automatic redirect
 * that overrides a choice the visitor made by hand is a bug, not a feature:
 * the English-speaking expat in Malaysia must not be flipped back to Malay on
 * every single visit.
 *
 * ## Step 2 would not have worked on the current host either
 *
 * Worth knowing before anyone re-wires this expecting the claim-004
 * behaviour: Firebase Hosting injects **none** of the headers in
 * `COUNTRY_HEADERS` — it has no Vercel, Cloudflare or App Engine equivalent
 * to offer. Even with a server in front of it, `countryFromHeaders` would
 * return `null` on every request there and the country step would be dead
 * weight, leaving cookie → `Accept-Language` → `en-GB`. That inverts claim
 * 004's headline decision, which was that country should outrank
 * `Accept-Language`: with no country available, a Japanese speaker in Kuala
 * Lumpur gets Japanese.
 *
 * `null` is the documented normal path — not an error, not something to log —
 * and a table that never matches costs nothing. The failure modes worth
 * guarding are the opposite ones: guessing a country, or throwing when the
 * header is absent.
 *
 * ## Everything here parses untrusted input
 *
 * Both the header and the cookie are attacker-controlled on any host that
 * does not strip them, and the value this module returns is interpolated into
 * a redirect path by the proxy. So nothing is ever returned that did not
 * come out of `isLocale` — not the cookie, not the country lookup — and the
 * `Accept-Language` parser is bounded and cannot throw. See the individual
 * notes below; they each guard a specific way this could go wrong.
 */

import { DEFAULT_LOCALE, isLocale, type Locale } from "./config";

/**
 * The cookie name holding an explicit prior choice.
 *
 * Re-exported, not defined here, so that the proxy has a single import
 * site for everything it needs. It is **declared** in `./config` on purpose:
 * the language switcher is a Client Component and writes this cookie on
 * click, and importing the name from this module would drag the
 * `Accept-Language` parser and the whole country table into the browser
 * bundle to read one string. `./config` is the module documented as
 * client-safe; the constant is free there and expensive here.
 *
 * `./config` also owns `LOCALE_COOKIE_MAX_AGE`, which only the writer needs —
 * it is deliberately not re-exported, since nothing in negotiation sets the
 * cookie.
 */
export { LOCALE_COOKIE } from "./config";

/**
 * ISO 3166-1 alpha-2 (upper-case) -> locale. **Not every country is listed,
 * and that is the point.**
 *
 * Only countries where the choice is unambiguous appear here. A country whose
 * visitors plausibly want either of two locales belongs in neither column —
 * it falls through to `Accept-Language`, which is a statement the visitor
 * actually made.
 *
 *   MY, BN -> ms-MY    Malay is the national language of both; Brunei's
 *                      Standard Malay and Malaysia's share an orthography,
 *                      so one catalogue serves both.
 *   ID     -> id-ID    Indonesian, its own catalogue rather than a Malay
 *                      alias — the two are close but not interchangeable.
 *   CN         -> zh-Hans  Simplified is the written standard.
 *   TW, HK, MO -> zh-Hans  Traditional Chinese is no longer on the site (Hong
 *                      Kong removed in quick-kayinleong-006, Taiwan in
 *                      quick-kayinleong-007), so these Traditional-writing
 *                      regions fall to the one remaining Chinese catalogue,
 *                      Simplified, rather than to English. Their readers get
 *                      mainland glyph forms — the unavoidable cost of dropping
 *                      both Traditional variants.
 *   JP         -> ja-JP
 *
 * **Singapore is deliberately absent.** English is its working language and
 * the language of its schools and business, so an `SG` visitor falls through
 * to their `Accept-Language` — which correctly picks up the Simplified
 * Chinese, Malay or English reader as each of them actually is — and then to
 * `en-GB`. Its absence is a decision, not an omission; do not add it.
 *
 * GB, US, AU and the rest of the anglophone world are absent for a duller
 * reason: they reach `en-GB` through `DEFAULT_LOCALE` anyway, so listing them
 * would add rows that can only ever rot.
 */
export const COUNTRY_LOCALES: Readonly<Record<string, Locale>> = {
  MY: "ms-MY",
  BN: "ms-MY",
  ID: "id-ID",
  CN: "zh-Hans",
  TW: "zh-Hans",
  HK: "zh-Hans",
  MO: "zh-Hans",
  JP: "ja-JP",
};

/**
 * The geolocation headers this app will read, in precedence order.
 *
 * Host-agnostic on purpose — see the module note. `Headers.get` is
 * case-insensitive per the Fetch standard, so `cf-ipcountry` matches the
 * `CF-IPCountry` Cloudflare actually sends; nobody needs to "fix" the casing
 * here.
 *
 *   x-vercel-ip-country  Vercel.
 *   cf-ipcountry         Cloudflare.
 *   x-country            A cross-vendor convention rather than one vendor's
 *                        documented header, cheap to honour. Netlify's own
 *                        geo signal is `x-nf-geo`, base64-encoded JSON, which
 *                        is deliberately not decoded here: base64 + JSON.parse
 *                        on every unprefixed request is not worth one header.
 *   x-geo-country        Common Akamai/Fastly custom-header spelling.
 *   x-appengine-country  Google App Engine.
 */
const COUNTRY_HEADERS = [
  "x-vercel-ip-country",
  "cf-ipcountry",
  "x-country",
  "x-geo-country",
  "x-appengine-country",
] as const;

/**
 * Sentinel values that mean "we could not tell", which must be treated as no
 * answer rather than as a country.
 *
 *   XX  Cloudflare, country unknown.
 *   T1  Cloudflare, a Tor exit node.
 *   ZZ  App Engine's unknown value, and the CLDR/ISO code for "unknown
 *       region" generally.
 *
 * `T1` is already rejected by the two-letter shape check below — it is listed
 * anyway so the intent survives if that check is ever loosened.
 */
const UNKNOWN_COUNTRIES = new Set(["XX", "T1", "ZZ"]);

/** A real ISO 3166-1 alpha-2 code: exactly two letters, nothing else. */
const COUNTRY_CODE = /^[A-Z]{2}$/;

/**
 * Reads a country code from whichever CDN header is present, upper-cased.
 *
 * Returns the first header that yields a usable code. A header carrying an
 * unknown-sentinel or a malformed value is skipped as though it were absent,
 * so a stack where one proxy knows the country and an earlier one does not
 * still resolves.
 *
 * **`null` is the expected answer on a host with no geolocation**, and on
 * every local `next dev` request. Callers must treat it as "no signal" and
 * carry on down the priority order — never as a failure.
 *
 * The shape check is not cosmetic. This value is used as an object key in
 * `negotiateLocale`, and on a host that does not strip inbound `x-*` headers
 * a visitor can set one to anything they like; two ASCII letters cannot name
 * `constructor` or `__proto__`.
 */
export function countryFromHeaders(headers: Headers): string | null {
  for (const name of COUNTRY_HEADERS) {
    const value = headers.get(name);
    if (value === null) continue;

    const code = value.trim().toUpperCase();
    if (!COUNTRY_CODE.test(code)) continue;
    if (UNKNOWN_COUNTRIES.has(code)) continue;

    return code;
  }

  return null;
}

/**
 * How much of an `Accept-Language` header is worth looking at.
 *
 * A browser sends a few dozen characters. These two caps exist because this
 * parser runs in the proxy on every unprefixed request, where a hostile
 * 100 KB header would otherwise buy a request's worth of CPU for the price of
 * one request: the character cap stops `split(",")` allocating a hundred
 * thousand strings, and the entry cap bounds the work after it.
 *
 * The cost of the caps is that a browser sending more than 20 languages loses
 * the tail of its list. No real client does.
 */
const MAX_ACCEPT_LANGUAGE_CHARS = 1024;
const MAX_ACCEPT_LANGUAGE_ENTRIES = 20;

/**
 * `Accept-Language` -> supported locales, best first, q-values honoured.
 *
 * Returns `[]` for a missing, empty or wildcard-only header. A bare `*` means
 * "anything is acceptable", which is no preference at all — expanding it into
 * a locale would dress up a guess as a signal, so it is dropped and the
 * caller falls through to `DEFAULT_LOCALE`.
 *
 * Unsupported languages are dropped rather than approximated: a `de` reader
 * gets English, which is the honest answer.
 *
 * RFC 9110 §12.5.4 defines the grammar and the weights. Two of its rules are
 * easy to get wrong and are handled explicitly below: a missing `q` is `1`,
 * and `q=0` means **not acceptable** — a `de, en;q=0` header is a request for
 * anything except English, so the `en` entry is discarded rather than ranked
 * last.
 */
export function parseAcceptLanguage(header: string | null | undefined): Locale[] {
  if (typeof header !== "string") return [];

  const trimmed = header.trim();
  if (trimmed === "" || trimmed === "*") return [];

  /*
   * A parser reading an attacker-controlled header inside the proxy: a throw
   * here is not a bad locale, it is a 500 on every page of the site. Nothing
   * below throws today — it is string slicing and `parseFloat` — and this
   * catch exists so that stays true after the next edit. It is a circuit
   * breaker, not a place to let a bug hide: `[]` degrades to the default
   * locale, which is always a valid outcome.
   */
  try {
    const matches: { locale: Locale; quality: number }[] = [];

    for (const entry of trimmed
      .slice(0, MAX_ACCEPT_LANGUAGE_CHARS)
      .split(",")
      .slice(0, MAX_ACCEPT_LANGUAGE_ENTRIES)) {
      const parts = entry.split(";");
      const tag = parts[0].trim().toLowerCase();
      if (tag === "" || tag === "*") continue;

      const locale = localeForTag(tag);
      if (locale === null) continue;

      const quality = qualityOf(parts.slice(1));
      if (quality <= 0) continue;

      matches.push({ locale, quality });
    }

    /*
     * `Array.prototype.sort` is required to be stable (ES2019), so entries of
     * equal weight keep their header order — which is exactly what an
     * unweighted `zh-Hans, ja-JP` means. Do not swap this for a hand-rolled
     * sort that loses that property.
     */
    matches.sort((a, b) => b.quality - a.quality);

    const ordered: Locale[] = [];
    for (const match of matches) {
      if (!ordered.includes(match.locale)) ordered.push(match.locale);
    }

    return ordered;
  } catch {
    return [];
  }
}

/**
 * The weight of one entry's parameters, clamped to `[0, 1]`.
 *
 * A missing weight is `1` (RFC 9110 §12.5.4). So is an unparseable one — a
 * malformed `q` is a broken client, not a statement that the language is
 * unwanted, and silently demoting it would be a worse guess than ignoring it.
 * A negative or absurd weight is clamped rather than trusted, so `q=99`
 * cannot jump the queue.
 */
function qualityOf(params: readonly string[]): number {
  for (const param of params) {
    const trimmed = param.trim().toLowerCase();
    if (!trimmed.startsWith("q=")) continue;

    const value = Number.parseFloat(trimmed.slice(2));
    return Number.isNaN(value) ? 1 : Math.min(Math.max(value, 0), 1);
  }

  return 1;
}

/**
 * One lower-cased language tag -> a supported locale, or `null` if none fits.
 *
 * Every language now maps from its primary subtag alone: `en-AU`, `ms-BN`,
 * `ja-JP` and every `zh-*` tag collapse to their one catalogue without reading
 * the rest. Chinese used to need its script/region subtags read to choose
 * between Simplified and Traditional, but Traditional was removed
 * (quick-kayinleong-006 Hong Kong, quick-kayinleong-007 Taiwan), so every `zh`
 * tag now resolves to Simplified.
 *
 * `in` is Indonesian. ISO 639 renamed it to `id` in 1989, but the JDK froze
 * the old code for compatibility and Java-derived stacks — including some
 * still-shipping Android builds — emit `in` to this day. It costs one line.
 *
 * Deliberately unmapped: `yue` (Cantonese). A bare `yue` falls through to the
 * next entry in the header rather than being force-mapped to Mandarin.
 */
function localeForTag(tag: string): Locale | null {
  const subtags = tag.split("-");

  switch (subtags[0]) {
    case "en":
      return "en-GB";
    case "ms":
      return "ms-MY";
    case "id":
    case "in":
      return "id-ID";
    case "ja":
      return "ja-JP";
    case "zh":
      return "zh-Hans";
    default:
      return null;
  }
}

/** Which signal decided the locale. Carried so the proxy can log it. */
export type NegotiationReason = "cookie" | "country" | "language" | "default";

/**
 * The whole decision, in one place.
 *
 * Priority is cookie, then country, then language, then the default — see the
 * module comment for why country sits above language and why the cookie sits
 * above both. Every argument is optional and `null`-tolerant, because on a
 * given host any of the three signals may simply not exist.
 *
 * The returned `locale` always comes from `isLocale`, never straight out of
 * the input or the lookup table. That matters twice over. The cookie is
 * attacker-supplied and ends up in a redirect path, so it is checked against
 * the allow-list rather than trusted. And `COUNTRY_LOCALES` is a plain object
 * literal, so `COUNTRY_LOCALES["constructor"]` returns a function, not
 * `undefined`, and TypeScript's `Record<string, Locale>` will cheerfully call
 * it a `Locale` — a crafted `x-country` header would otherwise redirect to a
 * path built from `Object`'s constructor. The `isLocale` guard closes that,
 * as well as the duller case of a typo in the table above.
 */
export function negotiateLocale(input: {
  cookie?: string | null;
  acceptLanguage?: string | null;
  country?: string | null;
}): { locale: Locale; reason: NegotiationReason } {
  /*
   * Matched exactly, not case-insensitively. This cookie is written by our
   * own language switcher, so a value in the wrong case is a value we did not
   * write; falling through to the next signal is the right response to it.
   */
  if (isLocale(input.cookie)) {
    return { locale: input.cookie, reason: "cookie" };
  }

  if (typeof input.country === "string") {
    const mapped = COUNTRY_LOCALES[input.country.trim().toUpperCase()];
    if (isLocale(mapped)) return { locale: mapped, reason: "country" };
  }

  const preferred = parseAcceptLanguage(input.acceptLanguage);
  if (preferred.length > 0) {
    return { locale: preferred[0], reason: "language" };
  }

  return { locale: DEFAULT_LOCALE, reason: "default" };
}
