# Claim: quick-kayinleong-006

- owner: kayinleong
- session: claude-code
- branch: main
- started: 2026-09-29
- status: done
- summary: Refresh the five translated catalogues from the supplied localization pack, remove the Hong Kong (`zh-HK`) locale end-to-end, and surface the language switcher in the mobile header bar (outside the burger sheet).

## What will change

Three logical parts, one atomic commit each, under this single claim.

### Part A — Update the language (5 catalogues)

Source: `~/Downloads/recharge-localizations.zip` → `recharge-localizations/{id-ID,ja-JP,ms-MY,zh-Hans,zh-Hant}.json`.

- Overwrite `src/messages/{id-ID,ja-JP,ms-MY,zh-Hans,zh-Hant}.json` with the supplied versions.
- `en-GB.json` is **unchanged** — it is the canonical `Messages` shape (`src/lib/i18n/types.ts`) and the pack ships no English file.
- **Verified before starting:** all five supplied files are an *exact* structural match to `en-GB.json` (no missing/extra key paths), so `tsc --noEmit` — which type-checks every catalogue against `typeof en-GB.json` through the `dictionaries` loader map — will stay green.

### Part B — Remove Hong Kong (`zh-HK`)

`LOCALES` in `src/lib/i18n/config.ts` is the single source of truth; the total `Record<Locale, …>` maps make every consumer a compile error until updated. Full surface:

