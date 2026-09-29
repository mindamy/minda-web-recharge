# Claim: quick-kayinleong-006

- owner: kayinleong
- session: claude-code
- branch: main
- started: 2026-09-29
- status: in-progress
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

_(filled in as work completes)_

## Verification

_(Regression Report — filled in before status: done)_
