# Plan — quick-kayinleong-003: i18n + Chinese

**Commit prefix:** `feat(quick-kayinleong-003):` / `fix(quick-kayinleong-003):`
**Branch:** `main` (user decision — see CLAIM.md)
**Baseline:** `0c52229`

## Goal

Every user-facing string lives in a per-locale JSON catalogue. The site serves
`en-GB`, `zh-Hans` and `zh-Hant` from locale-prefixed URLs, with a language switcher
in the chrome that preserves the current page.

## Wave structure

Waves synchronise at their boundary; everything inside a wave runs concurrently and is
file-disjoint. **The orchestrator owns git** — no agent commits.

```
Wave 1  foundation (1 agent, blocking — everything depends on the catalogue + routing)
Wave 2  migration + translation (4 agents)
Wave 3  typography + switcher (2 agents)
Wave 4  verification (orchestrator)
```

---

## Wave 1 — Foundation

**W1** · owns `src/lib/i18n/**`, `src/messages/en-GB.json`, `src/app/**`, `next.config.ts`

1. **i18n core**, no dependencies:
   - `src/lib/i18n/config.ts` — `LOCALES = ["en-GB","zh-Hans","zh-Hant"]`, default `en-GB`, `isLocale()` guard.
   - `src/lib/i18n/types.ts` — `Messages` type derived structurally from the `en-GB` catalogue, so a
     missing or misspelt key in another locale is a `tsc` error, not a runtime blank.
   - `src/lib/i18n/dictionaries.ts` — server-only loader, static `import()` map per locale.
   - `src/lib/i18n/MessagesProvider.tsx` — `"use client"` context + `useMessages()`, receives an
     already-selected slice as a serialisable prop.
2. **`src/messages/en-GB.json`** — all ~197 distinct strings per `RESEARCH-strings.md`.
   Namespaces: `meta`, `common`, `chrome`, `sections`, `notFound`.
   - **No `@ref` indirection.** The medical disclaimer lives once at `common.disclaimer.medical`
     and all four call sites read that key directly.
   - Rich text uses `{ text, mark? }` segment arrays (20 cases).
   - British spellings round-trip byte-exact (12 instances).
3. **Routing** — move the route tree under `src/app/[locale]/`:
   - `generateStaticParams` on the layout returning all three locales; `export const dynamicParams = false`.
   - `<html lang>` from `next/root-params` (v16.3.0+).
   - `metadata` object → `generateMetadata()`; set `metadataBase` in the same edit or relative
     `alternates` fail the build.
4. **`next.config.ts`** — `globalNotFound: true` + six 308 `redirects()` (`/`, `/how-it-works`,
   `/the-r3-experience`, `/plans`, `/trust-and-approach`, `/about` → `/en-GB/…`).
5. **`src/app/global-not-found.tsx`** — must re-import `globals.css` **and both fonts**; it bypasses
   the layout and will otherwise ship unstyled.
6. **Reference migration:** migrate `Footer.tsx` only, as the worked example Wave 2 copies.

**Do NOT create `src/proxy.ts`.** (`middleware.ts` is deprecated and renamed `proxy.ts` in v16 —
stated so nobody adds one reflexively.) Redirects cover `/` without a Node function per request.

**Gate:** `npm run build` green, 18 routes static, `/plans` 308s to `/en-GB/plans`.

---

## Wave 2 — Migration + translation (4 concurrent)

Pattern for all three migration agents: **server components read the catalogue directly; client
components receive a narrow slice via `MessagesProvider`.** A catalogue import from any
`"use client"` file bundles all three locales with no warning — the post-wave grep gate catches it.

