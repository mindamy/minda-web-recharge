# Recharge Marketing Site — Implementation Stack Research

**Researched:** 2026-09-14
**Domain:** Static marketing/landing site — Next.js App Router + Tailwind v4 + Motion
**Confidence:** HIGH (every version and every code snippet below was executed and built successfully in a throwaway scaffold this session)

## Summary

The whole site is presentational and can be **100% statically prerendered**. Next.js 16.3.5 App Router + Tailwind CSS 4.3.3 + Motion 13.2.0, with `next/font/google` for the Playfair Display / DM Sans pairing and `next/image` static imports for photography. No backend, no route handlers, no `next.config` image `remotePatterns` needed (all images are local static imports).

The single highest-leverage architectural decision: **keep `app/page.tsx` a Server Component** and push animation into small `"use client"` leaf components (or use `motion/react-client`, which needs no boundary file at all). This was verified — the probe build reported `○ / (Static) prerendered as static content` with motion components on the page.

Two things materially changed versus most guidance you will find online: **`priority` on `next/image` is deprecated in Next.js 16** (use `preload` / `fetchPriority="high"`), and **Tailwind v4 has no `tailwind.config.js`** — design tokens live in `@theme` inside `globals.css`.

**Primary recommendation:** Scaffold with the exact verified command in §1, define all Recharge design tokens in a split `@theme` / `@theme inline` block in `globals.css` (§2–3), and build exactly three reusable client components — `Reveal`, `RevealGroup`/`RevealItem`, `AuroraParallax` — that every one of the 8 sections composes (§4).

---

## Verification Method

All version claims come from `npm view` executed this session, and all code was written into a real `create-next-app` scaffold that passed `npx tsc --noEmit` (exit 0) and `next build` (`✓ Compiled successfully`, 4/4 static pages). Emitted CSS and prerendered HTML were inspected to confirm tokens and utilities actually materialize. Where a claim rests on documentation rather than execution it is tagged `[CITED: …]`.

---

## 1. Next.js and React — Exact Versions + Scaffold

### Registry output (verbatim, this session)

```
$ npm view next version
16.3.5

$ npm view next dist-tags --json
{
  "next-11": "11.1.4",
  "next-12-2-6": "12.2.6",
  "next-14-1": "14.1.1",
  "rc": "15.0.0-rc.1",
  "next-13": "13.5.11",
  "next-12-3-2": "12.3.7",
  "beta": "16.0.0-beta.0",
  "next-14": "14.2.35",
  "next-15-3": "15.3.9",
  "next-15-2": "15.2.9",
  "next-15-0": "15.1.12",
  "next-15-0-0": "15.0.8",
  "preview": "16.3.0-preview.10",
  "backport": "15.5.25",
  "latest": "16.3.5",
  "canary": "16.4.0-canary.28"
}

$ npm view react version
19.3.0

$ npm view react-dom version
19.3.0
```

`[VERIFIED: npm registry]` **Next.js latest stable = `16.3.5`.** `latest` dist-tag is `16.3.5`; `canary` is `16.4.0-canary.28`; `beta`/`rc` tags are stale pointers to older majors and must be ignored.

`[VERIFIED: npm registry]` **React / React DOM latest stable = `19.3.0`.**

> **Important nuance:** `create-next-app@16.3.5` pins React to `19.2.8` in its template, **not** `19.3.0`. Verified from the generated `package.json`:
> ```json
> "dependencies": { "next": "16.3.5", "react": "19.2.8", "react-dom": "19.2.8" }
> ```
> Leave the pin alone. There is nothing in this build that needs 19.3.0, and an unpinned bump costs you Next's tested pairing for zero benefit.

### `create-next-app --help` (verbatim, this session)

```
Usage: create-next-app [directory] [options]

Options:
  -v, --version                            Output the current version of create-next-app.
  --ts, --typescript                       Initialize as a TypeScript project. (default)
  --js, --javascript                       Initialize as a JavaScript project.
  --tailwind                               Initialize with Tailwind CSS config. (default)
  --react-compiler                         Initialize with React Compiler enabled.
  --eslint                                 Initialize with ESLint config.
  --biome                                  Initialize with Biome config.
  --app                                    Initialize as an App Router project.
  --src-dir                                Initialize inside a 'src/' directory.
  --rspack                                 Enable Rspack as the bundler.
  --import-alias <prefix/*>                Specify import alias to use (default "@/*").
  --api                                    Initialize a headless API using the App Router.
  --empty                                  Initialize an empty project.
  --use-npm                                Explicitly tell the CLI to bootstrap the application using npm.
  --use-pnpm                               Explicitly tell the CLI to bootstrap the application using pnpm.
  --use-yarn                               Explicitly tell the CLI to bootstrap the application using Yarn.
  --use-bun                                Explicitly tell the CLI to bootstrap the application using Bun.
  --reset, --reset-preferences             Reset the preferences saved for create-next-app.
  --skip-install                           Explicitly tell the CLI to skip installing packages.
  --yes                                    Use saved preferences or defaults for unprovided options.
  -e, --example <example-name|github-url>
  --example-path <path-to-example>
  --agents-md                              Include AGENTS.md to guide coding agents to write up-to-date Next.js code. (default)
  --disable-git                            Skip initializing a git repository.
  -h, --help                               Display this help message.
```

### The scaffold command (executed successfully)

```bash
npx create-next-app@latest minda-web-recharge \
  --ts \
  --tailwind \
  --eslint \
  --app \
  --no-src-dir \
  --no-agents-md \
  --import-alias "@/*" \
  --use-npm \
  --disable-git \
  --yes
```

Flag notes — all `[VERIFIED: executed this session]`:

