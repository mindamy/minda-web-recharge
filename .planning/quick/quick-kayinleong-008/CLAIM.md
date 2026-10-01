# Claim: quick-kayinleong-008

- owner: kayinleong
- session: claude-code
- branch: main
- started: 2026-10-01
- status: in-progress
- summary: Apply the second localization pack (`Language Files.zip`) and re-add Traditional Chinese as `zh-Hant`, labelled 「繁體中文」 with no Taiwan wording. Site goes from five locales back to six.

## What will change

Pack: `~/Downloads/Language Files.zip` → `Language Files/{en-GB,id-ID,ja-JP,ms-MY,zh-CN,zh-TW}.json`.

### Pack facts established before starting

- `en-GB.json` is **byte-identical** to the repo's — the canonical `Messages` shape is unchanged,
  so every other catalogue must still satisfy it.
- The pack names Chinese by **region** (`zh-CN`, `zh-TW`); this repo names it by **script**
  (`zh-Hans`, `zh-Hant`). The repo's codes are kept — they are the live URL segments and the
  `hreflang` values, and renaming `/zh-Hans` → `/zh-CN` would 404 live URLs for a filename
  convention. So: `zh-CN.json` → `src/messages/zh-Hans.json`, `zh-TW.json` → `src/messages/zh-Hant.json`.

### Content

| Target | Source |
|--------|--------|
| `src/messages/id-ID.json` | pack `id-ID.json` |
| `src/messages/ja-JP.json` | pack `ja-JP.json` |
| `src/messages/ms-MY.json` | pack `ms-MY.json` |
| `src/messages/zh-Hans.json` | pack `zh-CN.json` |
| `src/messages/zh-Hant.json` | pack `zh-TW.json` (**new** — locale re-added) |
| `src/messages/en-GB.json` | unchanged (identical) |

### Re-adding `zh-Hant` (reverses quick-007)

Restore the locale across `config.ts`, `dictionaries.ts`, `negotiate.ts`, `FlagIcon.tsx` and the
`html:lang(zh-Hant)` CJK font rule in `globals.css`; counts go five→six and 30→36.

Two deliberate departures from a plain revert of quick-007, both user decisions:

- **Label is 「繁體中文」, not 「繁體中文（台灣）」** — the user asked that the label not name Taiwan.
  The locale code stays `zh-Hant` (script subtag) rather than the pack's `zh-TW`, so the URL does
  not encode Taiwan either.
- **The Taiwan flag is restored** (user chose it over a neutral badge when asked).

The switcher measurement essay rewritten in quick-007 is **kept** — the old version a revert
would restore was already stale from quick-006.

## Known risks to verify

1. **Shape wrinkle.** `ja-JP`, `zh-CN` and `zh-TW` drop the leading `{"text":…}` segment of
   `sections.r3Loop.eyebrow`, starting at `{"mark":"rcubed"}`, where `en-GB` and the current
   catalogues carry three segments. Whether `tsc` accepts it depends on how it unions the JSON
   element types — **verify by running `npm run typecheck`**, do not assume.
2. **`WIDE_NAV_LOCALES` may no longer be needed.** The pack *shortens* the ms-MY/id-ID nav labels
   that forced the `min-[1600px]` workaround in quick-006 (`Kepercayaan & Pendekatan` →
   `Pendekatan Kami`, `Tentang Kami` → `Tentang`). Re-measure the desktop header; if they now fit
   at `xl`, the workaround should be removed rather than left as dead complexity.

## What has changed

_(filled in as work completes)_

## Verification

_(Regression Report — filled in before status: done)_
