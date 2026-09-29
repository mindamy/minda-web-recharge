# Claim: quick-kayinleong-007

- owner: kayinleong
- session: claude-code
- branch: main
- started: 2026-09-29
- status: in-progress
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

_(filled in as work completes)_

## Verification

_(Regression Report — filled in before status: done)_
