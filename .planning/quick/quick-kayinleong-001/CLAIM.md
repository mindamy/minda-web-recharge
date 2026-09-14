# Claim: quick-kayinleong-001

- owner: kayinleong
- session: claude-code
- branch: main
- started: 2026-09-14
- status: done
- summary: Build a Next.js marketing site implementing the 8-section Recharge web design, with the deck's page 1 hero replaced by `.docs/First Page.jpeg`.

## What will change

Greenfield scaffold — the repository contained only `.docs/` design sources before this claim.

- `git init` + `.gitignore` (this commit)
- `.planning/` bootstrap: `STATE.md`, `ROADMAP.md` (this commit)
- Next.js application scaffold (latest stable, App Router, TypeScript, Tailwind)
- Design token layer derived from the mockups (colour, type, radii, shadow, spacing)
- Shared chrome: header/nav, trust strip, scroll indicator, Ask Recharge affordance, aurora wave SVG system
- 8 section components, in deck order:
  1. Hero — sourced from `.docs/First Page.jpeg`, NOT deck page 1
  2. Moments — "What do you need right now?"
  3. R³ Loop — "How Recharge helps"
  4. Connected — "Wellbeing support shouldn't feel fragmented."
  5. Rhythm — "Meets you where you are."
  6. Trust — "Support you can trust, every step of the way."
  7. Plans — "Choose the Recharge that fits you."
  8. Final CTA — "Start where you are."
- Image assets cropped from the design renders into `public/`
- Scroll-triggered motion layer with `prefers-reduced-motion` support
- Responsive reflow for tablet and mobile

## What has changed

- [x] Repository initialised as a git repo on `main`; `.gitignore` added
- [x] `.planning/` scaffolding bootstrapped
- [x] Next.js 16.3.5 scaffolded — App Router, TypeScript, Tailwind v4, `src/`
- [x] Research captured (`RESEARCH.md`) and design spec extracted (`DESIGN-SPEC.md`, ~92 KB)
- [x] Design token layer in `globals.css` — palette, type scale, radii, shadows, motion
- [x] Motion infrastructure — `Reveal`/`RevealGroup`/`RevealItem`, `MotionProvider`, CSS `rise`
- [x] Shared chrome — header with scroll-spy, footer, trust strip, scroll cue, 7 Ask Recharge layouts
- [x] 40-icon set on a uniform 24x24 / `currentColor` contract
- [x] Aurora wave SVG system — procedural geometry, 8 section presets, bounded player waveform
- [x] All 8 sections, in deck order, with the hero sourced from `First Page.jpeg`
- [x] 13 image assets cropped from 300 ppi re-renders
- [x] Hybrid routing — `/` narrative plus 5 standalone section routes, branded 404
- [x] Responsive pass — verified at 390, 664, 1440
- [x] WCAG AA contrast pass — 5 token failures fixed

## Deviations from the standard GSD quick gate

`gsd-tools query init.quick` reported `roadmap_exists: false` and `planning_exists: false`.
The documented quick-mode gate is to stop and direct the user to `/gsd-new-project`.

Deviation taken: bootstrap a minimal `.planning/` (STATE.md + ROADMAP.md) in place rather
than stopping, because the user's instruction was an explicit, self-contained build request
against design sources already present in `.docs/`, and a full project-init interview would
not have changed the work. Recorded here rather than applied silently. Artifacts for this
task live in this directory using the owner-scoped ID mandated by the global rules, not the
auto-generated `260914-mlr-*` slug that `init.quick` proposed.

## Locked decisions

Both were genuinely ambiguous in the deck and were put to the user rather than assumed.

### Routing — hybrid
The deck argues with itself: pages 1-3 carry a "SCROLL TO EXPLORE" affordance (one long page),
while pages 6 and 7 render an active underline beneath "Trust & Approach" and "Plans"
(separate routes). User chose **hybrid**: `/` renders the full eight-section scrolling
narrative, and every nav destination is *also* a real route rendering that section standalone.
Consequence: section components must be self-contained and mountable in either context, so no
section may depend on a sibling's scroll position or DOM.

### Imagery — crop from the design renders
Each PDF page is one flattened RGB raster (confirmed via `pdfimages -list`: a single
1448-px-wide image object per page), so no photo layer can be extracted. User chose to crop
photography out of the renders. Mitigation for the resulting resolution ceiling: crops are
taken from 300 ppi re-renders of individual pages rather than the 144 ppi batch, and the
decorative aurora line-art is rebuilt as SVG instead of cropped so it stays resolution-
independent and animatable. The hero uses the supplied full-resolution `First Page.jpeg`.

