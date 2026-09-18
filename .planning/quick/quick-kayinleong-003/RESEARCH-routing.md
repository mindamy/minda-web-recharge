# RESEARCH — i18n Routing (Next.js 16.3.5 App Router)

**Claim:** `quick-kayinleong-003`
**Researched:** 2026-09-18
**Confidence:** HIGH for Next.js API claims (read from `node_modules/next/dist/docs/` in this session), MEDIUM for deployment/SEO judgement calls.

All paths below are relative to `node_modules/next/dist/docs/` unless they start with `src/`.
Every Next.js API claim cites a file and line range I opened this session. Nothing here is from training memory; where I could not verify something, it is in `## Uncertainties`.

---

## Recommendation

1. **Use `app/[locale]/` as a root dynamic segment + `next/root-params`.** There is no built-in App Router i18n config. The `i18n` key in `next.config.js` is Pages-Router-only and its App Router replacement is explicitly "no longer necessary" — you build it yourself. `next/root-params` (new in **v16.3.0**, i.e. three patch releases before the installed 16.3.5) is the sanctioned way to read the locale anywhere on the server without prop drilling.
2. **Choose option (b): prefix every locale, including English.** `/en-GB/...`, `/zh-Hans/...`, `/zh-Hant/...`. Option (a) is achievable but requires a rewrite, and a rewrite over statically prerendered pages is a **documented** cause of `usePathname()` hydration mismatch — and `src/components/chrome/Header.tsx` is built entirely on `usePathname()`. Option (a) would silently kill the scroll-spy.
3. **Recover the old URLs with a 6-entry `redirects()` table in `next.config.ts`**, not a rewrite. `/`, `/how-it-works`, `/the-r3-experience`, `/plans`, `/trust-and-approach`, `/about` each 308 to their `/en-GB/...` counterpart. Redirects run *before* filesystem routes, are statically analysed at build, and need no `proxy.ts`. This gives option (b) most of option (a)'s link-preservation benefit at zero hydration risk.
4. **Ship no `proxy.ts` at all in v1.** Accept-Language negotiation is a nice-to-have; a hard `/` → `/en-GB` redirect covers the same ground without putting a Node.js function in front of every request. If negotiation is wanted later, add a `proxy.ts` whose `matcher` is **only** `'/'` — never a broad matcher, which would reintroduce pitfall #1 on the six prerendered pages.
5. **Keep all 18 routes static** (3 locales × 6 pages) with a single `generateStaticParams` in `app/[locale]/layout.tsx` returning the three locales. Add `export const dynamicParams = false` so `/fr/plans` 404s at the router instead of being rendered on demand.
6. **Add no i18n dependency.** Next's own docs ship the whole recipe. `next-intl@4.14.5` is genuinely compatible, but it drags `@swc/core`, `@parcel/watcher` and an ICU toolchain in for 60–120 strings with no plurals, dates or numbers. Hand-rolled is ~100 lines you own, and it buys **compile-time** missing-key detection that the library cannot give for free.
7. **Message access: server reads, client receives.** Server Components call `getDictionary()` (zero bytes to the browser). Client Components **never import the catalogue** — a server parent passes a narrow, already-selected slice down as a serializable prop via a `<MessagesProvider>`. Importing a catalogue barrel from a `"use client"` file bundles **all three locales** into the browser chunk with no warning.
8. **Keep route slugs in English across all locales.** `/zh-Hant/how-it-works`. This makes the language switcher a pure string swap on the first path segment — no map, no per-locale `generateStaticParams`, no 404 when a slug translation is missing mid-switch.
9. **`<html lang={await locale()}>`** using `next/root-params`, and convert the `metadata` object in `src/app/layout.tsx` to `generateMetadata()`. You cannot export both from the same segment. Set `metadataBase` or relative `alternates` will **fail the build**.
10. **Enable `globalNotFound` and add `app/global-not-found.tsx`.** Moving the root layout under `[locale]` is one of the two cases the docs name as requiring it. It bypasses the layout, so `globals.css` and both fonts must be re-imported there or the 404 renders unstyled.

---

## 1. Supported i18n routing mechanism in Next.js 16.3.5

### The `next.config` `i18n` key is Pages-Router-only — confirmed

The `i18n` config key is documented **only** under `02-pages/`. There is no `i18n` key documented anywhere under `01-app/`, and no `i18n.md` in the App Router config reference (`01-app/03-api-reference/05-config/01-next-config-js/` — full listing read this session, no such file).

`02-pages/02-guides/internationalization.md:14`:

> "Next.js has built-in support for internationalized ([i18n](…)) routing since `v10.0.0`. You can provide a list of locales, the default locale, and domain-specific locales and Next.js will automatically handle the routing."

The App Router migration guide states the removal explicitly — `01-app/02-guides/migrating/app-router-migration.md:509`:

> "The `locale`, `locales`, `defaultLocales`, `domainLocales` values have been removed because built-in i18n Next.js features are no longer necessary in the `app` directory."

Corroborating evidence that the whole i18n-config surface is Pages-only:

- `01-app/03-api-reference/05-config/01-next-config-js/rewrites.md:423-427` — the "Rewrites with i18n support" section is wrapped in a `<PagesOnly>` tag.
- `01-app/03-api-reference/02-components/link.md:55-68` — the prop table containing `locale` is inside `<PagesOnly>`, and `link.md:397-414` shows the example with `filename="pages/index.tsx"`. **`<Link locale="…">` does not exist in the App Router.**

`[VERIFIED: 01-app/02-guides/migrating/app-router-migration.md:509; 02-pages/02-guides/internationalization.md:14; 01-app/03-api-reference/02-components/link.md:55-68]`

