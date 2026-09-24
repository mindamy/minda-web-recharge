/**
 * Locale-aware metadata helper.
 *
 * Every route under `app/[locale]` builds its `<title>`, description,
 * canonical URL and `hreflang` set through `localisedMetadata`, so the six
 * pages cannot drift apart and no page can forget its alternates.
 *
 * Two hard constraints from the framework are encoded here:
 *
 *  1. A segment may export `metadata` **or** `generateMetadata`, never both.
 *     Every route in this app therefore exports `generateMetadata`.
 *  2. A relative path in a URL-based metadata field without a configured
 *     `metadataBase` is a **build error**, not a warning. `alternates` is
 *     written relative, so `metadataBase` is set on every object this helper
 *     produces rather than relied upon by inheritance.
 *
 * Resolving the locale from `next/root-params` is not dynamic behaviour, so
 * the metadata stays in the prerendered HTML.
 */

import type { Metadata } from "next";

import { LOCALES, localePath } from "./config";
import { getDictionary, getLocale } from "./dictionaries";

/**
 * The origin used to absolutise `alternates`.
 *
 * TODO(deploy): set `NEXT_PUBLIC_SITE_URL` to the real origin. The fallback
 * exists so the build is not blocked before a domain is chosen; shipping it
 * would publish `hreflang` links to a domain nobody owns.
 */
export const SITE_URL = new URL(
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://recharge.example.com",
);

/**
 * `path` is the locale-less route path: `"/"`, `"/plans"`, `"/about"`.
 * The locale prefix is added for the canonical and for each alternate.
 */
export async function localisedMetadata({
  title,
  description,
  path,
}: {
  title?: string;
  description?: string;
  path: string;
}): Promise<Metadata> {
  const locale = await getLocale();

  return {
    ...(title === undefined ? {} : { title }),
    ...(description === undefined ? {} : { description }),
    metadataBase: SITE_URL,
    alternates: {
      canonical: localePath(locale, path),
      languages: {
        ...Object.fromEntries(
          LOCALES.map((candidate) => [candidate, localePath(candidate, path)]),
        ),
        /*
         * `x-default` became load-bearing the moment `src/middleware.ts`
         * started redirecting locale-less URLs to a negotiated locale.
         *
         * It names the URL to send a reader whose language none of the seven
         * alternates matches, and it is the *unprefixed* path on purpose —
         * the one URL that runs detection. Pointing it at `/en-GB` instead
         * would advertise English as the universal fallback and defeat the
         * detection for exactly the readers it is meant to help.
         *
         * Not folded into the `LOCALES` map above, because it is not a
         * locale: it is a hreflang keyword, and `Locale` must not grow a
         * member that has no catalogue, no route and no entry in the
         * switcher.
         */
        "x-default": path === "/" || path === "" ? "/" : path,
      },
    },
  };
}

/**
 * Metadata for one of the six content routes, read from the `meta` namespace.
 *
 * The key is the route's own catalogue key, so a route added without a `meta`
 * entry fails to compile rather than shipping an untitled page.
 */
export async function routeMetadata(
  key: "about" | "howItWorks" | "plans" | "theR3Experience" | "trustAndApproach",
  path: string,
): Promise<Metadata> {
  const messages = await getDictionary();
  const meta = messages.meta[key];

  return localisedMetadata({ title: meta.title, description: meta.description, path });
}