| Flag | Why |
|------|-----|
| `--no-src-dir` | **Not listed in `--help`** but works (Commander auto-negation of the `--src-dir` boolean). Verified: no `src/` directory was created. Without it, `--yes` may reuse a *saved preference* from a previous run on this machine and silently create `src/`. Always pass it explicitly. |
| `--no-agents-md` | `--agents-md` is **default true** and writes both `AGENTS.md` **and** a `CLAUDE.md` whose entire content is the single line `@AGENTS.md`. That will collide with your own project `CLAUDE.md`. Verified: with `--no-agents-md`, neither file is created. |
| `--yes` | Required for non-interactive. **Reads saved preferences** — combine with explicit flags for every option you care about, or add `--reset` first. |
| *(no `--turbopack`)* | The flag is gone. Turbopack is the default bundler in Next 16 — build output reads `▲ Next.js 16.3.5 (Turbopack)`. |
| `--react-compiler` | **Do not enable.** Extra build time and a beta surface for a site with no expensive re-renders. |
| `--rspack`, `--biome`, `--api`, `--empty` | Not applicable. |

### What the scaffold actually generates (verbatim)

`package.json`:
```json
{
  "name": "minda-web-recharge",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint"
  },
  "dependencies": {
    "next": "16.3.5",
    "react": "19.2.8",
    "react-dom": "19.2.8"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "16.3.5",
    "tailwindcss": "^4",
    "typescript": "^5"
  }
}
```

Resolved installs (`npm ls --depth=0`): `next@16.3.5`, `react@19.2.8`, `react-dom@19.2.8`, `tailwindcss@4.3.3`, `@tailwindcss/postcss@4.3.3`, `typescript@5.9.3`, `eslint@9.39.5`.

`next.config.ts` — empty, and **needs no changes for this project**:
```ts
import type { NextConfig } from "next";
const nextConfig: NextConfig = {};
export default nextConfig;
```

---

## 2. Tailwind CSS v4 — Setup

```
$ npm view tailwindcss version
4.3.3

$ npm view tailwindcss dist-tags --json
{
  "next": "4.0.0",
  "v3-lts": "3.4.19",
  "latest": "4.3.3",
  "insiders": "0.0.0-insiders.41d9cae"
}

$ npm view @tailwindcss/postcss version
4.3.3
```

`[VERIFIED: npm registry]` **Tailwind latest stable = `4.3.3`.** Note the `next` dist-tag is a **stale `4.0.0`** — do not install `tailwindcss@next`, it is older than `latest`. `v3-lts` is `3.4.19`; ignore it.

### `postcss.config.mjs` — exact, as generated

```js
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
```

That is the whole file. **No `autoprefixer`, no `postcss-import`** — v4's engine handles both internally. Adding them is a common copy-paste error that breaks the build.

### `app/globals.css` — complete working file for this project

This exact file was compiled by the probe build and its emitted utilities were inspected in `.next/static/chunks/*.css`.

