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

## Brand

The authoritative brand assets live in `.docs/brand/`, from the supplied `LOGO.zip`:

| Element | Hex | RGB |
|---------|-----|-----|
| Blue | `#35C1FC` | 53, 193, 252 |
| Pink | `#FC7E9E` | 252, 126, 158 |
| Green | `#61E1A3` | 97, 225, 163 |
| Grey | `#AAABB1` | 170, 171, 177 |
| Soft-black text | `#222222` | 34, 34, 34 |
| Soft-white text | `#F5F5F0` | 245, 245, 240 |

`public/logo-mark.svg` is a vector trace of `logo-mark.png` with those exact fills. It also
drives the favicon, `icon.svg` and `apple-icon.png`.

> **The brand palette and the UI palette are different things, and are not interchangeable.**
> Brand blue `#35C1FC` is far brighter than the UI blue `blue-fill` `#2B5FD9` that the deck
> uses for buttons and links — and it is the darker one that passes WCAG AA on the page
> ground. Only the logo and the wordmark use brand values; everything else uses the
> deck-sampled scales in `src/app/globals.css`.

The header lockup is horizontal (mark + live text), matching the deck. The supplied lockup
PNGs are stacked vertically; that arrangement is used in the Connected section. The wordmark
is live text in the display serif rather than baked into the image, so it stays selectable,
translatable and searchable.

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

Then open **http://localhost:3000/en-GB** — note the locale segment.

