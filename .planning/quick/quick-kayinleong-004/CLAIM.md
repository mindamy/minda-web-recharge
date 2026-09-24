# Claim: quick-kayinleong-004

- owner: kayinleong
- session: claude-code
- branch: main
- started: 2026-09-24
- status: claimed
- summary: Take the seven-locale catalogue drop (revised Chinese, new Japanese/Indonesian/Malay/Hong Kong) and add a country flag beside every language name in the switcher.

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
| Trigger icon | Globe stays; no flag | Below `xl` the trigger is icon-only. A globe says "language"; a flag says "country". Swapping it would trade the control's meaning for its current value. |

### Caveat recorded, not hidden

Flags denote countries, not languages, and the mapping is lossy in both directions —
`zh-Hans` and `zh-Hant` are *script* subtags with no region at all, and are being shown 🇨🇳
and 🇹🇼 by convention rather than by the tag. The user asked for flags explicitly; this is
recorded so the next person knows it was a decision rather than an oversight.

## What has changed

_(filled in as work completes)_

## Verification

_(Regression Report — filled in before status: done)_
