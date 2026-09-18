import type { NextConfig } from "next";

/**
 * The six URLs the site shipped before locales existed. Each 308s to its
 * `/en-GB/…` counterpart.
 *
 * Six literal sources, all known at build time — no regex and no negative
 * lookahead, so there is no way for this table to swallow `/zh-Hans/…` or
 * `/_next/…`. Redirects run before filesystem routes, so they still fire even
 * though nothing is served at `/how-it-works` any more.
 *
 * Deliberately redirects rather than rewrites. A rewrite over statically
 * prerendered pages is a documented cause of `usePathname()` hydration
 * mismatch, and this site's header scroll-spy is built entirely on
 * `usePathname()`.
 */
const LEGACY_PATHS = [
  "/",
  "/how-it-works",
  "/the-r3-experience",
  "/plans",
  "/trust-and-approach",
  "/about",
] as const;

const nextConfig: NextConfig = {
  experimental: {
    /**
     * The root layout now lives under a top-level dynamic segment, which is
     * one of the two cases the framework names as requiring a global 404 —
     * there is no longer a layout at `app/` to compose one from.
     */
    globalNotFound: true,
  },

  async redirects() {
    return LEGACY_PATHS.map((source) => ({
      source,
      destination: source === "/" ? "/en-GB" : `/en-GB${source}`,
      permanent: true,
    }));
  },
};

export default nextConfig;