### The supported path: `[lang]`/`[locale]` dynamic segment

`01-app/02-guides/internationalization.md:74`:

> "Finally, ensure all special files inside `app/` are nested under `app/[lang]`. This enables the Next.js router to dynamically handle different locales in the route, and forward the `lang` parameter to every layout and page."

Middleware/proxy is presented as the way to *redirect* an unprefixed request to a prefixed one, not as the routing mechanism itself — `internationalization.md:37`:

> "Routing can be internationalized by either the sub-path (`/fr/products`) or domain (`my-site.fr/products`). With this information, you can now redirect the user based on the locale inside [Proxy]."

The guide's own proxy example (`internationalization.md:47-71`) returns `NextResponse.redirect`, not a rewrite.

### `middleware.ts` is deprecated — it is `proxy.ts` in v16

This is a breaking change from training-data-era Next.js and it matters for every code example anyone writes here.

`01-app/03-api-reference/03-file-conventions/middleware.md:11`:

> "The `middleware.js` file convention has been **deprecated** in Next.js 16 and renamed to [`proxy.js`]."

`01-app/01-getting-started/16-proxy.md:15`:

> "Starting with Next.js 16, Middleware is now called Proxy to better reflect its purpose. The functionality remains the same."

`01-app/02-guides/upgrading/version-16.md:614-616`:

> "The `middleware` filename is deprecated, and has been renamed to `proxy` to clarify network boundary and routing focus.
> The `edge` runtime is **NOT** supported in `proxy`. The `proxy` runtime is `nodejs`, and it cannot be configured."

Convention (`16-proxy.md:35`): `proxy.ts` at the project root **or inside `src/`** — for this repo that is `src/proxy.ts`, same level as `src/app`.

`[VERIFIED: 01-app/03-api-reference/03-file-conventions/middleware.md:11; 01-app/01-getting-started/16-proxy.md:15,35; 01-app/02-guides/upgrading/version-16.md:614-616]`

### `next/root-params` — new in v16.3.0, and the biggest win here

This API did not exist before the version installed in this repo. Version table, `01-app/03-api-reference/04-functions/next-root-params.md:426`:

| Version | Changes |
| --- | --- |
| `v16.3.0` | `next/root-params` introduced. |

`next-root-params.md:14-18`:

> "The `next/root-params` module provides getter functions for accessing root-level parameters in **Server Components**. Each root parameter is exported as an async function that resolves to the parameter value for the current route.
> The export names are generated from your dynamic segment folder names. For example, if your root layout is inside `app/[locale]`, you import `locale` from `next/root-params`."

So with `app/[locale]/layout.tsx`, the import is literally `import { locale } from 'next/root-params'`.

Also removed in v16 — `01-app/02-guides/upgrading/version-16.md:1246-1248`:

> "The `unstable_rootParams` function has been removed. Use [`next/root-params`] instead."

`[VERIFIED: 01-app/03-api-reference/04-functions/next-root-params.md:14-18,426; 01-app/02-guides/upgrading/version-16.md:1246-1248]`

---

## 2. Default-locale URL strategy — recommend (b), everything prefixed

### What each option actually costs

**Option (a) — English unprefixed at `/`.** Two implementations exist, both real:

- *a1: `next.config.ts` rewrites.* `{ source: '/', destination: '/en-GB' }` plus one entry per section route. Rewrites "act as a URL proxy and mask the destination path, making it appear the user hasn't changed their location" (`rewrites.md:13`) and "are applied to client-side routing" (`rewrites.md:37`). No `proxy.ts` needed, statically analysed at build.
- *a2: `proxy.ts` rewrite.* Same effect, runtime cost, and unsupported on static export.

**Option (a) does keep static prerendering.** The prerendered artefacts are still `/en-GB/...`; the rewrite only changes which URL serves them. Execution order (`proxy.md:238-246`) places rewrites/proxy at steps 3–4 and "Filesystem routes (`public/`, `_next/static/`, `pages/`, `app/`, etc.)" at step 5 — the prerendered HTML is still what gets served. `[ASSUMED — inference from documented execution order; the docs nowhere state a rewrite de-optimises a prerendered route, and nowhere state it preserves it either.]`

### Why option (a) is nonetheless the wrong call for *this* codebase

The docs flag exactly one hazard for the a1/a2 pattern, and this repo walks straight into it.

`01-app/03-api-reference/04-functions/use-pathname.md:37`:

> "If your page is being statically prerendered and your app has [rewrites] in `next.config` or a [Proxy] file, reading the pathname with `usePathname()` can result in hydration mismatch errors, because the initial value comes from the server and may not match the actual browser pathname after routing."

And `use-pathname.md:117`:

> "When a page is prerendered, the HTML is generated for the source pathname. If the page is then reached through a rewrite using `next.config` or `Proxy`, the browser URL may differ, and `usePathname()` will read the rewritten pathname on the client."

`src/components/chrome/Header.tsx:29-30` is:

```tsx
const pathname = usePathname();
const isHome = pathname === "/";
```

Under option (a), the server prerenders `/en-GB` → `isHome === false` → no `IntersectionObserver` scroll-spy. The browser then reads `/` → `isHome === true`. That is the hydration mismatch, and its user-visible symptom is that the header's active underline behaves inconsistently on the one page the whole scrolling narrative lives on. It compiles, it builds, it ships.

The documented mitigation (`use-pathname.md:119`) is:

> "design the UI so that only a small, isolated part depends on the client pathname. Render a stable fallback on the server and update that part after mount."

