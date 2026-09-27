# State — Recharge Web

- project: Recharge marketing website
- stack: Next.js (latest stable), TypeScript, Tailwind, motion
- locales: en-GB (default), zh-Hans, zh-Hant — locale-prefixed routes, JSON catalogues in src/messages/
- deployed: https://recharge-main.web.app — Firebase Hosting, project `mtherapys`, site `recharge-main`, static export
- deploys need `FIREBASE_HOSTING_UPLOAD_CONCURRENCY=8` until the 2.26 MB pages shrink
- design source: `.docs/Design.pdf` (8 pages) + `.docs/First Page.jpeg` (replaces page 1)
- current branch: main
- remote: https://github.com/mindamy/minda-web-recharge (private)
- active claim: none

## Quick Tasks Completed

| ID | Date | Summary | Status |
|----|------|---------|--------|
| quick-kayinleong-001 | 2026-09-14 | Build Next.js app from the Recharge web design deck | done |
| quick-kayinleong-002 | 2026-09-15 | Real brand logo + scroll-driven motion layer | done |
| quick-kayinleong-003 | 2026-09-18 | i18n: JSON catalogues, Simplified + Traditional Chinese, language switcher | done |
| quick-kayinleong-004 | 2026-09-24 | Seven locales, country flags in the switcher, IP + device-language auto-select | done |
| quick-kayinleong-005 | 2026-09-28 | Deploy to Firebase Hosting as a static export; proxy removed, locale detection retired | done |
