# Claim: quick-kayinleong-005

- owner: kayinleong
- session: claude-code
- branch: main
- started: 2026-09-27
- status: done
- summary: Deploy the Recharge marketing site to Firebase Hosting in project `mtherapys` (account sosleong365@gmail.com). Landed as a **static export** on site `recharge-main` after the SSR backend was withdrawn mid-claim.

## What will change

First deployment of this codebase.

### Target, as confirmed with the user

| | |
|---|---|
| Account | `sosleong365@gmail.com` (already a known account in the local CLI — no new OAuth) |
| Project | `mtherapys` (display name *MTherapys*, project number 869271964404) |
| Site | `recharge-main` → `https://recharge-main.web.app` |
| Mode | **Static export** (`output: "export"`), uploaded to the CDN. No server. |

### Why not the obvious site

`mtherapys` already owned a site whose name fit perfectly, and it was a trap:
`recharge-wellbeing.web.app` serves a **different live product** — *"Recharge | Health Screening
Report"*, a voice-recording report tool with its own `combined.css` and
`config.js?v=localization-33`. Deploying the marketing site there would have replaced it.
Confirmed with the user before proceeding; it was left untouched.

## Scope round 2 (user, mid-claim): SSR → static

The claim began as an SSR deployment through Hosting's web-frameworks integration, chosen to
preserve `src/proxy.ts` — the locale negotiation shipped one commit earlier in
[quick-kayinleong-004]. That path **worked**: the integration recognised Next 16.3.5 and
printed

```
Building a Cloud Function to run this application. This is needed due to:
 • middleware
 • Image Optimization
```

which is it detecting the Next-16 `proxy` convention through
`.next/server/functions-config-manifest.json` — the specific risk flagged at the start, since
`firebase-tools` 15.30.1 declares Next support as `12 - 16.0`.

The user then deleted the backend and asked for a static site instead. That is a product
decision, and it is the cheaper, faster architecture — but it is not free, and the price is
recorded here rather than discovered later.

### What static export costs

| Lost | Detail |
|------|--------|
| **Locale auto-detection, entirely** | Proxy is on the framework's unsupported-for-export list, and unlike `redirects` it does not fail quietly — the export build refuses to run while `src/proxy.ts` exists. The file is deleted. |
| **Six negotiated redirects → six fixed ones** | `/`, `/how-it-works`, `/the-r3-experience`, `/plans`, `/trust-and-approach`, `/about` now `302` to their `/en-GB/…` counterpart in `firebase.json`. Everyone who types the bare domain gets English. |
| **`next/image` optimisation** | `images.unoptimized` is required; the six `<Image>` call sites serve their source files. `width`/`height`/`sizes` still work; resizing and the WebP/AVIF rewrite do not. |

`src/lib/i18n/negotiate.ts` is **kept, unwired**, with a header saying so. It is the decision,
not the plumbing: the priority order was argued out with the product owner and the q-value
parsing, country table and untrusted-input guards each carry assertions. Re-wiring is one
adapter — restore `src/proxy.ts` from git, drop `output: "export"`, move to a host with a
server.

Worth knowing before anyone tries: **the IP-country half would not have worked on Firebase
either.** Hosting injects none of the headers in `COUNTRY_HEADERS`, so `countryFromHeaders`
would have returned `null` on every request even with the Cloud Function in place. That
inverts claim 004's headline decision — country was chosen to outrank `Accept-Language`, and
on this host there is no country.

## Locked decisions

| Decision | Choice | Why |
|----------|--------|-----|
| Render mode | Static export | User's call, round 2. |
| Redirect status | **`302`**, never `301` | A permanent redirect from `/` to a language is cached by the browser and every CDN between. Today it would pin the English we already send; the day negotiation returns it would pin English for everyone who ever hit the old one. Same reasoning that made the deleted proxy return 307, and the same mistake the pre-004 `next.config.ts` table had already shipped once with `permanent: true`. |
| Redirect owner | `firebase.json`, not `next.config.ts` | `redirects()` is *also* unsupported under export. It would not error — it would simply never run, leaving six dead entries that work in `next dev` and 404 in production. |
| `_next/static` caching | `max-age=31536000, immutable` | Fingerprinted filenames; the default 1 hour is pure waste. |
| Account selection | `--account sosleong365@gmail.com` per command | The CLI's active account is `ka.yin.leong@accenture.com`. A global `login:use` would silently change the account for every other project on this machine. |
| Site ID | `recharge-main` | Fourth attempt. See below. |

### The site-ID problem, in order, because it cost four names

1. **`recharge`** — refused by the API: *"reserved by another project"*. Hosting site IDs are
   globally unique across every Firebase project, and there is no separate display name to
   fall back on: the ID **is** what appears in `<id>.web.app`.
