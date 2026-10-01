# Claim: quick-kayinleong-008

- owner: kayinleong
- session: claude-code
- branch: main
- started: 2026-10-01
- status: done
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

One code commit (`56330f7`) + this docs close.

`zh-Hant` was restored by reverting quick-007's code commit (`e5b81e4`) rather than retyping the
flag artwork and CJK font rule, then departing from it in three places:

1. **Label** is 「繁體中文」, not 「繁體中文（台灣）」, and the locale code stays `zh-Hant` rather than
   the pack's `zh-TW` — so neither the picker nor the URL names a territory. The Taiwan flag is
   kept (user chose it over a neutral badge).
2. **The switcher measurement essay** rewritten in quick-007 was kept; the revert would have
   restored the version that was already stale from quick-006.
3. **The `WIDE_NAV_LOCALES` breakpoint dropped 1600 → 1400** (see below).

### The nav breakpoint was re-measured, not assumed

This pack shortens the two labels that forced the quick-006 workaround
(`Kepercayaan & Pendekatan` → `Pendekatan Kami`, `Tentang Kami` → `Tentang`), so the obvious move
was to delete `WIDE_NAV_LOCALES` entirely. **That was tried and rejected on measurement:** with
the workaround removed, Malay still wraps at `xl` (link heights `[48,48,32,48,32]`, zero slack).
Malay's true unwrapped nav is 598px at `gap-9` (582 at the `gap-8` used below `2xl`); against the
223px logo and 469px flag-form cluster in a 1280−80 track it needs ~1354px. So the per-locale
deferral stays, with the threshold lowered to 1400px — Malay and Indonesian now get the full nav
200px earlier than before.

## Verification

### Regression Report

**Gates (all green):** `npm run typecheck`, `npm run lint`, `npm run build` (static export → 41
pages: 6 locales × 6 routes + not-found/icons; `out/` has all six locale dirs).

**The two risks named up front, both resolved by measurement:**

| Risk | Outcome |
|------|---------|
| Shape wrinkle — `ja-JP`/`zh-CN`/`zh-TW` drop the leading `{"text"}` segment of `r3Loop.eyebrow` | **Not a problem.** `tsc` passes: TypeScript unions the JSON array element types, and en-GB's own eyebrow already contains a `{mark}`-only segment (the `rcubed` case `types.ts` documents), so the 2-segment form is assignable. Rendering confirmed on `/zh-Hant` — the `R³` `<sup>` is present. |
| `WIDE_NAV_LOCALES` possibly dead | **Still needed, threshold lowered.** Removal tried and measured as wrapping; breakpoint set to `min-[1400px]`. |

**Regression surfaces audited:**

| Surface | Tested | Result |
|---------|--------|--------|
| Canonical shape | `diff` pack `en-GB.json` vs repo | Byte-identical — `Messages` unchanged, repo file not touched |
| Catalogue parity | Key-path diff of all pack files vs en-GB, then `tsc` | Build green |
| Locale set | Footer switcher read from DOM | 6 entries; `zh-Hant` → 「繁體中文」 (no region); all carry flag SVGs |
| Restored locale | `/zh-Hant` in dev **and** production output | `lang="zh-Hant"`, new pack copy, `R³` renders |
| Nav breakpoint | ms-MY & id-ID @1400 (no wrap), ms-MY @1399 (burger), **en-GB @1280** | Correct at the boundary; **English unchanged** |
| Console | dev + production (`out/` over a static server) | Dev `No link element found for chunk` is a Turbopack HMR artifact, absent in production. Production React #418 reproduced on **unrelated** `/en-GB.html`, so it is the `.html` pathname of the test server (client `usePathname()` sees `.html`, diverging from the server render); Firebase Hosting sets `cleanUrls: true`, so it does not occur live. **Ruled out, not hand-waved.** |

**Not re-deployed by this claim** — the live site still serves the five-locale build until a
deploy is run.
