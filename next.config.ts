import type { NextConfig } from "next";

/**
 * THIS SITE IS A STATIC EXPORT. THERE IS NO SERVER ANYWHERE IN IT.
 *
 * `output: "export"` writes `out/` as plain HTML, CSS and JS, and that directory is
 * uploaded verbatim to Firebase Hosting's CDN (`firebase.json`, site `recharge-main`).
 * Nothing in this project runs per-request. That is a deliberate choice — see
 * `.planning/quick/quick-kayinleong-005/CLAIM.md` — and it is load-bearing for everything
 * below.
 *
 * ---------------------------------------------------------------------------
 * DO NOT ADD A `redirects()` TABLE HERE. IT WILL NOT RUN.
 *
 * This file used to own six redirects — `/`, `/how-it-works`, `/the-r3-experience`,
 * `/plans`, `/trust-and-approach`, `/about`, each sending a locale-less URL to its
 * `/en-GB/…` counterpart. They were removed once, when `src/proxy.ts` took the paths over,
 * and they must not come back now that the proxy is gone, because **`redirects` is on the
 * unsupported list for static export**
 * (`node_modules/next/dist/docs/01-app/02-guides/static-exports.md`). It is a server
 * feature; with no server it is not an error, it is simply never consulted. The symptom
 * would be six dead entries in this file and a bare domain that 404s in production while
 * working perfectly in `next dev`.
 *
 * Those six paths are now owned by `firebase.json` → `hosting.redirects`, which is the only
 * layer left that can answer them. Edit them there.
 * ---------------------------------------------------------------------------
 *
 * `src/proxy.ts` IS GONE, AND CANNOT COME BACK WITHOUT UNDOING `output: "export"`.
 *
 * Proxy is also on that unsupported list, and unlike `redirects` it does not fail quietly —
 * the export build refuses to run while the file exists. It held the locale negotiation
 * from claim 004 (cookie → IP country → `Accept-Language` → default). What replaced it is a
 * fixed redirect to `en-GB`, so the bare domain no longer adapts to the visitor at all.
 * `src/lib/i18n/negotiate.ts` is kept, unwired, so that decision is one file away from being
 * reversible; its header explains how.
 */

const nextConfig: NextConfig = {
  output: "export",

  /**
   * `next/image`'s default loader optimises on demand, which is a server doing work per
   * request — the one thing this config has just removed. Static export therefore requires
   * this flag, and the build fails without it rather than silently shipping broken images.
   *
   * The cost is real but small here: the six `<Image>` call sites now serve the source file
   * as-is, and the largest of those (`public/images/hero-sunrise.jpg`) is 231 KB. `width`,
   * `height` and `sizes` still do their job — layout stability and `srcset` selection are
   * unaffected; only the resizing and the WebP/AVIF rewrite are lost.
   */
  images: {
    unoptimized: true,
  },

  experimental: {
    /**
     * The root layout lives under a top-level dynamic segment, which is one of the two cases
     * the framework names as requiring a global 404 — there is no longer a layout at `app/`
     * to compose one from. Under export this becomes `out/404.html`, which is exactly the
     * file Firebase Hosting serves for an unmatched path, so the two conventions line up
     * without any `errorPage` config.
     */
    globalNotFound: true,
  },
};

export default nextConfig;
