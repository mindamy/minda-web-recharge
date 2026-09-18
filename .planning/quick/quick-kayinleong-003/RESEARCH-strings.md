# RESEARCH — User-facing string inventory

**Claim:** `quick-kayinleong-003`
**Scope:** every user-facing string in `src/` of the Next.js 16 App Router marketing site.
**Method:** all 55 `.ts`/`.tsx` files under `src/` read in full, then reconciled against
prerendered HTML from a successful `npm run build`.

---

## Summary

### Counting convention

One **catalogue entry** = one authored string unit (a headline, a paragraph, a label, an
`alt`, a metadata field). Where the source stores copy as an array of hard line fragments
(`body: ["Everyday wellbeing support and reflection,", "not diagnosis, treatment or cure."]`)
or splits a sentence across `<br className="hidden sm:inline" />`, that is **one** entry —
the line break is responsive layout, not copy. Lines that carry *emphasis* markup
(`<GradText>`, `<strong>`, `<sup>`, a coloured `<span>`, an inline `<a>`) are a different
matter and are catalogued separately under **Rich-text strings**.

### Totals

| Metric | Count |
|---|---|
| Authored string units (entries before dedup) | **209** |
| Exact-duplicate literals appearing in 2+ components | **12 pairs** |
| Distinct literals after dedup | **~197** |
| Rich-text (markup-bearing) strings | **20** |
| Interpolated / composed strings | **3** |
| Strings stored as hard-line arrays in source | **25** |
| Strings split by inline `<br>` in JSX | **22** |
| `alt` / `aria-label` strings | **17** |
| Route `metadata` fields (titles + descriptions) | **14** |

### Count by area

| Area | Files | Entries |
|---|---|---|
| Route metadata (`src/app/**/page.tsx`, `layout.tsx`) | 7 | 14 |
| Header + nav + shared CTA (`chrome/Header`, `chrome/NavLabel`, `chrome/Logo`, `lib/nav`) | 4 | 14 |
| Footer (`chrome/Footer`) | 1 | 5 |
| TrustStrip (`chrome/TrustStrip`) | 1 | 6 |
| ScrollCue (`chrome/ScrollCue`) | 1 | 1 |
| AskRecharge — 7 layouts (`chrome/AskRecharge`) | 1 | 12 |
| Hero (`sections/Hero`) | 1 | 4 |
| Moments (`sections/Moments`) | 1 | 23 |
| R3Loop copy (`sections/R3Loop`) | 1 | 5 |
| R³ loop nodes (`sections/r3/loopNodes`, `LoopDiagram`) | 2 | 11 |
| ExperienceCard (`sections/r3/ExperienceCard`) | 1 | 10 |
| Connected header (`sections/Connected`) | 1 | 3 |
| FragmentedStack (`sections/connected/FragmentedStack`) | 1 | 8 |
| CentrePortrait (`sections/connected/CentrePortrait`) | 1 | 3 |
| UnifiedCircle (`sections/connected/UnifiedCircle`) | 1 | 2 |
| WhyConnectionMatters (`sections/connected/WhyConnectionMatters`) | 1 | 11 |
| Rhythm (`sections/Rhythm`) | 1 | 11 |
| RhythmTimeline (`sections/rhythm/RhythmTimeline`) | 1 | 14 |
| Trust (`sections/Trust`) | 1 | 16 |
| Plans (`sections/Plans`) | 1 | 30 |
| Start (`sections/Start`) | 1 | 5 |
| 404 (`app/not-found.tsx`) | 1 | 4 |

**Files with zero user-facing strings** (verified by reading, and by a JSX-text-node /
text-prop scan that returned no hits): all of `src/components/aurora/*` (5 files),
`src/components/icons/index.tsx` (892 lines, pure path data), all of
`src/components/motion/*` (6 files), `src/components/sections/r3/LoopArcs.tsx`,
`src/components/sections/connected/{Connector,ScatterField,ConnectionCurves}.tsx`,
`src/components/sections/rhythm/timeline.ts`, `src/lib/cn.ts`, and all of
`src/components/ui/*` except default prop values (`Container`, `Section`, `Button`,
`GradText` carry no copy; `Eyebrow` carries none either — every eyebrow string is passed
in by its section). `src/app/globals.css` has no `content:` text.

> Note: `sections/rhythm/timeline.ts` was named in the brief as a likely copy holder. It is
> **not** — it is pure geometry. The Rhythm copy lives in `RhythmTimeline.tsx`'s `NODES`
> array and in `Rhythm.tsx`'s `STRIP` array. `r3/loopNodes.ts` *does* hold copy, as expected.

### Reconciliation verdict — **CLEAN**

`npm run build` exited 0. All 8 prerendered HTML files under `.next/server/app/` were
parsed; script/style/svg content stripped; text nodes, `alt`, `aria-label`, `title`,
`<title>` and `<meta name="description">` extracted and de-duplicated.

- **276 distinct rendered fragments** across the 7 project pages.
- **260 matched a source literal verbatim.**
- **16 did not match verbatim — all 16 are explained**, none is a missed string:

| Unmatched rendered fragment | Why |
|---|---|
| `We handle your information with care and give you control.` | `TrustStrip` joins a 2-element `body` array with `body.join(" ")` |
| `AI, personalisation and human insight working together for you.` | same |
| `It’s normal to have ups and downs.` | source writes `It&rsquo;s` (HTML entity) |
| `clear boundaries. Here’s what that means for you.` | source writes `Here&rsquo;s` |
| `Recharge is designed to respond to the moment, learn from` | JSX source wraps this line mid-sentence across two source lines |
| `what matters to you, and become more relevant as your` | same |
| `and Recharge Experiences together before` | same |
| `The link you followed points somewhere we have not built yet. Start where you are — everything else is a scroll away.` | source writes `&mdash;` and wraps across source lines |
| `©` and `2026` | `&copy; {new Date().getFullYear()}` — interpolated |
| `Page not found — Recharge`, `About — Recharge`, `How it works — Recharge`, `Plans — Recharge`, `The R³ Experience — Recharge`, `Trust & approach — Recharge` | composed by the `title.template: "%s — Recharge"` in `layout.tsx:40` |

**Nothing visible in the built HTML is absent from this inventory.**

Two strings in the inventory are *not* in any prerendered HTML because they are
client-conditional: `Close menu` and `Open menu` (`Header.tsx:166` — only `Open menu`
prerenders, `Close menu` appears after the mobile sheet opens). Both are inventoried.

`.next/server/app/_global-error.html` contains four strings that are **not** ours —
`500: This page couldn’t load`, `This page couldn’t load`, `A server error occurred.
Reload to try again.`, `Reload`. These are Next.js framework defaults with no source in
`src/`. See **Uncertainties**.

---

## Proposed catalogue structure

### Recommendation: **mirror the component tree, not the pages.**

The decisive fact is the site's hybrid routing (`src/lib/nav.ts:5-9`): every section
component is mounted **both** inside the `/` scroll narrative **and** on its own standalone
route. Concretely:

| Section | Mounted on |
|---|---|
| `Start` | `/`, `/about`, `/how-it-works`, `/plans`, `/the-r3-experience`, `/trust-and-approach` — **all 6 routes** |
| `Connected`, `Rhythm` | `/`, `/about` |
| `Moments` | `/`, `/how-it-works` |
| `R3Loop` | `/`, `/the-r3-experience` |
| `Trust` | `/`, `/trust-and-approach` |
| `Plans` | `/`, `/plans` |

A page-grouped catalogue (`en-GB.json → { home: {...}, plans: {...} }`) would have to either
duplicate the entire `Start` section's copy six times, or invent cross-page `$ref`s. Both
are worse than just keying by component. The *only* genuinely page-scoped copy is route
`metadata`, which gets its own `meta` namespace keyed by route slug.

### Top-level namespaces

```
meta.*        per-route <title> and description — the one page-keyed namespace
common.*      strings used by 2+ components (CTA copy, brand, the Ask Recharge family)
chrome.*      header, footer, nav, logo, scroll cue, trust strip
sections.*    one key per section component, mirroring src/components/sections/
notFound.*    the 404 route's own copy
```

### Representative excerpt

