import type { NextConfig } from "next";

/**
 * THE `redirects()` TABLE THAT USED TO LIVE HERE IS GONE ON PURPOSE. DO NOT
 * PUT IT BACK.
 *
 * It held six literal sources — `/`, `/how-it-works`, `/the-r3-experience`,
 * `/plans`, `/trust-and-approach`, `/about` — each 308ing to its `/en-GB/…`
 * counterpart. `src/proxy.ts` now owns exactly those paths, redirecting the
 * same URLs to a *negotiated* locale instead of a hardcoded English one.
 *
 * Two reasons it had to be removed rather than left alongside the proxy:
 *
 * 1. IT WOULD HAVE WON, SILENTLY AND ALWAYS. The routing chain is ordered, and
 *    `redirects` from `next.config.js` is step 2 while Proxy is step 3
 *    (`node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md`,
 *    "Execution order"). A `redirects()` entry for `/` fires before the proxy
 *    is ever consulted, so the negotiation could not run at all — not "runs
 *    and loses", never runs. The only symptom would be that locale detection
 *    appeared to be broken for every visitor on earth, with nothing in the
 *    proxy to debug, because it was never invoked. The framework's own
 *    redirects reference points at this split: locales in `next.config`
 *    redirects work "only as hardcoded paths", and "for dynamic or per-request
 *    locale handling, use dynamic route segments and proxy".
 *
 * 2. THEY WERE PERMANENT, AND PERMANENT MEANS PERMANENT. `permanent: true`
 *    emits a 308, which "instructs clients/search engines to cache the
 *    redirect forever" (`…/05-config/01-next-config-js/redirects.md`). Every
 *    browser that has already followed one is holding `/ → /en-GB` with no
 *    expiry, and will keep short-circuiting to English without ever asking the
 *    server again. Those clients cannot be reached from here by any change to
 *    this file; they age out when the user clears site data, and that is the
 *    entire remedy available. This is why `src/proxy.ts` returns a 307 and
 *    says so in a twenty-line comment — a header-dependent destination must
 *    never be cacheable, and this table is the worked example of what it costs
 *    when it is.
 *
 * The old table's own defence — six literal sources, no regex, so it could not
 * swallow `/zh-Hans/…` or `/_next/…` — still holds, and is now the proxy's
 * `config.matcher` problem instead. That is where the negative lookahead and
 * its reasoning live.
 *
 * Also worth keeping from the old note, because it constrains the replacement:
 * this path redirects rather than rewrites, deliberately. A rewrite over
 * statically prerendered pages is a documented cause of `usePathname()`
 * hydration mismatch, and this site's header scroll-spy is built entirely on
 * `usePathname()`.
 */

const nextConfig: NextConfig = {
  experimental: {
    /**
     * The root layout now lives under a top-level dynamic segment, which is
     * one of the two cases the framework names as requiring a global 404 —
     * there is no longer a layout at `app/` to compose one from.
     */
    globalNotFound: true,
  },
};

export default nextConfig;
