# Recharge — Web

Marketing website for **Recharge**, a personal wellbeing companion, implementing the design in
`.docs/`.

## Design sources

| Source | Role |
|--------|------|
| `.docs/First Page.jpeg` | **Canonical hero.** Supersedes page 1 of the PDF. |
| `.docs/Design.pdf` | Pages 2–8 — the remaining seven sections. Page 1 is superseded. |

Each PDF page is a single flattened raster image, so photography is cropped out of high-DPI
re-renders into `public/images/` rather than extracted as layers. The decorative "aurora wave"
line-art is rebuilt as SVG rather than cropped, so it stays crisp and can be animated.

## Stack

- **Next.js 16** (App Router, Turbopack) + **React 19**
- **TypeScript**
- **Tailwind CSS v4** — design tokens declared via `@theme` in `src/app/globals.css`
- **motion** (motion.dev) for scroll-triggered reveals
- **class-variance-authority** + **clsx** for variant-driven component styling

## Getting started

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | `next typegen` then `tsc --noEmit` |

> `typecheck` runs `next typegen` first on purpose. Next.js 16 generates the typed-routes
> helpers (`LayoutProps`, `PageProps`) into `.next/types`, and a bare `tsc --noEmit` fails
> with `Cannot find name 'LayoutProps'` if those have never been generated.

## Routing

Routing is hybrid, because the deck argues for both readings: pages 1-3 carry a
"SCROLL TO EXPLORE" affordance, while pages 6 and 7 show an active underline beneath a nav
label. So `/` renders the full eight-section scrolling narrative with anchor nav and
scroll-spy, and every nav destination is *also* a real route rendering that section
standalone.

Nav labels are matched to sections by the deck's own eyebrow text rather than by guesswork:

| Route | Section(s) | Matched by |
|-------|-----------|------------|
| `/` | All eight, in deck order | — |
| `/how-it-works` | Moments | `RECOGNISE YOUR MOMENT` |
| `/the-r3-experience` | R³ Loop | `THE R³ RECHARGE LOOP` |
| `/plans` | Plans | `FREE TRIAL & PLANS` |
| `/trust-and-approach` | Trust | `TRUST & APPROACH` |
| `/about` | Connected + Rhythm | `MORE CONNECTED` (no About page exists in the deck) |

The Rhythm section has no nav entry of its own — it belongs to the scroll narrative and to
`/about`. Each standalone route repeats the closing CTA so a deep-linked visitor has somewhere
to go.

### Links that intentionally 404

The deck draws affordances for screens it never designs — `Sign In`, and the `Ask Recharge`
link that recurs seven times. Those links point at their eventual destinations (`/sign-in`,
`/ask`) rather than being stripped out or pointed somewhere misleading, so they currently land
on the branded `not-found` page. Same for the footer's `/privacy` and `/terms`.

## Additions not in the design deck

Three things were added because omitting them would have been a defect rather than fidelity.
Each is flagged in its own source file:

- **A sticky header.** The deck's band is static and transparent. Anchor nav is useless if it
  scrolls away, and a transparent band over moving content is unreadable, so it gains a faint
  translucent wash past 24px of scroll.
- **A footer.** All eight deck pages end at their own content. A health-adjacent product
  carrying a "not diagnosis, treatment or cure" disclaimer needs somewhere for that statement
  and for privacy/terms to live. Every string in it is lifted from the deck or unavoidable
  boilerplate.
- **A branded 404**, for the links described above.

## Known deviations

- **The logo is a hand reconstruction** traced from a 400 ppi re-render; no vector asset was
  supplied. The deck's ring arcs taper along their length, which uniform-width SVG strokes
  cannot reproduce. Replace with the real brand SVG before launch.
- **Typefaces are inferred, not identified.** The design spec measured letterforms and ranked
  candidates rather than asserting a match. Body is Outfit (the deck's sans has a
  double-storey `a` with no tail and a single-storey `g`); display is Playfair Display, which
  is the closest free match but whose `y` descender is straight where the deck's is curved and
  hooked. Both are one-line swaps in `src/app/layout.tsx`.
- **Five colours were darkened for WCAG AA.** Recomputed against the real page ground,
  `rose-ink`, `green-ink`, `teal-400`, `green-500` and `ink-400` all failed on text they were
  carrying. The deck's lighter hues are retained for icon strokes, which always sit beside a
  text label. See the comments in `src/app/globals.css`.
- **The Trust portrait is 4:5, not the deck's 2.4:1 room scene.** Excluding the arc from the
  crop so it could be redrawn as SVG forced a portrait-orientation source.
- **The hero photo tops out at 848x754.** Page 1 of the PDF embeds a single 1448x965 raster
  with the page UI baked in; that sub-rectangle is the largest completely UI-free region, and
  no sharper source exists.
- **Mobile carousel dots are not implemented.** The spec asks for them on the Moments row;
  tracking the active dot needs client scroll state, and a static row with the first dot lit
  would misreport position the moment you scroll.

## Project layout

```
public/images/     Photography cropped from the design renders
src/app/           App Router routes
src/components/    Section + UI components
.docs/             Design sources (PDF + hero image)
.planning/         GSD planning artifacts
```
