# Claim: quick-kayinleong-004

- owner: kayinleong
- session: claude-code
- branch: main
- started: 2026-09-24
- status: done
- summary: Take the seven-locale catalogue drop (revised Chinese, new Japanese/Indonesian/Malay/Hong Kong), add a country flag beside every language name in the switcher, and auto-select a locale from IP country and device language.

## What will change

Follow-on to [quick-kayinleong-003], which established the catalogue/routing/switcher
machinery for three locales. This claim widens it to **seven** and puts a flag against each
option, per the user's request.

### Input

`Webpage Language.zip`, supplied by the user, containing six catalogues:

| File | Status | Note |
|------|--------|------|
| `zh-Hans.json` | **revised** | ~278 changed lines vs the shipped copy — softer register (身心關懷 over 身心健康, 自我洞察 over 個人洞察) |
| `zh-Hant.json` | **revised** | ~279 changed lines, same revision pass |
| `zh-HK.json` | **new** | Hong Kong Traditional — genuinely HK-flavoured, not a `zh-Hant` copy (支援/計劃/7 日/毋須/網頁/主頁) |
| `ja-JP.json` | **new** | Japanese |
| `id-ID.json` | **new** | Indonesian |
| `ms-MY.json` | **new** | Malay |

Verified before adoption: every one of the six has a **named-key path set identical to
`en-GB.json`** — zero missing, zero extra. The only structural differences are the lengths
of `RichText` segment arrays, which vary legitimately per language and which
`Messages = typeof enGB` does not constrain (TypeScript infers JSON arrays as `T[]`, not
tuples). So the `Record<Locale, CatalogueLoader>` parity check in `dictionaries.ts` will
hold without touching `en-GB.json` or `types.ts`.

`en-GB.json` is **not** in the drop and is not edited.

### Planned change

1. **Register four new locales** — `LOCALES`, `LOCALE_LABELS`, the `dictionaries` loader map.
   6 pages × 7 locales = **42 prerendered routes**, up from 18.
2. **Flags** — a new `FlagIcon` component rendering inline SVG, shown beside the autonym in
   all three switcher variants (menu, sheet, footer).
3. **Per-script typography** — `globals.css` currently covers `zh` and `zh-Hant`. Japanese
   and Hong Kong Traditional need their own stacks; Malay and Indonesian are Latin and need
   nothing.
4. **Comment/doc drift** — "all three locales", "18 prerendered routes" and similar counts
   appear in ~10 prose comments that are load-bearing documentation in this codebase.

## Locked decisions

| Decision | Choice | Why |
|----------|--------|-----|
| Switcher order | `en-GB`, `ms-MY`, `id-ID`, `zh-Hans`, `zh-Hant`, `zh-HK`, `ja-JP` | Latin block then CJK block, so a reader scanning for their script stops scanning early. English first as the default; Malay next as the home market. Presentation-only — `DEFAULT_LOCALE` is set explicitly and nothing else reads the array order. |
| `zh-Hant` vs `zh-HK` labels | `繁體中文（台灣）` / `繁體中文（香港）` | With both present, a bare `繁體中文` next to a 🇹🇼 flag is ambiguous *and* asymmetric. The region suffix makes the pair self-explanatory, and the catalogues really are regionally distinct. |
| Flag rendering | **Inline SVG**, not emoji | Windows ships no flag glyphs in Segoe UI Emoji: `🇬🇧` renders as the letters `GB` in Chrome on Windows, which is the single largest desktop combination. Inline SVG is deterministic on every platform, crisp at any size, and costs ~1.5 KB gzipped for all seven. |
| Flag geometry | Uniform `0 0 60 40` (3:2) viewBox | Five of the seven flags (JP, CN, TW, HK, ID) are natively 3:2. GB and MY are natively 2:1 and are redrawn to 3:2 — the same normalisation every flag icon set performs. |
| Flag semantics | `aria-hidden`, decorative only | A flag is not a language (see the caveat below). The autonym carries the meaning for every reader; the flag is a scanning aid for sighted readers only, and is never the sole label. |
| Trigger icon | Globe stays, **plus** the current flag below `2xl` | Superseded mid-claim by the header fix below. The globe still carries "language"; the flag replaces the autonym as the compact way to say *which*, at 21px instead of up to 128px. |

## Scope round 2 (user, mid-claim): automatic locale selection

> "auto change language based on user ip / auto detect device language"