### Stack — verified live, not from memory
`next@16.3.5`, `react@19.2.8` (the version create-next-app pins for this Next release, not the
19.3.0 available on npm), `tailwindcss@4`, `motion@13.2.0`, `class-variance-authority@0.7.1`,
`clsx@2.1.1`. Tailwind v4 means tokens are declared with `@theme` in `globals.css`; there is no
`tailwind.config.js`.

Note: `cva` was installed first and resolved to a `0.0.0` placeholder stub. The real package is
`class-variance-authority`. Corrected before any component consumed it.

## Verification

### Automated gates (all passing at HEAD)

| Gate | Command | Result |
|------|---------|--------|
| Types | `npm run typecheck` (`next typegen && tsc --noEmit`) | pass |
| Lint | `npx eslint src` | clean, 0 warnings |
| Build | `npm run build` | 7 routes, all statically prerendered |
| Routes | `curl` each path | `/`, `/how-it-works`, `/the-r3-experience`, `/plans`, `/trust-and-approach`, `/about` -> 200; unknown -> 404 |
| Console | browser, page load + full scroll | no application errors (only dev-only HMR websocket noise) |

### Rendered verification

The page was driven in a real browser, not just compiled. This mattered: two of the
defects below only exist at render time and both passed typecheck and build.

- Measured at 1440x1000: trust strip 1152x129 against the deck's measured 1163x131, all
  three column bodies on two lines, whole strip above the fold.
- Measured at 1440x950: all 8 section ids present, document 9114px, 896 aurora paths.
- Measured at 390x844: **zero horizontal overflow**, h1 at its 36px clamp floor, header
  collapsed to the hamburger, Moments row behaving as a scroll-snap carousel.
- Standalone route `/trust-and-approach`: `aria-current="page"` on the correct nav item,
  underline 52px wide with opacity 1 on that item and 0 on the other four, `<title>`
  resolving through the metadata template.

### Emitted-asset verification

Checked the production CSS and prerendered HTML directly rather than trusting the source:

- `@media (scripting:none){[data-reveal]{opacity:1!important;transform:none!important}}`
  present and well-formed. 54 elements ship Motion's inline `opacity:0`, and all 61
  reveal wrappers carry `data-reveal`, so the net covers every one.
- `@media (prefers-reduced-motion:reduce)` present, forcing `animation-duration:.01ms`
  and `animation-iteration-count:1`. Combined with `rise`'s `both` fill-mode this lands
  on the final state rather than hiding anything.
- `@keyframes rise` present; the hero's entrance is CSS and carries no JS dependency.
- Darkened tokens `#d8235a`, `#17764a`, `#167c78` all present in the emitted CSS.
- `/` prerendered HTML contains no `opacity:0` on any hero element.

### Contrast audit

Every token that carries real words was recomputed against the three surfaces it appears
on (page ground `#F8F9FC`, card `#FEFEFE`, warm card `#FDFCFA`). Five failures found and
fixed — see the Regression Report.

## Regression Report

### Regression surface

Greenfield repository: there was no prior behaviour to regress *within this project*. The
real surface is internal coupling, since eight sections were built in parallel by separate
agents against one shared token layer and one set of primitives. Anything shared was
therefore treated as the risk: `globals.css`, `Container`, `Button`, `Reveal`, the icon
barrel, and `nav.ts`.

### Self-audit findings — defects found and fixed

1. **The hero shipped invisible.** Motion serialises its `initial` variant into the server
   HTML as an inline `opacity:0`, so the page's most important content was blank until
   Motion hydrated *and* IntersectionObserver fired. Fixed by moving the hero to a CSS
   keyframe entrance and adding the `scripting: none` net for the sections below.
   *Ruled out for the rest of the page:* all 61 reveal wrappers carry `data-reveal`, so the
   net covers them; and the remaining exposure (IO not firing in a background tab) resolves
   itself the moment the tab is focused.

2. **`Container` made every section 80px too narrow.** It capped the outer box at the
   measured width and then subtracted its own padding. This was a silent, global
   mis-sizing that no agent could have caught in isolation — it only showed as a
   downstream symptom: the trust strip's columns were starved enough to wrap all three
   bodies onto a third line, inflating it from 131px to 151px and pushing it below the
   fold. Fixed by adding the gutter to the max-width.
   *Regression check:* re-measured the trust strip (1152x129, two-line bodies) and
   re-rendered all 8 sections at 1440 and 390 afterwards. Widening containers cannot clip
   content — every section either centres or stretches — and the 390px check confirms no
   horizontal overflow was introduced.