| File | Change |
|------|--------|
| `src/lib/i18n/config.ts` | Drop `"zh-HK"` from `LOCALES` and its `LOCALE_LABELS` entry; update the two-Traditional-entries rationale. Keep `zh-Hant` label as `繁體中文（台灣）` (still accurate). |
| `src/lib/i18n/dictionaries.ts` | Remove the `zh-HK` loader. |
| `src/lib/i18n/negotiate.ts` | Map `HK`/`MO` → `zh-Hant` (nearest remaining Traditional) in `COUNTRY_LOCALES` and `chineseLocale`; update comments. **Type-forced** (module is dead/unwired since claim 005, but still compiled). |
| `src/components/chrome/FlagIcon.tsx` | Remove `zh-HK` from `FLAG_ARTWORK`, delete `HongKongArtwork` + `HK_PETAL_ANGLES` (else unused-var lint), update comments. |
| `src/app/globals.css` | Delete the `html:lang(zh-HK)` font-stack rule + its comment block; drop `zh-HK` from the `:lang(zh)` and `text-balance` notes. |
| `src/messages/zh-HK.json` | **Delete.** |
| doc/comment counts | `seven`→`six`, `42`→`36` locale/route counts in `layout.tsx`, `metadata.ts`, `types.ts`, `Header.tsx`, `Footer.tsx`, `LanguageSwitcher.tsx`, `NavLabel.tsx`, `config.ts`, `README.md`. **Not** the unrelated sevens (Malaysia's 7 flag stripes, the 7 AskRecharge deck placements, 7 design sections, geometry). |

HK/MO → `zh-Hant` (not dropped to Simplified) keeps Hong Kong/Macau visitors on Traditional Chinese — the behaviour-preserving choice now that their own catalogue is gone.

### Part C — Language switcher in the mobile bar (outside the burger)

`src/components/chrome/Header.tsx`:

- Add the compact `menu`-variant `<LanguageSwitcher />` to the mobile top bar, grouped beside the burger in an `xl:hidden` flex container (desktop already has its own in the `xl:flex` CTA cluster).
- Remove the in-sheet `variant="sheet"` switcher — now redundant, and "outside the hamburger menu" is the request. The `sheet` variant code stays in `LanguageSwitcher.tsx` (unused branch, no lint cost) so it can be re-added later.

## Known risk to verify (regression surface)

The supplied `ms-MY`/`id-ID` catalogues **re-lengthen** the nav labels that `LanguageSwitcher.tsx:376` documents were deliberately *shortened* to stop the desktop header colliding at 1280px (`trust`: `Kepercayaan` → `Kepercayaan & Pendekatan`; `connected`: `Tentang` → `Tentang Kami`). Per that comment, this may reintroduce the collision at the `xl`–`2xl` band. **Must verify the desktop header in `ms-MY` and `id-ID` at ~1280/1366px in-browser** and, if it collides, surface options to the user before finalizing (the translations are the user's source of truth — will not silently trim their copy).

## What has changed

Three atomic commits under this claim:

| Commit | Part |
|--------|------|
| `3664ca9` | A — refresh `id-ID`/`ja-JP`/`ms-MY`/`zh-Hans`/`zh-Hant` catalogues from the pack |
| `e5a3935` | B — remove the `zh-HK` locale end-to-end |
| `f293ecf` | C — switcher in the mobile bar + locale-aware nav breakpoint |

### Deviation from the plan: the nav-overflow risk was real, and the user chose the fix

The risk flagged in "What will change" was **confirmed in-browser**: the pack's longer
`ms-MY`/`id-ID` nav labels overflow the desktop header and collide with the wordmark at
~1280–1440px (English unaffected). Presented to the user, who chose **"keep the copy, fix the
layout"** over trimming the labels or shipping the overlap.

Implemented as a **locale-scoped** breakpoint rather than a global one: only `ms-MY` and `id-ID`
(the two whose translated labels overflow) defer the horizontal nav to a measured
`min-[1600px]`; every other locale keeps its original `xl` (1280px) nav untouched. A global raise
was rejected because it would have pushed English — the default and majority locale, which fits
fine at 1280px — onto the burger for no reason. See `WIDE_NAV_LOCALES` in `Header.tsx`.

The switcher's authored autonym-at-`2xl` behaviour and its whole desktop design are unchanged;
the fix is purely which breakpoint the header chrome switches at, per locale.

### Deliberate choices worth recording

- **`zh-Hant` label kept as `繁體中文（台灣）`** (not simplified to `繁體中文`). Still accurate, still
  unambiguous, and relabelling is a copy decision the user did not ask for.
- **HK/MO → `zh-Hant`** in `negotiate.ts` (not dropped to Simplified), keeping Hong Kong/Macau
  visitors on Traditional. Type-correctness only — the module has had no importers since claim
  005, verified again here.
- **The `sheet` variant of `LanguageSwitcher` is now unused** but left in place (valid union
  member, no lint cost) so an in-sheet switcher can be re-added without rebuilding it.

## Verification

### Regression Report

**Gates (all green):** `npm run typecheck` (`next typegen && tsc --noEmit`), `npm run lint`
(eslint), `npm run build` (static export → 41 pages: 6 locales × 6 routes + not-found/icons).
The total `Record<Locale, …>` maps in `dictionaries.ts` and `FlagIcon.tsx` mean tsc would fail
on any missed `zh-HK` consumer; it passed.

**Regression surfaces audited:**

| Surface | Tested | Result |
|---------|--------|--------|
| Catalogue parity | Structural key-diff of all 5 pack files vs `en-GB.json`, then tsc | Exact match; build green |
| `zh-HK` removal completeness | Repo-wide grep (src + README + globals.css + firebase.json); `out/` after build | No `zh-HK` left except intentional history comments; `out/` has exactly 6 locale dirs |
| CJK font stacks (`globals.css`) | `zh-Hant` rule untouched; `:lang(zh)` cascade reviewed; `zh-Hant`/`zh-Hans`/`ja` pages built | `zh-HK` rule (now dead) removed; Traditional/Simplified/JP stacks intact |
| Flags | All 6 render in the switcher dropdown in-browser | Correct; `HongKongArtwork` cleanly removed |
| `negotiate.ts` | Grep for importers | None — inert module, change is type-correctness only, zero runtime effect |
| **Mobile switcher (the ask)** | 375px: switcher in bar outside burger; dropdown opens; switches to `ms-MY`; 6 locales, no HK | Works |
| **Desktop header (regression)** | en-GB @1280 (full nav, unchanged); ms-MY @1280 & 1536 (burger, no collision); ms-MY @1600 & 1920 (full nav, one line, copy intact); id-ID measured | No collision at any width; English untouched |
| Footer switcher | `variant="footer"` unchanged | Unaffected |

**Ruled out:** English/`zh-*`/`ja` desktop nav regression — English @1280 verified still full-nav
(locale-scoped breakpoint leaves it on `xl`). Build-artifact leak — `out/`, `.next/` confirmed
gitignored, not staged.

**Not done here (out of scope):** the pre-existing 2.26 MB/page Aurora payload (README "Known
problem"); deploying — `firebase deploy` is the user's call (outward-facing).