| Decision | Choice | Notes |
|----------|--------|-------|
| Signal priority | **IP country wins**, device language is the tiebreaker | User's explicit call, made against a recommendation. The trade-off was stated and shown: a Japanese-speaking traveller in Malaysia gets Malay. Recorded here so it reads as a decision, not a bug. |
| Cookie outranks both | **Yes**, non-negotiable | Not a product question — a correctness requirement. Without it an English-speaking reader in Kuala Lumpur who picks English is flipped back to Malay on every visit, with no way to stop it. |
| Who writes the cookie | **The switcher, on click** — not the proxy | The proxy writing it on any locale-prefixed request would mean opening a shared `/ja-JP` link silently rewrites the recipient's language for the whole site. |
| Redirect status | **307 temporary**, never 308 | The target depends on request headers. A permanent redirect is cached by the browser and by any CDN, pinning the first-detected locale forever. |
| Host | **Host-agnostic** | No host chosen yet (`NEXT_PUBLIC_SITE_URL` is still a TODO). Country is read from whichever of the known CDN headers is present, and the IP signal drops out cleanly when none is. |

### The `next.config.ts` redirect table had to go

It 308'd `/`, `/plans` and four others to `/en-GB/…`. Two independent reasons it could not stay:
`next.config` redirects run **before** the proxy (routing chain step 2 vs step 3), so detection
would never have executed on `/`;
and they were **permanent**, so any browser that had already followed one had cached
`/ → /en-GB` indefinitely. Claim 003 recorded "not launched, no traffic", so retiring them
costs nothing.

### It is `src/proxy.ts`, not `src/middleware.ts`

Next.js 16 deprecated the `middleware` file convention and renamed it to `proxy`
(`node_modules/next/dist/docs/.../file-conventions/middleware.md`). Three consequences, all
documented in the file itself: the export must be named `proxy` or the build fails — and in
dev it only warns, so the symptom is a proxy that silently never runs; shipping both files is
a hard throw (`E900`), not a precedence rule; and `middleware.ts` alone still works but
deprecation-warns on every boot. Anyone "adding the middleware back" will break the build.

## Header collision found and fixed (pre-existing, made worse here)

Adding Malay and Indonesian surfaced a bug that was already shipped. At 1280px — the exact
width at which the desktop nav appears — the header collided in **English**: `How It Works`
overlapped the wordmark and three nav labels wrapped to two lines.

Claim 003's comment claimed 1280px "fits with room to spare". It had measured the gap between
the language trigger and the Sign In pill; the binding constraint is the **nav**, on the other
side of the bar. Natural widths against the 1200px track, re-measured:

| Locale | before | after |
|--------|--------|-------|
| en-GB | **−25px** (collided) | +24px |
| ms-MY | **−209px** (collided) | +40px |
| id-ID | **−152px** (collided) | +114px |
| ja-JP | +14px | +62px |
| zh-Hant / zh-HK | +76px | +203px |
| zh-Hans | +140px | +203px |

Fix, per the user's choice of the three options offered:
1. The trigger shows the **flag** below `2xl` and the autonym at `2xl` and above. 21px against
   up to 128px, and strictly more informative than the globe-only compact state it replaces.
2. `chrome.nav.items` shortened in `ms-MY` and `id-ID` only —
   `Kepercayaan & Pendekatan` → `Kepercayaan`, `Tentang Kami` → `Tentang`. Nav labels only;
   the `meta.*` page titles keep their full wording.
3. Nav `gap-9` → `gap-8` below `2xl`, for 16px of margin against font-swap variance.

All three are needed: removing any one brings the collision back in at least one locale.

### Caveat recorded, not hidden

Flags denote countries, not languages, and the mapping is lossy in both directions —
`zh-Hans` and `zh-Hant` are *script* subtags with no region at all, and are being shown 🇨🇳
and 🇹🇼 by convention rather than by the tag. The user asked for flags explicitly; this is
recorded so the next person knows it was a decision rather than an oversight.

## What has changed

### Catalogues

- `src/messages/{zh-Hans,zh-Hant}.json` replaced with the revised copy (~278 and ~279
  changed lines).
- `src/messages/{zh-HK,ja-JP,id-ID,ms-MY}.json` added.
- `src/messages/en-GB.json` untouched — it is the structural source of `Messages` and was
  not in the drop.

Pre-adoption checks, all run against `en-GB` as the reference and all clean for all six:

| Check | Result |
|-------|--------|
| Named key paths (array indices collapsed) | 0 missing, 0 extra in every file |
| `tsc --noEmit` through `Record<Locale, CatalogueLoader>` | passes for all seven |
| Interpolation placeholders (`{year}`, `%s`) | present, in the same keys |
| Rich-text `mark` vocabulary | exactly `grad, grad-1, grad-2, grad-3, grad-italic, rcubed, strong, violet` in all seven — no unknown mark, none dropped |
| `R³` brand token in `chrome.nav.items["r3-loop"]` | present in all seven |

### Code

- `src/lib/i18n/config.ts` — `LOCALES` grown to seven in switcher order; `LOCALE_LABELS`
  extended, with the two Traditional entries gaining a region suffix.