For `Header.tsx` that means deferring the entire nav's active state to `useEffect`, which is a visible flicker on every page load on a design-led marketing site. Not worth it.

### Recommendation: (b) + a redirect table

Prefix everything. Then recover every existing URL with `redirects()` in `next.config.ts`:

```ts
// next.config.ts
const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/", destination: "/en-GB", permanent: true },
      { source: "/how-it-works", destination: "/en-GB/how-it-works", permanent: true },
      { source: "/the-r3-experience", destination: "/en-GB/the-r3-experience", permanent: true },
      { source: "/plans", destination: "/en-GB/plans", permanent: true },
      { source: "/trust-and-approach", destination: "/en-GB/trust-and-approach", permanent: true },
      { source: "/about", destination: "/en-GB/about", permanent: true },
    ];
  },
};
```

Six literal sources, all known at build time — no regex, no negative-lookahead, no risk of swallowing `/zh-Hans/...` or `/_next/...`. Redirects run at step 2 of the execution order, before proxy and before filesystem routes (`proxy.md:240-246`), so they fire even though no route exists at `/how-it-works` any more.

**Trade-off being accepted:** the canonical English URL becomes `/en-GB/plans`, not `/plans`. Old links survive as permanent redirects, which transfers link equity, but they are no longer the canonical form. On a site whose public launch is the thing being built, that is a cheap price for uniform code and zero hydration risk. If the canonical-English requirement is a hard business constraint, revisit — but then budget for the `Header.tsx` rework and a deferred-active-state flicker.

**Static prerendering under (b): fully preserved.** No rewrite, no proxy, no request-time work. 18 prerendered HTML files.

---

## 3. Does static prerendering survive? Yes.

### Mechanism

`01-app/02-guides/internationalization.md:254-256`:

> "To generate static routes for a given set of locales, we can use `generateStaticParams` with any page or layout. This can be global, for example, in the root layout"

with the example at `internationalization.md:258-272`:

```tsx
// app/[lang]/layout.tsx
export async function generateStaticParams() {
  return [{ lang: 'en-US' }, { lang: 'de' }]
}

export default async function RootLayout({ children, params }: LayoutProps<'/[lang]'>) {
  return (
    <html lang={(await params).lang}>
      <body>{children}</body>
    </html>
  )
}
```

`generateStaticParams` is confirmed valid on a **layout**, not only a page — `01-app/03-api-reference/04-functions/generate-static-params.md:8-12` lists Pages, Layouts and Route Handlers. One declaration in `app/[locale]/layout.tsx` therefore covers all six pages × three locales.

`[VERIFIED: 01-app/02-guides/internationalization.md:254-272; 01-app/03-api-reference/04-functions/generate-static-params.md:6-12]`

### Add `dynamicParams = false`

Default behaviour is permissive. `01-app/03-api-reference/03-file-conventions/02-route-segment-config/dynamicParams.md:17-18`:

> "- **`true`** (default): Dynamic route segments not included in `generateStaticParams` are generated at request time.
> - **`false`**: Dynamic route segments not included in `generateStaticParams` will return a 404."

Left at the default, `/fr/plans` or `/zh/plans` renders on demand rather than 404ing — which silently converts a static site into one with a request-time render path. Set `export const dynamicParams = false` on `app/[locale]/layout.tsx`.

Belt-and-braces, keep the docs' `hasLocale` guard too (`internationalization.md:153`):

> "Since `lang` is typed as `string`, using `hasLocale` narrows the type to your supported locales. It also ensures a 404 is returned if a translation is missing, rather than a runtime error."

Note `dynamicParams` "is not available when [Cache Components] is enabled" (`dynamicParams.md:22`). Cache Components is not enabled in `next.config.ts` (read this session — the config is empty apart from the type annotation), so this is fine. If anyone turns on `cacheComponents` later, `generateStaticParams` becomes *mandatory* for root params: "A `generateStaticParams` function is only required with [Cache Components], where each root parameter must have at least one value or the build fails" (`next-root-params.md:54`).

`[VERIFIED: .../dynamicParams.md:17-22; 01-app/02-guides/internationalization.md:153; 01-app/03-api-reference/04-functions/next-root-params.md:54]`

### Middleware/proxy interaction

Under the recommendation there is **no proxy file**, so the question is moot for v1. For completeness, if one is added later:

- Proxy defaults to the **Node.js runtime** and "The `runtime` config option is not available in Proxy files. Setting the `runtime` config option in Proxy will throw an error." (`proxy.md:253-255`). The edge runtime is *not* supported (`version-16.md:616`).
- "Without a `matcher`, Proxy runs on **every request**, including static files (`_next/static`), image optimizations (`_next/image`), and assets in the `public/` folder." (`proxy.md:75`).
- Static export is not supported: `self-hosting.md:31` — "Since it requires access to the incoming request, it is not supported when using a [static export]." The platform-support table at `proxy.md:759-765` lists Static export → **No**.
- The docs contain no statement that a proxy file de-optimises prerendered routes. The execution-order list (`proxy.md:238-246`) has proxy at step 3 and filesystem routes at step 5, which implies prerendered HTML is still served. This is an inference, not a citation. `[ASSUMED]`

`[VERIFIED: 01-app/03-api-reference/03-file-conventions/proxy.md:75,238-246,253-255,759-765; 01-app/02-guides/self-hosting.md:31]`

---

## 4. Library vs hand-rolled — recommend **no dependency**

### `next-intl` is compatible, and that is not the question