```css
@import "tailwindcss";

/* ── Fonts: `inline` is REQUIRED here (see Pitfall P4) ───────────────── */
@theme inline {
  --font-display: var(--font-playfair), ui-serif, Georgia, serif;
  --font-sans: var(--font-dm-sans), ui-sans-serif, system-ui, sans-serif;
}

/* ── Everything else: plain `@theme` (static values) ─────────────────── */
@theme {
  /* Recharge pastel palette — keep these as literal hex so that
     opacity modifiers (bg-cream/70, ring-ink/5) resolve statically. */
  --color-cream: #fdf8f3;
  --color-blush: #f7d9d4;
  --color-lilac: #ded6f2;
  --color-mint: #cfe8e0;
  --color-sky: #d6e6f7;
  --color-ink: #1f1b24;
  --color-ink-muted: #6b6472;

  /* Aurora gradient — NOT a --color-* token, so referenced via a
     custom utility below rather than a bg-* class. */
  --gradient-aurora: linear-gradient(
    135deg,
    var(--color-blush) 0%,
    var(--color-lilac) 45%,
    var(--color-sky) 100%
  );

  /* Display type scale. The `--text-{name}--line-height` and
     `--text-{name}--letter-spacing` suffixes are real v4 features:
     one `text-display-lg` class sets size + leading + tracking. */
  --text-display-sm: 2.25rem;
  --text-display-sm--line-height: 1.15;
  --text-display-md: 3.5rem;
  --text-display-md--line-height: 1.08;
  --text-display-lg: 5rem;
  --text-display-lg--line-height: 1.02;
  --text-display-lg--letter-spacing: -0.02em;

  /* Motion tokens */
  --ease-soft: cubic-bezier(0.22, 1, 0.36, 1);
  --animate-drift: drift 18s var(--ease-soft) infinite alternate;

  /* @keyframes MUST live inside @theme for --animate-* to work */
  @keyframes drift {
    from { transform: translate3d(0, 0, 0) scale(1); }
    to   { transform: translate3d(2%, -3%, 0) scale(1.06); }
  }
}

/* ── Base element styles ────────────────────────────────────────────── */
@layer base {
  html {
    scroll-behavior: smooth;
  }
  body {
    background-color: var(--color-cream);
    color: var(--color-ink);
    font-family: var(--font-sans);
    -webkit-font-smoothing: antialiased;
  }
  h1, h2, h3 {
    font-family: var(--font-display);
  }
}

/* ── Custom utility (v4 replacement for @layer utilities) ───────────── */
@utility aurora-surface {
  background-image: var(--gradient-aurora);
}

/* ── CSS-level reduced-motion guard (complements Motion's hook) ─────── */
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Verified emitted CSS

Grepped out of the probe's production CSS chunk — proof the tokens materialize:

```css
.font-display{font-family:var(--font-playfair), ui-serif, Georgia, serif}
.text-display-lg{font-size:var(--text-display-lg);line-height:var(--tw-leading,var(--text-display-lg--line-height));letter-spacing:var(--tw-tracking,var(--text-display-lg--letter-spacing))}
.aurora-surface{background-image:var(--gradient-aurora)}
.text-lilac{color:var(--color-lilac)}
.ring-ink\/5{--tw-ring-color:#1f1b240d}
.ring-ink\/5{--tw-ring-color:color-mix(in oklab, var(--color-ink) 5%, transparent)}
.bg-linear-to-b{--tw-gradient-position:to bottom in oklab}
```

Note `ring-ink/5` compiled to a static `#1f1b240d` fallback **plus** a `color-mix()` progressive enhancement — that only happens because `--color-ink` is a literal hex. This is why the palette must not be defined as `var()` indirection.

### `@theme` namespaces `[CITED: tailwindcss.com/docs/theme]`

| Namespace | Generates |
|-----------|-----------|
| `--color-*` | `bg-*`, `text-*`, `border-*`, `ring-*`, `from-*`, `via-*`, `to-*`, … |
| `--font-*` | `font-sans`, `font-display`, … |
| `--text-*` | `text-xl` (+ `--line-height` / `--letter-spacing` suffixes) |
| `--font-weight-*` | `font-bold` |
| `--tracking-*` / `--leading-*` | `tracking-wide` / `leading-tight` |
| `--breakpoint-*` | `sm:*` variants |
| `--container-*` | `@sm:*` container queries, `max-w-md` |
| `--spacing-*` | `px-4`, `max-h-16`, … |
| `--radius-*` / `--shadow-*` / `--inset-shadow-*` / `--drop-shadow-*` | `rounded-sm` / `shadow-md` / `inset-shadow-xs` / `drop-shadow-md` |
| `--blur-*` / `--perspective-*` / `--aspect-*` | `blur-md` / `perspective-near` / `aspect-video` |
| `--ease-*` / `--animate-*` | `ease-out` / `animate-spin` |

### v3 → v4 gotchas that will trip an implementer

| v3 habit | v4 reality |
|----------|-----------|
| `tailwind.config.js` with `theme.extend` | **Gone.** Tokens live in `@theme` in CSS. There is no config file in the scaffold. |
| `@tailwind base; @tailwind components; @tailwind utilities;` | Replaced by a single `@import "tailwindcss";` |
| `content: [...]` globs | Gone — v4 auto-detects sources. |
| `postcss.config.js` with `tailwindcss` + `autoprefixer` | Only `@tailwindcss/postcss`, in `postcss.config.mjs`. |
| `bg-gradient-to-b` | Renamed **`bg-linear-to-b`** (verified in emitted CSS). `bg-radial-*` / `bg-conic-*` also exist. |
| `shadow-sm` / `blur-sm` / `rounded-sm` | Scale shifted one step: old `shadow-sm` → `shadow-xs`, old `shadow` → `shadow-sm`. Same for `blur-*` and `rounded-*`. |
| `@layer utilities { .foo { … } }` | Use **`@utility foo { … }`**. Raw `@layer utilities` no longer participates in variant generation (`hover:foo` won't work). |
| `theme('colors.ink')` in CSS | Use `var(--color-ink)`. |
| `opacity-50` on a `var()`-based color | Needs `@theme inline` or a literal value, or opacity silently no-ops. |
| `@keyframes` at top level + `animation` in config | `@keyframes` must be **inside `@theme`** for `--animate-*` to resolve. |
| `outline-none` | Renamed `outline-hidden`. |

---

## 3. Fonts — Playfair Display + DM Sans

### Recommendation

**Headlines: `Playfair_Display`. Body/UI: `DM_Sans`.**

Rationale — Playfair Display is the canonical free high-contrast Didone serif; its thick/thin stroke modulation is exactly the "elegant editorial" look in the design, which Lora (low-contrast, bookish) and Source Serif 4 (workhorse, low-contrast) do not deliver. DM Sans is a geometric sans with a large x-height and true optical-size axis — cleaner at body sizes than Poppins (whose circular `o`/`e` get illegible below 16px) and more geometric than Inter. Both are **variable** fonts, so no weight array is needed.

If the headline needs to be *slightly* less austere, `Fraunces` (with the `SOFT` and `WONK` axes) is the one substitution worth making. Do not substitute in Lora.

### `app/layout.tsx` — exact working code

```tsx
import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  style: ["normal", "italic"], // italic Playfair is worth it for pull-quotes
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
  axes: ["opsz"], // optical-size axis; omit to shave ~30KB
});

export const metadata: Metadata = {
  title: "Recharge — Wellbeing, restored",
  description: "Guided audio sessions that bring you back to baseline.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

Then in `globals.css` (already shown in §2):
```css
@theme inline {
  --font-display: var(--font-playfair), ui-serif, Georgia, serif;
  --font-sans: var(--font-dm-sans), ui-sans-serif, system-ui, sans-serif;
}
```

Usage: `className="font-display"` / `className="font-sans"`, plus the `h1,h2,h3` base rule already defaults headings to the serif.

### Verified behaviour

- **`font.variable` is a className, not a variable name.** The prerendered HTML shows:
  ```html
  <html lang="en" class="playfair_display_d959cace-module__1ZHK6W__variable dm_sans_e0d2ab3f-module__po7sdG__variable">
  ```
  and the CSS chunk contains:
  ```css
  .playfair_display_d959cace-module__1ZHK6W__variable{--font-playfair:"Playfair Display", "Playfair Display Fallback"}
  ```
  So the var is scoped to whatever element carries that class. Put it on `<html>`.
- **Weight is not required** for these two — both are variable. Verified emitted `@font-face` for DM Sans: `font-weight:100 1000`. Adding `weight: ["400","500","600","700"]` produced identical file counts but forces static instances; omit it. `[CITED: nextjs.org/docs/app/api-reference/components/font]` — "Required if the font being used is **not** variable".
- **Automatic fallback metrics** are generated, killing CLS. Verified emitted CSS: `ascent-override:97.25%;descent-override:22.56%;line-gap-override:0.0%;size-adjust:111.26%`.
- **Total font payload:** 10 `.woff2` files, **296 KB** across both families with subsets split by unicode-range. Self-hosted; zero requests to Google.
- **Must be module scope.** Calling the loader inside a component body is a build error. Two loaders = two families; that is the budget — do not add a third.
- `axes: ["opsz"]` is optional. `[CITED: nextjs.org/docs/app/api-reference/components/font]` — "By default, only the font weight is included to keep the file size down."

---

## 4. Animation — Motion 13.2.0

```
$ npm view motion version
13.2.0

$ npm view motion dist-tags --json
{ "beta": "3.2.4", "rc": "10.0.0-rc.6", "alpha": "10.5.0-alpha.1",
  "canary": "13.1.1-alpha.0", "latest": "13.2.0" }

$ npm view framer-motion version
13.2.0

$ npm view motion peerDependencies --json
{ "react": "^18.0.0 || ^19.0.0", "react-dom": "^18.0.0 || ^19.0.0" }
```

`[VERIFIED: npm registry]` **`motion` latest = `13.2.0`**, React 19 peer-compatible. Install `motion`, not `framer-motion`.

`[VERIFIED: node_modules inspection]` `motion@13.2.0` is a **thin re-export of `framer-motion@13.2.0`** — `dist/es/react.mjs` begins:
```js
import * as fm from 'framer-motion';
export * from 'framer-motion';
```
Both are installed either way; `framer-motion` arrives as a transitive dep. Never import from both — you will ship two contexts.

### Export map (verified from the installed `package.json`)

```
".", "./mini", "./vgpu", "./debug", "./react", "./three",
"./react-m", "./react-mini", "./react-client", "./package.json"
```

| Entry | Use for |
|-------|---------|
| **`motion/react`** | The React API. Requires a `"use client"` file. |
| **`motion/react-client`** | Pre-marked client components, importable **directly into a Server Component**. Resolves to `framer-motion/client`. |
| `motion/react-m` | `m` components for `LazyMotion` bundle-splitting. Not needed here. |
| `motion` (root) | Imperative vanilla API. Not needed. |

### (a) The `"use client"` boundary — the exact failure mode

Verified by deliberately importing `motion/react` into a Server Component. It **compiles fine** and then **fails at prerender**:

```
✓ Compiled successfully in 2.4s
Error occurred prerendering page "/bad".
Error: Attempted to call createMotionComponent() from the server but
createMotionComponent is on the client. It's not possible to invoke a client
function from the server, it can only be rendered as a Component or passed to
props of a Client Component.
    at <unknown> (app/bad/page.tsx:3:18)
⨯ Next.js build worker exited with code: 1
```

Two legal options, **both verified building**:

```tsx
// Option A — dedicated client leaf (preferred; needed whenever you use hooks)
"use client";
import { motion } from "motion/react";
```

```tsx
// Option B — no boundary file at all; works inside a Server Component.
// Components are LOWERCASE: m.div, m.section, m.svg …
import * as m from "motion/react-client";

export default function Page() {          // still a Server Component
  return (
    <m.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      …
    </m.div>
  );
}
```

Use **Option B** for one-off decorative motion (no hooks). Use **Option A** for anything needing `useScroll` / `useReducedMotion` / `useRef`.

### (b) Scroll-triggered reveals — `components/Reveal.tsx`

Verified compiling and building. This is the workhorse for all 8 sections.

```tsx
"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
};

export function Reveal({ children, delay = 0, y = 24, className }: RevealProps) {
  const reduce = useReducedMotion();

  const variants: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : y },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: reduce ? 0 : 0.7,
        delay: reduce ? 0 : delay,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.25, margin: "0px 0px -10% 0px" }}
    >
      {children}
    </motion.div>
  );
}
```

Staggered variant for the card grids and the pricing table:

```tsx
const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

