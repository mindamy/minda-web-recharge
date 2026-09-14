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

The home route `/` renders the full eight-section scrolling narrative. Each nav destination is
*also* a real route that renders its section standalone, so links deep-link correctly:

| Route | Section |
|-------|---------|
| `/` | Full scrolling page |
| `/how-it-works` | The R³ Recharge Loop |
| `/the-r3-experience` | One connected experience |
| `/plans` | Free trial & plans |
| `/trust-and-approach` | Trust & approach |
| `/about` | About |

## Project layout

```
public/images/     Photography cropped from the design renders
src/app/           App Router routes
src/components/    Section + UI components
.docs/             Design sources (PDF + hero image)
.planning/         GSD planning artifacts
```