```
$ npm view next-intl version peerDependencies dependencies time.modified
version = '4.14.5'
peerDependencies = {
  next:  '^12.0.0 || ^13.0.0 || ^14.0.0 || ^15.0.0 || ^16.0.0',
  react: '^16.8.0 || ^17.0.0 || ^18.0.0 || >=19.0.0-rc <19.0.0 || ^19.0.0'
}
time.modified = '2026-09-14T09:32:38.971Z'
```

`next@16.3.5` satisfies `^16.0.0` and `react@19.2.8` satisfies `^19.0.0`. Actively maintained (published four days ago), 5.2M weekly downloads, real repo at `github.com/amannn/next-intl`. **Compatibility is confirmed — it is the cost/benefit that fails.**

Its runtime dependency closure:

```
use-intl, @swc/core (~1.16.0), icu-minify, negotiator, @eloqnt/config,
@parcel/watcher (^2.4.1), @eloqnt/format-po, @eloqnt/format-json,
@formatjs/intl-localematcher, next-intl-swc-plugin-extractor
```

That is a native-binary-bearing compiler toolchain (`@swc/core`, `@parcel/watcher`) and a full ICU message formatter. Against the actual requirement: **60–120 strings, no pluralisation, no date/number formatting, no runtime locale fetching, all-static output.** Every capability being paid for is unused.

`[VERIFIED: npm registry — npm view next-intl, run this session]`

### Alternatives considered

| Package | Verdict | Note |
| --- | --- | --- |
| `next-intl` | Compatible but over-specified | See above. Would be the right answer if plurals/dates/ICU were needed. |
| `next-international` | **Reject** | Real package, 77k/wk, but last published `2024-10-31` — predates Next 16 entirely. No evidence of App-Router-16 / `next/root-params` support. |
| `paraglide-js` | **Do not install** | The npm name `paraglide-js` resolves to a package whose `repository` is `npm/security-holder` — a placeholder, not the real project. The genuine package is scoped `@inlang/paraglide-js`. Installing the bare name is a slopsquat hazard. |

### Next.js ships the hand-rolled recipe itself

`01-app/02-guides/internationalization.md:122-136` is the complete loader, and `:191-210` is the `root-params` version. Verbatim from `:205-209`:

```ts
export const getDictionary = async () => {
  const locale = await lang()
  if (!hasLocale(locale)) notFound()
  return dictionaries[locale]()
}
```

And the bundle-size guarantee, `internationalization.md:183`:

> "Because all layouts and pages in the `app/` directory default to [Server Components], we do not need to worry about the size of the translation files affecting our client-side JavaScript bundle size. This code will **only run on the server**, and only the resulting HTML will be sent to the browser."

### Concrete cost of hand-rolling, for this site

| Artefact | Lines | What it does |
| --- | --- | --- |
| `src/messages/{en-GB,zh-Hans,zh-Hant}.json` | — | The catalogues. Would exist under any option. |
| `src/lib/i18n.ts` | ~30 | `LOCALES` tuple, `Locale` type, `hasLocale` guard, dynamic-import map, `getDictionary()` reading `locale()` from root-params. |
| `src/lib/i18n.ts` types | ~5 | `type Messages = typeof enGB` as canonical shape; `zh-Hans.json` / `zh-Hant.json` imported `satisfies Messages`. **A missing key becomes a `tsc --noEmit` error.** |
| `src/components/i18n/MessagesProvider.tsx` | ~25 | `"use client"` context + `useMessages()` for the client slice. |
| `src/components/chrome/LocaleSwitcher.tsx` | ~35 | The dropdown. Needed under every option including next-intl. |

≈ 95 lines of owned code, versus a dependency tree with native binaries. The typed-`t()` question resolves itself: you do not need a `t("a.b.c")` string-path accessor at all. Dotted-path accessors are the *reason* runtime libraries exist. With plain nested objects you write `m.hero.headline` and TypeScript checks it structurally — better ergonomics *and* better safety than `t()`.

**Recommendation: add no dependency.** Revisit only if plurals, relative dates, or a translation-management-system integration land in scope.

---

## 5. Server vs Client components — the critical implementation detail

### What is `"use client"` today

Verified by `grep -rl '"use client"' src/` this session — ten files:

```
src/components/aurora/AuroraField.tsx
src/components/chrome/Header.tsx
src/components/motion/ImageReveal.tsx
src/components/motion/MotionProvider.tsx
src/components/motion/ParallaxLayer.tsx
src/components/motion/Reveal.tsx
src/components/motion/ScrollProgress.tsx
src/components/sections/Connected.tsx
src/components/sections/connected/ScatterField.tsx
src/components/sections/r3/LoopArcs.tsx
```

Of these, only **`Header.tsx`** and **`Connected.tsx`** plausibly render user-facing copy. The five `motion/*` files and `AuroraField`/`ScatterField`/`LoopArcs` are behaviour and graphics wrappers — they take `children` and animate them. **That distinction is the whole solution.**

### Server side

`next/root-params` is Server-Component-only, enforced at build. `next-root-params.md:49`:

> "`next/root-params` can be used in Server Components. It cannot be used in Client Components, Server Actions, or [Route Handlers]. Support for Route Handlers is planned for a future release."

and `:369-373`:

```tsx
// This will cause a build error
'use client'
import { lang } from 'next/root-params' // Error: Cannot import in Client Component
```

`:196`:

> "You do not need to add `import 'server-only'` to files that use `next/root-params`. The import already fails at build time if used in a Client Component."

So `src/lib/i18n.ts` importing `locale` from `next/root-params` is **self-guarding** — any accidental client import is a build error, not a silent regression. That is a strong argument for the root-params form over passing `params` around.