const child: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export function RevealGroup({ children, className }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      variants={container}
      initial={reduce ? "visible" : "hidden"}
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div className={className} variants={child}>
      {children}
    </motion.div>
  );
}
```

`viewport` options `[CITED: motion.dev/docs/react-scroll-animations]`:

| Option | Meaning |
|--------|---------|
| `once: true` | "so an animation only plays the first time an element scrolls into view" — **always set this** on a marketing page; re-triggering on scroll-up reads as a bug |
| `amount` | fraction of the element that must be visible (`0.25` = 25%); `"all"`/`"some"` also accepted |
| `margin` | inset the trigger box; negative bottom (`-10%`) fires slightly *before* the element reaches the edge |
| `root` | ref of a custom scroll container |

Variants propagate to children automatically — that is why `RevealItem` needs no `initial`/`whileInView` of its own, only `variants`.

### (c) Scroll-linked parallax — `components/AuroraParallax.tsx`

Verified compiling and building. This is the aurora wave line-art layer.

```tsx
"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from "motion/react";

export function AuroraParallax() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"], // 0 when top hits viewport bottom; 1 when bottom hits viewport top
  });

  // Smoothing — raw scrollYProgress is jittery on trackpads.
  const smooth = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 30,
    restDelta: 0.001,
  });

  const yBack = useTransform(smooth, [0, 1], ["-8%", "12%"]);
  const yFront = useTransform(smooth, [0, 1], ["6%", "-14%"]);
  const opacity = useTransform(smooth, [0, 0.35, 1], [0.35, 0.85, 0.4]);

  return (
    <div ref={ref} className="relative isolate overflow-hidden py-32">
      <motion.svg
        aria-hidden
        style={{ y: reduce ? 0 : yBack, opacity }}
        viewBox="0 0 1440 600"
        className="pointer-events-none absolute inset-0 -z-10 h-full w-full"
        preserveAspectRatio="none"
      >
        <g fill="none" stroke="currentColor" strokeWidth="1.25" className="text-lilac">
          {Array.from({ length: 14 }).map((_, i) => (
            <path
              key={i}
              d={`M0 ${180 + i * 18} C 320 ${100 + i * 22}, 720 ${320 + i * 10}, 1440 ${200 + i * 16}`}
              opacity={1 - i * 0.055}
            />
          ))}
        </g>
      </motion.svg>

      <motion.div
        aria-hidden
        style={{ y: reduce ? 0 : yFront }}
        className="aurora-surface pointer-events-none absolute -inset-x-1/4 top-1/4 -z-20 h-[60%] opacity-60 blur-3xl"
      />

      <h2 className="text-display-md mx-auto max-w-3xl text-center text-balance">
        Ten minutes back to baseline
      </h2>
    </div>
  );
}
```

`useScroll` returns `scrollX`, `scrollY` (pixels) and `scrollXProgress`, `scrollYProgress` (0→1) `[CITED: motion.dev/docs/react-scroll-animations]`. Options: `container`, `target`, `offset`, `axis`. Smoothing via `useSpring` is the documented approach — "Smooth changes to a scroll value by passing one through useSpring".

Animate only `y`/`opacity`/`scale` (compositor-only). Never scroll-link `top`, `height`, `margin`, or `filter: blur()` — they force layout/paint every frame.

### (d) `prefers-reduced-motion`

```tsx
import { useReducedMotion } from "motion/react";
const prefersReducedMotion = useReducedMotion();
```

`[CITED: motion.dev/docs/react-use-reduced-motion]` — "A hook that returns `true` if the current device has Reduced Motion setting enabled."

**Critical, verified from source** — `node_modules/motion-dom/.../reduced-motion/state.mjs`:
```js
// Does this device prefer reduced motion? Returns `null` server-side.
const prefersReducedMotion = { current: null };
```
and `use-reduced-motion.mjs` reads it via `useState(prefersReducedMotion.current)` with **no subscription re-render**:
```js
const [shouldReduceMotion] = useState(prefersReducedMotion.current);
```

Consequences you must design around:
1. **SSR returns `null` (falsy).** Branch *animation values*, never JSX structure — see Pitfall P2.
2. The value is captured once on mount; toggling the OS setting mid-session does not re-render. Acceptable for a marketing site.

Belt-and-braces global override — wrap once, high in the tree:

```tsx
"use client";
import { MotionConfig } from "motion/react";