```jsonc
{
  "meta": {
    "default": {
      "title": "Recharge — Your personal wellbeing companion",
      "titleTemplate": "%s — Recharge",
      "description": "Recharge brings personal insights, AI-guided coaching and personalised experiences together in one connected wellbeing experience."
    },
    "about":            { "title": "About",               "description": "Recharge brings personal insights, AI-guided coaching and Recharge Experiences together around you." },
    "howItWorks":       { "title": "How it works",        "description": "Recognising how you feel is the first step to finding what can help. See how Recharge meets your moment." },
    "plans":            { "title": "Plans",               "description": "Try Recharge free for 7 days, then choose the level of support that feels right for you." },
    "theR3Experience":  { "title": "The R³ Experience",   "description": "One connected loop to help you understand yourself, find what you need and feel better in the moment." },
    "trustAndApproach": { "title": "Trust & approach",    "description": "Recharge is built around care, clarity and clear boundaries. Support, not diagnosis." },
    "notFound":         { "title": "Page not found" }
  },

  "common": {
    "brand": { "wordmark": "Recharge", "homeLabel": "Recharge — home" },
    "cta": {
      "tryFree":        "Try Recharge Free",
      "signIn":         "Sign In",
      "seeHowItWorks":  "See How It Works",
      "trialMeta":      "7 days · No credit card required"
    },
    "pillars": {
      "insights":     { "title": "Personal Insights",    "sub": "Understand yourself." },
      "coaching":     { "title": "AI-guided Coaching",   "sub": "Find what you need." },
      "experiences":  { "title": "Recharge Experiences", "sub": "Feel better in the moment." }
    },
    "disclaimer": {
      "medical": "Everyday wellbeing support and reflection, not diagnosis, treatment or cure."
    },
    "ask": {
      "label":        "Ask Recharge",
      "labelDotted":  "Ask Recharge.",
      "guide":        "Website guide",
      "hero":         "Not sure where to start? Ask Recharge",
      "bannerLead":   "Not sure where to start?",
      "bannerBody":   "Our AI companion can help you make sense of how you feel and find what might help.",
      "loop":         "Questions about the loop?",
      "personal":     "How does Recharge become personal?",
      "approach":     "Questions about our approach?",
      "plans":        "Not sure which plan fits you?",
      "plansCta":     "Help Me Choose",
      "start":        "Still have a question before you begin?"
    }
  },

  "chrome": {
    "nav": {
      "landmarkMain":   "Main",
      "landmarkFooter": "Footer",
      "openMenu":       "Open menu",
      "closeMenu":      "Close menu",
      "items": {
        "howItWorks":       "How It Works",
        "theR3Experience":  "The R³ Experience",
        "plans":            "Plans",
        "trustAndApproach": "Trust & Approach",
        "about":            "About"
      }
    },
    "scrollCue": { "label": "Scroll to explore" },
    "footer": {
      "copyright": "© {year} Recharge. All rights reserved.",
      "privacy":   "Privacy",
      "terms":     "Terms"
    },
    "trustStrip": {
      "support": { "title": "Support, not diagnose.", "body": "@common.disclaimer.medical" },
      "privacy": { "title": "Your privacy matters.",  "body": "We handle your information with care and give you control." },
      "care":    { "title": "Built with care.",       "body": "AI, personalisation and human insight working together for you." }
    }
  },

  "sections": {
    "hero": {
      "eyebrow":    "Your personal wellbeing companion",
      "headline":   [                                    // rich — see RT-1
        { "text": "What if " },
        { "text": "better sleep,", "mark": "grad-1" },
        { "text": " a " },
        { "text": "calmer mind,",  "mark": "grad-2" },
        { "text": " and relief from " },
        { "text": "migraine",      "mark": "grad-3" },
        { "text": " " },
        { "text": "discomfort",    "mark": "violet"  },
        { "text": " were within reach?" }
      ],
      "leadSerif":  "Recharge your body. Calm your mind.\nWake up feeling refreshed.",
      "leadSans":   "Give yourself the rest and recovery you deserve."
    },

    "moments": {
      "eyebrow": "RECOGNISE YOUR MOMENT",
      "headline": { "plain": "What do you need right now?", "grad": "Your moment matters." },
      "lead": "We all move through different moments. Recognising how you feel is the first step to finding what can help.",
      "reassurance": {
        "title": "It’s normal to have ups and downs.",
        "body":  "Recharge is here to support you, wherever you are in your day."
      },
      "cards": {
        "focus":      { "title": "I need to focus",      "body": "I want to be clear, productive and in flow.", "alt": "A young man at a desk writing beside a laptop, a bright window behind him." },
        "reset":      { "title": "I need a reset",       "body": "I feel overwhelmed and need to reset.",       "alt": "A woman reclining on a sofa under a knit throw with her eyes closed." }
        // … runningLow, switchOff, stuck, clarity
      }
    }
    // … r3Loop, connected, rhythm, trust, plans, start
  },

  "notFound": {
    "eyebrow":  "Not quite here",
    "headline": { "plain": "This page is ", "grad": "still on its way." },
    "body":     "The link you followed points somewhere we have not built yet. Start where you are — everything else is a scroll away.",
    "backHome": "Back to Recharge"
  }
}
```

### Why the `common.pillars` sub-namespace exists

`Personal Insights` / `Understand yourself.`, `AI-guided Coaching` / `Find what you need.`
and `Recharge Experiences` / `Feel better in the moment.` appear in **three** places each —
`r3/loopNodes.ts`, `connected/FragmentedStack.tsx`, and (for the third pillar)
`r3/ExperienceCard.tsx`. They are the product's three pillars and must not drift; giving
them one shared key is the single highest-leverage dedup in the catalogue.

### Nesting depth

Cap at four levels (`sections.moments.cards.focus.title`). The Plans features arrays are
the one place a fifth would be tempting; use an array value instead
(`sections.plans.tiers.essential.features: [ … ]`) rather than
`sections.plans.tiers.essential.features.f1`.

---

## Inventory

Line numbers are current as of this reading. `↺` marks a string that also appears elsewhere
(see **Repeated strings**). `RT-n` cross-references **Rich-text strings**.

### A. Route metadata

| Key | String | file:line | Notes |
|---|---|---|---|
| `meta.default.title` | `Recharge — Your personal wellbeing companion` | `src/app/layout.tsx:39` | em dash |
| `meta.default.titleTemplate` | `%s — Recharge` | `src/app/layout.tsx:40` | interpolated; em dash |
| `meta.default.description` | `Recharge brings personal insights, AI-guided coaching and personalised experiences together in one connected wellbeing experience.` | `src/app/layout.tsx:42-43` | 🇬🇧 `personalised` |
| `meta.notFound.title` | `Page not found` | `src/app/not-found.tsx:20` | |
| `meta.about.title` | `About` | `src/app/about/page.tsx:16` | ↺ same literal as nav label |
| `meta.about.description` | `Recharge brings personal insights, AI-guided coaching and Recharge Experiences together around you.` | `src/app/about/page.tsx:17-18` | |
| `meta.howItWorks.title` | `How it works` | `src/app/how-it-works/page.tsx:14` | sentence case — nav label is Title Case |
| `meta.howItWorks.description` | `Recognising how you feel is the first step to finding what can help. See how Recharge meets your moment.` | `src/app/how-it-works/page.tsx:15-16` | 🇬🇧 `Recognising` |
| `meta.plans.title` | `Plans` | `src/app/plans/page.tsx:8` | ↺ nav label |
| `meta.plans.description` | `Try Recharge free for 7 days, then choose the level of support that feels right for you.` | `src/app/plans/page.tsx:9-10` | ↺ Plans section lead |
| `meta.theR3Experience.title` | `The R³ Experience` | `src/app/the-r3-experience/page.tsx:13` | `³` U+00B3; ↺ nav label |
| `meta.theR3Experience.description` | `One connected loop to help you understand yourself, find what you need and feel better in the moment.` | `src/app/the-r3-experience/page.tsx:14-15` | ↺ R3Loop body copy |
| `meta.trustAndApproach.title` | `Trust & approach` | `src/app/trust-and-approach/page.tsx:8` | sentence case; nav label is `Trust & Approach` |
| `meta.trustAndApproach.description` | `Recharge is built around care, clarity and clear boundaries. Support, not diagnosis.` | `src/app/trust-and-approach/page.tsx:9-10` | |

### B. Header, nav, shared CTA

| Key | String | file:line | Notes |
|---|---|---|---|
| `common.brand.wordmark` | `Recharge` | `src/components/chrome/Logo.tsx:72` | live text, intentionally not part of the SVG mark |
| `common.brand.homeLabel` | `Recharge — home` | `Header.tsx:111`, `Footer.tsx:26` | ↺ ×2; `aria-label`; em dash |
| `chrome.nav.landmarkMain` | `Main` | `Header.tsx:115`, `Header.tsx:194` | ↺ ×2; `<nav aria-label>` |
| `chrome.nav.openMenu` | `Open menu` | `Header.tsx:166` | `aria-label`, ternary |
| `chrome.nav.closeMenu` | `Close menu` | `Header.tsx:166` | `aria-label`, ternary; not in prerendered HTML |
| `chrome.nav.items.howItWorks` | `How It Works` | `src/lib/nav.ts:54` | |
| `chrome.nav.items.theR3Experience` | `The R³ Experience` | `src/lib/nav.ts:60` | RT-21; `superscript: true` at `nav.ts:64` |
| `chrome.nav.items.plans` | `Plans` | `src/lib/nav.ts:68` | |
| `chrome.nav.items.trustAndApproach` | `Trust & Approach` | `src/lib/nav.ts:74` | literal `&`, not an entity |
| `chrome.nav.items.about` | `About` | `src/lib/nav.ts:80` | |
| `common.cta.tryFree` | `Try Recharge Free` | `src/lib/nav.ts:100` | used 6× (Header ×2, Hero, Plans ×2, Start, 404) |
| `common.cta.signIn` | `Sign In` | `src/lib/nav.ts:101` | used 2× (Header desktop + mobile) |
| `common.cta.seeHowItWorks` | `See How It Works` | `src/lib/nav.ts:102` | Hero only |
| `common.cta.trialMeta` | `7 days · No credit card required` | `src/lib/nav.ts:103` | `·` U+00B7 middot; used 3× |