Server Components then just call `getDictionary()` with no arguments (`internationalization.md:232-240`). Section components (`Hero`, `Moments`, `R3Loop`, `Rhythm`, `Trust`, `Plans`, `Start`) are all Server Components and can each call it directly — the dynamic `import()` resolves once per render.

### Client side — the trap and the fix

**The trap.** A `"use client"` file that does `import { messages } from "@/messages"` where that barrel statically imports all three JSONs will cause the bundler to emit **all three locales into the browser chunk**. No error, no warning. The site works perfectly in every locale and ships 3× the copy. This is precisely the compile-and-break class this repo has a history of.

**The fix — pass a selected slice as a prop.** `01-app/02-guides/server-and-client-boundary.md:160`:

> "**Data** crosses through props, and it must be [serializable], so functions like event handlers cannot cross."

and `:168`:

> "A rendered React element can cross the boundary because it is serializable data. Passing rendered output as `children` lets a Server Component nest inside a Client Component without importing the Server Component's code into the client graph."

That second sentence is the cleanest route for the `motion/*` wrappers: `<Reveal>` never needs a string — the server parent renders the copy and passes it as `children`. No change to those five files at all.

For `Header.tsx` and `Connected.tsx`, which genuinely need strings inside client logic, mount a provider in the **server** layout:

```tsx
// src/app/[locale]/layout.tsx  — Server Component
import { getDictionary } from "@/lib/i18n";
import { locale as getLocale } from "next/root-params";

export default async function RootLayout({ children }: LayoutProps<"/[locale]">) {
  const lang = await getLocale();
  const m = await getDictionary();
  return (
    <html lang={lang} className={`${playfair.variable} ${outfit.variable}`}>
      <body>
        <MessagesProvider messages={m.client}>   {/* ← client slice ONLY */}
          <MotionProvider>
            <ScrollProgress />
            <Header />
            {children}
            <Footer />
          </MotionProvider>
        </MessagesProvider>
      </body>
    </html>
  );
}
```

**Structure the catalogue with an explicit `client` namespace.** Each locale JSON gets a top-level `client` key holding only what `Header` / `Connected` actually render (nav labels, CTA copy, switcher labels), and everything else sits outside it. Then:

- `m.client` is the *only* thing that crosses the boundary.
- It is one locale, never three.
- Its size is auditable by looking at one JSON key, not by reading a bundle report.

**One thing to be explicit about with the planner:** anything passed as a prop to a Client Component is serialized into the RSC flight payload embedded in the HTML. It ships over the wire. So `m.client` should stay genuinely small — roughly the 15–20 nav/CTA strings, not the section prose. The bulk of the 60–120 strings should never appear in it.

`[VERIFIED: 01-app/02-guides/server-and-client-boundary.md:160,168; 01-app/03-api-reference/04-functions/next-root-params.md:49,196,369-373; 01-app/02-guides/internationalization.md:183,232-240]`

---

## 6. Language switcher route mapping — keep slugs in English

### Recommendation

Keep `/zh-Hant/how-it-works`. Do not translate route segments.

### The switcher then becomes trivial

`usePathname()` returns the full pathname including the locale prefix — `use-pathname.md:59-66` gives the return table (`/blog/hello-world` → `'/blog/hello-world'`). Under option (b) the prefix is always present, so:

```tsx
"use client";
const pathname = usePathname();                 // "/zh-Hant/how-it-works"
const rest = pathname.split("/").slice(2).join("/");  // "how-it-works"
const href = `/${nextLocale}${rest ? `/${rest}` : ""}`;
```

No lookup table, no reverse map, no failure mode. `useParams()` is the alternative read (`use-params.md:5-20`) and returns `{ locale: "zh-Hant" }` — useful for marking the current item selected, but `usePathname` is what you need for the destination.

Note this is only safe because option (b) guarantees the prefix is always there. Under option (a) the switcher would need to special-case "no prefix means en-GB" *and* would be reading a rewritten pathname — a second reason (a) loses.

### What translated slugs would cost

- A `[section]` dynamic segment replacing five literal route folders, plus a bidirectional slug↔canonical map per locale.
- `generateStaticParams` on that segment returning 3 × 5 = 15 pairs instead of the layout's flat 3.
- The switcher must consult the map: current slug → canonical section → target-locale slug. If any locale is missing an entry, the switcher navigates the user to a 404 **from a working page** — the worst possible failure for a language switcher.
- `NAV_ITEMS[].href` in `src/lib/nav.ts:52-84` is currently a single literal per item and would have to become per-locale or be derived through the map. That file is deliberately "the single source of truth for navigation" (`src/lib/nav.ts:1-3`); routing it through a translation map is a real complexity increase in the one file the header, the scroll-spy and the section routes all share.

### Why English slugs are defensible here

Chinese-language SEO for keyword-bearing URL slugs matters for content sites competing on search. This is a six-page product marketing site whose discovery path is almost certainly direct/paid/referral. The `hreflang` annotations (see §7) already tell search engines that `/zh-Hant/plans` is the Chinese counterpart of `/en-GB/plans` — the slug language is not what establishes that relationship.

**If the decision is later reversed**, do it with a `[section]` segment plus a map that is exhaustive by type (`Record<Locale, Record<SectionKey, string>>`), so a missing translation is a compile error rather than a runtime 404.

`[VERIFIED: 01-app/03-api-reference/04-functions/use-pathname.md:59-66; 01-app/03-api-reference/04-functions/use-params.md:5-20; src/lib/nav.ts:1-3,52-84]`

---

## 7. `lang` attribute and metadata

### `<html lang>`

Current state — `src/app/layout.tsx:48`:

