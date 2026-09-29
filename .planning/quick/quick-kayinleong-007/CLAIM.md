# Claim: quick-kayinleong-007

- owner: kayinleong
- session: claude-code
- branch: main
- started: 2026-09-29
- status: done
- summary: Remove the Taiwan (`zh-Hant`) Traditional Chinese locale end-to-end. This is the last Traditional catalogue (Hong Kong went in quick-006), so after this the only Chinese locale is Simplified (`zh-Hans`); the site drops from six locales to five.

## What will change

Mirror of the `zh-HK` removal in quick-006. `LOCALES` in `src/lib/i18n/config.ts` is the single
source of truth; the total `Record<Locale, …>` maps make every consumer a compile error until
updated.

| File | Change |
|------|--------|
| `src/lib/i18n/config.ts` | Drop `"zh-Hant"` from `LOCALES` + `LOCALE_LABELS`; remove the "only Traditional catalogue" / `（台灣）`-label notes. |
| `src/lib/i18n/dictionaries.ts` | Remove the `zh-Hant` loader. |
| `src/lib/i18n/negotiate.ts` | `TW`/`HK`/`MO` now resolve to `zh-Hans` (the only remaining Chinese); `chineseLocale` collapses to always-`zh-Hans`; comments updated. **Type-forced** (module dead/unwired since claim 005). |
| `src/components/chrome/FlagIcon.tsx` | Remove `zh-Hant` from `FLAG_ARTWORK`, delete `TaiwanArtwork`, update the flag-count / script-subtag / dropped-detail comments (`starPath` stays — China + Malaysia still use it). |
| `src/app/globals.css` | Delete the `html:lang(zh-Hant)` font-stack rule; collapse the SC/TC split notes (only Simplified remains); drop `zh-Hant` from the `:lang(zh)`, Android-serif and `text-balance` notes. |
| `src/messages/zh-Hant.json` | **Delete.** |
| example URLs in comments | `/zh-Hant/…` → `/zh-Hans/…` across `nav.ts`, `config.ts`, `LanguageSwitcher.tsx`, `Plans.tsx` so no comment cites a dead locale. |
| doc/comment counts | `six`→`five`, `36`→`30` routes in `layout.tsx`, `metadata.ts`, `types.ts`, `Header.tsx`, `Footer.tsx`, `LanguageSwitcher.tsx`, `NavLabel.tsx`, `config.ts`, `loopNodes.ts`, `README.md`. **Not** unrelated numbers (Malaysia's flag stripes, geometry, deck-placement counts). |

`WIDE_NAV_LOCALES` in `Header.tsx` (ms-MY, id-ID) is unaffected — Taiwan was not a wide-label
locale. The mobile switcher work from quick-006 is untouched.

### Consequence, recorded deliberately

After this there is **no Traditional Chinese** on the site — only Simplified. `TW`/`HK`/`MO`
visitors (in the inert negotiation table) fall to `zh-Hans`. This is the direct result of the
user removing both Traditional variants (Hong Kong in quick-006, Taiwan here) and is intended.

## What has changed

One code commit (`e5b81e4`) + this docs close. zh-Hant removed end-to-end exactly as
planned, plus two comment surfaces the removal touched that quick-006 hadn't:

- **The switcher measurement essay** (`LanguageSwitcher.tsx`) was rewritten. It documented the
  old 7-locale / `xl` / shortened-labels analysis, which quick-006 had already invalidated (the
  pack re-lengthened the labels and the nav moved to the locale-aware `min-[1600px]` breakpoint)
  and which cited `繁體中文（台灣）` as the widest autonym. Replaced with a concise, current note
  that points to `WIDE_NAV_LOCALES` in `Header`.
- **`/zh-Hant/…` example URLs** in comments (`nav.ts`, `config.ts`, `Plans.tsx`,
  `LanguageSwitcher.tsx`) were swapped to `/zh-Hans/…` so no comment cites a dead locale.

`chineseLocale` in `negotiate.ts` was deleted rather than left returning a constant — with one
Chinese catalogue, `case "zh": return "zh-Hans"` is the whole logic.

## Verification

### Regression Report

**Gates (all green):** `npm run typecheck`, `npm run lint`, `npm run build` (static export → 35
pages: 5 locales × 6 routes + not-found/icons). The total `Record<Locale, …>` maps would fail
tsc on any missed `zh-Hant` consumer; passed.

**Regression surfaces audited:**

| Surface | Tested | Result |
|---------|--------|--------|
| `zh-Hant` removal completeness | Repo-wide grep (src + README + globals.css); `out/` after build | No `zh-Hant` left except intentional history comments; `out/` has exactly 5 locale dirs, no `zh-Hant` |
| Dangling symbols | grep `TaiwanArtwork` / `chineseLocale` / `zh-Hant.json` | None |
| `starPath` helper | grep after removing Taiwan's sun | Still used by China (2×) + Malaysia (1×) — kept |
| CJK font stacks (`globals.css`) | `html:lang(zh)` (Simplified) rule + `:lang(ja)` intact; SC/TC split notes collapsed | Simplified + Japanese stacks unaffected; dead `zh-Hant` rule gone |
| Switcher (in-browser, 1440px) | Opened dropdown | Exactly 5 options — English, Bahasa Melayu, Bahasa Indonesia, 简体中文, 日本語; **no Taiwan**; no console errors |
| `negotiate.ts` | grep for importers | None — inert module; TW/HK/MO → zh-Hans is type-correctness only |
| Locale counts | grep `six`/`36` near locale/route words | All locale counts → five/30; the surviving `six` all refer to the 6 content routes (correct) |

**Ruled out:** other locales' rendering — `en-GB`/`ms-MY`/`id-ID`/`ja-JP`/`zh-Hans` all still
build and render; the Header `WIDE_NAV_LOCALES` (ms-MY, id-ID) and mobile-switcher work from
quick-006 are untouched.

**Consequence (intended):** no Traditional Chinese remains on the site; Simplified is the only
Chinese. Direct result of the user removing both Traditional variants across quick-006/007.
