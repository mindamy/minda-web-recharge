# Typography research — Chinese (`zh-Hans` / `zh-Hant`) for Recharge

**Claim:** quick-kayinleong-003
**Researched:** 2026-09-18
**Scope:** font strategy, per-locale stack mechanics, CJK layout/metrics risk. Routing and string extraction are owned by sibling agents.

> **Provenance key.** `[VERIFIED: …]` = confirmed this session by opening the file / running the probe, with the output or the quoted line beside it. `[CITED: …]` = taken from an authoritative document. `[ASSUMED]` = training knowledge, not confirmed here — treat as needing confirmation before it becomes a locked decision.

---

## Recommendation

1. **Do not webfont the body text.** Measured: serving `Noto Sans SC` as a webfont costs **786 KB over 15 requests** for a page with ~230 distinct characters; `Noto Sans TC` costs **979 KB**. Add a CJK serif for headlines from the same source and `zh-Hant` reaches **~2.3 MB**. `[VERIFIED: probe, see §2]` That is not a trade-off, it is a different website.

2. **Body and UI: a per-locale system CJK stack. Zero bytes, zero CLS, zero build steps.** Exact stacks:

   ```css
   /* zh-Hans — body / UI */
   var(--font-outfit), "PingFang SC", "Microsoft YaHei UI", "Microsoft YaHei",
   "Source Han Sans SC", "Noto Sans CJK SC", "Noto Sans SC",
   "Hiragino Sans GB", "Heiti SC", sans-serif

   /* zh-Hant — body / UI */
   var(--font-outfit), "PingFang TC", "PingFang HK",
   "Microsoft JhengHei UI", "Microsoft JhengHei",
   "Source Han Sans TC", "Noto Sans CJK TC", "Noto Sans TC",
   "Heiti TC", sans-serif
   ```

3. **Display / headlines: a Song (宋体/明體) stack, not the body sans.** Song is the native Han analogue to a Latin serif — modulated strokes, triangular 頓 terminals, genuine thick/thin contrast — and it is the only way to preserve the serif-display-against-sans-body hierarchy this design is built on. At the design's **weight 400** it reads considered and literary, which suits a wellbeing brand; the memorial/officialese association attaches to *heavy* Song, which this design never uses. Exact stacks:

   ```css
   /* zh-Hans — display */
   var(--font-playfair), "Songti SC", "STSong",
   "Source Han Serif SC", "Noto Serif CJK SC", "Noto Serif SC",
   SimSun, NSimSun, serif

   /* zh-Hant — display */
   var(--font-playfair), "Songti TC", "LiSong Pro", "Apple LiSung",
   "Source Han Serif TC", "Noto Serif CJK TC", "Noto Serif TC",
   PMingLiU, MingLiU, serif
   ```

   The trailing generic `serif` is load-bearing, not decoration: Android's `fonts.xml` maps `serif` + `lang="zh-Hans"` / `lang="zh-Hant"` to `NotoSerifCJK-Regular.ttc`, so the generic keyword resolves to the correct *regional* Song face automatically. `[CITED: android.googlesource.com/platform/frameworks/base/+/refs/heads/main/data/fonts/fonts.xml]`

4. **Latin inside Chinese sentences needs no special handling.** `var(--font-outfit)` / `var(--font-playfair)` stay *first* in every stack. CSS font matching runs per character, so `Recharge` and `R³` resolve in Outfit/Playfair and only the codepoints those faces lack fall through to the CJK families. Verified that the metric-override fallback faces cannot steal Chinese: Arial, Times New Roman and Helvetica contain **no** CJK ideographs and **no** CJK/fullwidth punctuation. `[VERIFIED: cmap probe, see §4]`

5. **The swap mechanism is a `:lang()` block redefining custom properties — but it needs one extra level of indirection**, because `@theme inline` *inlines* the font token into `.font-sans` / `.font-display` instead of emitting `var(--font-sans)`. Without the indirection the Logo wordmark, the Hero serif lead and the Plans serif button silently stay on Playfair. Full mechanism in §4. `[VERIFIED: .next/static/chunks/2ejqahnqop129.css]`

6. **The type scale, by contrast, needs no indirection at all.** The plain `@theme` block emits real custom properties and every `.text-*` utility reads them through `var()`. Redefining `--text-h1--line-height` / `--text-eyebrow--letter-spacing` under `html:lang(zh-Hans)` reaches every call site with **zero component edits**. `[VERIFIED: compiled `.text-h1{font-size:var(--text-h1);line-height:var(--tw-leading,var(--text-h1--line-height))}`]`

7. **Loosen leading and kill tracking under `:lang(zh)`.** The scale's 1.1–1.22 display leading is tuned to Outfit's 0.51em x-height; Han glyphs fill the em box and will visually collide at 1.1. The eyebrow's `+0.16em` tracking is the single most visible CJK mistake in this codebase. Concrete values in §6.

8. **Kill italic under `:lang(zh)`.** `Trust.tsx:194` sets a gradient headline run in italic. There is no Han italic; browsers synthesise one by shearing, which is a cardinal CJK error. Needs `font-style: normal` + `font-synthesis-style: none`, and a different emphasis device for that line.

9. **Follow-on (separate claim, ~50–90 KB per locale):** layer a **subsetted `Noto Serif SC` / `Noto Serif TC`** in front of the system Song names via `next/font/local`, generated from the locale string catalogue at build time, gated by a coverage check that fails the build on drift. Justification and the fragility analysis are in §2(c). The defect this fixes is specific: on Windows the display stack lands on **SimSun / PMingLiU**, which are hinted bitmap-era faces that look coarse at the h1 clamp ceiling of 56px — the one substitution that most undermines a design whose entire premise is a high-contrast display serif.