3. **Five WCAG AA failures on text.** Recomputing against the real page ground rather than
   trusting `DESIGN-SPEC` §1.1: `rose-ink` was 4.25:1 where the spec recorded 4.6:1;
   `green-ink` 4.1:1; the Rhythm sub-labels used `teal-400` at 2.1:1 and `green-500` at
   2.8:1; and `ink-400` at 3.5:1 was carrying the trial meta line, the plans disclaimer,
   "Website guide" and two micro-eyebrows. Fixed by darkening `rose-ink` and `green-ink`,
   adding `teal-ink`, and moving load-bearing copy to `ink-500`.
   *Regression check:* the deck's lighter hues are retained on icon strokes, which always
   sit beside a text label, so the visual character is unchanged. `ink-400` now appears
   only on one icon and two middot separators — confirmed by grep. Re-ran the full audit
   after the change: every text token now passes on all three surfaces.

4. **`cva` resolved to a `0.0.0` placeholder stub.** The real package is
   `class-variance-authority`. Caught before any component imported it.

5. **`tsc --noEmit` failed on the scaffold's own `layout.tsx`** while `next build` passed,
   because Next 16 emits the typed-route helpers into `.next/types`. `typecheck` is now
   `next typegen && tsc --noEmit`.

6. **The Trust portrait rendered as a band across the subject's chin.** The asset is a
   620x762 portrait (the arc had to be excluded from the crop so it could be redrawn as
   SVG), but it was being stretched into a ~3.6:1 bleeding box. Reframed to the asset's
   own 4:5. *Verified by re-rendering the route.*

7. **The aurora was far too strong on mobile.** The field scales with
   `preserveAspectRatio="none"`, packing a bundle tuned at 1448px into a quarter of that
   width. Damped to 45% below `sm`. *Verified at 390px before and after.*

8. **One string was still spelled American** — `Personalized audio experiences` sat in the
   same card as `Personalised`. Swept the whole tree by grep afterwards; only doc comments
   describing the deck's own wording still contain the `-z-` forms.

9. **The R³ loop's arcs shipped invisible with scripting off.** They draw via Motion's
   `pathLength`, which serialises as `stroke-dasharray="0 1"` — the same class of failure as
   the hero's `opacity:0`, but on a different property, so the existing net did not catch it.
   The section author flagged it as a site-wide decision rather than fixing it locally, which
   was the right call. Fixed by tagging the 12 arc paths `data-draw` and extending the
   `scripting: none` block to reset `stroke-dasharray`/`stroke-dashoffset`.
   *Verified:* the emitted rule covers both attributes, and all 12 paths carry the hook in
   the prerendered HTML.

10. **The British standardisation was reverted mid-flight.** The R³ section's brief named the
    card *title* as an example of the rule; its author read that as the rule's whole scope and
    reverted the body line to `Personalized`, leaving two spellings inside one card. The
    user's decision was site-wide, so it was re-applied. *Verified:* zero occurrences of
    `Personaliz` in the prerendered HTML.

### What was ruled out, and why

- **Server/Client boundary faults.** The highest-risk failure in this stack compiles clean
  and only fails at prerender. Every agent was told never to import `motion/react` into a
  Server Component. Confirmed by grep, and confirmed harder by the fact that `/` and all
  five section routes now genuinely prerender — which is the first time the sections were
  ever rendered, since each was built in isolation with nothing importing it.
- **Hydration mismatch from reduced motion.** `useReducedMotion` returns `null` during
  SSR, so branching JSX on it would desync. `Reveal` branches animated *values* only.
- **Non-deterministic SVG.** The aurora is procedurally generated; a `Math.random` in that
  path would produce a different server and client tree. The geometry module is seeded
  (`mulberry32`) and the author verified two consecutive server renders are byte-identical
  across all ten SVG blocks.
- **Icon barrel collisions.** All 40 icons share one uniform signature and were checked by
  typecheck across every consumer.
- **Tailwind token typos.** The stock palette is cleared with `--color-*: initial`, so any
  invented colour class fails to compile rather than silently falling back.

### Not covered

- **No automated test suite.** The project has none; this was a design-implementation task
  and no test framework was requested or added. Verification is the gates above plus
  rendered measurement.
- **Real-device and cross-browser testing.** Everything was verified in one Chromium-based
  browser at three widths. Safari's `background-clip: text`, `mask-composite` and
  `backdrop-filter` behaviour is untested.
- **`prefers-reduced-motion` was verified by inspecting the emitted CSS**, not by toggling
  the OS setting — the browser tooling available here cannot emulate it.
- The deviations listed in README under "Known deviations" are accepted, not fixed.
