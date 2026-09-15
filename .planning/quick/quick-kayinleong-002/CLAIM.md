# Claim: quick-kayinleong-002

- owner: kayinleong
- session: claude-code
- branch: main
- started: 2026-09-15
- status: done
- summary: Replace the reconstructed logo with the supplied brand asset, and add a scroll-driven motion layer.

> **Process note.** This claim was opened *after* the work began, not before, which
> breaks the claim-before-start rule. Two requests arrived in sequence during an
> active session and were acted on immediately. Recorded here rather than
> backdated.

## What will change

Follow-on to [quick-kayinleong-001], which shipped the site with a hand-reconstructed
logo flagged for replacement.

1. **Logo** — replace the traced-by-eye SVG with the brand asset supplied by the design owner.
2. **Scroll motion** — the site had scroll-triggered reveals but no scroll-*linked* motion.
   Add a coherent layer rather than a pile of effects.

## What has changed

- [x] Brand asset recovered from the supplied images and vectorised
- [x] `public/logo-mark.svg` + `src/app/icon.svg` + favicon + apple-icon
- [x] Originals preserved at `.docs/logo-mark.webp` / `.docs/logo-lockup.webp`
- [x] `Logo` API reworked; the `[&>svg]` coupling in Connected removed
- [x] `ScrollProgress`, `ParallaxLayer`, `ImageReveal` added
- [x] `card-lift` hover utility applied to the Moments, Trust and Plans cards

## Logo

The supplied images were not on disk — they arrived as attachments. They were recovered
from the session transcript, where they are stored base64-encoded, and decoded to two
1254x1254 WebPs that already carry a transparent alpha channel.

Rather than ship a raster, the mark was **vectorised**: segment the opaque pixels into
four clusters, take the *modal* colour of each so anti-aliased edge pixels cannot drag the
value, then fit smooth cubic Béziers through the region contours. Verified by rendering
the trace against the source at 300px, as a hue-shifted overlay, and at 24/44/54/78px —
indistinguishable at every size.

Recovered brand colours: blue `#36A9D8`, grey `#8E949B`, pink `#E86E92`, green `#63B792`.
These are **more saturated and more cyan** than DESIGN-SPEC §2.1 records, because the spec
measured them off the soft, low-resolution deck render.

Served as one cached `/logo-mark.svg` rather than inlined: the lockup appears in the
header, the footer and the Connected section, and inlining ~16 KB of path data three times
costs more than one same-origin request.

## Motion

Every effect has a named purpose; nothing was added because it looked busy.

| Effect | Purpose | Implementation |
|--------|---------|----------------|
| `ScrollProgress` | Orientation — the home page is ~9,000px of continuous narrative with a sticky header and no other position cue | `useScroll` -> spring -> `scaleX`, carrying the aurora ramp |
| `ParallaxLayer` | Depth — separates the decorative plane from the content plane | Scroll-linked `translate3d`, 40–80px per section |
| `ImageReveal` | Preventing a jarring change — a full-height portrait that simply appears reads as a layout jump | Settles from `scale(1.04)`, never from 0 |
| `card-lift` | Feedback | 3px lift, 220ms, inside `@media (hover: hover)` |

Deliberately **not** added: gradient-text animation (animating `background-position` under
`background-clip: text` repaints the text layer every frame and fringes serif glyphs —
DESIGN-SPEC §5 forbids it), and anything on the trust strip, which carries the medical
disclaimer.

## Verification

| Gate | Result |
|------|--------|
| `npm run typecheck` | pass |
| `npx eslint src` | clean, 0 warnings |
| `npm run build` | 9 routes, all statically prerendered |
| Console | no application errors on load or full scroll |

Measured in-browser at 1440x950, scrolled to y=4600 of ~9,100:
- progress bar `matrix(0.530137, 0, 0, 1, 0, 0)` — 53%, matching scroll position
- 8 parallax layers translating, sampled at -40/-70/-70px
- logo served as a single 16,602-byte request

Emitted-asset checks:
- progress bar server-renders at `scaleX(0)` — invisible until scrolled, so no flash
- `card-lift` emits as `@media (hover:hover){.card-lift:hover{...translate:0 -3px}}`

## Regression Report

### Regression surface

The logo is consumed in three places and the motion layer wraps all eight sections, so the
surface is every section plus the shared chrome.

### Findings

1. **`[&>svg]:size-[78px]` in Connected's Zone D would have broken silently.** It depended
   on the mark being a direct-child `<svg>`; the new mark is an `<img>`. Rather than patch
   the selector, `Logo` now takes `markClassName` and `wordmarkClassName`, so the coupling
   cannot recur. *Verified by rendering the Connected section.*

2. **Tailwind v4 emits `translate`, not `transform`, for translate utilities.** A
   `transition-[transform,...]` on the card lift would have compiled and silently never
   fired. The utility names `translate` explicitly. *Verified in the emitted CSS.*

3. **The parallax layer needed vertical overscan.** The aurora fields fill their box
   exactly, so a layer inset to 0 exposed a bare strip at whichever edge it drifted from.
   Inset to `-inset-y-28` (112px), comfortably beyond the 80px maximum travel.

4. **`useReducedMotion` returns `null` server-side**, so `ParallaxLayer` and `ImageReveal`
   branch animated *values*, never JSX. Parallax collapses to zero travel — it is the one
   effect here that is a genuine vestibular trigger and has no worthwhile degraded form.
   `ScrollProgress` is deliberately *not* gated: it tracks the scrollbar one-to-one and
   initiates no motion of its own.

### Ruled out

- **Server/Client boundary faults** — the three new primitives are `"use client"`; the
  aurora presets they wrap stay Server Components, passed through as children. Confirmed
  by a clean prerender of all 9 routes.
- **Hydration mismatch** — the trace is deterministic; no `Math.random`, no `Date.now`.
- **Pre-hydration flash** — the progress bar server-renders at `scaleX(0)`. The parallax
  layers server-render at their `+distance` offset, which is *correct* for every section
  below the fold; only the hero settles, by 40px, on a 14%-opacity decorative layer inside
  a 112px overscan. Judged imperceptible and accepted.

### Not covered

- No automated tests; the project has none.
- One browser engine only.
- `prefers-reduced-motion` verified by reading the emitted CSS and the value-branching
  code, not by toggling the OS setting.
