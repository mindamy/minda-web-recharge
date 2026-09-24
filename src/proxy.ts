import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { isLocale, localePath } from "@/lib/i18n/config";
import { LOCALE_COOKIE, countryFromHeaders, negotiateLocale } from "@/lib/i18n/negotiate";

/**
 * Automatic locale selection for visitors who arrive without a locale prefix.
 *
 * Every real URL on this site carries one — `/en-GB/plans`, `/ja-JP`. The 42
 * routes behind them are fully prerendered and stay that way; this file exists
 * only to answer the one question a static export cannot, which is where to
 * send somebody who typed the bare domain.
 *
 * ---------------------------------------------------------------------------
 * THIS FILE IS `proxy.ts`. IT IS NOT `middleware.ts`, AND THAT IS NOT STYLE.
 *
 * Next.js 16 deprecated the `middleware` file convention and renamed it to
 * `proxy` — "All functionality remains the same — only the file and export
 * names have changed"
 * (`node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/middleware.md`).
 *
 * Three consequences, in ascending order of how much time they cost you:
 *
 *   1. A `middleware.ts` would still run, but `next dev` logs a deprecation
 *      on every boot (`next/dist/server/lib/router-utils/setup-dev-bundler.js`).
 *   2. The exported function must be named `proxy`, or be the default export.
 *      A function still called `middleware` inside a file called `proxy.ts` is
 *      explicitly checked for and rejected — `hasValidExport` in
 *      `next/dist/build/analysis/get-page-static-info.js` requires the name to
 *      match the filename convention. It fails the build, and in dev it only
 *      `errorOnce`s, so the symptom is a proxy that silently never runs.
 *   3. Shipping **both** files is a hard throw, not a precedence rule: "Both
 *      middleware file … and proxy file … are detected" (error `E900`, thrown
 *      from both the dev bundler and `next/dist/build/index.js`).
 *
 * So if you are here to "add the middleware back", you are about to break the
 * build. Edit this file instead.
 * ---------------------------------------------------------------------------
 *
 * This is a thin adapter and nothing more. It pulls three inputs off the
 * request, hands them to `negotiateLocale` once, and redirects. The priority
 * between those inputs (cookie → country → Accept-Language → default) lives in
 * `@/lib/i18n/negotiate` and is deliberately not restated, re-ordered or
 * second-guessed here — one copy of that rule, in the module that is unit
 * testable without a request object.
 */

/**
 * `next.config.ts` USED TO OWN THESE PATHS. IT CANNOT ANY MORE.
 *
 * The routing chain is ordered, and `redirects` from `next.config.js` sits at
 * step 2 while Proxy is step 3 (`…/03-file-conventions/proxy.md`, "Execution
 * order"). A `redirects()` entry for `/` therefore fires *before* this file is
 * ever consulted — the negotiation below could never run, and the only symptom
 * would be that every visitor on earth lands on English. That table has been
 * removed; see the comment in `next.config.ts` for the rest of the story.
 */

/**
 * Only the locale-less entry points reach the function below.
 *
 * Read as: every path, except one that starts with `api` or `_next`, except
 * one already prefixed with a supported locale, and except anything
 * containing a dot.
 *
 * The dot clause is doing more work than it looks like. It is what excludes
 * `/favicon.ico`, `/icon.svg`, `/apple-icon.png`, `/robots.txt`,
 * `/sitemap.xml`, everything under `public/images/`, and — because the
 * segment itself begins with one — the whole of `/.well-known/*`. No route on
 * this site contains a dot, so "has a dot" and "is not a page" are the same
 * set here, and one clause covers the lot without a list that rots.
 *
 * THE SEVEN LOCALES ARE HARDCODED HERE AND THAT IS UNAVOIDABLE. The matcher
 * "values need to be constants so they can be statically analyzed at
 * build-time. Dynamic values such as variables will be ignored" (proxy.md,
 * "Matcher") — interpolating `LOCALES` would not fail, it would be *ignored*,
 * which is far worse. Before you go looking for a way to dedupe it: the
 * duplication is safe by construction. This matcher is a performance filter,
 * never a correctness boundary. Forget to add a locale here and its pages
 * merely pay a wasted proxy invocation before `isLocale` returns them
 * untouched — the behaviour is identical, just slower.
 *
 * The correctness boundary is the `isLocale` check in the function body, and
 * it has to stay there for a second reason the matcher cannot help with:
 * "Even when `_next/data` is excluded in a negative matcher pattern, proxy
 * will still be invoked for `_next/data` routes. This is intentional
 * behavior" (proxy.md). The matcher is advisory; the guard is not.
 *
 * Excluding the locale prefixes is the whole point of the optimisation. Those
 * 42 routes are the site — leaving them in would put a proxy invocation in
 * front of every request to an otherwise entirely static app, to accomplish
 * nothing but `NextResponse.next()`.
 */