2. **`minda-recharge`** — created, then deleted when the user picked a different name.
3. **`recharge-index`** — created, then deleted by the user along with the SSR backend.
4. **Both are now permanently unusable.** Deleting a Hosting site retires its ID globally:
   *"the site cannot be reactivated by you or anyone else"*. Re-creating `recharge-index`
   returns the same *"reserved by another project"* error that a stranger's `recharge` does.
5. **`rechargeindex`** — created as the nearest obtainable spelling, superseded immediately by
   the user's next choice. Left in place, empty and unused; deleting it would burn that name
   too for no gain.
6. **`recharge-main`** — created, and the one that ships.

**Rule for anyone who follows:** do not delete a Hosting site to rename it. There is no
rename, and the old name does not come back. Point `firebase.json` at a new site and leave
the old one empty.

## What has changed

### New files

- **`firebase.json`** — site `recharge-main`, `public: "out"`, `cleanUrls`, `trailingSlash:
  false`, the six `302`s, the `_next/static` immutable cache header, and a `predeploy` hook
  running `npm run build` so the uploaded `out/` is never stale. `ignore` restores the
  dotfile default after the first attempt uploaded a `.DS_Store`.
- **`.firebaserc`** — pins `mtherapys`, so neither `deploy` nor `hosting:channel:deploy` needs
  `--project`.

### Changed

- **`next.config.ts`** — `output: "export"` and `images.unoptimized`. The long note explaining
  why a `redirects()` table must never come back is rewritten for the new reason: it is not
  that the proxy would outrank it (the proxy is gone), it is that under export it never runs
  at all.
- **`src/proxy.ts`** — **deleted.** Required by the export build.
- **`src/lib/i18n/metadata.ts`** — `SITE_URL`'s fallback moved off the placeholder
  `https://recharge.example.com` to the real origin. Not cosmetic: the pages are prerendered,
  so the fallback is baked into every canonical and all seven `hreflang` links of all 42
  pages at build time. Shipping the placeholder would have published ~340 links to a domain
  nobody owns — exactly what that file's `TODO(deploy)` warned about.
- **`src/lib/i18n/negotiate.ts`** — comment only; marked unwired, with the revival recipe and
  the Firebase geo-header note.
- **`eslint.config.mjs`** — ignore `.firebase/**`. The CLI stages the entire build there
  (it reached **880 MB** under the SSR path), and `npx eslint .` was linting Turbopack's own
  generated chunks: thousands of unactionable errors in files no one wrote.
- **`.gitignore`** — `.firebase/`.
- **`README.md`** — a `## Deployment` section: the one command, what each config file owns,
  and the four non-obvious costs above.
- Four stray `.DS_Store` files deleted.

### Found while deploying, deliberately not fixed here

**Every prerendered page is 2.26 MB, and ~96% of it is the Aurora artwork, shipped twice.**
Measured on the built `en-GB.html`: 1,019,421 bytes of inline `<svg>` (111 `<svg>` elements,
903 `<path>`, 940 KB of path data) plus 1,169,112 bytes of RSC payload carrying the same
markup again. It gzips to **871 KB** — the path data is high-entropy float coordinates and
barely compresses. `out/` totals **105 MB**.

This is not theoretical: it killed **two** deploys outright, both around 80 files in, with
`retries exhausted after 6 attempts, Timeout reached making request to
upload-firebasehosting.googleapis.com`.

That error reads like a network fault and is not one. The Hosting uploader defaults to **200
simultaneous uploads** (`lib/deploy/hosting/deploy.js`, overridable with
`FIREBASE_HOSTING_UPLOAD_CONCURRENCY`) against a per-file timeout of
`max(round(bytes / 1000) * 20, 30_000)` ms — which for anything under ~1.5 MB is a flat 30
seconds. Two hundred parallel transfers of 871 KB files starve each other and all blow that
timeout at once, which is why the failure arrives as a cliff rather than a slow crawl.
Deployed at `FIREBASE_HOSTING_UPLOAD_CONCURRENCY=8`. The flag is a workaround for the page
size, not a fix — shrink the pages and it can go.

The nine Aurora presets take no data-dependent props — the same nine pictures render on every
page in every locale — so they should be built once into static files instead of inlined 42
times. That is a rewrite of `AuroraField`/`geometry`/`presets` and belongs in its own claim;
this one does not change behaviour beyond the deployment. Filed as a follow-up.

## Verification

### Regression Report

