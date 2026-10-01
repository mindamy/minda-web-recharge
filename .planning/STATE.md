# State — Recharge Web

- project: Recharge marketing website
- stack: Next.js (latest stable), TypeScript, Tailwind, motion
- locales: en-GB (default), ms-MY, id-ID, zh-Hans, zh-Hant, ja-JP — six locales, JSON catalogues in src/messages/ (zh-HK/Hong Kong removed in quick-006; zh-Hant removed in quick-007 and restored in quick-008, labelled 繁體中文 with no region)
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
| quick-kayinleong-006 | 2026-09-29 | Refresh 5 catalogues from the localization pack; remove Hong Kong (zh-HK); language switcher in the mobile bar (locale-aware nav breakpoint) | done |
| quick-kayinleong-007 | 2026-09-29 | Remove the Taiwan (zh-Hant) locale — last Traditional Chinese; site now five locales | done |
| quick-kayinleong-008 | 2026-10-01 | Second localization pack (zh-CN→zh-Hans, zh-TW→zh-Hant); restore zh-Hant as 繁體中文; nav breakpoint 1600→1400 | done |