export const config = {
  matcher: [
    "/((?!api(?:/|$)|_next(?:/|$)|en-GB(?:/|$)|ms-MY(?:/|$)|id-ID(?:/|$)|zh-Hans(?:/|$)|zh-Hant(?:/|$)|zh-HK(?:/|$)|ja-JP(?:/|$)|.*\\.).*)",
  ],
};

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  /**
   * AN EXPLICIT LOCALE ALWAYS WINS. NOTHING BELOW THIS LINE MAY OVERRIDE IT.
   *
   * A reader who asked for `/ja-JP/plans` gets `/ja-JP/plans`, whatever their
   * browser, their IP or their cookie says. Auto-redirecting a URL that
   * already states its locale is the bug that breaks every shared link, every
   * bookmark and every `hreflang` a crawler follows — the Hong Kong page you
   * sent a colleague would silently open in their language, not the one you
   * sent them.
   *
   * The matcher above already filters these out. This is deliberate belt and
   * braces: the matcher is a build-time string, this is the runtime truth,
   * and `_next/data` requests arrive here regardless of what the matcher says.
   */
  const firstSegment = pathname.split("/")[1];
  if (isLocale(firstSegment)) return NextResponse.next();

  /**
   * THE COOKIE IS READ HERE AND IS NEVER WRITTEN HERE.
   *
   * `NEXT_LOCALE` means one specific thing in this codebase: *the visitor
   * picked this in the switcher*. The switcher writes it on click; this file
   * only ever reads it. Setting it on the redirect below would quietly promote
   * a guess to a stated preference — and worse, it would make a shared
   * `/ja-JP` link permanently change the language of everyone who opened it,
   * because the cookie then outranks their own browser settings on every later
   * visit. A detection that cannot be escaped is not a default, it is a trap.
   */
  /*
   * Passed straight through, `null`s and all — `negotiateLocale` documents
   * itself as null-tolerant on every argument, so coercing to `undefined`
   * here would only add noise over a contract that already covers it.
   */
  const { locale, reason } = negotiateLocale({
    cookie: request.cookies.get(LOCALE_COOKIE)?.value,
    acceptLanguage: request.headers.get("accept-language"),
    country: countryFromHeaders(request.headers),
  });

  /**
   * `clone()` rather than a fresh `URL`, so the query string survives the hop:
   * `/plans?plan=essential` lands on `/en-GB/plans?plan=essential`.
   *
   * The fragment is not preserved here and cannot be. `#compare` is never
   * transmitted by the browser, so no server-side redirect has ever seen one —
   * it is reattached by the client to whatever `Location` we return, which is
   * why this costs us nothing. Do not add code that "fixes" the missing hash;
   * there is nothing to fix and nothing to read it from.
   *
   * `localePath` builds the destination so that the `/` → `/en-GB` case (no
   * trailing slash) is handled by the same helper the language switcher uses,
   * rather than by a second `pathname === "/"` special case that can drift.
   */
  const destination = request.nextUrl.clone();
  destination.pathname = localePath(locale, pathname);

  return NextResponse.redirect(destination, {
    /**
     * 307, TEMPORARY, AND NEVER 308 OR 301.
     *
     * This is the single most damaging change anyone can make to this file.
     * The destination is computed from request headers, so it is different for
     * different visitors — and a permanent redirect is, by definition, the
     * promise that it never will be. A browser that follows a 308 from `/`
     * caches it indefinitely: the reader who first arrived on a Japanese
     * laptop can then never reach `/` in any other language again, not by
     * retyping it, not after switching the cookie, not until they manually
     * clear site data. A CDN that caches it does the same thing to everyone
     * behind it at once.
     *
     * `NextResponse.redirect` already defaults to 307, but it is written out
     * because a default is silent and this needs to be arguable in a diff.
     * The previous `next.config.ts` table used `permanent: true`, which is
     * exactly this mistake, already shipped once.
     */
    status: 307,
    headers: {
      /**
       * WHY `no-store` AND NOT JUST `Vary`.
       *
       * `Vary` is the textbook answer and it is not sufficient here, for two
       * independent reasons.
       *
       * First, it is incomplete and cannot be completed. The negotiation also
       * reads the visitor's country, which arrives as an edge-injected header
       * derived from their IP (`countryFromHeaders`). Listing that header in
       * `Vary` would be meaningless to a shared cache upstream of the edge —
       * it never saw the header and cannot key on it. So two visitors with
       * identical `Accept-Language` and no cookie, in Malaysia and in Japan,
       * are indistinguishable to a `Vary`-honouring cache and would be served
       * each other's redirect.
       *
       * Second, `Vary: Accept-Language` is close to worthless in practice even
       * where it is honoured: the header is near-unique per browser, so it
       * either fragments the cache to a one-entry-per-visitor degenerate case
       * or gets dropped by intermediaries that treat it as uncacheable noise.
       *
       * `private, no-store` is the part that actually holds: no shared cache
       * may retain this response at all. `Vary` stays as an accurate
       * description of what the response depends on, for the caches and
       * debugging proxies that do read it, not as the mechanism.
       */
      "Cache-Control": "private, no-store",
      Vary: "Accept-Language, Cookie",

      /**
       * Diagnostic only — which input decided. Free to expose on a response
       * that is already `no-store` and never reaches a cache, and it is the
       * difference between reproducing a "why did this open in Japanese"
       * report in one `curl -I` and not reproducing it at all.
       */
      "x-locale-reason": reason,
    },
  });
}
