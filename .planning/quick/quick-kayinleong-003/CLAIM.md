# Claim: quick-kayinleong-003

- owner: kayinleong
- session: claude-code
- branch: main
- started: 2026-09-18
- status: done
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

- [x] `src/messages/{en-GB,zh-Hans,zh-Hant}.json` — 195 entries each, structurally identical
- [x] `src/lib/i18n/**` — config, structural `Messages` type, server loader, client provider, `interpolate`
- [x] `src/components/ui/RichText.tsx` — shared renderer with a mark registry
- [x] Route tree moved under `src/app/[locale]/`; 18 routes, all prerendered static
- [x] Six 308 redirects recover every pre-i18n URL; `dynamicParams = false` 404s unknown locales
- [x] `experimental.globalNotFound` + `app/global-not-found.tsx`, with styles and fonts re-imported
- [x] All 25 components migrated off literals
- [x] Per-locale CJK type stacks; `@theme inline` `var()` indirection; italic and tracking neutralised on Han
- [x] `LanguageSwitcher` in header bar, burger sheet and footer
- [x] Locale-blind scroll-spy fixed; internal hrefs locale-prefixed

## Verification

### Automated gates (all passing at HEAD)

| Gate | Result |
|------|--------|
| `npm run typecheck` | clean — and now meaningful: both Chinese catalogues are checked against `en-GB`'s shape |
| `npx eslint src` | 0 warnings |
| `npm run build` | 18 routes, all `●` static |
| Catalogue parity (own script) | 0 missing, 0 extra, 0 kind mismatches, all 8 marks preserved |
| Client-bundle leak | 0 catalogue imports across all 8 real client components |
| Legacy URLs | all six 308 to `/en-GB/…`; `/fr/plans` → 404 |
| hreflang | three-way cross-reference + per-locale canonical on every page |

### The goal, tested directly

The requirement was that copy live in JSON rather than in the TSX. Verified **both directions**:

- **No copy left in TSX.** A literal sweep returned 46 candidates; all 46 were Tailwind class
  lists or CSS values (multi-line `className` continuations my heuristic mis-parsed). Zero real
  copy.
- **Nothing rendered that is not in the catalogue.** Extracting visible text from all six
  prerendered `en-GB` pages left exactly 7 fragments unaccounted for, every one explained: five
  `<title>`s composed by Next from `%s` + catalogue parts, the `English` autonym (deliberately
  not a catalogue entry — it reads the same in every locale), and the `{year}` interpolation.
- **No English leaking into Chinese.** Latin-only fragments on both Chinese locales: only
  `RECONNECT` / `REALIGN` / `RECHARGE`, left Latin on purpose (see Open decisions), plus the
  brand name.

### Rendered verification (real browser, production build)

Compiling was never treated as evidence — this codebase has shipped invisible content twice.

- `/zh-Hant/plans` reached **via the switcher from `/en-GB/plans`**: landed on the same page,
  `<html lang="zh-Hant">`, title `方案｜Recharge`.
- Chinese headlines rasterise in **Songti SC/TC**, body in **PingFang SC/TC** — confirmed with
  `CSS.getPlatformFontsForNode`, i.e. actual glyph rasterisation, not the resolved family string.
  `zh-Hant` genuinely gets the Traditional face, not the Simplified one.
- Per-character matching holds: `Recharge`, `R³` and `AI` stay in Playfair/Outfit **inside**
  Chinese sentences.
- Hero keeps all four gradient runs after translation; `R³` keeps its superscript.
- Scroll-spy advances through all eight sections on `/en-GB`; standalone routes light the
  correct item.
- English hero still balances to the deck's five-line shape.

## Regression Report

### Regression surface

Every rendered string and every route changed, so the surface is the whole site. The specific
risks were: strings lost or altered in migration, English silently served on a Chinese route,
catalogues leaking into client bundles, the pre-i18n URLs breaking, and Latin typography
regressing while Han was added.

### Defects found and fixed

1. **The scroll-spy died silently.** `Header.tsx` compared `pathname` against `"/"` and against
   literal hrefs; both go permanently false under a locale prefix, so the `IntersectionObserver`
   never mounted. Types and build stayed green. Fixed via a locale-stripping helper; verified by
   scrolling a real browser, not by building.

2. **The deck's one serif button had never been serif.** `Button`'s cva base carries `font-sans`
   and `Plans.tsx` added `font-display`; single-class utilities in one layer resolve by compiled
   source order, not attribute order, and `.font-sans` is emitted later. **Pre-existing and
   invisible in English** — it surfaced only because in Chinese it would have set that label in
   黑体 beneath a 宋体 heading.