### C. Footer

| Key | String | file:line | Notes |
|---|---|---|---|
| `chrome.nav.landmarkFooter` | `Footer` | `Footer.tsx:34` | `<nav aria-label>` |
| `common.disclaimer.medical` | `Everyday wellbeing support and reflection, not diagnosis, treatment or cure.` | `Footer.tsx:30` | ⚠️ **MEDICAL DISCLAIMER** — ↺ identical to TrustStrip col 1 body (`TrustStrip.tsx:23`) |
| `chrome.footer.copyright` | `© {year} Recharge. All rights reserved.` | `Footer.tsx:51-53` | `&copy;` + `new Date().getFullYear()` — **interpolated** |
| `chrome.footer.privacy` | `Privacy` | `Footer.tsx:57` | ↺ shares literal with Trust card 4 title line 1 |
| `chrome.footer.terms` | `Terms` | `Footer.tsx:61` | |

*(Footer nav link labels are read from `NAV_ITEMS` — `Footer.tsx:42` — no new strings.)*

### D. TrustStrip — ⚠️ carries the medical disclaimer

| Key | String | file:line | Notes |
|---|---|---|---|
| `chrome.trustStrip.support.title` | `Support, not diagnose.` | `TrustStrip.tsx:21` | ↺ identical to Trust card 1 title (`Trust.tsx:60`) |
| `chrome.trustStrip.support.body` | `Everyday wellbeing support and reflection, not diagnosis, treatment or cure.` | `TrustStrip.tsx:23` | ⚠️ **MEDICAL DISCLAIMER**; source is a 2-element array joined with `" "` at `TrustStrip.tsx:55` |
| `chrome.trustStrip.privacy.title` | `Your privacy matters.` | `TrustStrip.tsx:27` | |
| `chrome.trustStrip.privacy.body` | `We handle your information with care and give you control.` | `TrustStrip.tsx:29` | 2-element array |
| `chrome.trustStrip.care.title` | `Built with care.` | `TrustStrip.tsx:33` | |
| `chrome.trustStrip.care.body` | `AI, personalisation and human insight working together for you.` | `TrustStrip.tsx:35` | 🇬🇧 `personalisation`; 2-element array |

> ⚠️ **Disclaimer flag.** Three strings carry the legally-sensitive "not diagnosis,
> treatment or cure" language: `common.disclaimer.medical` (TrustStrip + Footer, identical
> wording) and the longer Trust card 1 body (`Trust.tsx:62-70`). A fourth,
> `meta.trustAndApproach.description`, restates it as "Support, not diagnosis." These four
> must not be freely reworded or machine-translated — they should be marked
> `"translate": false` or gated behind legal sign-off in any `en-GB` → other-locale flow.
> `TrustStrip.tsx:12-16` records that its wording was deliberately taken from the supplied
> hero JPEG rather than the deck, because the deck renders a stray trailing period.

### E. ScrollCue

| Key | String | file:line | Notes |
|---|---|---|---|
| `chrome.scrollCue.label` | `Scroll to explore` | `ScrollCue.tsx:23` | **default prop value**, not passed by any caller; rendered uppercase via CSS (`text-scroll uppercase`, line 53), so the catalogue value stays sentence case. The whole cue is `aria-hidden`. |

### F. AskRecharge — 7 placements, 5 layouts

| Key | String | file:line | Notes |
|---|---|---|---|
| `common.ask.hero` | `Not sure where to start? Ask Recharge` | `AskRecharge.tsx:78` | whole string is one link; `Ask Recharge` is **not** separately coloured here |
| `common.ask.bannerLead` | `Not sure where to start?` | `AskRecharge.tsx:99` | RT-15 |
| `common.ask.labelDotted` | `Ask Recharge.` | `AskRecharge.tsx:101` | RT-15; with trailing period, blue span |
| `common.ask.bannerBody` | `Our AI companion can help you make sense of how you feel and find what might help.` | `AskRecharge.tsx:107-108` | `<br className="hidden lg:inline" />` |
| `common.ask.label` | `Ask Recharge` | `:113`, `:133`, `:155`, `:177`, `:204`, `:233` | ↺ **6 occurrences** in this file alone |
| `common.ask.loop` | `Questions about the loop?` | `AskRecharge.tsx:128` | |
| `common.ask.personal` | `How does Recharge become personal?` | `AskRecharge.tsx:150` | RT-16 |
| `common.ask.guide` | `Website guide` | `AskRecharge.tsx:158`, `:236` | ↺ ×2 |
| `common.ask.approach` | `Questions about our approach?` | `AskRecharge.tsx:172` | RT-17 |
| `common.ask.plans` | `Not sure which plan fits you?` | `AskRecharge.tsx:196` | |
| `common.ask.plansCta` | `Help Me Choose` | `AskRecharge.tsx:201` | the **link** here; `Ask Recharge` demotes to a label below it |
| `common.ask.start` | `Still have a question before you begin?` | `AskRecharge.tsx:225` | RT-18 |
| *(glyph)* | ` · ` | `AskRecharge.tsx:235` | `&middot;` separator — see **Non-copy strings** |

### G. Hero

| Key | String | file:line | Notes |
|---|---|---|---|
| `sections.hero.eyebrow` | `Your personal wellbeing companion` | `Hero.tsx:113` | uppercased by CSS, stored sentence case |
| `sections.hero.headline` | `What if better sleep, a calmer mind, and relief from migraine discomfort were within reach?` | `Hero.tsx:121-133` | **RT-1** — 4 coloured runs + 1 flat violet span + 4 conditional `<br>` |
| `sections.hero.leadSerif` | `Recharge your body. Calm your mind. Wake up feeling refreshed.` | `Hero.tsx:139-140` | `<br className="hidden sm:inline" />` |
| `sections.hero.leadSans` | `Give yourself the rest and recovery you deserve.` | `Hero.tsx:147` | |

*(Hero photo `alt=""` at `Hero.tsx:72` — intentionally empty, decorative. Not a string.)*

### H. Moments