```tsx
<html lang="en" className={`${playfair.variable} ${outfit.variable}`}>
```

The docs give the exact replacement. `next-root-params.md:20-29`:

```tsx
import { lang } from 'next/root-params'

export default async function RootLayout(props: LayoutProps<'/[lang]'>) {
  return (
    <html lang={await lang()}>
      <body>{props.children}</body>
    </html>
  )
}
```

The `await params` form also works (`internationalization.md:263-272`), but root-params is preferable because the same getter is reused by `getDictionary()` and by `generateMetadata`.

**`en-GB`, `zh-Hans` and `zh-Hant` are valid BCP-47 tags and valid `lang` attribute values as-is**, so the URL segment value *is* the `lang` value with no mapping layer. That is a good reason to use exactly these strings as the segment values rather than `en`/`cn`/`tw`.

**Constraint to respect** — `next-root-params.md:48`:

> "Root parameter names must be valid JavaScript function identifiers. Kebab-cased segment names (e.g. `[post-slug]`) are not supported and will cause an error at dev time or during build."

This governs the **segment name** (`[locale]` — fine), not the runtime values. `zh-Hans` as a *value* is unaffected.

Also note the root layout signature changes: `LayoutProps<"/">` → `LayoutProps<"/[locale]">`, and the component must become `async`. Types are generated by `next dev` / `next build` / `next typegen` (`next-root-params.md:50`; `layout.md:109`). The repo's `typecheck` script already runs `next typegen && tsc --noEmit`, so this is covered.

### `metadata` → `generateMetadata`

Current state — `src/app/layout.tsx:37-44` exports a static `metadata` object with a `title.template` and `description`.

Hard rule, `generate-metadata.md:111`:

> "You cannot export both the `metadata` object and `generateMetadata` function from the same route segment."

So it is a conversion, not an addition. `generate-metadata.md:110`:

> "The `metadata` object and `generateMetadata` function exports are **only supported in Server Components**."

And on staticness, `generate-metadata.md:~44`:

> "Resolving `generateMetadata` is part of rendering the page. If the page can be prerendered and `generateMetadata` doesn't introduce dynamic behavior, the resulting metadata is included in the page's initial HTML."

Reading the locale via `next/root-params` is not dynamic behaviour, so the metadata stays in the prerendered HTML.

### `alternates` / `hreflang` — supported

`generate-metadata.md:397-418`:

```jsx
export const metadata = {
  metadataBase: new URL('https://acme.com'),
  alternates: {
    canonical: '/',
    languages: { 'en-US': '/en-US', 'de-DE': '/de-DE' },
  },
}
```

emitting:

```html
<link rel="canonical" href="https://acme.com" />
<link rel="alternate" hreflang="en-US" href="https://acme.com/en-US" />
<link rel="alternate" hreflang="de-DE" href="https://acme.com/de-DE" />
```

Full field reference at `generate-metadata.md:823-857`.

**Build-breaking caveat**, `generate-metadata.md:428`:

> "Using a relative path in a URL-based `metadata` field without configuring a `metadataBase` will cause a build error."

`src/app/layout.tsx` currently sets **no `metadataBase`**. Adding relative `alternates` without adding `metadataBase` first will fail `npm run build`. Loud, not silent — but it will block the executor, so plan it as one task.

### Sitemap

`01-app/03-api-reference/03-file-conventions/01-metadata/sitemap.md:216-249` supports per-entry `alternates.languages`:

```ts
{
  url: 'https://acme.com/about',
  lastModified: new Date(),
  alternates: { languages: { es: 'https://acme.com/es/about', de: 'https://acme.com/de/about' } },
}
```

The repo has no `sitemap.ts` today (verified — `find src -type f` this session lists none). Adding one is optional for this claim but is the natural place to enumerate 18 URLs with their alternates.

`[VERIFIED: 01-app/03-api-reference/04-functions/generate-metadata.md:110,111,397-418,428,823-857; 01-app/03-api-reference/04-functions/next-root-params.md:20-29,48,50; 01-app/03-api-reference/03-file-conventions/layout.md:109; 01-app/03-api-reference/03-file-conventions/01-metadata/sitemap.md:216-249; src/app/layout.tsx:37-48]`

---

## Pitfalls

Ordered by how silently they fail.

### P1 — `usePathname()` + rewrite = hydration mismatch (option (a) only)

Covered in §2. `use-pathname.md:37,117`. `Header.tsx:29-30` is the victim. **This is the single reason option (a) is rejected.** If anyone reintroduces a broad-matcher `proxy.ts` or a `rewrites()` entry covering the section routes, this comes back.

### P2 — Header active-state comparisons break silently under prefixing

`src/components/chrome/Header.tsx:30`:
```tsx
const isHome = pathname === "/";
```
Under option (b), `pathname` is `/en-GB` and this is **permanently `false`**. The `useEffect` at `Header.tsx:~57` early-returns (`if (!isHome) return;`), the `IntersectionObserver` never mounts, and the scroll-spy underline never lights on the main narrative page. TypeScript is perfectly happy. The build is green. A human has to scroll the homepage to notice.

Same class: `NAV_ITEMS[].href` values in `src/lib/nav.ts:52-84` are literals like `"/how-it-works"`. Any `pathname === item.href` comparison silently stops matching. The comparison must become locale-aware (strip the first segment) **and** `NAV_ITEMS` hrefs must be prefixed at render time.

**Verification step for the plan:** load `/en-GB`, scroll, assert the active underline moves.

### P3 — Importing a catalogue from a `"use client"` file bundles all three locales