- `src/lib/i18n/dictionaries.ts` — four loaders added. Still one static `import()` per
  locale; no template specifier, so no context module over `messages/`.
- `src/components/chrome/FlagIcon.tsx` — new. Inline SVG, one flag per locale, `Record<Locale, …>`
  so an eighth locale without a flag fails `tsc` rather than rendering a gap.
- `src/components/chrome/LanguageSwitcher.tsx` — flag beside the autonym in all three
  variants; menu `min-w` 11rem → 14rem (at 11rem the widest row, `Bahasa Indonesia`,
  wrapped) plus a `max-h` guard so a short viewport cannot make Japanese unreachable.
- `src/app/globals.css` — `html:lang(zh-HK)` and `html:lang(ja)` stacks added; the Han
  metrics block and the italic reset widened to cover `ja`.
- Comment-only: `layout.tsx` (18 → 42 prerendered routes), `types.ts`, `Header.tsx`,
  `Footer.tsx`, `loopNodes.ts`, `AskRecharge.tsx`, `NavLabel.tsx`.

### Two things found while working, both recorded rather than silently worked around

1. **`zh-HK` was going to inherit the Simplified font stack.** `:lang(zh)` prefix-matches
   `zh-HK`, and `:lang(zh-Hant)` does **not** (RFC 4647 extended filtering compares subtag
   by subtag; `HK` is not `Hant`). So adding the locale without a CSS rule would have served
   Hong Kong mainland glyph forms — the exact failure the existing SC/TC comment in
   `globals.css` warns about. Fixed with its own rule, ordered after `html:lang(zh)`.

2. **`cn()` is plain `clsx`, deliberately not tailwind-merge.** So a "size override" passed
   through `FlagIcon`'s `className` would not override anything — both classes land and the
   winner is decided by compiled-stylesheet order. `FlagIcon` therefore bakes its size in
   and documents that `className` is for additive utilities only. This is the same trap
   already documented at `src/components/sections/Plans.tsx:170`.

## Verification

### Regression Report

Regression surface, enumerated before testing: the catalogue loader (every page in every
locale), the prerender manifest, the client bundle boundary, the header at every breakpoint
in every locale, per-script typography, the switcher's keyboard and ARIA contract, and — new
in round 2 — the routing chain, which now has a redirect in front of a wholly static site.

#### Gates

| Gate | Result |
|------|--------|
| `npx tsc --noEmit` | clean, whole project |
| `npx eslint .` | clean, exit 0 |
| `npx next build` | succeeds; **47 static pages**, of which 42 are the 6 routes × 7 locales. Proxy registered as `ƒ Proxy (Middleware)` |
| Catalogue parity | all seven check against `Messages = typeof enGB` via `Record<Locale, CatalogueLoader>` |

#### Client bundle boundary — the thing this codebase guards hardest

Grepped the built `.next/static/chunks` for strings that must never reach a browser:

| Probe | Result |
|-------|--------|
| `Bagaimana jika` (ms/id body copy) | absent |
| `あなたの心と体` (ja) | absent |
| `訂閱計劃` (zh-HK) | absent |
| `了解自己的感受` (zh-Hans) | absent |
| `x-vercel-ip-country`, `cf-ipcountry`, `COUNTRY_LOCALES` | absent — `negotiate.ts` stayed server-side |
| `NEXT_LOCALE` | **present**, correctly: the switcher writes the cookie |

Adding four locales did not widen the flight payload: `selectClientMessages` is unchanged and
still ships one locale's nav/CTA/brand slice. The seven inline flags plus the whole switcher
compile to a 20.8 KB chunk, 7.3 KB gzipped.

#### Per-script typography — verified in a live browser, not inferred

| Page | `--stack-sans` head | `--stack-display` head | Verdict |
|------|--------------------|------------------------|---------|
| `/zh-HK` | `PingFang HK`, `PingFang TC` | `Songti TC`, `LiSong Pro` | **correct** — `:lang(zh)` did *not* win, so Hong Kong is not getting mainland glyph forms |
| `/ja-JP` | `Hiragino Sans`, `Hiragino Kaku Gothic ProN` | `Hiragino Mincho ProN`, `Yu Mincho` | **correct** — asserted by regex that no `PingFang`/`Songti`/`SimSun`/`MingLiU`/`JhengHei`/`Heiti`/`LiSong` face appears in either Japanese stack |
| `/ja-JP` h1 | — | — | `line-height: 60.99px`, i.e. the widened Han-and-kana 1.3, not the Latin 1.1 |
| `/ja-JP` body | — | — | `font-synthesis-style: none` inherited — no sheared fake italic |

#### Header — the pre-existing collision

