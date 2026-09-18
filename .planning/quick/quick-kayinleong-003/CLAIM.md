# Claim: quick-kayinleong-003

- owner: kayinleong
- session: claude-code
- branch: main
- started: 2026-09-18
- status: claimed
- summary: Externalise all UI copy into JSON message catalogues and add Simplified and Traditional Chinese alongside British English, with a language switcher in the site chrome.

## What will change

Follow-on to [quick-kayinleong-001] (site build) and [quick-kayinleong-002] (brand + motion).
The site today is monolingual: every user-facing string is a literal inside a `.tsx`
component or a co-located data module (`src/lib/nav.ts`, `src/components/sections/rhythm/timeline.ts`,
`src/components/sections/r3/loopNodes.ts`), and `src/app/layout.tsx` hardcodes `lang="en"`.

Planned change:

1. **Message catalogues** — move every user-facing string out of TSX into JSON, one file
   per locale, so translation is a data edit rather than a code edit.
2. **Three locales** — `en-GB` (existing copy, British spellings preserved),
   `zh-Hans` (Simplified) and `zh-Hant` (Traditional).
3. **Locale-prefixed routing** — Chinese served from a URL path prefix so each locale is
   independently shareable and crawlable.
4. **Language switcher** — a dropdown in the site chrome that preserves the current route.
5. **CJK typography** — Playfair Display and Outfit are Latin-only; Chinese needs a font
   fallback that does not regress the Latin rendering.

## Locked decisions (user, at claim time)

| Decision | Choice | Notes |
|----------|--------|-------|
| Chinese variant | **Both** — `zh-Hans` and `zh-Hant` | Three locales total, not two. Triples the translation surface and the switcher has three entries. |
| Locale in URL | **Path prefix** | English stays canonical; Chinese served under a prefix. Rejected: cookie-only (not shareable/indexable) and subdomain (needs DNS outside this repo). |
| Branch | **main, direct** | Matches claims 001 and 002. Deviates from the global "main is protected, work flows through PRs" rule; taken as an explicit user decision, recorded not assumed. |

## Locked decisions — round 2 (user, after routing research)

| Decision | Choice | Notes |
|----------|--------|-------|
| Default-locale URL | **Prefix every locale** | `/en-GB/...`, `/zh-Hans/...`, `/zh-Hant/...`. Reverses the "English stays at `/plans`" reading of the round-1 choice, surfaced to the user rather than switched silently. |
| Old URLs | **6-entry `redirects()` table, 308** | `/`, `/how-it-works`, `/the-r3-experience`, `/plans`, `/trust-and-approach`, `/about` each permanently redirect to their `/en-GB/` counterpart. |
| Launch status | **Not launched, no traffic** | Confirmed by the user. The canonical-URL move therefore carries no SEO cost; redirects are belt-and-braces, not damage control. |

### Why English could not stay unprefixed

`usePathname()` on a prerendered page reached through a rewrite is a documented cause of
hydration mismatch (`use-pathname.md:37`), and `src/components/chrome/Header.tsx:30` gates the
entire scroll-spy on `pathname === "/"`. The rewrite variant of "English stays at `/`" would
have killed the scroll-spy silently — green build, green types, broken page. The alternative
(a duplicated route tree with two root layouts) still forces the same experimental
`globalNotFound` handling, so it buys nothing.

## Research answers adopted

- **No i18n dependency.** `next-intl@4.14.5` is genuinely Next-16 compatible but drags
  `@swc/core` + `@parcel/watcher` in for ~60–120 strings with no plurals, dates or numbers.
  Hand-rolled is ~100 lines and gives compile-time missing-key detection. Zero new packages.
- **`app/[locale]/` + `next/root-params`** (new in v16.3.0 — three patches before the installed
  16.3.5). There is no App Router i18n config; the `next.config` `i18n` key is Pages-Router-only.
- **No `proxy.ts`.** (`middleware.ts` is deprecated and renamed `proxy.ts` in v16 — noted so no
  executor writes one from memory.) A static redirect covers `/` without putting a Node function
  in front of every request.
- **Route slugs stay English in all locales** — `/zh-Hant/how-it-works`. Makes the switcher a
  pure first-segment swap: no slug map, no 404 mid-switch.
- **Server reads, client receives.** Client Components never import a catalogue; a server parent
  passes a narrow slice through a provider. A barrel import from `"use client"` would bundle all
  three locales with no warning.
- **`globalNotFound` + `app/global-not-found.tsx`** required, because the root layout moves under
  a dynamic segment. It bypasses the layout, so `globals.css` and both fonts must be re-imported
  there or the branded 404 ships unstyled.

## What has changed

_(pending execution)_

## Verification

_(pending execution)_