| Agent | Owns | Must not touch |
|---|---|---|
| **W2A** chrome | `src/components/chrome/**`, `src/lib/nav.ts` | sections, messages, globals.css |
| **W2B** sections A | `sections/{Hero,Moments,R3Loop,Connected}.tsx`, `sections/connected/**`, `sections/r3/**` | chrome, sections B, globals.css |
| **W2C** sections B | `sections/{Rhythm,Trust,Plans,Start}.tsx`, `sections/rhythm/**` | chrome, sections A, globals.css |
| **W2D** translation | `src/messages/zh-Hans.json`, `src/messages/zh-Hant.json` | all `.ts`/`.tsx` |

**W2A additionally fixes the scroll-spy (P2).** `Header.tsx:30` is `pathname === "/"`, which is
permanently false once the path is `/en-GB`. Line 57 early-returns on it, so the
IntersectionObserver never mounts. Types and build stay green — only scrolling the page reveals it.
Strip the locale segment before comparing, and prefix `NAV_ITEMS[].href` at render time.

**W2A resolves the `R³` inconsistency.** Three representations today: a `<RCubed/>` component with
no `³` in the string, a literal `³` that `NavLabel` splits on, and the ASCII `r3` route slug (the
slug stays ASCII — it is a URL, not copy). Pick one rendering for the two copy cases.

**W2D translation rules:**
- `zh-Hans` and `zh-Hant` are written as **two genuine catalogues**, not one converted into the
  other. Marketing register and word choice differ beyond glyph mapping.
- `common.disclaimer.medical` is medical/legal copy — translate conservatively and literally.
  It must not acquire a claim of treatment in either variant.
- Brand tokens stay Latin: `Recharge`, `R³`, `AI`.
- Structure must match `en-GB.json` exactly — same keys, same segment-array arity for rich text.

---

## Wave 3 — Typography + switcher (2 concurrent)

| Agent | Owns | Must not touch |
|---|---|---|
| **W3A** typography | `src/app/globals.css`, plus font-related fixes in `Logo.tsx`, `Hero.tsx`, `Plans.tsx`, `Trust.tsx` | `Header.tsx`, new switcher, messages |
| **W3B** switcher | new `src/components/chrome/LanguageSwitcher.tsx`, `Header.tsx` | globals.css, sections, messages |

**W3A** per `RESEARCH-typography.md`: per-locale system stacks (PingFang SC/TC → YaHei/JhengHei →
Noto Sans CJK; Song/Ming for display), the `@theme inline` `var()` indirection — without it the
Logo, Hero lead and Plans button silently stay on Playfair — loosened leading, tracking reset to 0
under `:lang(zh)`, and `font-style: normal` + `font-synthesis-style: none` for `Trust.tsx:194`,
which is currently italic and has no Han equivalent.

**W3B**: swaps the first path segment, preserves the rest of the route and the hash. Cannot use
`<Link locale=…>` — that prop is Pages-Router-only and is silently ignored in the App Router.
Keyboard accessible, `aria-current` on the active locale, and each option labelled in its own
language (`English` / `简体中文` / `繁體中文`).

---

## Wave 4 — Verification (orchestrator)

| Gate | Pass condition |
|---|---|
| `npm run typecheck` | clean |
| `npx eslint src` | 0 warnings |
| `npm run build` | 18 routes, all static |
| Catalogue parity | all three JSON files structurally identical (script) |
| Client-bundle leak | 0 catalogue imports from any `"use client"` file (grep) |
| Redirects | all 6 old URLs 308 to `/en-GB/…` |
| Scroll-spy | underline advances while scrolling `/en-GB` — **browser, not build** |
| CJK render | `/zh-Hans` and `/zh-Hant` in a real browser: no tofu, no sheared italic, no letter-spaced Han |
| Locale switch | switcher preserves the page; no flash-of-invisible-content (Motion remounts on root-param change) |
| 404 | `global-not-found` renders **styled** — the documented failure is an unstyled 404 |

## Out of scope

- Subsetted `Noto Serif SC/TC` webfont (~50–90 KB/locale) — a separate claim. On Windows the
  display stack lands on SimSun/PMingLiU, which look coarse at the 56px h1 ceiling.
- Accept-Language negotiation; translated route slugs; any locale beyond the three.
