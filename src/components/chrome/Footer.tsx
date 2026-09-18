import Link from "next/link";

import { localePath } from "@/lib/i18n/config";
import { getDictionary, getLocale } from "@/lib/i18n/dictionaries";
import { interpolate } from "@/lib/i18n/format";
import { NAV_ITEMS, type SectionId } from "@/lib/nav";

import { Logo } from "./Logo";

/**
 * Site footer.
 *
 * NOT IN THE DESIGN DECK. All eight deck pages end at their own content, with
 * no footer anywhere. It is added here because the product carries a
 * "not diagnosis, treatment or cure" disclaimer, and shipping a
 * health-adjacent site with nowhere for that statement — or for privacy and
 * terms — to live would be a real gap rather than a faithful omission.
 *
 * Deliberately restrained, and every string is either lifted from the deck or
 * unavoidable boilerplate. Nothing here invents product copy: the disclaimer
 * is the trust strip's own wording, and the link labels reuse the nav.
 *
 * ---------------------------------------------------------------------------
 * REFERENCE MIGRATION — this is the worked example for the rest of the site.
 *
 * 1. **Server Components read the catalogue directly.** The component becomes
 *    `async` and calls `getDictionary()` with no argument; the locale comes
 *    from the root route parameter, so nothing is prop-drilled. Zero bytes of
 *    catalogue reach the browser.
 *
 *    A Client Component must NOT do this. It receives an already-selected
 *    slice through `<MessagesProvider>` and reads it with `useMessages()`. A
 *    static catalogue import from any `"use client"` file bundles all three
 *    locales into the browser chunk with no error and no warning.
 *
 * 2. **Every internal href is locale-prefixed** with `localePath(locale, …)`.
 *    Route slugs stay English in every locale, so this is a string prefix and
 *    never a lookup that can miss.
 *
 * 3. **Nav labels are keyed by `sectionId`**, the identifier `NAV_ITEMS`
 *    already carries, so the catalogue needs no parallel ordering and
 *    `src/lib/nav.ts` needs no new field. `?? item.label` keeps the existing
 *    literal as a visible fallback rather than rendering an empty link.
 *
 * 4. **Interpolation is explicit.** `{year}` is substituted by `interpolate`,
 *    not by concatenating around the catalogue string — a translated
 *    copyright line may well put the year somewhere else in the sentence.
 * ---------------------------------------------------------------------------
 */
export async function Footer() {
  const locale = await getLocale();
  const m = await getDictionary();

  const navLabels: Partial<Record<SectionId, string>> = m.chrome.nav.items;

  return (
    <footer className="border-t border-hairline-faint">
      <div className="mx-auto w-full max-w-[1200px] px-6 py-14 sm:px-8 lg:max-w-[1232px] lg:px-10">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-sm">
            <Link
              href={localePath(locale, "/")}
              aria-label={m.common.brand.homeLabel}
              className="inline-block rounded-lg"
            >
              <Logo />
            </Link>
            {/* The medical disclaimer lives once, at `common.disclaimer.medical`,
                and is read directly by every site that shows it — here and in
                `TrustStrip`. It is legal copy: do not reword it locally. */}
            <p className="text-body-sm mt-5 text-ink-500">{m.common.disclaimer.medical}</p>
          </div>

          <nav aria-label={m.chrome.nav.landmarkFooter} className="lg:pt-3">
            <ul className="grid grid-cols-2 gap-x-10 gap-y-3 sm:grid-cols-3 lg:flex lg:gap-9">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={localePath(locale, item.href)}
                    className="text-body-sm text-ink-600 transition-colors duration-150 ease-soft hover:text-blue-ink"
                  >
                    {navLabels[item.sectionId] ?? item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-hairline-faint pt-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-meta text-ink-500">
            {interpolate(m.chrome.footer.copyright, { year: new Date().getFullYear() })}
          </p>
          <ul className="text-meta flex gap-6 text-ink-500">
            <li>
              <Link
                href={localePath(locale, "/privacy")}
                className="transition-colors duration-150 hover:text-blue-ink"
              >
                {m.chrome.footer.privacy}
              </Link>
            </li>
            <li>
              <Link
                href={localePath(locale, "/terms")}
                className="transition-colors duration-150 hover:text-blue-ink"
              >
                {m.chrome.footer.terms}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