| Key | String | file:line | Notes |
|---|---|---|---|
| `sections.moments.eyebrow` | `RECOGNISE YOUR MOMENT` | `Moments.tsx:131` | 🇬🇧 `RECOGNISE`; **stored uppercase in source** (unlike Hero's eyebrow) |
| `sections.moments.headline` | `What do you need right now?` / `Your moment matters.` | `Moments.tsx:133-137` | **RT-2** — line 2 in `<GradText>` |
| `sections.moments.lead` | `We all move through different moments. Recognising how you feel is the first step to finding what can help.` | `Moments.tsx:140-142` | 🇬🇧 `Recognising` |
| `sections.moments.reassurance.title` | `It’s normal to have ups and downs.` | `Moments.tsx:155` | `&rsquo;` entity in source |
| `sections.moments.reassurance.body` | `Recharge is here to support you, wherever you are in your day.` | `Moments.tsx:158-159` | |
| `…cards.focus.title` | `I need to focus` | `Moments.tsx:69` | |
| `…cards.focus.body` | `I want to be clear, productive and in flow.` | `Moments.tsx:70` | 2-element array |
| `…cards.focus.alt` | `A young man at a desk writing beside a laptop, a bright window behind him.` | `Moments.tsx:65` | |
| `…cards.reset.title` | `I need a reset` | `Moments.tsx:78` | ↺ identical to `YOU_NODE.pill[1]` (`loopNodes.ts:103`) |
| `…cards.reset.body` | `I feel overwhelmed and need to reset.` | `Moments.tsx:79` | 2-element array |
| `…cards.reset.alt` | `A woman reclining on a sofa under a knit throw with her eyes closed.` | `Moments.tsx:74` | |
| `…cards.runningLow.title` | `I’m running low` | `Moments.tsx:87` | `’` U+2019 literal |
| `…cards.runningLow.body` | `I feel drained and need to recharge.` | `Moments.tsx:88` | 2-element array |
| `…cards.runningLow.alt` | `A woman outdoors in a green jacket holding a water bottle.` | `Moments.tsx:83` | |
| `…cards.switchOff.title` | `I can’t switch off` | `Moments.tsx:96` | `’` U+2019 literal |
| `…cards.switchOff.body` | `My mind is busy and I need to unwind.` | `Moments.tsx:97` | 2-element array |
| `…cards.switchOff.alt` | `A man at a table at night by a warm lamp, one hand at his temple.` | `Moments.tsx:92` | |
| `…cards.stuck.title` | `I feel stuck` | `Moments.tsx:105` | |
| `…cards.stuck.body` | `I need a shift in perspective.` | `Moments.tsx:106` | 2-element array |
| `…cards.stuck.alt` | `A woman seated indoors, chin resting on her hand, looking away.` | `Moments.tsx:101` | |
| `…cards.clarity.title` | `I want more clarity` | `Moments.tsx:114` | |
| `…cards.clarity.body` | `I’m looking for direction and inner clarity.` | `Moments.tsx:115` | `’` U+2019; 2-element array |
| `…cards.clarity.alt` | `A man outdoors at dusk beside a lake, mountains behind him.` | `Moments.tsx:110` | |

### I. R3Loop (section copy)

| Key | String | file:line | Notes |
|---|---|---|---|
| `sections.r3Loop.eyebrow` | `THE R³ RECHARGE LOOP` | `R3Loop.tsx:47-49` | **RT-3** — `THE ` + `<RCubed />` + ` RECHARGE LOOP`; the `³` is *not* in the string, it is a component |
| `sections.r3Loop.headline` | `How Recharge helps` | `R3Loop.tsx:53-55` | **RT-4** — `Recharge` in `<GradText>`, wrapped once around the whole word |
| `sections.r3Loop.lead` | `One connected loop to help you understand yourself, find what you need and feel better in the moment.` | `R3Loop.tsx:59-66` | **RT-5** — trailing clause in `<strong>`; ↺ same sentence as `meta.theR3Experience.description` |
| `sections.r3Loop.noStart` | `There is no fixed starting point. Start wherever you are.` | `R3Loop.tsx:70-73` | `<br className="hidden sm:inline" />` |
| `sections.r3Loop.closing` | `Start where you are. Move with what you need.` | `R3Loop.tsx:96-98` | |

### J. R³ loop nodes (`loopNodes.ts` → `LoopDiagram.tsx`)

| Key | String | file:line | Notes |
|---|---|---|---|
| `…nodes.reconnect.label` | `RECONNECT` | `loopNodes.ts:58` | micro-eyebrow, stored uppercase |
| `…nodes.reconnect.title` | `Personal Insights` | `loopNodes.ts:59` | ↺ `FragmentedStack.tsx:41` |
| `…nodes.reconnect.sub` | `Understand yourself.` | `loopNodes.ts:60` | ↺ `FragmentedStack.tsx:42` |
| `…nodes.realign.label` | `REALIGN` | `loopNodes.ts:73` | |
| `…nodes.realign.title` | `AI-guided Coaching` | `loopNodes.ts:74` | ↺ `FragmentedStack.tsx:49` |
| `…nodes.realign.sub` | `Find what you need.` | `loopNodes.ts:75` | ↺ `FragmentedStack.tsx:50` |
| `…nodes.recharge.label` | `RECHARGE` | `loopNodes.ts:86` | ↺ `ExperienceCard.tsx:93` |
| `…nodes.recharge.title` | `Personalised Recharge Experiences` | `loopNodes.ts:87` | 🇬🇧 `Personalised` (deliberate deviation, see `loopNodes.ts:14-16`); ↺ `ExperienceCard.tsx:96` |
| `…nodes.recharge.sub` | `Feel better in the moment.` | `loopNodes.ts:88` | ↺ `ExperienceCard.tsx:99`, ≈ `FragmentedStack.tsx:58` |
| `…you.title` | `You` | `loopNodes.ts:102` | rendered twice — ellipse (`LoopDiagram.tsx:161`) and rail (`:233`) |
| `…you.pill` | `Right now: I need a reset` | `loopNodes.ts:103` | 2-element array, hard `<br>` at `LoopDiagram.tsx:117`; line 2 ↺ `Moments.tsx:78` |

### K. ExperienceCard

| Key | String | file:line | Notes |
|---|---|---|---|
| `…experienceCard.eyebrow` | `RECHARGE` | `ExperienceCard.tsx:93` | ↺ `loopNodes.ts:86` |
| `…experienceCard.kicker` | `Personalised Recharge Experiences` | `ExperienceCard.tsx:96` | 🇬🇧; ↺ `loopNodes.ts:87` |
| `…experienceCard.title` | `Feel better in the moment.` | `ExperienceCard.tsx:99` | ↺ `loopNodes.ts:88` |
| `…experienceCard.body` | `Personalised audio experiences designed to support the state you need.` | `ExperienceCard.tsx:102-103` | 🇬🇧 `Personalised` |
| `…experienceCard.suggestedLabel` | `Suggested for this moment` | `ExperienceCard.tsx:108` | |
| `…experienceCard.track.name` | `Reset` | `ExperienceCard.tsx:58` | **RT-19** |
| `…experienceCard.track.duration` | `8 min` | `ExperienceCard.tsx:60` | **RT-19** |
| `…experienceCard.track.body` | `A moment to clear some mental noise and make space to reset.` | `ExperienceCard.tsx:63-64` | |
| `…experienceCard.track.time` | `0:00 / 8:00` | `ExperienceCard.tsx:130` | frozen resting state, not a live timer |
| `…experienceCard.playLabel` | `Play Reset, an 8 minute recharge experience` | `ExperienceCard.tsx:35` | `aria-label`; **restates `Reset` and `8 min`** — see Uncertainties |
| *(glyph)* | `·` | `ExperienceCard.tsx:59` | `&middot;` separator |

### L. Connected (section header)

| Key | String | file:line | Notes |
|---|---|---|---|
| `sections.connected.eyebrow` | `MORE CONNECTED` | `Connected.tsx:51` | gradient eyebrow (`gradient="forward"`) |
| `sections.connected.headline` | `Wellbeing support` / `shouldn’t feel fragmented.` | `Connected.tsx:53-56` | **RT-6** — two `<span className="block">`; the **only headline in the deck with no gradient run** (`Connected.tsx:28-32`); `’` U+2019 literal |
| `sections.connected.lead` | `Recharge brings personal insights, AI-guided coaching and Recharge Experiences together around you.` | `Connected.tsx:58-63` | **RT-7** — two block spans; ↺ ≈ `meta.about.description` |

### M. FragmentedStack

| Key | String | file:line | Notes |
|---|---|---|---|
| `…fragmented.eyebrow` | `FRAGMENTED SUPPORT` | `FragmentedStack.tsx:65` | |
| `…fragmented.lead` | `Help can come from many places, but rarely works together.` | `FragmentedStack.tsx:66-69` | two block spans |
| `…fragmented.cards.insights.title` | `Personal Insights` | `FragmentedStack.tsx:41` | ↺ `loopNodes.ts:59` |
| `…fragmented.cards.insights.sub` | `Understand yourself.` | `FragmentedStack.tsx:42` | ↺ `loopNodes.ts:60` |
| `…fragmented.cards.coaching.title` | `AI-guided Coaching` | `FragmentedStack.tsx:49` | ↺ `loopNodes.ts:74` |
| `…fragmented.cards.coaching.sub` | `Find what you need.` | `FragmentedStack.tsx:50` | ↺ `loopNodes.ts:75` |
| `…fragmented.cards.experiences.title` | `Recharge Experiences` | `FragmentedStack.tsx:57` | |
| `…fragmented.cards.experiences.sub` | `Feel better in the moment.` | `FragmentedStack.tsx:58` | stored as `["Feel better in", "the moment."]`; same sentence as `loopNodes.ts:88` |

### N. CentrePortrait

| Key | String | file:line | Notes |
|---|---|---|---|
| `…centrePortrait.alt` | `A woman sitting indoors beside a houseplant, looking up into soft window light.` | `CentrePortrait.tsx:42` | |
| `…centrePortrait.headline` | `One person.` / `One connected experience.` | `CentrePortrait.tsx:49-54` | **RT-8** — `connected` in `<GradText>`, line 2 only |
| `…centrePortrait.caption` | `Recharge connects the journey.` | `CentrePortrait.tsx:58` | |

### O. UnifiedCircle

| Key | String | file:line | Notes |
|---|---|---|---|
| `…unifiedCircle.headline` | `One connected experience` | `UnifiedCircle.tsx:75-80` | **RT-9** — `connected` in `<GradText>`; note the **line break falls mid-phrase** (`One connected` / `experience`), unlike RT-8 |
| `…unifiedCircle.caption` | `Insights. Guidance. Experiences. Working together around you.` | `UnifiedCircle.tsx:84-87` | two block spans |

*(Logo lockup reused at `UnifiedCircle.tsx:69-73` — no new string.)*

### P. WhyConnectionMatters

| Key | String | file:line | Notes |
|---|---|---|---|
| `…why.eyebrow` | `WHY CONNECTION MATTERS` | `WhyConnectionMatters.tsx:74` | |
| `…why.problem` | `Support often lives in different places.` | `WhyConnectionMatters.tsx:75-78` | two block spans |
| `…why.answer` | `Recharge brings it together around you.` | `WhyConnectionMatters.tsx:79-82` | two block spans |
| `…why.benefits.lessSearching.title` | `Less searching` | `WhyConnectionMatters.tsx:39` | |
| `…why.benefits.lessSearching.body` | `Insights, guidance and experiences in one connected place.` | `WhyConnectionMatters.tsx:41` | |
| `…why.benefits.moreRelevant.title` | `More relevant` | `WhyConnectionMatters.tsx:47` | |
| `…why.benefits.moreRelevant.body` | `Support shaped around the moment and what matters to you.` | `WhyConnectionMatters.tsx:49` | |
| `…why.benefits.inTheMoment.title` | `In the moment` | `WhyConnectionMatters.tsx:55` | |
| `…why.benefits.inTheMoment.body` | `Start when you need support, without waiting for the perfect time or place.` | `WhyConnectionMatters.tsx:56` | ⚠️ **deliberately departs from the deck** — `WhyConnectionMatters.tsx:19-22` records the render reads "…without waiting as you perfect time or place." and this is the agreed correction |
| `…why.benefits.overTime.title` | `More personal over time` | `WhyConnectionMatters.tsx:63` | cf. Rhythm's `More Personal Over Time` (Title Case) — **different casing, same words** |
| `…why.benefits.overTime.body` | `Your experience can become more relevant as you use Recharge.` | `WhyConnectionMatters.tsx:65` | |

### Q. Rhythm

| Key | String | file:line | Notes |
|---|---|---|---|
| `sections.rhythm.eyebrow` | `PERSONAL TO YOUR RHYTHM` | `Rhythm.tsx:71` | |
| `sections.rhythm.headline` | `Meets you where you are.` / `Gets to know your rhythm over time.` | `Rhythm.tsx:73-77` | **RT-10** — `your rhythm` in `<GradText>`, **mid-line** |
| `sections.rhythm.lead` | `Your needs can change throughout the day and over time. Recharge is designed to respond to the moment, learn from what matters to you, and become more relevant as your experience continues.` | `Rhythm.tsx:81-88` | 4 hard lines via `<br className="hidden lg:inline" />` |
| `sections.rhythm.closing` | `Everyday moments, at your own pace.` | `Rhythm.tsx:98` | |
| `…rhythm.strip.moment.title` | `Personal to the Moment` | `Rhythm.tsx:44` | |
| `…rhythm.strip.moment.body` | `What do you need right now?` | `Rhythm.tsx:45` | ↺ **identical to the Moments headline line 1** (`Moments.tsx:134`) |
| `…rhythm.strip.you.title` | `Personal to You` | `Rhythm.tsx:50` | |
| `…rhythm.strip.you.body` | `Your preferences, patterns and responses.` | `Rhythm.tsx:51` | 2-element array |
| `…rhythm.strip.overTime.title` | `More Personal Over Time` | `Rhythm.tsx:56` | Title Case; cf. `WhyConnectionMatters.tsx:63` |
| `…rhythm.strip.overTime.body` | `The experience can evolve with you.` | `Rhythm.tsx:57` | 2-element array |
| `sections.rhythm.noTwo` | `No two people are the same. No two moments are either.` | `Rhythm.tsx:151` | |

### R. RhythmTimeline

| Key | String | file:line | Notes |
|---|---|---|---|
| `…timeline.morning.title` | `Morning` | `RhythmTimeline.tsx:63` | |
| `…timeline.morning.sub` | `Get Ready` | `RhythmTimeline.tsx:64` | |
| `…timeline.morning.alt` | `A woman sitting up in bed, stretching her arms above her head beside a bright window` | `RhythmTimeline.tsx:67` | no terminal period (inconsistent with other alts) |
| `…timeline.work.title` | `Work` | `RhythmTimeline.tsx:75` | |
| `…timeline.work.sub` | `Focus` | `RhythmTimeline.tsx:76` | |
| `…timeline.pressure.title` | `Pressure` | `RhythmTimeline.tsx:85` | |
| `…timeline.pressure.sub` | `Reset` | `RhythmTimeline.tsx:86` | ↺ shares literal with `ExperienceCard.tsx:58` — **different meaning**, do not share a key |
| `…timeline.energyDip.title` | `Energy Dip` | `RhythmTimeline.tsx:95` | |
| `…timeline.energyDip.sub` | `Recharge` | `RhythmTimeline.tsx:96` | ↺ shares literal with the brand wordmark and the micro-eyebrow — **different meaning** |
| `…timeline.afterWork.title` | `After Work` | `RhythmTimeline.tsx:105` | |
| `…timeline.afterWork.sub` | `Unwind` | `RhythmTimeline.tsx:106` | |
| `…timeline.afterWork.alt` | `A woman on a sofa holding a mug in the evening, a plant and a lamp behind her` | `RhythmTimeline.tsx:109` | no terminal period |
| `…timeline.night.title` | `Night` | `RhythmTimeline.tsx:117` | |
| `…timeline.night.sub` | `Rest` | `RhythmTimeline.tsx:118` | |

### S. Trust

| Key | String | file:line | Notes |
|---|---|---|---|
| `sections.trust.eyebrow` | `TRUST & APPROACH` | `Trust.tsx:189` | `&amp;` entity in source; gradient `reverse` |
| `sections.trust.headline` | `Support you can trust,` / `every step of the way.` | `Trust.tsx:191-195` | **RT-11** — line 2 is `<GradText className="italic">`; **the only place serif italic + gradient combine** (`Trust.tsx:31-33`) |
| `sections.trust.lead` | `Recharge is built around care, clarity and clear boundaries. Here’s what that means for you.` | `Trust.tsx:197-201` | `&rsquo;` entity |
| `sections.trust.portraitAlt` | `A woman in a cream cable-knit sweater sitting on a pale sofa, holding a mug in both hands and looking up.` | `Trust.tsx:222` | |
| `…trust.cards.support.title` | `Support, not diagnose.` | `Trust.tsx:60` | ↺ `TrustStrip.tsx:21` |
| `…trust.cards.support.body` | `Recharge supports everyday wellbeing and personal reflection. It is not intended to diagnose, treat or cure medical or mental health conditions, and it does not replace professional care when that is needed.` | `Trust.tsx:62-70` | ⚠️ **MEDICAL DISCLAIMER** — 7-element hard-line array |
| `…trust.cards.ai.title` | `AI that guides, not defines you.` | `Trust.tsx:78` | 2-element array |
| `…trust.cards.ai.body.0` | `AI can help you reflect, explore perspectives and consider possible next steps.` | `Trust.tsx:80` | |
| `…trust.cards.ai.body.1` | `You remain in control of your choices.` | `Trust.tsx:81` | **second paragraph** — card 2 is the only multi-paragraph card |
| `…trust.cards.personalisation.title` | `Personalisation with purpose.` | `Trust.tsx:89` | 🇬🇧 `Personalisation`; 2-element array |
| `…trust.cards.personalisation.body` | `Recharge is designed to become more relevant through the information, choices and interactions that matter to your experience.` | `Trust.tsx:91-97` | 5-element array |
| `…trust.cards.personalisation.accent` | `More relevant, not more intrusive.` | `Trust.tsx:99` | rose emphasis line, card 3 only |
| `…trust.cards.privacy.title` | `Privacy deserves care.` | `Trust.tsx:105` | 2-element array; line 1 ↺ footer `Privacy` |
| `…trust.cards.privacy.body` | `Personal wellbeing can involve information that matters to you. Recharge approaches privacy, data and user control thoughtfully and transparently.` | `Trust.tsx:107-113` | 5-element array |
| `sections.trust.closingLead` | `Recharge is designed to support you with care, clarity and respect.` | `Trust.tsx:283` | |
| `sections.trust.closingSerif` | `Trust should be part of the experience.` | `Trust.tsx:286` | |

### T. Plans

| Key | String | file:line | Notes |
|---|---|---|---|
| `sections.plans.eyebrow` | `FREE TRIAL & PLANS` | `Plans.tsx:143` | literal `&` |
| `sections.plans.headline` | `Choose the Recharge that fits you.` | `Plans.tsx:145-147` | **RT-12** — `fits you.` in `<GradText>` |
| `sections.plans.lead` | `Try Recharge free for 7 days, then choose the level of support that feels right for you.` | `Plans.tsx:150-151` | ↺ `meta.plans.description` |
| `…plans.trial.eyebrow` | `7-DAY FREE TRIAL` | `Plans.tsx:164` | |
| `…plans.trial.body` | `Experience Personal Insights, AI-guided Coaching and Recharge Experiences together before choosing a plan.` | `Plans.tsx:169-172` | 3 hard lines |
| `…plans.badge` | `Most popular` | `Plans.tsx:234` | Rhythm only |
| `…plans.priceTbd` | `Price coming soon` | `Plans.tsx:257` | ×3 (one per card) |
| `…plans.tiers.essential.name` | `Essential` | `Plans.tsx:77` | |
| `…plans.tiers.essential.tagline` | `Start simply.` | `Plans.tsx:78` | |
| `…plans.tiers.essential.features[0-3]` | `Core Personal Insights` · `AI-guided Coaching for lighter use` · `Core Recharge Experiences` · `Essential personalisation` | `Plans.tsx:83-86` | 🇬🇧 `personalisation`; note plural `Experiences` here vs singular on the other two tiers (`Plans.tsx:72-74` says this is as-rendered, not a typo) |
| `…plans.tiers.essential.cta` | `Choose Essential` | `Plans.tsx:88` | |
| `…plans.tiers.rhythm.name` | `Rhythm` | `Plans.tsx:95` | ↺ shares literal with the Rhythm *section* name — **different meaning** |
| `…plans.tiers.rhythm.tagline` | `Build an ongoing rhythm.` | `Plans.tsx:96` | |
| `…plans.tiers.rhythm.features[0-3]` | `Expanded Personal Insights` · `More AI-guided Coaching` · `Wider Recharge Experience access` · `Personalisation that grows with your use` | `Plans.tsx:101-104` | 🇬🇧 `Personalisation` |
| `…plans.tiers.rhythm.cta` | `Choose Rhythm` | `Plans.tsx:106` | |
| `…plans.tiers.plus.name` | `Plus` | `Plans.tsx:115` | |
| `…plans.tiers.plus.tagline` | `Go deeper with more support.` | `Plans.tsx:116` | |
| `…plans.tiers.plus.features[0-3]` | `Deeper Personal Insights` · `Highest Coaching access` · `Full Recharge Experience access` · `Extended personalisation` | `Plans.tsx:121-124` | 🇬🇧 `personalisation` |
| `…plans.tiers.plus.cta` | `Choose Plus` | `Plans.tsx:126` | |
| `…plans.compare` | `Compare all features` | `Plans.tsx:304` | links to `/plans#compare` |
| `…plans.disclaimer` | `Working plan details. Names, prices and usage limits to be confirmed.` | `Plans.tsx:317` | ⚠️ commercial disclaimer — pricing not final |

*(The trial banner's `<h3>` at `Plans.tsx:166` and its button at `:193` both render
`CTA.tryFree`; the meta line at `:196` renders `CTA.trialMeta`. No new strings.)*

### U. Start

| Key | String | file:line | Notes |
|---|---|---|---|
| `sections.start.eyebrow` | `START YOUR RECHARGE` | `Start.tsx:114` | |
| `sections.start.headline` | `Start where` / `you are.` | `Start.tsx:118-122` | **RT-13** — `you are.` in `<GradText>`, one run across the whole phrase |
| `sections.start.lead` | `Try Recharge for yourself and discover what works for you.` | `Start.tsx:125-126` | |
| `sections.start.explore` | `Explore Plans` | `Start.tsx:144` | ghost link + arrow |
| `sections.start.portraitAlt` | `A woman in loose cream linen sitting cross-legged beside a calm lake at sunrise, looking up towards the light` | `Start.tsx:165` | no terminal period |

### V. 404

| Key | String | file:line | Notes |
|---|---|---|---|
| `notFound.eyebrow` | `Not quite here` | `not-found.tsx:28` | |
| `notFound.headline` | `This page is still on its way.` | `not-found.tsx:29-31` | **RT-14** — `still on its way.` in `<GradText>` |
| `notFound.body` | `The link you followed points somewhere we have not built yet. Start where you are — everything else is a scroll away.` | `not-found.tsx:32-35` | `&mdash;` entity |
| `notFound.backHome` | `Back to Recharge` | `not-found.tsx:38` | |

---

## Rich-text strings

**These 20 cannot be flat JSON strings without losing formatting.** They drive the
catalogue's shape more than anything else in this document.

There are three distinct shapes here. I'd recommend **one representation for all three**
rather than three mechanisms — a `segments` array where each segment is `{ text, mark? }` —
because the gradient/emphasis/link cases are structurally identical and a single renderer
component can handle all of them.

### Category 1 — gradient headline runs (11 cases)

Every one wraps a `<GradText>` (or `<GradRun>`) around **part** of a headline. The project
comment at `GradText.tsx:8-13` is emphatic that the run must be wrapped **once around the
entire phrase, never per word** — wrapping per word restarts the ramp. Any catalogue
representation must therefore preserve run boundaries exactly.

| ID | Location | Current JSX (abridged) | Proposed representation |
|---|---|---|---|
| **RT-1** | `Hero.tsx:121-133` | `What if <GradRun stops="#1663DA 0%, #0F8FCB 100%">better sleep,</GradRun><br/> a <GradRun stops="#0A81B9 0%, #295A9D 55%, #46397E 100%">calmer mind,</GradRun> and<br/> relief from <GradRun stops="#7A4B81 0%, #C56F97 100%">migraine</GradRun><br/> <span className="text-[#82458C]">discomfort</span> were<br/> within reach?` | `segments: [{text:"What if "},{text:"better sleep,",mark:"g1"},{text:" a "},{text:"calmer mind,",mark:"g2"},{text:" and relief from "},{text:"migraine",mark:"g3"},{text:" "},{text:"discomfort",mark:"violet"},{text:" were within reach?"}]` — **hardest case on the site**: 3 gradients with *hand-tuned per-run stops* + 1 flat colour + 4 conditional breaks. The stops stay in code, keyed by `mark`; only the text ships in the catalogue. |
| **RT-2** | `Moments.tsx:133-137` | `What do you need right now?<br/><GradText>Your moment matters.</GradText>` | `{ lines: [{text:"What do you need right now?"},{text:"Your moment matters.",mark:"grad"}] }` — break is a real line break, not responsive |
| **RT-4** | `R3Loop.tsx:53-55` | `How <GradText>Recharge</GradText> helps` | mid-line run; `segments` |
| **RT-8** | `CentrePortrait.tsx:49-54` | `<span block>One person.</span><span block>One <GradText>connected</GradText> experience.</span>` | two lines; run is mid-line on line 2 |
| **RT-9** | `UnifiedCircle.tsx:75-80` | `<span block>One <GradText>connected</GradText></span><span block>experience</span>` | ⚠️ **the run ends the line here** where RT-8's continues — the same phrase broken differently. Two separate keys, not one shared. |
| **RT-10** | `Rhythm.tsx:73-77` | `Meets you where you are.<br/>Gets to know <GradText>your rhythm</GradText> over time.` | run is mid-line on line 2 |
| **RT-11** | `Trust.tsx:191-195` | `Support you can trust,<br/><GradText className="italic">every step of the way.</GradText>` | **gradient + serif italic combined** — the only such case; `mark:"grad-italic"` |
| **RT-12** | `Plans.tsx:145-147` | `Choose the Recharge that <GradText>fits you.</GradText>` | run terminates the line |
| **RT-13** | `Start.tsx:118-122` | `Start where<br/><GradText>you are.</GradText>` | run is the whole of line 2 |
| **RT-14** | `not-found.tsx:29-31` | `This page is <GradText>still on its way.</GradText>` | |
| **RT-6** | `Connected.tsx:53-56` | `<span block>Wellbeing support</span><span block>shouldn’t feel fragmented.</span>` | **no gradient at all** — included because it is the *trap*: it is the only section headline in the deck with no run (`Connected.tsx:28-32`). Catalogue it with the same shape as its siblings so nobody "fixes" it by adding a mark. |

### Category 2 — inline emphasis and inline links (7 cases)

| ID | Location | Current JSX (abridged) | Proposed representation |
|---|---|---|---|
| **RT-5** | `R3Loop.tsx:59-66` | `One connected loop to help you understand yourself, <br/>find what you need and <strong className="font-semibold text-ink-800">feel better in the moment.</strong>` | `segments` with `mark:"strong"` on the trailing clause |
| **RT-15** | `AskRecharge.tsx:98-102` | `Not sure where to start?<br/><span className="text-blue-ink">Ask Recharge.</span>` | two lines, line 2 marked `brand`; note the **trailing period** distinguishes this from every other `Ask Recharge` |
| **RT-16** | `AskRecharge.tsx:149-157` | `How does Recharge become personal?{" "}<a href="/ask">Ask Recharge</a>` | `segments` with `mark:"link:ask"` — the link is *inside* the sentence |
| **RT-17** | `AskRecharge.tsx:171-180` | `Questions about our approach?{" "}<a href="/ask" className="inline-flex…">Ask Recharge <ArrowRight/></a>` | same, plus a trailing icon **inside** the anchor |
| **RT-18** | `AskRecharge.tsx:228-237` | `<a href="/ask">Ask Recharge</a><span className="text-ink-400"> &middot; </span><span className="text-ink-500">Website guide</span>` | three segments: link, middot separator, muted label. The `·` is a **structural separator**, not copy — keep it in the renderer, not the catalogue. |
| **RT-19** | `ExperienceCard.tsx:57-61` | `<span className="font-semibold text-rose-400">Reset</span><span className="mx-1.5 text-ink-400">&middot;</span><span className="font-medium text-ink-800">8 min</span>` | same shape as RT-18 — two catalogue values (`Reset`, `8 min`) joined by a renderer-owned middot |
| **RT-7** | `Connected.tsx:58-63` | two `<span className="block">` lines | line array; no emphasis, but the breaks are unconditional so they must survive |

### Category 3 — the `R³` glyph (2 cases)

The `³` is handled **three different ways** in this codebase and the catalogue must respect
all three:

| ID | Location | Current handling | Proposed representation |
|---|---|---|---|
| **RT-3** | `R3Loop.tsx:47-49` | `THE <RCubed /> RECHARGE LOOP` — `RCubed` (`GradText.tsx:41-47`) emits `R<sup className="top-[-0.42em] text-[0.62em]">3</sup>`. **The character `³` never appears in the string**; the eyebrow is assembled from two literals around a component. | `segments: [{text:"THE "},{mark:"rcubed"},{text:" RECHARGE LOOP"}]` — a *markerless* segment. This is the one case where a segment carries no text. |
| **RT-21** | `NavLabel.tsx:12-22` | The label string `"The R³ Experience"` (`nav.ts:60`) **does** contain the literal `³` (U+00B3). `NavLabel` splits on `"R³"` and re-emits `{before}R<sup>3</sup>{after}`, gated by `superscript?: boolean` (`nav.ts:49`). The comment at `NavLabel.tsx:5-10` is explicit that the literal stays in the string so the **accessible name and find-in-page text remain correct** — only the rendering is special-cased. | **Keep `³` in the catalogue value** and keep the `superscript` flag as component config (not catalogue data). A locale that renders the label differently would simply omit the `³` and the split becomes a no-op. |
| *(third form)* | `the-r3-experience/page.tsx:13`, plus route slug `/the-r3-experience` | metadata title carries the literal `³`; the **slug** uses ASCII `r3` | slug is not copy — see **Non-copy strings** |

### Interpolated / composed strings (3)

| Where | Form | Note |
|---|---|---|
| `Footer.tsx:51-53` | `&copy; {new Date().getFullYear()} Recharge. All rights reserved.` | needs a `{year}` placeholder in the catalogue. **Renders `2026` in the current build.** |
| `layout.tsx:40` | `template: "%s — Recharge"` | Next.js metadata template — composes all 6 route titles. Keep the `%s` form; Next owns the substitution. |
| `TrustStrip.tsx:55` | `{body.join(" ")}` | three bodies are 2-element arrays joined at render. If the catalogue stores full sentences this goes away. |

### Responsive hard-line breaks (not rich text, but load-bearing)

**25 strings are stored as hard-line arrays** and **22 more are split by inline `<br>`**.
These are layout, not emphasis. Two flavours:

- **Unconditional** `<br />` — e.g. `Moments.tsx:135`, `Rhythm.tsx:75`, `Start.tsx:120`,
  `LoopDiagram.tsx:117`. The break is real copy structure. Store as a `lines` array.
- **Conditional** `<br className="hidden sm:inline" />` — e.g. `Hero.tsx:140`,
  `Moments.tsx:141`, `Trust.tsx:199`, `Plans.tsx:170`, `Rhythm.tsx:83-87`. These vanish
  below the breakpoint and the text reflows. Store as **one flat sentence** and let the
  component re-break; a translated string will not honour English break points anyway.
  `Rhythm.tsx:127-130` already documents that the leading space survives the dropped break.

**Recommendation:** store flat sentences for conditional breaks; store `lines` arrays only
for the unconditional ones. That collapses ~22 of the 47 break-bearing strings to plain
values.

---

## Repeated strings

Exact literals appearing in 2+ places. Each should resolve to **one** catalogue key unless
marked otherwise.

| String | Occurrences | Share a key? |
|---|---|---|
| `Ask Recharge` | `AskRecharge.tsx:113,133,155,177,204,233` (6×) | **Yes** → `common.ask.label` |
| `Everyday wellbeing support and reflection, not diagnosis, treatment or cure.` | `TrustStrip.tsx:23`, `Footer.tsx:30` | **Yes** → `common.disclaimer.medical` (and lock it) |
| `Support, not diagnose.` | `TrustStrip.tsx:21`, `Trust.tsx:60` | **Yes** |
| `Personal Insights` | `loopNodes.ts:59`, `FragmentedStack.tsx:41` | **Yes** → `common.pillars.insights.title` |
| `Understand yourself.` | `loopNodes.ts:60`, `FragmentedStack.tsx:42` | **Yes** |
| `AI-guided Coaching` | `loopNodes.ts:74`, `FragmentedStack.tsx:49` | **Yes** |
| `Find what you need.` | `loopNodes.ts:75`, `FragmentedStack.tsx:50` | **Yes** |
| `Feel better in the moment.` | `loopNodes.ts:88`, `ExperienceCard.tsx:99`, ≈`FragmentedStack.tsx:58` | **Yes** (the third is the same sentence in a 2-element array) |
| `Personalised Recharge Experiences` | `loopNodes.ts:87`, `ExperienceCard.tsx:96` | **Yes** |
| `RECHARGE` (micro-eyebrow) | `loopNodes.ts:86`, `ExperienceCard.tsx:93` | **Yes** |
| `Website guide` | `AskRecharge.tsx:158,236` | **Yes** |
| `Recharge — home` | `Header.tsx:111`, `Footer.tsx:26` | **Yes** |
| `Main` | `Header.tsx:115,194` | **Yes** |
| `I need a reset` | `Moments.tsx:78`, `loopNodes.ts:103` | **Yes, but check** — the loop pill deliberately quotes a Moments card. Sharing is correct *and* intentional; flag it so a copy change to one is understood to change both. |
| `What do you need right now?` | `Moments.tsx:134`, `Rhythm.tsx:45` | **Yes, but check** — same as above |
| `Try Recharge free for 7 days, then choose the level of support that feels right for you.` | `plans/page.tsx:9-10`, `Plans.tsx:150-151` | **Yes** — metadata description mirrors the section lead |
| `Plans` | `nav.ts:68`, `plans/page.tsx:8` | **No** — nav label vs `<title>`; keep separate so either can change |
| `About` | `nav.ts:80`, `about/page.tsx:16` | **No** — same reason |
| `Reset` | `ExperienceCard.tsx:58` (audio track), `RhythmTimeline.tsx:86` (time-of-day state) | **No** — homograph, different meanings |
| `Recharge` | `Logo.tsx:72` (wordmark), `RhythmTimeline.tsx:96` (timeline sub-label), `loopNodes.ts:86` (eyebrow) | **No** — brand vs state vs eyebrow |
| `Rhythm` | `Plans.tsx:95` (plan tier), `SECTION_IDS.rhythm` context | **No** — plan name is a proper noun |
| `Privacy` | `Footer.tsx:57` (link), `Trust.tsx:105` (title line 1) | **No** — link label vs a fragment of `Privacy deserves care.` |
| `Trust & Approach` / `TRUST & APPROACH` / `Trust & approach` | `nav.ts:74`, `Trust.tsx:189`, `trust-and-approach/page.tsx:8` | **No** — three different casings, three keys |
| `More Personal Over Time` / `More personal over time` | `Rhythm.tsx:56`, `WhyConnectionMatters.tsx:63` | **No** — different casing. ⚠️ Flag to the copy owner: this may be an unintended inconsistency. |

---

## British spellings — for the `en-GB` catalogue

The project deliberately standardised on British English (`loopNodes.ts:14-16`,
`ExperienceCard.tsx:18-23`, `TrustStrip.tsx:15-16`, `Plans.tsx:44-45`, `Trust.tsx:88`).
Every instance in shipped copy:

| Spelling | file:line | String |
|---|---|---|
| `personalised` | `layout.tsx:43` | `…AI-guided coaching and personalised experiences together…` |
| `Personalised` | `loopNodes.ts:87` | `Personalised Recharge Experiences` (deck reads `Personalized`) |
| `Personalised` | `ExperienceCard.tsx:96` | `Personalised Recharge Experiences` |
| `Personalised` | `ExperienceCard.tsx:102` | `Personalised audio experiences designed…` (deck reads `Personalized`) |
| `personalisation` | `TrustStrip.tsx:35` | `AI, personalisation and human insight…` (deck reads `personalization`) |
| `Personalisation` | `Trust.tsx:89` | `Personalisation with purpose.` |
| `personalisation` | `Plans.tsx:86` | `Essential personalisation` |
| `Personalisation` | `Plans.tsx:104` | `Personalisation that grows with your use` |
| `personalisation` | `Plans.tsx:124` | `Extended personalisation` |
| `Recognising` | `how-it-works/page.tsx:16` | `Recognising how you feel is the first step…` |
| `RECOGNISE` | `Moments.tsx:131` | `RECOGNISE YOUR MOMENT` |
| `Recognising` | `Moments.tsx:140` | `We all move through different moments. Recognising how you feel…` |

**12 instances across 9 files.** `personalis*` accounts for 9, `recognis*` for 3. No other
`-ise`/`-our`/`-re` British forms appear in copy (`centre`, `colour`, `standardise` etc.
appear only in code comments and identifiers such as `CentrePortrait`, which is a component
name, not copy).

**Catalogue action:** these must round-trip byte-exact. A locale file linter that flags
`personaliz`/`recogniz` in `en-GB.json` would be cheap insurance — the deck source uses the
American forms, so regression is likely.

---

## Typographic characters in copy

| Char | Codepoint | Where | Count | Note |
|---|---|---|---|---|
| `·` middot | U+00B7 | `nav.ts:103` (`7 days · No credit card required`) | 1 in copy | part of the string; must survive |
| `·` middot | via `&middot;` | `AskRecharge.tsx:235`, `ExperienceCard.tsx:59` | 2 in markup | **structural separators**, not copy — keep in the renderer |
| `—` em dash | U+2014 | `layout.tsx:39,40`, `Header.tsx:111`, `Footer.tsx:26` | 4 | literal char in source |
| `—` em dash | via `&mdash;` | `not-found.tsx:34` | 1 | inside prose |
| `’` right single quote | U+2019 | `Moments.tsx:87,96,115`, `Connected.tsx:55` | 4 | **literal char** |
| `’` right single quote | via `&rsquo;` | `Moments.tsx:155`, `Trust.tsx:199` | 2 | **entity** — same character, two encodings |
| `³` superscript three | U+00B3 | `nav.ts:60`, `the-r3-experience/page.tsx:13` | 2 | see RT-21 |
| `³` as `<sup>3</sup>` | — | `NavLabel.tsx:19`, `GradText.tsx:44` | 2 | rendered form |
| `©` | via `&copy;` | `Footer.tsx:52` | 1 | |
| `&` literal | — | `nav.ts:74`, `Plans.tsx:143` | 2 | |
| `&` via `&amp;` | — | `Trust.tsx:189` | 1 | |

⚠️ **The apostrophe is encoded two ways** (literal `’` in `.ts` data files, `&rsquo;` in
JSX prose) and **the ampersand is encoded two ways**. Normalise to the literal Unicode
character in JSON — entities do not belong in a catalogue value, and JSX will escape
correctly on output. Six strings are affected.

---

## Non-copy strings

Deliberately excluded. Listed so the planner can confirm the exclusions.

### Route slugs (URLs — not copy)

| Slug | Built? |
|---|---|
| `/` | ✅ |
| `/about` | ✅ |
| `/how-it-works` | ✅ |
| `/plans` | ✅ |
| `/the-r3-experience` | ✅ — note ASCII `r3`, not `r³` |
| `/trust-and-approach` | ✅ |
| `/ask` | ❌ `AskRecharge.tsx:24` — 7 links point here; falls through to 404 |
| `/sign-in` | ❌ `Header.tsx:153,212` |
| `/privacy` | ❌ `Footer.tsx:56` |
| `/terms` | ❌ `Footer.tsx:61` |
| `/plans#compare` | ❌ anchor does not exist yet — `Plans.tsx:301` |
| `/plans?plan=essential\|rhythm\|plus` | `Plans.tsx:92,112,130` — query params, not copy |

*(The 404 exists precisely because of these — see `not-found.tsx:11-17`.)*

### Section ids and anchors

`hero`, `moments`, `r3-loop`, `connected`, `rhythm`, `trust`, `plans`, `start` —
`nav.ts:24-33`. Used as `#anchor` targets on `/` and as `id` on `<section>`
(`Section.tsx:30`). Never rendered as text.

### SVG/DOM ids and gradient ids

`mobile-nav` (`Header.tsx:191`), `rhythm-rail-v` / `rhythm-rail-h`
(`RhythmTimeline.tsx:181,204`), `trust-arc-ramp` (`Trust.tsx:155`), `start-arc-rise` /
`start-arc-fall` (`Start.tsx:60,76`), `r3-arc-reconnect` / `r3-arc-realign` /
`r3-arc-recharge` / `r3-arc-return` (`LoopArcs.tsx:55,69,82,97`).

### Data attributes

`data-slot="aurora-waveform"` (`ExperienceCard.tsx:139`).

### Image paths

`/logo-mark.svg`, `/images/hero-sunrise-clean.jpg`, `/images/moment-{focus,reset,running-low,switch-off,stuck,clarity}.jpg`, `/images/connected-portrait.jpg`, `/images/rhythm-{morning,after-work}.jpg`, `/images/trust-portrait.jpg`, `/images/cta-portrait.jpg`.

### Empty / decorative alt text

`Logo.tsx:36` (`alt=""` + `aria-hidden`) and `Hero.tsx:72` (`alt=""`). Both correct — the
logo's accessible name comes from the wrapping link's `aria-label`, and the hero photo is
pure atmosphere. **Not catalogue entries**, but worth a note so nobody "fixes" them by
adding alt text.

### Icon component names, CSS classes, colour tokens, `cva` variant names

`PlayTriangle`, `SpeechBubbleDots`, `text-blue-ink`, `outlineRose`, `grad-text`, etc.
All 892 lines of `src/components/icons/index.tsx` are path data and JSDoc.

### Framework-owned strings (not in `src/`)

`.next/server/app/_global-error.html` contains `500: This page couldn’t load`, `This page
couldn’t load`, `A server error occurred. Reload to try again.` and `Reload`. These come
from Next.js's built-in global error boundary. The project has no `global-error.tsx`. See
**Uncertainties**.

---

## Uncertainties

1. **`ScrollCue`'s `label` is a default prop, never passed.** `ScrollCue.tsx:23` defaults to
   `"Scroll to explore"` and no call site overrides it (`Hero.tsx:178`, `Moments.tsx:225`,
   `R3Loop.tsx:100`). It is also inside an `aria-hidden` container (`ScrollCue.tsx:34,44`),
   so screen readers never announce it — but it *is* visible on screen. **Treat as
   user-facing copy.** The open question is whether the catalogue should also own the
   `variant` names; I'd say no.

2. **`aria-label` strings restate visible copy.** `ExperienceCard.tsx:35` reads
   `"Play Reset, an 8 minute recharge experience"` and independently encodes `Reset` (line
   58) and `8 min` (line 60). If the track name ever changes, three strings must change
   together. **Recommend** making this a composed string
   (`common.a11y.play: "Play {track}, an {minutes} minute recharge experience"`) rather than
   a fourth literal — but that is a copy/engineering decision the planner should confirm,
   not something to assume.

3. **Is the brand wordmark translatable?** `Logo.tsx:72` renders `Recharge` as live text
   (deliberately — `Logo.tsx:48-50` says so, for selectability and searchability). It is a
   brand name and almost certainly should be `"translate": false`, but it is currently
   indistinguishable from ordinary copy.

4. **Case inconsistency: `More Personal Over Time` vs `More personal over time`.**
   `Rhythm.tsx:56` and `WhyConnectionMatters.tsx:63`. Same words, different casing, in
   different sections. I have catalogued them as two keys. If this is a copy bug rather
   than intent, externalisation is the moment to fix it — but it is a copy decision.

5. **Eyebrow casing is inconsistent in *source*.** Some eyebrows are stored uppercase
   (`RECOGNISE YOUR MOMENT`, `MORE CONNECTED`, `TRUST & APPROACH`, `FREE TRIAL & PLANS`,
   `PERSONAL TO YOUR RHYTHM`, `START YOUR RECHARGE`) and some sentence case
   (`Your personal wellbeing companion` at `Hero.tsx:113`, `Not quite here` at
   `not-found.tsx:28`). All are rendered uppercase by `Eyebrow`'s `uppercase` CSS
   (`Eyebrow.tsx:31`). **Recommend** normalising the catalogue to sentence case and letting
   CSS uppercase, because `text-transform: uppercase` is locale-aware and a hard-coded
   uppercase string is not (Turkish dotted-I being the classic failure). But this changes
   what a translator sees, so confirm before doing it.

6. **Alt-text terminal punctuation is inconsistent.** The six Moments alts and the two
   Connected/Trust alts end with a period; the two Rhythm alts (`RhythmTimeline.tsx:67,109`)
   and the Start alt (`Start.tsx:165`) do not. Cosmetic, but a catalogue makes it visible.

7. **Should the `·` separators be catalogue entries?** `AskRecharge.tsx:235` and
   `ExperienceCard.tsx:59` both render a standalone `&middot;` between two pieces of copy.
   I have classified them as renderer-owned structure (not copy), because a locale would
   not translate them — but a locale *might* want a different separator. Low stakes;
   flagging for a decision.

8. **Next.js's built-in error strings are unreachable from a catalogue.** The four
   `_global-error.html` strings are framework defaults. If they must be localised, the
   project needs its own `src/app/global-error.tsx` — which is net-new copy, out of scope
   for a pure externalisation task but worth surfacing.

9. **Deliberate copy deviations are recorded only in comments.** Three strings knowingly
   differ from the design deck — `WhyConnectionMatters.tsx:56` (restored dropped clause),
   the `personalis*`/`Personalis*` family, and `TrustStrip.tsx:12-16` (period removed). Once
   copy moves to JSON those comments no longer sit beside the strings. **Recommend** the
   catalogue carries a `_note` sibling key or the planner preserves the rationale
   somewhere durable; otherwise the next person "corrects" them back to the deck.

10. **`sections.rhythm.strip.moment.body` is identical to the Moments headline line 1.**
    `Rhythm.tsx:45` = `What do you need right now?` = `Moments.tsx:134`. I have recommended
    sharing a key, but if the repetition is coincidental rather than an intentional echo,
    sharing would couple two unrelated pieces of copy. Needs a copy-owner call.