Covered in §5. No error, no warning, 3× the copy in the browser chunk. **Verification:** after implementation, grep every `"use client"` file for imports from `@/messages` or `@/lib/i18n`; there should be zero. `next/root-params` self-guards (build error), but a plain JSON import does not.

### P4 — The 404 page breaks in a way the docs specifically predict

`src/app/not-found.tsx` is currently a root-level `not-found.tsx`. `not-found.md:133`:

> "In addition to catching expected `notFound()` errors, the root `app/not-found.js` and `app/global-not-found.js` files handle any unmatched URLs for your whole application."

Move the root layout under `[locale]` and this breaks. `not-found.md:55-58` names the exact situation:

> "`global-not-found.js` is useful when you can't build a 404 page using a combination of `layout.js` and `not-found.js`. This can happen in two cases:
> - Your app has multiple root layouts …
> - **Your root layout is defined using top-level dynamic segments (e.g. `app/[country]/layout.tsx`), which makes composing a consistent 404 page harder.**"

Fix: `globalNotFound: true` in `next.config.ts` (`not-found.md:60-72`) plus `app/global-not-found.tsx`. But note the sting, `not-found.md:51`:

> "The `global-not-found.js` file bypasses your app's normal rendering, which means you'll need to import any global styles, fonts, or other dependencies that your 404 page requires."

So `globals.css`, `Playfair_Display` and `Outfit` must be re-imported inside `global-not-found.tsx` or the branded 404 (`src/app/not-found.tsx:23-47`, which uses `Eyebrow`, `GradText`, `Container`, `Button`) renders in Times New Roman with no Tailwind. It compiles. It builds. It looks broken.

Feature status: experimental, introduced `v15.4.0` (`not-found.md:235`). Also note `not-found.md:187` — Next injects `<meta name="robots" content="noindex">` automatically for 404s.

### P5 — `dynamicParams` defaults to `true`

Covered in §3. Without `export const dynamicParams = false`, `/fr/plans` renders at request time rather than 404ing, quietly adding a server render path to a "fully static" site. `dynamicParams.md:17-18`.

### P6 — Fonts have no CJK glyphs

`src/app/layout.tsx:17-35` loads `Playfair_Display` and `Outfit` with `subsets: ["latin"]`. **Neither font covers Han characters.** Every Chinese string will fall back to whatever the OS supplies, with entirely different metrics, weight and x-height — the typographic argument documented in `layout.tsx:11-30` simply does not apply to `zh-Hans`/`zh-Hant`. The build succeeds, the page renders, and the design is silently gone. This is the sibling typography agent's territory, but it is a **hard dependency of the routing work** — a locale route that renders in a fallback font is not done. Flag it as a cross-agent handoff.

### P7 — `<Link locale="…">` does not exist in the App Router

`link.md:55-68` puts the `locale` prop inside `<PagesOnly>`. Anyone reaching for it from training memory will write `<Link href="/plans" locale="zh-Hans">`, which at best is a TS error and at worst is a silently ignored prop that leaves the user in the wrong locale. Locale switching must build the full `href` string itself (§6).

### P8 — `middleware.ts` will be written from memory

The rename is v16-new (`version-16.md:614`). A file named `middleware.ts` with an exported `middleware` function is deprecated. Codemod available: `npx @next/codemod@canary middleware-to-proxy .` (`middleware.md:18`). Also renamed: `skipMiddlewareUrlNormalize` → `skipProxyUrlNormalize` (`version-16.md:637-643`). Under the recommendation no such file is created — but the planner should say so explicitly so an executor does not add one reflexively.

### P9 — `metadataBase` missing → build error on relative `alternates`

`generate-metadata.md:428`. Loud, but blocking. Add `metadataBase` in the same task as `alternates`.

### P10 — Motion re-initialisation on locale switch

Switching locale is a navigation across a different **root** parameter, so the entire tree below `app/[locale]/layout.tsx` — including `MotionProvider` (`src/components/motion/MotionProvider.tsx:17-23`) and every `Reveal` — remounts. Given this repo's documented history of Motion serialising `opacity: 0` into server HTML, a locale switch is a plausible trigger for a flash-of-invisible-content. **Not verified** — I did not run the app. Add a manual UAT step: switch locale on `/en-GB` mid-scroll and confirm no section stays invisible.

### P11 — `next/root-params` restrictions

`next-root-params.md:376-399`: it throws inside `unstable_cache` (use `"use cache"` instead) and is unsupported in Server Actions. Not relevant to this static site today, but it constrains any future contact form.

---

## Uncertainties

Stated plainly; none of these are papered over.

1. **Whether a `proxy.ts` de-optimises prerendered routes in 16.3.5.** The docs never say either way. My conclusion that it does *not* is an inference from the execution-order list (`proxy.md:238-246`, proxy at step 3, filesystem routes at step 5). `[ASSUMED]`. The recommendation sidesteps this entirely by not shipping a proxy. If a future phase adds one, verify empirically by checking the build output still marks routes as static.

2. **The deployment target is unknown.** I found no `vercel.json`, no Dockerfile, no CI config, and `next.config.ts` sets no `output`. This matters: if the site is ever built with `output: 'export'`, **both** `proxy.ts` (`self-hosting.md:31`, `proxy.md:764`) and `redirects()` stop working, and the `/` → `/en-GB` redirect would have to move to the host (S3/CloudFront/Netlify rules) or a client-side bounce. The recommendation is compatible with `next start`, Docker and Vercel; it is **not** verified against static export. Confirm the target before locking the plan.