Measured per locale at 1280px, before and after (table above under "Header collision").
All seven now have positive slack and **zero wrapped nav labels**; before the change, three
locales collided. Also checked: autonym returns at 1600px; mobile sheet at 375px shows all
seven pills with flags and the correct `aria-current`; footer shows seven flagged links with
`aria-current="page"` on the active locale.

#### Switcher contract — what was deliberately *not* changed

- Options are still links with real `href`s, still `hrefLang` + `lang`, still `aria-current="page"`.
- Flags are `aria-hidden`, so no accessible name changed anywhere. Below `2xl` the trigger's
  name is `Language`; at `2xl` it is `Language <autonym>`, matching the visible words
  (WCAG 2.5.3).
- Arrow/Home/End/Escape wiring, the `focusOnOpen` ref and the close-on-route-change render
  adjustment are untouched.
- SVG `clipPath` ids: the Union Jack is the only flag needing one. Verified on a page
  rendering 14 flags that ids are unique (`uj-r0`, `uj-R2dd99etb`) and every `clip-path`
  reference resolves — a duplicate id would have silently cross-referenced.

#### Detection — 13 request shapes against the dev server

| Request | Result |
|---|---|
| `Accept-Language: ja` on `/` | 307 → `/ja-JP` |
| `Accept-Language: ja` + country `MY` | 307 → `/ms-MY` — **country beats language**, as decided |
| `Cookie: NEXT_LOCALE=en-GB` + country `MY` | 307 → `/en-GB` — **cookie beats country** |
| `cf-ipcountry: HK` | 307 → `/zh-HK` |
| country `ID` on `/plans` | 307 → `/id-ID/plans` |
| `Accept-Language: zh-TW` | 307 → `/zh-Hant` |
| no signals | 307 → `/en-GB` |
| `cf-ipcountry: XX` + `Accept-Language: ms` | 307 → `/ms-MY` — unknown-country sentinel ignored |
| country `SG` + `Accept-Language: ja` | 307 → `/ja-JP` — SG deliberately unmapped |
| `/plans?plan=essential&ref=x` + country `TW` | 307 → `/zh-Hant/plans?plan=essential&ref=x` — query preserved |
| `/ja-JP/plans`, `/ja-JP` | **200, no redirect** — an explicit locale always wins |
| `/favicon.ico`, `/icon.svg`, real `_next` asset | 200, not redirected |
| redirect headers | `307` + `Cache-Control: private, no-store` + `Vary: Accept-Language, Cookie` |

`negotiate.ts` additionally carries a 76-assertion harness covering q-value ordering, `q=0`,
the `zh-HK`-before-`zh-Hant` trap, the legacy `in` → `id-ID` code, hostile 100 KB headers,
and prototype-pollution probes (`__proto__`, `constructor`) on both the country lookup and
the cookie. All 76 pass.

### Ruled out, with reasons

- **Static rendering lost to the proxy** — ruled out by the build output: 42 locale routes
  still `● (SSG)`. The proxy's matcher excludes all seven locale prefixes, so the site's own
  pages never invoke it.
- **`useSearchParams()` creep** — unchanged; the switcher still reads `window.location`.
- **Catalogue leakage into the client graph** — grepped, above.
- **Duplicate SVG ids** — checked on a 14-flag page, above.
- **`en-GB.json` drift** — not edited. The only `src/messages` edits outside the drop are the
  two `chrome.nav.items` shortenings in `ms-MY`/`id-ID`.
- **`R³` rendering under the new locales** — `NavLabel` splits on the literal; confirmed the
  token is present in all seven catalogues. Japanese `R³体験` has an empty prefix, which the
  existing `indexOf(...) === -1` guard handles correctly.
- **Rich-text `mark` vocabulary drift** — all seven use exactly the eight marks `en-GB` uses.

### Known and accepted

1. **A traveller gets the wrong language on their first page.** Country outranks
   `Accept-Language` by explicit decision; a Japanese-speaking visitor in Malaysia sees Malay
   until they use the switcher, after which the cookie pins their choice permanently.
2. **A locale-less unknown path costs an extra hop** — `/nonexistent` negotiates, redirects,
   then 404s at the router. Falls out of the broad negative-lookahead matcher; the narrower
   alternative duplicates the route table in a third place and fails silently when a route is
   added.
3. **`x-locale-reason` is a diagnostic response header** that was not in the brief. It names
   which input decided (`cookie`/`country`/`language`/`default`) and is free on a response
   that is already `no-store`. Two lines to remove if it is not wanted.
4. **Flags are countries, not languages** — see the caveat above. `zh-Hans`/`zh-Hant` carry
   no region and are shown CN/TW by convention.
5. **Browsers that already cached the old 308s** from `/` cannot be reached by any change
   here; they age out when the user clears site data. Claim 003 recorded no traffic, so the
   population is approximately the developers.
