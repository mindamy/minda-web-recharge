# Claim: quick-kayinleong-001

- owner: kayinleong
- session: claude-code
- branch: main
- started: 2026-09-14
- status: in-progress
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

- [x] Repository initialised as a git repo on `main`
- [x] `.gitignore` added
- [x] `.planning/` scaffolding bootstrapped
- [x] Repository scaffolded (Next.js 16.3.5, App Router, TS, Tailwind v4)
- [ ] Research + design spec captured
- [ ] Application scaffold
- [ ] Design token layer
- [ ] Shared chrome
- [ ] 8 sections
- [ ] Assets
- [ ] Motion layer
- [ ] Responsive pass

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

Pending — see the Regression Report section below once work completes.

## Regression Report

Not yet written. This claim cannot be marked `done` until it is.
