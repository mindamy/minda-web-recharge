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

## Open questions for research

- Whether the default locale stays unprefixed at `/` (preserves every existing URL, but
  needs middleware rewrites or a duplicated route tree under App Router) or moves to
  `/en-GB/` (uniform, but breaks existing links).
- Library vs hand-rolled: whether `next-intl` (or similar) earns its dependency here against
  a ~60-string, zero-plural-rules, static-export-friendly site.
- CJK webfont strategy — subsetting cost for a font with thousands of glyphs versus a
  system-font stack.

## What has changed

_(pending execution)_

## Verification

_(pending execution)_