export function MotionProvider({ children }: { children: React.ReactNode }) {
  // ReducedMotionConfig = "always" | "never" | "user"   (verified in framer-motion/dist/index.d.ts:208)
  return (
    <MotionConfig reducedMotion="user" transition={{ ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </MotionConfig>
  );
}
```

`reducedMotion="user"` makes Motion automatically drop transform/layout animations while keeping opacity — which is exactly the accessible fallback you want. Combined with the CSS `@media (prefers-reduced-motion: reduce)` block in `globals.css`, this covers both Motion-driven and CSS-driven animation.

---

## 5. `next/image`

### ⚠ Breaking change: `priority` is deprecated in Next.js 16

`[CITED: nextjs.org/docs/app/api-reference/components/image]`:

> "Starting with Next.js 16, the `priority` property has been deprecated in favor of the `preload` property in order to make the behavior clear."

> "In most cases, you should use `loading="eager"` or `fetchPriority="high"` instead of `preload`."

Version History row, verbatim:
> `v16.0.0` — "`qualities` default configuration changed to `[75]`, `preload` prop added, `priority` prop deprecated, `dangerouslyAllowLocalIP` config added, `maximumRedirects` config added."

`[VERIFIED: built and inspected]` `priority` still works and emits **no build-time warning** — the deprecation is documentation-only, so nothing will nag you. Both `preload?: boolean` and `priority?: boolean` exist in `next/dist/shared/lib/get-img-props.d.ts` (lines 23 and 28). Write new code with `fetchPriority` + `loading`.

Other deprecations still in force: `onLoadingComplete` (use `onLoad`, deprecated v14) and `images.domains` (use `images.remotePatterns`, deprecated v14). Neither applies here.

### (a) Full-bleed background hero photo

```tsx
import Image from "next/image";
import heroImg from "./assets/hero.jpg"; // static import → width/height/blurDataURL inferred

export default function Hero() {
  return (
    <section className="relative isolate flex min-h-svh items-center justify-center overflow-hidden">
      <Image
        src={heroImg}
        alt=""                      /* decorative → empty alt, not a description */
        fill
        fetchPriority="high"        /* replaces `priority` in Next 16 */
        loading="eager"
        placeholder="blur"
        sizes="100vw"
        className="-z-10 object-cover object-center"
      />
      {/* pastel scrim so the serif headline stays legible over photography */}
      <div className="absolute inset-0 -z-10 bg-linear-to-b from-cream/70 via-cream/30 to-cream" />
      <div className="px-6 text-center">
        <h1 className="text-display-lg text-balance">Recharge</h1>
      </div>
    </section>
  );
}
```

`fill` rules `[CITED: nextjs.org/docs/app/api-reference/components/image]`:
- "The parent element **must** assign `position: "relative"`, `"fixed"`, `"absolute"`." → the `relative` on `<section>` is load-bearing; omitting it is the #1 `fill` bug.
- "By default, the `<img>` element uses `position: "absolute"`."
- "If no styles are applied to the image, the image will stretch to fit the container." → **always** pair `fill` with `object-cover` (or `object-contain`).
- `sizes` is required with `fill`: "If `sizes` is missing, the browser assumes the image will be as wide as the viewport (`100vw`)."

Verified prerendered `<img>` output:
```html
<img alt="" fetchPriority="high" decoding="async" data-nimg="fill"
     class="-z-10 object-cover object-center"
     style="position:absolute;height:100%;width:100%;left:0;top:0;right:0;bottom:0;color:transparent;background-size:cover;background-position:50% 50%;background-repeat:no-repeat;background-image:url("data:image/svg+xml;charset=utf-8,%3Csvg …feGaussianBlur stdDeviation='20'…">
```
The blur placeholder ships as an inline SVG `feGaussianBlur` data URI applied as `background-image` — zero extra request. A `<link rel="preload" as="image" imageSrcSet="…w=640&q=75 640w, …750w, …828w…">` is also injected, confirming `q=75` is the v16 default quality.

### (b) Fixed-size card photos

```tsx
import Image from "next/image";
import cardImg from "./assets/card.jpg";

<Image
  src={cardImg}
  alt="A guided breathing session"
  width={640}
  height={420}
  placeholder="blur"
  sizes="(min-width: 1024px) 384px, (min-width: 640px) 50vw, 100vw"
  className="h-56 w-full object-cover"
/>
```

`sizes` matters even for "fixed" cards `[CITED: nextjs.org/docs/app/api-reference/components/image]`:
> "Without `sizes`: Next.js generates a limited `srcset` (e.g. 1x, 2x), suitable for fixed-size images. With `sizes`: Next.js generates a full `srcset` (e.g. 640w, 750w, etc.), optimized for responsive layouts."

Because the card is `w-full` inside a responsive grid, pass `sizes` matching the grid's column widths.

### `placeholder` rules `[CITED: nextjs.org/docs/app/api-reference/components/image]`

- `blur` — "Must be used with the `blurDataURL` property." **Static imports supply `blurDataURL` automatically.** A remote `src` string requires you to generate and pass it yourself.
- `data:image/...` — a Data URL used directly as the placeholder (use for a shimmer).
- `empty` — default.

### Where to put the images

Put them in `app/assets/` (or `components/`) and **static-import** them. Do **not** put them in `public/` and reference by string path — you lose automatic `width`/`height`/`blurDataURL` and gain CLS plus a hand-maintained `blurDataURL`. `public/` is for `favicon.ico`, `robots.txt`, and OG images only.

Since every image is a local static import, `next.config.ts` needs no `images` block at all.

---

## 6. Pitfalls

### P1 — Accidentally making the whole page a Client Component  ⚠ highest impact

One `"use client"` at the top of `app/page.tsx` (or a shared `layout.tsx`) converts every descendant into a client component, ships the entire 8-section markup as JS, and kills static prerendering.

**Rule: `"use client"` goes on leaf animation wrappers only, never on `page.tsx` or `layout.tsx`.**

Verified — the probe's `page.tsx` is a Server Component that imports `Reveal`, `RevealGroup`, `AuroraParallax` (all `"use client"`) *and* uses `motion/react-client` inline. Build output:
```
Route (app)
┌ ○ /
└ ○ /_not-found
○  (Static)  prerendered as static content
```

Correct shape:
```
app/page.tsx                    ← Server Component: composes all 8 sections
app/(sections)/Hero.tsx         ← Server Component (uses <Reveal> as a wrapper)
app/(sections)/Pricing.tsx      ← Server Component
app/(sections)/AudioPlayer.tsx  ← "use client" (needs local state)
components/Reveal.tsx           ← "use client"
components/AuroraParallax.tsx   ← "use client"
components/MotionProvider.tsx   ← "use client"
```

Server Components may pass **children** (already-rendered elements) into client components freely — `<Reveal><h1>…</h1></Reveal>` keeps the `<h1>` server-rendered. They may **not** pass functions or class instances as props.

### P2 — Hydration mismatch from `useReducedMotion`

Since `prefersReducedMotion.current` is `null` on the server (verified in source, §4d), the server renders as if motion is *allowed*. If you gate JSX structure on it, the client's first render disagrees and React throws a hydration error.

Verified: an early draft wrote `{!reduce && (<motion.svg …/>)}`; the aurora `<svg>` **was present in the prerendered HTML**, so a user with Reduced Motion enabled would hydrate into a structural mismatch.

```tsx
// ❌ WRONG — server renders the SVG, client with reduced-motion doesn't
{!reduce && <motion.svg … />}

// ✅ RIGHT — identical tree on both sides; only the animated value differs
<motion.svg style={{ y: reduce ? 0 : yBack }} … />
```

Same rule applies to `Date`/`Math.random()` in copy, `window`-dependent values, and any `localStorage` read during render.

### P3 — `motion/react` in a Server Component fails at *prerender*, not compile

It compiles clean and then explodes during `Generating static pages`:
```
Error: Attempted to call createMotionComponent() from the server but
createMotionComponent is on the client.
```
So `next dev` on a page you haven't scrolled to may look fine while `next build` fails in CI. Run `npm run build` locally before pushing. Either add `"use client"` or switch that usage to `motion/react-client`.

### P4 — `next/font` + Tailwind v4 wiring: `@theme` vs `@theme inline`

`font.variable` is a **CSS-module className** whose body defines the custom property (verified: `.playfair_display_…__variable{--font-playfair:"Playfair Display", "Playfair Display Fallback"}`). So `--font-playfair` only exists on the subtree carrying that class.

With plain `@theme`, Tailwind emits `--font-display: var(--font-playfair)` at `:root` and the utility becomes `font-family: var(--font-display)`. That indirection breaks when the font class is **not** on `:root` — `[CITED: tailwindcss.com/docs/theme]` gives the exact failure:
```html
<div id="parent" style="--font-sans: var(--font-inter, sans-serif);">
  <div id="child" style="--font-inter: Inter; font-family: var(--font-sans);">
    This text will use the sans-serif font, not Inter.
  </div>
</div>
```
> "Using the `inline` option, the utility class will use the theme variable _value_ instead of referencing the actual theme variable."

**Therefore: font tokens go in `@theme inline`, static values go in plain `@theme`.** Verified difference in emitted CSS:
```css
/* @theme inline  → value inlined into the utility (correct for next/font) */
.font-display{font-family:var(--font-playfair), ui-serif, Georgia, serif}

/* @theme (plain) → utility points at the theme token (fragile here) */
.font-display{font-family:var(--font-display)}
```
This also matches the official Next.js Tailwind example, which uses `@theme inline` `[CITED: nextjs.org/docs/app/api-reference/components/font]`.

Related font-wiring mistakes:
- Forgetting `${playfair.variable}` on `<html>` → utilities resolve to nothing and you silently get `ui-serif`. **Check the rendered `<html class>` first when fonts look wrong.**
- Putting the variable classes on a nested `<div>` instead of `<html>`/`<body>`.
- Naming the token `--font-playfair` in `@theme` directly: that would generate a `font-playfair` utility whose value is the *font-family string*, colliding with next/font's own var of the same name. Keep next/font vars (`--font-playfair`) and theme tokens (`--font-display`) as distinct names.
- Defining palette colors as `var()` indirection in plain `@theme` → opacity modifiers (`bg-cream/70`, `ring-ink/5`) lose their static fallback. Keep literal hex.

### P5 — Fresh-scaffold breakers on Next 16.3.5

| Issue | Detail |
|-------|--------|
| **Do not upgrade TypeScript** | `npm view typescript version` → **`7.0.2`**. The scaffold specifies `^5` and resolves `5.9.3`, which is what `eslint-config-next@16.3.5` and the `next` TS plugin are tested against. `npm i -D typescript@latest` pulls the TS 7 native port. Leave `^5`. |
| **ESLint 9, not 10** | Install emits `npm warn deprecated eslint@9.39.5: This version is no longer supported.` `npm view eslint version` → `10.10.0`, but the scaffold's `eslint.config.mjs` imports `eslint-config-next/core-web-vitals` and `eslint-config-next/typescript`, pinned to the v9 flat-config shape. **Ignore the warning; do not bump to 10.** |
| **`LayoutProps<"/">` is a global** | The generated `layout.tsx` types children as `{ children }: LayoutProps<"/">` — a Next 16 typed-routes global from `.next/types`. It is *not* importable. Requires `".next/types/**/*.ts"` and `".next/dev/types/**/*.ts"` in `tsconfig.include` (the scaffold has them). Copy-pasting that signature into a project that deleted those globs fails to typecheck. `{ children }: { children: React.ReactNode }` is the portable fallback. |
| **`.next/types` must exist before typecheck** | Build logs `Generating route types...` before TS runs. A bare `npx tsc --noEmit` in CI **before** `next build` can fail on missing globals. Order CI as `next build` then lint, or run `next typegen` first. |
| **Scaffold writes `CLAUDE.md`** | `--agents-md` defaults on and emits `AGENTS.md` **plus** a `CLAUDE.md` containing only `@AGENTS.md`. It will overwrite/conflict with a project `CLAUDE.md`. Pass `--no-agents-md` (verified). |
| **`--yes` reuses saved preferences** | `create-next-app` persists choices across runs. `--yes` alone can silently produce `src/`, Biome, or JS. Pass every flag explicitly, or `--reset` first. |
| **Turbopack is the default builder** | Output reads `▲ Next.js 16.3.5 (Turbopack)`. Any custom webpack config in `next.config.ts` is ignored unless you opt out. You need none. |
| **`next lint` is gone** | The script is `"lint": "eslint"`. `next lint` was removed in 16. |

### P6 — Animation performance and UX anti-patterns for this design

- **Do not animate `filter: blur()` on scroll.** The aurora layer uses a *static* `blur-3xl` and animates only `y`/`opacity`. Animating blur repaints a full-screen surface every frame.
- **`once: true` on every reveal.** Re-animating on scroll-up reads as a rendering bug on a marketing page.
- **Never put `initial={{ opacity: 0 }}` on the hero headline without a reveal that is guaranteed to fire.** If JS fails or is slow, above-the-fold content stays invisible. Hero copy should be visible in the SSR HTML; reserve `opacity: 0` starts for below-the-fold sections.
- **`overflow-hidden` + `isolate`** on every section containing a parallax layer, or negative-inset aurora graphics create horizontal scrollbars.
- **`aria-hidden` on all decorative SVG/gradient layers**, and `pointer-events-none` so they never eat clicks on the pricing CTA.
- **Avoid a smooth-scroll library.** `scroll-behavior: smooth` in CSS covers anchor navigation. Lenis (`1.3.26`) hijacks native scroll, fights `useScroll`, and degrades accessibility. Only add it if the design review explicitly demands inertial scrolling.

---

## Package Legitimacy Audit

All checks run this session via `npm view` and the npm downloads API.

| Package | Registry | Created | Downloads/wk | Source Repo | Verdict | Disposition |
|---------|----------|---------|--------------|-------------|---------|-------------|
| `next` | npm | 2011-07-11 | 43,416,095 | github.com/vercel/next.js | OK | Approved |
| `react` | npm | 2011-10-26 | 128,119,130 | github.com/react/react | OK | Approved |
| `react-dom` | npm | 2014-05-06 | 120,650,097 | github.com/react/react | OK | Approved |
| `tailwindcss` | npm | 2017-10-06 | 92,659,855 | github.com/tailwindlabs/tailwindcss | OK | Approved |
| `@tailwindcss/postcss` | npm | 2024-02-02 | 27,907,840 | github.com/tailwindlabs/tailwindcss | OK | Approved |
| `motion` | npm | 2013-12-26 | 15,428,930 | github.com/motiondivision/motion | OK | Approved |
| `clsx` | npm | 2018-12-24 | 87,550,818 | github.com/lukeed/clsx | OK | Approved (optional) |
| `tailwind-merge` | npm | 2021-07-18 | 60,114,053 | github.com/dcastil/tailwind-merge | OK | Approved (optional) |
| `lenis` | npm | 2023-04-03 | 1,100,438 | github.com/darkroomengineering/lenis | OK | **Not recommended** — see P6 |

**Packages removed due to [SLOP] verdict:** none
**Packages flagged as suspicious [SUS]:** none

All nine resolve on the npm registry, are years old, carry 1M+ weekly downloads, and declare a public source repository. `next`, `react`, `react-dom`, `tailwindcss`, `@tailwindcss/postcss` and `motion` were additionally installed and built successfully this session.

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Playfair Display / DM Sans is the closest free Google Fonts match to the design's serif + geometric sans | §3 | Aesthetic only — swap the two loader calls; all token wiring is unaffected |
| A2 | The pastel hex values (`--color-blush` etc.) approximate the design's palette | §2 | Cosmetic — replace the hex literals in `@theme`; keep them literal (P4) |
| A3 | The audio-player section needs local React state and so must be `"use client"` | P1 | If it is a pure static mockup, drop `"use client"` and save the JS |
| A4 | `MotionConfig reducedMotion="user"` drops transform animations while preserving opacity | §4d | The `"always" \| "never" \| "user"` union is verified from `framer-motion/dist/index.d.ts:208`; the *behaviour* of `"user"` is from training knowledge, not this session's docs. The per-component `useReducedMotion` branching in `Reveal`/`AuroraParallax` is independently verified and is the load-bearing mechanism. |

---

## Sources

**Primary (HIGH — executed this session)**
- `npm view` for every version claim (outputs quoted verbatim)
- `create-next-app@latest --help` (quoted verbatim)
- A real scaffold at `…/scratchpad/probe`: `npx tsc --noEmit` exit 0, `next build` `✓ Compiled successfully`, `○ / (Static)`
- Emitted production CSS (`.next/static/chunks/*.css`) and prerendered HTML (`.next/server/app/index.html`)
- `node_modules/motion/package.json` export map; `motion-dom/.../reduced-motion/state.mjs`; `framer-motion/dist/index.d.ts:208`; `next/dist/shared/lib/get-img-props.d.ts:23,28`
- Deliberate negative test: `motion/react` in a Server Component (error text quoted verbatim)

**Secondary (MEDIUM — official docs)**
- nextjs.org/docs/app/api-reference/components/image (doc version banner: `16.3.5`, lastUpdated 2026-08-25)
- nextjs.org/docs/app/api-reference/components/font (doc version banner: `16.3.5`)
- tailwindcss.com/docs/theme
- motion.dev/docs/react-scroll-animations, motion.dev/docs/react-use-reduced-motion

---

## Locked Stack

Runtime dependencies:

```bash
npm install next@16.3.5 react@19.2.8 react-dom@19.2.8 motion@13.2.0
```

Dev dependencies:

```bash
npm install -D tailwindcss@4.3.3 @tailwindcss/postcss@4.3.3 \
  typescript@^5 @types/node@^20 @types/react@^19 @types/react-dom@^19 \
  eslint@^9 eslint-config-next@16.3.5
```

Resulting `package.json` (the only edit versus a clean scaffold is the `motion` line):

```json
{
  "dependencies": {
    "next": "16.3.5",
    "react": "19.2.8",
    "react-dom": "19.2.8",
    "motion": "^13.2.0"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "16.3.5",
    "tailwindcss": "^4",
    "typescript": "^5"
  }
}
```

| Package | Specifier | Why exactly this |
|---------|-----------|-----------------|
| `next` | `16.3.5` | `latest` dist-tag, verified |
| `react` / `react-dom` | `19.2.8` | Next 16.3.5's tested pairing — **not** npm-latest `19.3.0` |
| `motion` | `^13.2.0` | Framer Motion successor; import from `motion/react` and `motion/react-client` |
| `tailwindcss` / `@tailwindcss/postcss` | `^4` → `4.3.3` | Must match each other. Never `tailwindcss@next` (stale `4.0.0`) |
| `typescript` | `^5` → `5.9.3` | **Do not bump to `7.0.2`** |
| `eslint` | `^9` → `9.39.5` | **Do not bump to `10.10.0`**; deprecation warning is expected |
| `eslint-config-next` | `16.3.5` | Exact-pinned to `next` |

**Explicitly rejected:** `framer-motion` (redundant with `motion`), `autoprefixer` + `postcss-import` (built into v4), `tailwind.config.js` (does not exist in v4), `lenis` (fights `useScroll`), `gsap` / `@react-spring/web` / `aos` (Motion covers every requirement), `next-themes` (no dark mode in scope), `sharp` (bundled with Next 16), `clsx` + `tailwind-merge` (add only if a component grows genuine variant logic).
