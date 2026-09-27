# Claim: quick-kayinleong-005

- owner: kayinleong
- session: claude-code
- branch: main
- started: 2026-09-27
- status: claimed
- summary: Deploy the Recharge marketing site to Firebase Hosting in project `mtherapys` (account sosleong365@gmail.com) on a new site named `recharge`, served SSR via the Hosting web-frameworks integration so the locale proxy survives.

## What will change

First deployment of this codebase. Nothing in `src/` is expected to change; the work is
hosting configuration plus whatever the deploy proves wrong.

### Target, as confirmed with the user

| | |
|---|---|
| Account | `sosleong365@gmail.com` (already a known account in the local CLI — no new OAuth) |
| Project | `mtherapys` (display name *MTherapys*, project number 869271964404) |
| Site | **new site `recharge`** → `https://recharge.web.app` |
| Mode | **SSR via `webframeworks`**, not static export |

### Why a new site rather than the existing one

`mtherapys` already owns two Hosting sites, and the obvious-looking one is occupied:
`recharge-wellbeing.web.app` currently serves a **different product** — *"Recharge | Health
Screening Report"*, a voice-recording report tool with its own `combined.css`,
`config.js?v=localization-33` and `messages.js`. Deploying this marketing site over it would
have replaced a live app. Confirmed with the user before proceeding; a new site is created
instead and `recharge-wellbeing` is left untouched.

### Why SSR and not `output: 'export'`

The site is 47 prerendered pages and one request-time file: `src/proxy.ts`, the locale
negotiation shipped in [quick-kayinleong-004]. Proxy is on the documented **unsupported list**
for static export (`node_modules/next/dist/docs/01-app/02-guides/static-exports.md`,
"Unsupported Features"), so `output: 'export'` means deleting it and sending every bare URL to
`/en-GB` — retiring a feature one commit after shipping it. The web-frameworks integration
keeps the 47 pages on the CDN and runs the proxy in a Cloud Function. `mtherapys` is already
on Blaze (it runs eight v2 functions), so no billing change.

## Locked decisions

| Decision | Choice | Why |
|----------|--------|-----|
| Site ID | `recharge`, falling back to `minda-recharge` | Hosting site IDs are globally unique and lowercase; the user asked for "Recharge". |
| Render mode | Web-frameworks SSR | Keeps `proxy.ts`. See above. |
| Verify before live | Preview channel first | `firebase-tools` 15.30.1 declares Next.js support as `12 - 16.0`; this app is on **16.3.5**, i.e. past the tested range. The integration's own Next-16 wiring is present (`isUsingMiddleware` reads `functions-config-manifest.json` v3, which is where Next 16 records `/_middleware`), but "present" is not "verified". |
| Account selection | `--account sosleong365@gmail.com` per command | The CLI's active account is `ka.yin.leong@accenture.com`. Passing the flag avoids a global `login:use` that would silently change the account for every other project on this machine. |

## Known before starting

**IP-country detection does not survive this host.** Firebase Hosting injects no geo header,
so `countryFromHeaders` finds nothing and returns `null` — the documented, deliberate path.
Negotiation degrades to cookie → `Accept-Language` → `en-GB`. The country table still works
wherever a geo header exists; it is simply not one of Firebase's. This is a property of the
host, not of the mode chosen: static export would lose the whole negotiation, SSR loses only
the country signal.

## What has changed

_Pending._

## Verification

_Pending._