Regression surface, enumerated before testing: the build itself, every one of the 42 locale
routes, the six locale-less entry paths the deleted proxy used to own, prerendered metadata
(canonical + `hreflang`, whose origin changed), `next/image` under `unoptimized`, static
assets, the 404 path, cache headers, and the local dev experience — which is the one place the
Firebase redirect layer does not exist.

#### Gates

| Gate | Result |
|------|--------|
| `npx tsc --noEmit` | clean |
| `npx eslint .` | clean, exit 0 — after `.firebase/**` was added to the ignore list |
| `npm run build` | succeeds, 47 static pages, `out/` written, **no `ƒ Proxy (Middleware)` line** — confirming the proxy is genuinely gone rather than silently retained |
| `firebase deploy --only hosting` | `release complete`, https://recharge-main.web.app |

#### Live site — 21 checks against the deployed origin

| Check | Result |
|-------|--------|
| Six locale-less paths → `/en-GB/…` | all six correct |
| `/` status | **302**, not 301 — the caching decision holds in production |
| `Accept-Language: ja` on `/` | → `/en-GB`. **Expected**: the redirect is fixed now, not negotiated |
| `Cookie: NEXT_LOCALE=zh-HK` on `/` | → `/en-GB`. Same |
| 7 locales × 6 routes | **42/42 return 200** |
| `/en-GB/plans.html` | → `/en-GB/plans` (`cleanUrls`) |
| `/en-GB/plans/` | → `/en-GB/plans` (`trailingSlash: false`) |
| `/icon.svg`, `/favicon.ico`, `/images/hero-sunrise.jpg` | 200 |
| All 12 `public/images/*.jpg` | 200, real byte counts (13–95 KB) — `unoptimized` serves the sources, nothing 404s |
| `/nonexistent-path` | 404 |
| `/.DS_Store` | 404 — the `ignore` fix holds |
| `_next/static/**` cache header | `public, max-age=31536000, immutable` |
| Canonical origin, 4 locales sampled | `https://recharge-main.web.app/…`, correct per page |
| `recharge.example.com` anywhere in shipped HTML | **0 occurrences** |
| `hreflang` alternates | 8 per page (7 locales + `x-default`), all on the new origin |
| `<html lang>` | matches the route in all four sampled locales, including `zh-HK` |
| Page content | eight-section narrative intact — section eyebrows, 111 `<svg>`, `Sign In`, `Ask Recharge` all present |

#### Found regression, fixed in docs rather than code

**The six locale-less paths now 404 in `npm run dev`.** Verified against a running dev server:
`/`, `/plans`, `/how-it-works` return 404 while `/en-GB` and `/ja-JP/plans` return 200. The
proxy answered these locally; its replacement lives in `firebase.json` and only exists in
front of the deployed site. The README told people to open `http://localhost:3000`, which is
now a 404 — corrected to `/en-GB` with an explanation of why.

Not fixed in code deliberately. The options were a root page that exists only to redirect in
dev (dead weight in the export, and shadowed in production because Hosting evaluates redirects
before serving files) or a `redirects()` table in `next.config.ts` that works in dev and is
silently ignored by the export — the exact failure mode that file now carries a warning
against. A documented locale-prefixed dev URL costs less than either.

#### Ruled out, with reasons

- **Locale routes lost to the export** — ruled out by the build (47 pages, all `●` SSG) and by
  42/42 live 200s.
- **Metadata pointing at the wrong origin** — grepped the live HTML for the placeholder across
  four locales: absent. Canonicals and all eight alternates carry `recharge-main.web.app`.
- **Images broken by `unoptimized`** — all 12 fetched, 200, plausible sizes.
- **Per-script typography lost** — `<html lang>` verified per locale including the `zh-HK`
  case that claim 004 found was silently inheriting the Simplified stack.
- **`negotiate.ts` shipping to the browser** — it has no importer at all now, so it cannot be
  in any bundle.
- **`recharge-wellbeing` disturbed** — untouched throughout; it was never a deploy target.

### Known and accepted

1. **No locale detection.** The bare domain sends everyone to English. `negotiate.ts` is kept
   unwired with a revival recipe; reviving it needs a host that runs a server.
2. **Deploys need `FIREBASE_HOSTING_UPLOAD_CONCURRENCY=8`** until the pages shrink. Without it
   the upload dies at ~80 files. Documented in the README next to the command.
3. **2.26 MB pages, 105 MB of `out/`.** Filed as a follow-up claim; not touched here.
4. **`rechargeindex` exists and is empty.** Created as an intermediate name; left in place
   rather than deleted, because deleting it would permanently burn that name too.
5. **Custom domain not configured.** The site answers on `recharge-main.web.app`. Pointing a
   real domain at it needs `NEXT_PUBLIC_SITE_URL` set at build time, or the canonicals will
   keep advertising the Firebase origin.