3. **I did not run `npm run build`.** I was scoped read-only and a build writes `.next/`. The "9 routes, all static" baseline comes from the task brief, not from my own observation. The claim that the recommendation yields 18 static routes is a projection from the documented behaviour of `generateStaticParams` on a layout, not a measurement.

4. **`next-intl`'s actual App-Router-16 behaviour is unverified.** I confirmed its peer-dependency ranges and dependency list from the npm registry only. I did not read next-intl's own documentation, and I do not know whether it integrates with `next/root-params`, nor whether its `localePrefix: 'as-needed'` mode avoids pitfall P1. Since the recommendation is to add no dependency, this gap is not load-bearing — but if the user overrides and wants `next-intl`, this must be researched before planning.

5. **`next-intl` was flagged `SUS` by the package-legitimacy seam**, reason `too-new` (published 2026-09-14). I read this as a **false positive**: the heuristic keys on last-publish recency, and next-intl ships weekly. Countervailing signals: 5,198,170 weekly downloads, real repository `github.com/amannn/next-intl`, not deprecated, no postinstall script. Recording it because the protocol requires it, not because I think it is a risk.

6. **`paraglide-js` (unscoped) has `repoUrl: "npm/security-holder"`.** I did not verify what the correct scoped name is from an authoritative source — my belief that it is `@inlang/paraglide-js` is from training memory. `[ASSUMED]`. Either way: **do not install the unscoped name.**

7. **`global-not-found.js` is marked experimental** (`not-found.md:47`, introduced `v15.4.0` per `:235`). I have not verified it behaves correctly in 16.3.5 specifically, or how it interacts with `generateStaticParams` on the `[locale]` layout. The fallback if it misbehaves is a per-locale `app/[locale]/not-found.tsx` plus accepting that truly unmatched top-level URLs get the framework default 404. Treat as a `checkpoint:human-verify` in the plan.

8. **Font/CJK (P6) is outside my brief** and belongs to the typography agent. I have flagged it as a blocking dependency of the routing work but have made no recommendation on which CJK face to load or how to scope `subsets`.

9. **SEO impact of moving canonical English from `/` to `/en-GB/`** is a judgement call, not a verified finding. Permanent (308) redirects are the standard mechanism for transferring link equity, but I have no data on this site's current traffic or index status — there may be none at all if it has not launched. If it has launched and ranks, revisit option (a) with the `Header.tsx` rework costed in.

---

## Package Legitimacy Audit

| Package | Registry | Published | Downloads | Source Repo | Verdict | Disposition |
| --- | --- | --- | --- | --- | --- | --- |
| `next-intl` | npm | 2026-09-14 | 5,198,170/wk | github.com/amannn/next-intl | SUS (`too-new`) | **Not adopted** — evaluated and rejected on cost/benefit, not on legitimacy. Verdict assessed as a false positive (see Uncertainty 5). If the user overrides, add a `checkpoint:human-verify` before install. |
| `next-international` | npm | 2024-10-31 | 77,275/wk | github.com/QuiiBz/next-international | OK | **Not adopted** — predates Next 16. |
| `paraglide-js` | npm | 2026-07-31 | 81/wk | `npm/security-holder` | SUS | **REMOVED** — placeholder package, not the real project. Do not install this name. |

**Net recommendation: zero new dependencies.** No install step, therefore no install checkpoint required.

---

## Sources

All Next.js documentation read from `node_modules/next/dist/docs/` in this session (`next@16.3.5`):

- `01-app/02-guides/internationalization.md` — the App Router i18n guide (it exists; lines 1-299 read)
- `01-app/03-api-reference/04-functions/next-root-params.md` — `next/root-params`, introduced v16.3.0
- `01-app/03-api-reference/03-file-conventions/proxy.md` — execution order, matcher, runtime, platform support
- `01-app/03-api-reference/03-file-conventions/middleware.md` — deprecation notice
- `01-app/01-getting-started/16-proxy.md` — proxy convention and rename note
- `01-app/02-guides/upgrading/version-16.md` — middleware→proxy, `unstable_rootParams` removal
- `01-app/03-api-reference/04-functions/use-pathname.md` — **hydration mismatch with rewrites**
- `01-app/03-api-reference/04-functions/use-params.md`
- `01-app/03-api-reference/04-functions/generate-static-params.md`
- `01-app/03-api-reference/03-file-conventions/02-route-segment-config/dynamicParams.md`
- `01-app/03-api-reference/04-functions/generate-metadata.md` — `alternates`, `metadataBase`
- `01-app/03-api-reference/03-file-conventions/not-found.md` — `global-not-found`
- `01-app/03-api-reference/03-file-conventions/layout.md` — `LayoutProps` helper
- `01-app/03-api-reference/02-components/link.md` — `locale` prop is PagesOnly
- `01-app/03-api-reference/05-config/01-next-config-js/rewrites.md`
- `01-app/03-api-reference/05-config/01-next-config-js/typedRoutes.md`
- `01-app/03-api-reference/03-file-conventions/01-metadata/sitemap.md`
- `01-app/02-guides/server-and-client-boundary.md`
- `01-app/02-guides/self-hosting.md`
- `02-pages/02-guides/internationalization.md` — the Pages-only `i18n` config key

Repo files read this session: `AGENTS.md`, `package.json`, `next.config.ts`, `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/not-found.tsx`, `src/lib/nav.ts`, `src/components/chrome/Header.tsx`, `src/components/motion/MotionProvider.tsx`, plus full `find src -type f` and `grep -rl '"use client"' src/`.

Registry: `npm view next-intl version peerDependencies dependencies time.modified`; `gsd-tools query package-legitimacy check --ecosystem npm next-intl next-international paraglide-js`.