10. **Ship order.** Bullets 2–8 are one CSS block plus two small component fixes and are shippable inside this claim. Bullet 9 is not a quick task and should not be forced into one.

---

## 1. Verifying the coverage claim, and what `subsets` actually does

### The two current faces have no CJK coverage

From the font metadata bundled inside the installed `next` package — not from memory, and not from the Google Fonts website:

| Family | Declared `subsets` | Styles |
|---|---|---|
| `Playfair Display` | `["cyrillic","latin","latin-ext","vietnamese"]` | `["normal","italic"]` |
| `Outfit` | `["latin","latin-ext"]` | `["normal"]` |

`[VERIFIED: node_modules/next/dist/compiled/@next/font/dist/google/font-data.json]`

Corroborated against the live Google Fonts CSS2 API: `Playfair Display` returns **8** `@font-face` blocks and `Outfit` returns **2**, all labelled `cyrillic` / `vietnamese` / `latin-ext` / `latin`. A face with CJK coverage returns ~100. `[VERIFIED: probe against fonts.googleapis.com/css2]`

Stronger still: **no family in the entire bundled registry declares a `chinese-simplified` or `chinese-traditional` subset** — 1942 families, and neither string appears once. `Noto Sans SC` itself reports `subsets: ["cyrillic","latin","latin-ext","vietnamese"]`. `[VERIFIED: font-data.json, enumerated]` The Google Fonts API does not model CJK as a named subset at all; it models it as ~100 unlabelled `unicode-range` slices.

Conclusion: every Chinese glyph currently falls to the browser's last-resort fallback. Confirmed as a real consequence rather than a theoretical one.

### What `subsets` controls in Next 16.3.5 — it is **not** a download filter

This is the finding most likely to be wrong in training data, so it was read from the installed source.

The docs shipped inside this Next version say it plainly:

> "The font `subsets` defined by an array of string values with the names of each subset you would like to be **preloaded**. Fonts specified via `subsets` will have a link preload tag injected into the head when the `preload` option is true."
>
> `[VERIFIED: node_modules/next/dist/docs/01-app/03-api-reference/02-components/font.md:148]`

The loader source confirms it mechanically:

- `getGoogleFontsUrl(fontFamily, fontAxes, display)` takes **no** `subsets` argument and builds `https://fonts.googleapis.com/css2?family=…&display=…` with **no `subset=` and no `text=` parameter**. `[VERIFIED: .../google/get-google-fonts-url.js:8,46-54]`
- `subsets` reaches exactly one call site: `findFontFilesInCss(css, preload ? subsets : undefined)`, where it only decides the boolean `preloadFontFile`. `[VERIFIED: .../google/loader.js:102]`
- Every font file found in the CSS is then downloaded and emitted to `.next/static/media`, preloaded or not. `[VERIFIED: .../google/loader.js:104-129]`

**Practical consequence:** `Noto_Sans_SC({ subsets: ["latin"] })` would download the *entire* 4.31 MB family into the build output. `subsets` would reduce the `<link rel=preload>` tags, not the bytes.

One incidental detail with a useful consequence: in Google's CSS the CJK slices carry **no comment label at all** (only `cyrillic` / `vietnamese` / `latin-ext` / `latin` are labelled). `findFontFilesInCss` tracks the label to decide preloading, so the CJK slices start with `currentSubset = ''` and are never preloaded — the only part of this that behaves the way you would want. `[VERIFIED: .../google/find-font-files-in-css.js:15-31` + CSS probe`]`

---

## 2. Font strategy options — measured, not estimated