3. **`@theme inline` would have silently defeated the whole font swap.** Tailwind v4 inlines font
   tokens into `.font-sans`/`.font-display` instead of emitting `var()`, so a `:lang()` override
   alone would have left the Logo, Hero lead and Plans button on Playfair with no error. Fixed
   with a `var()` indirection, proved against the compiled artifact.

4. **Plan CTAs lost the reader's locale.** `/plans?plan=essential` clicked from `/zh-Hant/plans`
   hit the unprefixed route and 308'd back into `/en-GB`. Nothing failed. Now routed through
   `localePath`.

5. **The header was cramped from 1024px.** Partly pre-existing (labels already wrapped to two
   lines), worsened by the 74px switcher to three. Forcing one line overflows by 150px, so the
   nav/burger switch moved from `lg` to `xl`. Found by looking at the page — six agents had
   measured only 1440/1280/1180/1024/390 and none caught it.

6. **Two WCAG 2.5.8 target-size failures** in the new switcher (22px footer links, 34px sheet
   pills), found by measuring and fixed to 30px/38px.

7. **`globalNotFound` is `experimental.globalNotFound`.** Research had it top-level, where it
   would have been silently ignored.

8. **A researched rule measured harmful and was dropped.** `text-wrap: pretty` for `zh`
   paragraphs does nothing on Han in Chromium, and being unlayered it beat the existing
   `balance` and reintroduced the orphan it was meant to prevent.

### Ruled out, and why

- **Catalogues in client bundles.** The failure mode is silent and triples the copy shipped.
  All 8 real `"use client"` files verified free of catalogue imports — matching on `import`
  statements, since the bare path appears in doc comments warning against it. Copy was stripped
  from `loopNodes.ts` so the client-side `LoopArcs` could not reach for it.
- **A false client/server map.** `grep -rl '"use client"'` matched the phrase inside doc
  comments and wrongly flagged `Connected.tsx`, `AuroraField.tsx` and `ScatterField.tsx`.
  Re-derived from line-1 directives; the brief was corrected mid-wave.
- **Static rendering lost.** No `proxy.ts` was created, and the switcher avoids
  `useSearchParams()` — in a root-layout component it would have opted all 18 routes out of
  prerendering. Build still reports every route static.
- **Latin typography regressing.** English italic, wordmark tracking and body leading are
  unchanged; the type-scale overrides are scoped to `html:lang(zh*)`.
- **Locale-switch flash.** A root-param change remounts `MotionProvider`; switching mid-scroll
  produced no stranded-invisible section.
- **Translation drift on medical copy.** The disclaimer is a single shared key, so the two call
  sites cannot diverge.

### Accepted changes that were not asked for

**~15 hand-placed responsive line breaks were removed.** `<br className="hidden sm:inline" />`
cannot survive translation, and the catalogue stores those strings flat; splitting a translated
string at English word positions would be wrong. `text-wrap: balance` replaces them — and those
`<br>`s had in fact been *overriding* a `balance` rule `globals.css` already applied to headings.
The English hero still lands on the deck's five-line shape. Reversible per string by promoting
it to a catalogue line array.

### Not covered

- **No automated tests.** The project has none and none were requested; verification is the
  gates above plus rendered measurement.
- **One browser engine** (Chromium 153). Windows SimSun/PMingLiU, iOS Songti availability and
  Android's Noto weight axis are unverified and need real devices — the display stack on Windows
  falls to bitmap-era faces that look coarse at the 56px h1 ceiling.
- **`prefers-reduced-motion`** verified by reading emitted CSS, not by toggling the OS setting.
- **Translation reviewed by no native speaker.** Structure is machine-verified; register,
  idiom and the medical wording want a human pass.
- **A dangling URL fragment** (one matching no element) is dropped by the App Router on
  client-side locale switch. Characterised over 3 trials, documented in the component; a
  fragment that points at something survives.

## Open decisions for the copy owner

Surfaced, not silently resolved:

1. **`RECONNECT` / `REALIGN` / `RECHARGE`** stay Latin on Chinese pages. They are the three
   R-words the `R³` glyph counts; translating only two renders `重新连接 / 重新校准 / RECHARGE`,
   and translating all three loses the `R³` tie.
2. **Plan tier names** (Essential / Rhythm / Plus) translated as descriptive words. If they are
   brand-owned names they should stay Latin.
3. **`陪伴支持，而非诊断`** for "Support, not diagnose." The added 陪伴 ("accompany") is warmer
   and deliberately weaker than the English, so it adds no claim — but legal may want the flatter
   `支持，而非诊断`.
4. **`seeHowItWorks`** shortened to `运作方式` to fit the button; the fuller `了解运作方式` is
   better copy if that button has room.
5. **`metadataBase` has no real domain.** It reads `NEXT_PUBLIC_SITE_URL` and falls back to
   `https://recharge.example.com`, which currently ships in the `hreflang` and canonical links.
   **Needs a real value before launch.**