> `http://localhost:3000` itself 404s, and so do `/plans`, `/how-it-works` and the other three
> bare routes. Every real URL on this site carries a locale, and the thing that used to answer
> the locale-less ones — `src/proxy.ts` — was deleted when the site became a static export.
> What replaced it is a redirect table in `firebase.json`, which only exists in front of the
> deployed site. Nothing is broken locally; the front door simply lives in the CDN now. See
> [Deployment](#deployment).

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

## Deployment

Firebase Hosting, project `mtherapys`, site `recharge-main` — https://recharge-main.web.app

```bash
FIREBASE_HOSTING_UPLOAD_CONCURRENCY=8 firebase deploy --only hosting
```

That is the whole procedure. The environment variable is not optional today — see
[the pages are enormous](#known-problem-the-pages-are-enormous) below. `firebase.json` holds the site, the redirect table and the cache
headers; `.firebaserc` pins the project; a `predeploy` hook runs `npm run build` first, so the
uploaded `out/` is never a stale one.

| | |
|---|---|
| Output | `output: "export"` in `next.config.ts` → `out/`, 44 HTML files and their assets |
| Server | **None.** Nothing in this project runs per request |
| Preview | `firebase hosting:channel:deploy <name> --expires 7d` — same build, temporary URL |
| Rollback | `firebase hosting:rollback`, or the Hosting console's release list |

### What being static costs, and where the cost is paid

> **There is no locale detection any more.** `src/proxy.ts` decided a visitor's language from
> their cookie, IP country and `Accept-Language`; Proxy is on the framework's
> unsupported-for-export list and the build refuses to run while the file exists. The six
> locale-less entry paths are now six fixed `302`s to `/en-GB/…` in `firebase.json`, so
> everyone who types the bare domain lands on English and has to use the switcher.
> `src/lib/i18n/negotiate.ts` is kept, unwired, so the decision is recoverable — its header
> says how, and notes that the IP-country half would not have worked on Firebase regardless,
> since Hosting injects no geo header.

> **The redirects are `302`, not `301`.** A permanent redirect from `/` to a language is
> cached by the browser and by every CDN in between, forever. Today that would merely pin the
> English we are already sending; the day negotiation comes back it would pin English for
> every visitor who ever hit the old one. The cost of `302` is a repeated round trip on a
> 9 KB redirect. Do not "optimise" it.

> **`next/image` is unoptimised.** Static export has no image server, so `images.unoptimized`
> is set and the six `<Image>` call sites serve their source files as-is. `width`/`height`/
> `sizes` still work; the resizing and the WebP/AVIF rewrite do not.

> **`NEXT_PUBLIC_SITE_URL` is baked in at build time.** Every canonical and all five
> `hreflang` links in the shipped HTML are whatever the origin was when `next build` ran. It
> defaults to the Hosting origin in `src/lib/i18n/metadata.ts`; export the variable before
> deploying to move the site to a custom domain.

> **The site ID is the site's name, and `recharge` was not available.** Hosting site IDs are
> unique across every Firebase project on earth; that one is held by someone else and the API
> refuses it rather than suffixing it. Hence `recharge-main`. A custom domain mapped onto the
> site hides the ID from visitors entirely.

### Known problem: the pages are enormous

`out/` is **105 MB** and a single page is **2.26 MB** (871 KB gzipped — the path data is
high-entropy and barely compresses). Roughly 96% of that is the Aurora artwork: ~1.0 MB of
inline `<svg>` — 111 `<svg>` elements, 903 `<path>` — plus ~1.1 MB of RSC payload carrying the
same markup a second time, repeated across all 30 locale pages. This is not cosmetic; it
already killed one deploy with an upload timeout. The nine Aurora presets take no
data-dependent props, so they should be built once into static files rather than inlined per
page. Tracked separately.

Until that is fixed, **deploys must turn the upload concurrency down**:

```bash
FIREBASE_HOSTING_UPLOAD_CONCURRENCY=8 firebase deploy --only hosting
```

The CLI defaults to **200** simultaneous uploads (`lib/deploy/hosting/deploy.js`) against a
per-file timeout of 30 seconds. At 871 KB a file, 200 parallel transfers starve each other and
every one of them blows that timeout at the same moment. Two deploys died exactly that way,
around 80 files in:

```
Error: Task <hash> failed: retries exhausted after 6 attempts, with error:
Timeout reached making request to https://upload-firebasehosting.googleapis.com/...
```

It reads like a network fault and is not one — it is a self-inflicted bandwidth problem, and
it will come back the moment someone copies the bare `firebase deploy` from the Firebase docs.
Shrinking the pages removes the need for the flag.

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

## Motion

Scroll behaviour is a deliberate, small set — every effect has a named purpose rather than
existing because it looked busy.

| Effect | Purpose | Where |
|--------|---------|-------|
| Scroll progress bar | Orientation — `/` is ~9,000px of continuous narrative behind a sticky header | Top of the viewport, carrying the aurora ramp |
| Aurora parallax | Depth — separates the decorative plane from the content plane | All 8 sections, 40–80px of travel each |
| Staggered reveals | Preventing a jarring change | Every section; card grids stagger their children |
| Photo settle | Preventing a jarring change — a full-height portrait that simply appears reads as a jump | Trust and Start portraits, from `scale(1.04)` |
| Arc draw | Explanation | The R³ loop's connecting arcs |
| Card lift | Feedback | Moments, Trust and Plans cards; 3px, inside `@media (hover: hover)` |
| Aurora drift | Ambience | CSS keyframes, 26s/38s, transform only |

Two things are deliberately **not** animated:

- **Gradient headline text.** Animating `background-position` under `background-clip: text`
  repaints the text layer every frame and fringes sub-pixel-antialiased serif glyphs.
- **The trust strip**, which carries the medical disclaimer.

### Reduced motion

`prefers-reduced-motion` is honoured in three layers: `MotionConfig reducedMotion="user"`
drops transforms while keeping opacity; each primitive branches its animated *values* (never
its JSX — `useReducedMotion` returns `null` during SSR, so branching markup would hand a
hydration mismatch to exactly those visitors); and a CSS block collapses every animation and
transition. Parallax collapses to zero travel outright, being the one effect here with real
vestibular risk. The progress bar is intentionally exempt: it tracks the scrollbar
one-to-one and initiates no motion of its own.

### No-JavaScript safety

Motion serialises its `initial` variant into the server HTML as an inline `opacity:0`, and
the R³ arcs as `stroke-dasharray="0 1"`. Both would leave content invisible if scripting were
unavailable, so every reveal wrapper carries `data-reveal`, every drawn path carries
`data-draw`, and a `@media (scripting: none)` block force-reveals both. The hero does not
rely on that net at all — its entrance is a CSS keyframe.

## Known deviations

- **The logo's colours differ from the design spec.** The mark is a vector trace of
  `.docs/brand/logo-mark.png` from the supplied logo pack, with fills taken from that pack's
  colour sheet. DESIGN-SPEC §2.1 records much duller values because it measured them off the
  soft, low-resolution deck page.
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