All numbers below come from fetching the real CSS, parsing every `unicode-range`, mapping a representative body of translated marketing copy (~230 distinct characters, matching this site's actual copy volume) onto the slices, and measuring the real `Content-Length` of only the slices that copy touches.

| Family | Slices in family | Full-family bytes (build artifact) | Slices a real page touches | **Bytes the browser actually downloads** |
|---|---|---|---|---|
| Noto Sans SC | 101 | 4.31 MB | 15 | **786 KB** |
| Noto Sans TC | 105 | 4.00 MB | 15 | **979 KB** |
| Noto Serif SC | 101 | 5.75 MB | 15 | **1 020 KB** |
| Noto Serif TC | 108 | 5.45 MB | 15 | **1 297 KB** |

`[VERIFIED: probe — fonts.googleapis.com CSS + per-file range requests]`

### (a) System CJK font stack — **recommended for body and UI**

Zero bytes, first-paint render, no CLS, no build step, works behind the Great Firewall, works offline.

Verified present on macOS (this machine): `PingFang SC`, `PingFang TC`, `PingFang HK`, `PingFang MO`, `Songti SC`, `Songti TC`, `Heiti SC`, `Heiti TC`, `Hiragino Sans GB`, `STSong`, `STHeiti`, `LiHei Pro`, `Apple LiSung`. `[VERIFIED: system_profiler SPFontsDataType]`

**The SC/TC distinction is not cosmetic and is not optional.** Han unification means one codepoint can carry different regional glyph forms — `PingFang SC` renders mainland shapes, `PingFang TC` renders Taiwan shapes, for the *same* character. Serving `PingFang SC` to a `zh-Hant` reader produces glyphs that are wrong in a way Traditional readers notice immediately. This alone forces a per-locale stack; it is not a refinement you can defer. `[ASSUMED — well-established Han-unification behaviour, but the specific per-character differences were not enumerated this session]`

The honest cost: per-OS variation. But the variation is between four professionally hinted Han gothics that all read as "modern neutral" — `PingFang` (Apple), `Microsoft YaHei` (Windows), `Noto Sans CJK` (Android/ChromeOS/Linux). A Chinese reader sees their OS's Han face all day; it is the least jarring possible default, and it is what the large Chinese-market sites ship.

### (b) Self-hosted webfont — **rejected for body**

The important correction to the usual "a CJK font is 10 MB, forget it" reasoning: Google **does** serve these as ~100 small `unicode-range`-split slices, and the browser only fetches slices a glyph on the page falls into. So the naive multi-megabyte figure is wrong.

But the measured figure is still disqualifying, and the reason is worth understanding. Google's slicing is frequency-ordered: the last few slices are small and dense (one covers 70 of our 230 characters in 45 KB), but the *tail* is brutal — slices 81, 85, 86, 87 and 88 each pull **~60 KB to deliver between one and seven glyphs**. A 230-character page spreads across 15 slices and pays **786 KB for 230 glyphs — 3.4 KB per glyph.**

`next/font/google` can consume this (nothing special is needed; it self-hosts every slice), which also neutralises the Great Firewall problem — but it does so by writing **4.31 MB / 101 files per family** into the build output. Sans + serif across both locales would be **19.5 MB across ~415 files**, refetched from Google on every cold CI build.

Verdict: rejected for body. Viable only in the subsetted form below.

### (c) Subsetting to the glyphs the site actually uses — **recommended for display only**

Measured directly against Google's `&text=` endpoint with this site's plausible `zh-Hans` copy (228 distinct characters, 212 of them hanzi):

- **66 KB per weight** for `Noto Sans SC`, one file, one request. `[VERIFIED: probe]`
- ≈ **315 bytes per glyph**. Noto Serif CJK is ~1.33× heavier per the full-family ratio, so ≈ **420 bytes/glyph**.
- A headline-only subset (h1/h2/h3 + eyebrows + the two serif leads ≈ 150–200 distinct hanzi) lands at **≈ 60–85 KB per locale at one weight** — smaller than a single Latin webfont, and a **~12× saving** over the sliced full family.

**Tooling.** Three viable routes, in order of preference:
1. `subset-font` (npm, harfbuzz WASM) — pure JS, no Python in the toolchain. `[ASSUMED — package not verified against the registry this session; must pass a legitimacy check before adoption]`
2. `fonttools` / `pyftsubset` — the reference implementation, but adds Python to the build. `[ASSUMED]`
3. Fetch Google's `&text=` URL at build time and commit the result — no subsetting toolchain at all, and the OFL licence permits redistribution. But the URL carries a rotating `skey` and is an undocumented endpoint; brittle as a build dependency. `[VERIFIED: the endpoint works and returns a single 66 KB woff2]` / `[ASSUMED: licence reasoning]`

**The fragility risk is real and the brief is right to name it.** A later copy edit that introduces a hanzi outside the subset produces a *silent* failure: that one glyph falls through to the system Song mid-headline, mismatched in weight and width, and nothing in the build complains.

**The mitigation that de-risks it** — and the reason this becomes acceptable rather than merely cheap — is that the subset must be **derived from the locale catalogue, never hand-maintained**:

- `npm run fonts:subset` reads `messages/zh-Hans.json` + `zh-Hant.json`, extracts the distinct character set, emits the woff2.
- `npm run fonts:check` reads the committed woff2's `cmap` and fails if any character in the catalogue is missing. Wire it into `lint` / CI.

That converts a silent visual defect into a loud build failure. This site has no user-generated text, so the catalogue is a complete and authoritative source — which is precisely the condition under which subsetting is safe. Without that check, do not subset.

**Do not serve the subset from `fonts.googleapis.com` at runtime.** Google Fonts is blocked/throttled by the Great Firewall, so a `<link>` to the `text=` URL would hang for exactly the audience this work targets. Self-host via `next/font/local`. `[CITED: appinchina.co/does-google-fonts-api-work-in-china/, chinafy.com/blog/how-to-fix-font-loading-issues-in-china — secondary sources, consistent across several]`

---

## 3. The serif headline problem

**Recommendation: Song / Ming (宋体 / 明體), not the body sans.**

**Why Song is the right analogue.** Song is the conventional Han counterpart to a Latin serif, and the correspondence is unusually close for this particular design. Song has genuine stroke-weight modulation (thin horizontals against thick verticals), triangular serif-like 頓 terminals, and high contrast — the same three properties that make Playfair a Didone. Of everything available in the Han tradition, Song is the only thing that carries a comparable voice. There is no Han Didone, but Song is not a compromise analogue; it is *the* analogue.

**Why not simply use the body sans at a heavier weight** — the obvious alternative, and the one contemporary CJK marketing typography usually reaches for, because CJK hierarchy is conventionally built from weight and size rather than serif/sans contrast. Two reasons to reject it here:

- This design's hierarchy *is* the serif/sans pairing. `globals.css` sets `h1,h2,h3 { font-family: var(--font-display) }` at weight 400 against an Outfit body, and the Hero, Trust, Plans and R3Loop sections all set a second serif "lead" paragraph against sans body copy. Collapse display and body onto one gothic and the Chinese page loses a structural distinction the English page has. Every section would read flat.
- Han *does* have the native pairing. Using it is not an imported Western convention — 宋 for display against 黑 for text is standard Chinese practice.

**On the memorial-association objection.** It is real but it attaches to *heavy* Song at large size, not to Song as such. This design sets headlines at `font-weight: 400` `[VERIFIED: src/app/globals.css:289]`, where Song reads literary, unhurried and considered — a good match for a wellbeing brand, and closer in spirit to Playfair's delicacy than any weight of gothic would be. Do **not** let a translator or a later change push CJK headlines to 600/700; that is where the association bites.

**One caveat that shapes the fallback order.** Android ships `NotoSerifCJK-Regular.ttc` at **weight 400 only**. `[CITED: AOSP fonts.xml]` That is exactly the weight this design uses, so it costs nothing here — but it means any future heavier Song headline would be synthesised on Android and look wrong.

---

## 4. Mechanics of a per-locale stack in this codebase

### The asymmetry you must know about

Two theme blocks in `globals.css` behave differently, and the difference decides the whole mechanism. Both facts were read out of the compiled stylesheet, not inferred:

| Block | What Tailwind v4.3.3 emits |
|---|---|
| `@theme inline` (fonts) | `:root,:host{--font-sans:var(--font-outfit), Questrial, …}` **and** `.font-sans{font-family:var(--font-outfit), Questrial, …}` — the utility **inlines the literal list** |
| `@theme` (type scale) | `:root,:host{--text-h1--line-height:1.1}` **and** `.text-h1{font-size:var(--text-h1);line-height:var(--tw-leading,var(--text-h1--line-height))}` — the utility **reads the variable** |

`[VERIFIED: .next/static/chunks/2ejqahnqop129.css]`

So redefining `--font-sans` under `:lang()` would reach `body` and `h1,h2,h3` (which genuinely use `var(--font-sans)` / `var(--font-display)`) but would **silently miss** every element carrying the `font-display` or `font-sans` utility class:

- `src/components/chrome/Logo.tsx:71` — the wordmark
- `src/components/sections/Hero.tsx:136` — the serif lead
- `src/components/sections/Plans.tsx:187` — the serif CTA button
- `src/components/ui/Button.tsx:22` — `font-sans` on every button
- plus `font-display` at `R3Loop.tsx:96`, `Trust.tsx:285`, `Rhythm.tsx:97`, `LoopDiagram.tsx:161,233`

That is a partial-swap bug that looks like it works until someone opens the homepage.

### The fix: point the theme token at a second variable

The existing comment at `globals.css:3-8` already explains why `@theme inline` is needed here. This is the same trick one level deeper: because the utility inlines the *value*, make the value itself a `var()` reference, which then resolves at use time and obeys the cascade.

```css
@theme inline {
  --font-display: var(--stack-display);
  --font-sans: var(--stack-sans);
}
```

Compiled result becomes `.font-display{font-family:var(--stack-display)}` — now cascade-sensitive.

### The `:lang()` block

Place it **unlayered**. The compiled sheet emits `@layer properties, theme, base, utilities` `[VERIFIED: same file]`, and unlayered rules beat every layer regardless of specificity — so this cannot be defeated by a later Tailwind ordering change.

```css
/* ── Per-script font stacks ──────────────────────────────────────────────
   Unlayered on purpose: beats @layer theme without relying on specificity.
   Ordering inside this block is load-bearing — see the `:lang(zh)` note. */

:root {
  --stack-sans:
    var(--font-outfit), Questrial, "Hanken Grotesk", "Helvetica Neue", Arial,
    sans-serif;
  --stack-display:
    var(--font-playfair), Newsreader, "Source Serif 4", Georgia, serif;
}

/*
 * `:lang(zh)` prefix-matches zh-Hans AND zh-Hant, so it must come FIRST and
 * act only as a safety net for a bare `lang="zh"`. The two specific rules
 * below then override it. Reversing this order silently gives every
 * Traditional page the Simplified stack.
 */
html:lang(zh) {
  --stack-sans:
    var(--font-outfit), "PingFang SC", "Microsoft YaHei UI", "Microsoft YaHei",
    "Source Han Sans SC", "Noto Sans CJK SC", "Noto Sans SC",
    "Hiragino Sans GB", "Heiti SC", sans-serif;
  --stack-display:
    var(--font-playfair), "Songti SC", "STSong",
    "Source Han Serif SC", "Noto Serif CJK SC", "Noto Serif SC",
    SimSun, NSimSun, serif;
}

html:lang(zh-Hant) {
  --stack-sans:
    var(--font-outfit), "PingFang TC", "PingFang HK",
    "Microsoft JhengHei UI", "Microsoft JhengHei",
    "Source Han Sans TC", "Noto Sans CJK TC", "Noto Sans TC",
    "Heiti TC", sans-serif;
  --stack-display:
    var(--font-playfair), "Songti TC", "LiSong Pro", "Apple LiSung",
    "Source Han Serif TC", "Noto Serif CJK TC", "Noto Serif TC",
    PMingLiU, MingLiU, serif;
}
```

`layout.tsx:48` currently hard-codes `<html lang="en">`; it must become the active locale, and the routing work must emit exactly `zh-Hans` / `zh-Hant`. CSS `:lang(C)` matches only "equal to C, or C immediately followed by `-`", so `lang="zh-CN"` would **not** match `:lang(zh-Hans)`. `[CITED: CSS Selectors Level 3 :lang() definition]` This is a hard dependency on the routing agent's output.

### Why `:lang()` over the alternatives

| Option | Verdict |
|---|---|
| `:lang(zh-Hans)` on `<html>` | **Recommended.** Driven by the same attribute that already drives screen-reader voice selection, Android's per-language font resolution and browser hyphenation. One source of truth, no drift possible. |
| `[lang\|="zh-Hant"]` | Functionally equivalent here and marginally more explicit about prefix matching, but `:lang()` is the semantically intended selector and reads better. Either is safe. |
| A class on `<html>` | Rejected — a second source of truth that can disagree with `lang`, for no benefit. |
| A different `next/font` loader per locale | Rejected — `next/font` loaders are module-scope and evaluated at build time for every route; you cannot conditionally call one per request. It would also reintroduce the multi-megabyte download this whole recommendation exists to avoid. |

### Why Latin-inside-Chinese just works

CSS font matching runs **per character**: for each codepoint the browser walks the family list and uses the first family containing a glyph for it. With Outfit first, `Recharge` and `R³` are found in Outfit and matching stops; `更好的睡眠` is absent from Outfit, absent from every Latin fallback after it, and resolves in `PingFang SC`. No markup, no spans, no `unicode-range` declarations.

The one way this could have gone wrong is the metric-override fallback faces `next/font` injects — `--font-outfit` resolves to `"Outfit", "Outfit Fallback"` where `Outfit Fallback` is `src: local(Arial); size-adjust: 99.82%`, and `--font-playfair` to `"Playfair Display", "Playfair Display Fallback"` = `local(Times New Roman)`. `[VERIFIED: compiled CSS]` If Arial or Times covered CJK punctuation, those characters would render half-width and proportional instead of fullwidth. They do not:

```
Arial.ttf:            、U+3001=n  。U+3002=n  ，U+FF0C=n  ？U+FF1F=n  一U+4E00=n  “U+201C=Y  ³U+00B3=Y
Times New Roman.ttf:  、U+3001=n  。U+3002=n  ，U+FF0C=n  ？U+FF1F=n  一U+4E00=n  “U+201C=Y  ³U+00B3=Y
Helvetica.ttc:        、U+3001=n  。U+3002=n  ，U+FF0C=n  ？U+FF1F=n  一U+4E00=n  “U+201C=Y  ³U+00B3=Y
```

`[VERIFIED: direct cmap parse of /System/Library/Fonts/Supplemental/*]` — **macOS copies only.** Windows editions of Arial and Times ship different cmaps; see Uncertainties.

Note `“ U+201C=Y`: the curly quotes these fonts *do* carry will render as Latin quotes, not the Chinese 「」/『』. That is a copy decision for the strings agent, not a font-stack problem — but if the translation uses 「」 (U+300C/U+300D) they will correctly land in the CJK face.

---

## 5. Per-component layout risks

Ordered by severity. The governing metric facts: Chinese runs 40–70% shorter than English for the same meaning, but every glyph is full-width and ink fills essentially the whole em box — so **width shrinks while line height needs to grow**, and any dimension tuned to Outfit's 0.51em x-height is wrong twice over.

### Severity 1 — will visibly break

**1. 28 hard-coded `<br>` line breaks plus 16 `<span className="block">` line splits.**
`Hero.tsx` alone carries five `<br className="hidden lg:inline">` inside the `h1` and one in the serif lead. Also `Moments.tsx` (4), `Rhythm.tsx` (5), `Trust.tsx` (3), `Plans.tsx` (2), `R3Loop.tsx` (2), `Start.tsx` (2), `AskRecharge.tsx` (2), `ExperienceCard.tsx` (2), `LoopDiagram.tsx` (1). Plus per-line arrays in `Connected.tsx`, `UnifiedCircle.tsx`, `CentrePortrait.tsx`, `FragmentedStack.tsx`, `WhyConnectionMatters.tsx`. `[VERIFIED: grep, all paths listed]`
These were each measured against an English phrase at the deck's reference width. Applied to Chinese they will land mid-clause — the worst kind of CJK line break, because Chinese has no inter-word space to disguise it. **Every one must become locale-aware or be removed for `zh`.** This is the single largest structural risk in the migration.

**2. `--text-h1--line-height: 1.1` (and h2 1.15, h3 1.22, lead-serif 1.22).**
At the h1 clamp ceiling of 3.5rem, a 1.1 line box is 61.6px for glyphs whose ink spans ~56px. Adjacent Chinese lines will nearly touch. Latin survives 1.1 only because the x-height is half the em. Compounded by the strut: `line-height` is a unitless number, so the line box is fixed at 1.1em regardless of which font ends up rendering the glyphs. `[VERIFIED: src/app/globals.css:139-149]`

**3. `--text-eyebrow--letter-spacing: 0.16em` on every section kicker.**
`Eyebrow` applies `text-eyebrow uppercase` `[VERIFIED: src/components/ui/Eyebrow.tsx:30]`. On Han, `uppercase` is a no-op and `0.16em` adds 2.24px between glyphs that are *already* evenly set on a fullwidth body — the result reads as deliberately spaced-out 疏排 text, which in Chinese signals something entirely different from a kicker. Same problem at `--text-micro--letter-spacing: 0.14em` (`MicroEyebrow`, used by `FragmentedStack`, `WhyConnectionMatters`, `Plans`) and `--text-scroll--letter-spacing: 0.14em` (`ScrollCue`). Secondary defect: CSS letter-spacing is added *after* the final character too, so a centred eyebrow (`Plans.tsx:142` `text-center`) will sit visibly off-centre.

**4. `Trust.tsx:194` — `<GradText className="italic">`.**
The only italic in the codebase, and it is on a display headline. Browsers will synthesise a sheared oblique for the Han glyphs. This is the most recognisably wrong thing that can happen to Chinese type. `[VERIFIED: grep + src/app/layout.tsx:21 loads the italic style]`

**5. `Header.tsx:141` — the fixed 52px active underline (`w-13`).**
The code comment records the measurement that justified a fixed bar: *"the `Trust & Approach` label is 123px wide but its bar is only 57px, and `Plans` is 33px with a 51px bar."* In Chinese those labels become roughly 4–5 glyphs — `方案` at `--text-nav: 1rem` is **~32px wide against a 52px bar**. The underline will be wider than the word it underlines on at least two nav items. `[VERIFIED: src/components/chrome/Header.tsx:138-144, src/lib/nav.ts:52-84]`

### Severity 2 — will look wrong

**6. `TrustStrip.tsx:55` — `{body.join(" ")}`.**
The two body fragments are joined with a **Latin space**. Chinese does not use inter-word spaces; this inserts a visible gap mid-sentence. Must become `join("")` for `zh`. Separately, the fixed column ratios `md:grid-cols-[433fr_361fr_368fr]` were derived from English label widths; with Chinese titles at roughly half the width the three columns will look arbitrarily unbalanced. `[VERIFIED: src/components/chrome/TrustStrip.tsx:43,55]`
The good news the brief asked about: the previously documented *wrap-to-a-third-line / fall-below-the-fold* failure gets **better**, not worse — shorter copy means fewer lines. Hero's `min-h-[760px] md:min-h-svh` with `justify-center` will have more slack. But verify: the leading increase in §6 claws some of it back.

**7. `text-xs` / `--text-micro: 0.75rem` / `--text-meta: 0.8125rem` — 12px and 13px Chinese.**
`Plans.tsx:233` ("Most popular" pill) uses `text-xs` = 12px; `MicroEyebrow` is 12px; `--text-meta` (trial meta, plan disclaimer) is 13px. Han glyphs need more vertical resolution than Latin at the same nominal size — 12px Chinese is at the legibility floor, and with a system face whose hinting you do not control it will be genuinely hard to read. Bump to 14px under `:lang(zh)`.

**8. 17 explicit `leading-*` overrides that bypass the token mechanism.**
Because `.text-*` utilities resolve leading as `var(--tw-leading, var(--text-X--line-height))`, any explicit `leading-*` class wins and will **not** pick up the `:lang(zh)` override. The tight ones matter: `leading-none` (1.0) at `LoopDiagram.tsx:161,233` on `font-display text-[1.25rem]` node labels — Chinese glyphs at leading 1.0 will collide outright; `leading-tight` (1.25) at `LoopDiagram.tsx:96`; `leading-[1.3]` at `Rhythm.tsx:123`; `leading-[1.35]` at `RhythmTimeline.tsx:296`; `leading-snug` (1.375) at `R3Loop.tsx:96`, `Trust.tsx:285`, `Rhythm.tsx:97`, `AskRecharge.tsx:98`. Each needs an individual decision. `[VERIFIED: grep]`

**9. `Eyebrow` gradient runs — `grad-text` / `grad-text-reverse`.**
The design's own spec records that the point of the ramp is ink travelling *within* a word across ~110px. A six-stop ramp across a 5-glyph Chinese eyebrow at 14px spans ~80px, so each glyph gets a flat, different colour — rainbow characters, not a gradient run. Worst at `Plans.tsx:143` and the `TRUST & APPROACH` reverse ramp. Headline runs (`GradRun` in `Hero.tsx`, 3–4 glyphs at 56px ≈ 200px+) survive better.

**10. `GradRun` / `grad-text` descender compensation: `padding-bottom: 0.12em; margin-bottom: -0.12em`.**
Tuned so Playfair's serif descenders are not clipped by the `background-clip: text` box. Han glyphs sit lower in the em box than Latin lowercase; 0.12em may be insufficient and bottom strokes could clip. Needs visual checking. Also: `display: inline-block` makes each run an atomic inline box — a long Chinese run wraps internally but is placed as a unit, which can produce a ragged shape the English version never shows. `[VERIFIED: src/app/globals.css:318-357]`

**11. `font-weight: 600` on Windows.**
`--text-card-title--font-weight: 600`, `--text-eyebrow--font-weight: 600`, `--text-micro--font-weight: 600`, plus ~14 `font-semibold` call sites. `Microsoft YaHei` ships Light / Regular / Bold only, so a 600 request resolves upward to **Bold 700** — noticeably heavier than `PingFang SC Semibold` on macOS. Cross-platform inconsistency in the most repeated UI text on the page. `[ASSUMED — YaHei's shipped weight set was not verified this session; the CSS weight-matching direction is spec behaviour]`

### Severity 3 — worth a look

**12. `Button.tsx` — `whitespace-nowrap` with `h-[45px]` / `h-[52px]` / `h-[62px]` and `min-w-[225px]`.**
Chinese CTAs are much shorter, so the fixed heights are safe and `min-w-[225px]` will leave a short label floating in a wide pill. `whitespace-nowrap` means a long translated label overflows rather than wraps — a translator-facing length constraint that should be written into the string catalogue notes. The serif CTA at `Plans.tsx:183-194` uses `font-display` with an inline `clamp()` font size, so it inherits every display-stack decision above.

**13. `Plans.tsx:249` — `text-h3` plan names.**
`Essential` / `Rhythm` / `Plus` become 2–3 Chinese glyphs. At the h3 clamp ceiling (31px) that is a ~90px title beside a 62px icon circle — the visual balance the deck established is lost even though nothing breaks.

**14. `UnifiedCircle.tsx:51` — text inside `aspect-square w-[300px] lg:w-[400px]`.**
Hard-bounded circular container with per-line `<span className="block">` copy. Shorter Chinese helps, but the fixed lines will be wrong and the circle cannot grow.

**15. `FragmentedStack.tsx:76` — `min-h-[88px]` cards with a two-line `sub` array.**
`min-h` not `h`, so growth is safe. The two-line split is hard-coded and will be wrong.

**16. `RhythmTimeline.tsx:151,235` — JS-computed `--stack-h` / `--rail-h` / `--row-h` in px.**
Row heights come from TS constants, not from content. If leading increases under `:lang(zh)` the labels can overflow their computed rows. Needs checking after the leading change lands.

**17. `NavLabel.tsx:15` — `item.label.split("R³")`.**
Superscript rendering depends on the literal substring `R³` appearing in the label. A translated label that writes it differently silently loses the superscript with no error. Same shape of fragility at `GradText.tsx:40`.

---

## 6. CJK line-breaking, justification and tracking

### What to set

```css
html:lang(zh) {
  /* Han ink fills the em box; the Latin scale's leading is tuned to a
     0.51em x-height and collides. */
  --text-h1--line-height: 1.3;
  --text-h2--line-height: 1.32;
  --text-h3--line-height: 1.35;
  --text-lead-serif--line-height: 1.4;
  --text-lead--line-height: 1.7;
  --text-body--line-height: 1.8;
  --text-body-sm--line-height: 1.7;
  --text-card-title--line-height: 1.5;
  --text-card-body--line-height: 1.7;

  /* Han is already evenly set on a fullwidth body. Latin tracking reads as
     deliberate 疏排 spacing, and CSS also adds it after the last glyph,
     which throws centred eyebrows off-axis. */
  --text-eyebrow--letter-spacing: 0.05em;
  --text-micro--letter-spacing: 0.05em;
  --text-scroll--letter-spacing: 0.05em;
  --text-wordmark--letter-spacing: normal;

  /* 12–13px Han is below the comfortable legibility floor. */
  --text-micro: 0.875rem;
  --text-meta: 0.875rem;

  /* No Han italic exists; synthesis shears the glyphs. */
  font-synthesis-style: none;
}

html:lang(zh) :is(h1, h2, h3, .italic) { font-style: normal; }

/* Orphan control. A single glyph alone on the last line is a real Chinese
   typographic fault, and `pretty` targets exactly that. */
html:lang(zh) p { text-wrap: pretty; }
```

Values above are typographic judgement, `[ASSUMED]`, and should be checked in a browser against real translated copy. The *mechanism* by which they apply is `[VERIFIED]` (§4).

### `word-break` — the one setting that must not be touched

| Value | CJK behaviour | Verdict |
|---|---|---|
| `normal` | Default rule. Chinese already has a break opportunity between nearly every character. | **Use this. Change nothing.** |
| `break-all` | *"word breaks should be inserted between any two characters **(excluding Chinese/Japanese/Korean text)**"* | Pointless for CJK — it is a Latin-overflow tool only. |
| `keep-all` | *"Word breaks should not be used for Chinese/Japanese/Korean (CJK) text."* | **Never.** Would make a Chinese paragraph a single unbreakable line that overflows every container. It is a Korean-oriented value; reaching for it here is a common and catastrophic mistake. |
| `auto-phrase` | Language-aware phrase analysis, avoids breaking mid-phrase. | Attractive but not broadly shipped; treat as progressive enhancement. `[ASSUMED]` |

`[CITED: developer.mozilla.org/en-US/docs/Web/CSS/word-break]`

`overflow-wrap: break-word` is harmless and unnecessary. `line-break: auto` already applies standard 禁则 (kinsoku) — browsers will not strand 。、」 at a line start or 「 at a line end. `line-break: strict` mainly adds Japanese small-kana rules and is not needed for Chinese. `[ASSUMED]`

### `text-wrap: balance` — currently on `h1, h2, h3`

`[VERIFIED: src/app/globals.css:291]` — the only `text-wrap` in the codebase, and there are **zero `tracking-*` utilities** anywhere in `src/` `[VERIFIED: grep]`, so all tracking arrives through the four type-scale tokens listed above.

`balance` is **good** for CJK, arguably better than for Latin. MDN: the values *"only affect how text wraps; they don't change where soft wrap opportunities exist"* — and Chinese has a soft wrap opportunity between nearly every character, so the balancer has near-continuous freedom and produces very even lines. `[CITED: developer.mozilla.org/en-US/docs/Web/CSS/text-wrap-style]`

Two caveats:
- **Line limits:** Chromium ≤ 6 lines, Firefox ≤ 10; beyond that `balance` silently does nothing. `[CITED: same]` Chinese headlines are shorter, so this is less likely to bite than in English.
- **Interaction with the hard `<br>`s.** `Hero.tsx`'s `h1` contains five forced breaks at `lg`. How Chromium balances a block containing forced breaks is not something this research established — **needs browser verification**. Removing the `<br>`s for `zh` (which risk #1 already requires) makes the question moot and lets `balance` do the job the `<br>`s were doing manually. That is the clean fix.

`text-wrap: pretty` is the right addition for body paragraphs and is not currently used anywhere.

---

## 7. `font-display` and CLS

Both current loaders use `display: "swap"` `[VERIFIED: src/app/layout.tsx:20,34]`, and `next/font` generates metric-matched fallback faces to absorb the swap — `Playfair Display Fallback` = `local(Times New Roman)` with `ascent-override:97.25%; descent-override:22.56%; size-adjust:111.26%`, `Outfit Fallback` = `local(Arial)` with `size-adjust:99.82%`. `[VERIFIED: compiled CSS]`

**Under the recommended system-stack strategy, `font-display` is irrelevant to Chinese.** No webfont is involved, so there is no swap, no FOUT, and **no CLS at all** on Chinese text. That is a genuine and underrated advantage: it is strictly better than the English pages' current behaviour. The existing `swap` setting stays correct for the Latin faces and needs no change.

**If the display subset in Recommendation 9 is added later**, three things follow:

1. `next/font`'s `adjustFontFallback` only generates overrides for known Latin families; there is **no** metric-matched fallback for a CJK face, so a `swap` from system Song to `Noto Serif SC` would shift layout unabsorbed.
2. The shift is much smaller than the Latin equivalent — Songti SC, SimSun and Noto Serif CJK are all fullwidth 1em em-box designs with closely comparable ascent/descent — so `swap` remains the right choice for a headline that carries the brand voice. `display: "optional"` would trade a guaranteed-correct first paint for headlines that may never adopt the brand face at all; wrong trade here.
3. Tune it properly rather than accepting the default: `next/font/local` accepts `adjustFontFallback: false` plus explicit `declarations` (`size-adjust`, `ascent-override`) measured against the system Song fallback. `[ASSUMED — the `declarations` option is documented for `next/font/local` in this version's reference table, but its interaction with a CJK fallback was not tested]`

---

## Uncertainties

Things this research did **not** establish. None of these block the recommendation; all of them want a real browser or a real device.

1. **Windows font cmaps.** The Arial / Times New Roman / Helvetica CJK-punctuation probe used the **macOS** copies. Windows ships different builds. If Windows Arial covers U+3001/U+3002/U+FF0C, `Outfit Fallback` could capture Chinese punctuation and render it half-width with an inherited `size-adjust`. **Check on a real Windows machine.** If it happens, the fix is a `unicode-range`-scoped override, not a stack reorder.

2. **`text-wrap: balance` with forced `<br>`s.** Not established. Moot if the `<br>`s are removed for `zh`, which is independently required.

3. **Whether iOS ships Songti SC.** macOS does `[VERIFIED]`; the iOS Chinese font set is smaller and Apple's own guidance names PingFang for iOS. If Songti is absent on iOS, the `zh-Hans` display stack falls through to generic `serif`, which on iOS resolves to Times → then per-language fallback to PingFang, i.e. **a gothic, not a Song**. That would mean iOS silently loses the serif/sans hierarchy. This is the strongest single argument for the §2(c) display subset. **Verify on a real iPhone before deciding the subset is optional.** `[CITED: developer.apple.com/fonts/system-fonts/ — names PingFang for iOS; does not settle Songti]`

4. **Android's CJK weight axis.** AOSP `fonts.xml` declares weights 100–900 for `zh-Hans`/`zh-Hant` against a single `NotoSansCJK-Regular.ttc` index, which is ambiguous between a variable font and nine aliases of one static weight. If the latter, every `font-weight: 600` on Android Chinese is synthetic. `[CITED: AOSP fonts.xml — reading is ambiguous]`

5. **Microsoft YaHei's shipped weight set.** Stated as Light/Regular/Bold from training knowledge, not verified. The 600→700 consequence in risk #11 depends on it.

6. **Every leading, tracking and size value in §6.** These are typographic judgement, not measurement. They need looking at with real translated copy at real viewport widths. The *mechanism* that applies them is verified; the *numbers* are not.

7. **Descender clipping under `background-clip: text`.** Whether `padding-bottom: 0.12em` is enough for Han glyphs is a pixel question. Must be looked at, not reasoned about.

8. **`subset-font` (npm).** Named as the preferred subsetting tool from training knowledge. **Not verified against the npm registry and not checked for legitimacy.** Do not install it on this document's say-so — run a package legitimacy check first.

9. **Real-world distinct-hanzi count.** The §2 measurements used ~230 characters of plausible translated copy written for this probe, sized to match this site's actual string volume. The real catalogue does not exist yet. The *shape* of the finding (hundreds of KB for a sliced full family, tens of KB for a subset) is robust to a factor-of-two error in that count; the exact byte figures are not.

10. **Great Firewall behaviour.** Sourced from consistent secondary reporting, not tested from inside mainland China. It only affects the runtime-`<link>` option, which is rejected on other grounds anyway.

---

## Sources

**Primary — read or probed this session (HIGH):**
- `node_modules/next/dist/compiled/@next/font/dist/google/{font-data.json,loader.js,get-google-fonts-url.js,find-font-files-in-css.js}`
- `node_modules/next/dist/docs/01-app/03-api-reference/02-components/font.md`
- `.next/static/chunks/2ejqahnqop129.css` (compiled Tailwind v4.3.3 output)
- `src/app/{layout.tsx,globals.css}`, `src/lib/nav.ts`, and the section/chrome/ui components cited inline
- Live probes: `fonts.googleapis.com/css2` CSS + per-slice `Content-Length`; Google `&text=` subset endpoint; `system_profiler SPFontsDataType`; direct `cmap` parse of macOS Arial / Times New Roman / Helvetica

**Secondary (MEDIUM):**
- [AOSP `fonts.xml`](https://android.googlesource.com/platform/frameworks/base/+/refs/heads/main/data/fonts/fonts.xml)
- [MDN — `word-break`](https://developer.mozilla.org/en-US/docs/Web/CSS/word-break)
- [MDN — `text-wrap-style`](https://developer.mozilla.org/en-US/docs/Web/CSS/text-wrap-style)
- [Apple — System Fonts](https://developer.apple.com/fonts/system-fonts/)
- [AppInChina — Does Google Fonts API Work in China?](https://appinchina.co/does-google-fonts-api-work-in-china/), [Chinafy — font loading in China](https://www.chinafy.com/blog/how-to-fix-font-loading-issues-in-china)
