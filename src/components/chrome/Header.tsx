"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { localePath } from "@/lib/i18n/config";
import { useMessages } from "@/lib/i18n/MessagesProvider";
import { NAV_ITEMS, SPY_SECTION_IDS, splitLocalePath, type SectionId } from "@/lib/nav";

import { Logo } from "./Logo";
import { NavLabel } from "./NavLabel";

/**
 * Site header.
 *
 * The deck draws the band transparent with no fill, border or shadow, which
 * works because every page starts against the light page ground. Here the
 * header is sticky so the anchor nav stays reachable through a long scroll,
 * so it gains a faint translucent wash once the page has moved — without
 * that, nav labels collide with section content as it passes underneath.
 *
 * Active state has two sources. On the narrative page the whole story is one
 * document, so an IntersectionObserver tracks which section owns the
 * viewport. On a standalone section route there is nothing to observe, so the
 * active item is whichever one matches the route.
 *
 * ---------------------------------------------------------------------------
 * THE ONLY CLIENT COMPONENT IN THE CHROME — and the only one that reads
 * messages through `useMessages()`.
 *
 * It takes the `{ nav, localeSwitcher, cta, brand }` slice that the layout
 * already selected and passed to `<MessagesProvider>`. It must never
 * `import … from "@/messages/…"`: a static catalogue import from the client
 * graph bundles **all three** locales into the browser chunk, with no error,
 * no warning, and a site that still works perfectly in every language.
 * ---------------------------------------------------------------------------
 */
export function Header() {
  const pathname = usePathname();
  const { nav, cta, brand } = useMessages();

  /**
   * ---------------------------------------------------------------------
   * LOCALE-AWARE ROUTE MATCHING.
   *
   * `pathname` is now `/en-GB`, `/zh-Hans/plans`, and so on. Every
   * comparison below was previously against a bare literal:
   *
   *     const isHome = pathname === "/";              // permanently false
   *     const active = pathname === item.href;        // permanently false
   *
   * Both compile, both typecheck, and both build green — `usePathname()`
   * returns `string` and `"/"` is a `string`. The only symptom was chrome
   * that never activated: the scroll-spy effect early-returned on `isHome`,
   * so its IntersectionObserver was never constructed and the underline
   * never lit anywhere on the narrative page, while on a standalone route
   * the active item never matched either.
   *
   * So the locale is stripped once, here, and every comparison downstream is
   * against `route` — the locale-free path that `NAV_ITEMS[].href` is
   * already written in. The locale goes back on at render time through
   * `localePath`, which keeps `nav.ts` free of locale knowledge.
   * ---------------------------------------------------------------------
   */
  const { locale, route } = splitLocalePath(pathname);
  const isHome = route === "/";

  // `chrome.nav.items` is keyed by the five section ids that have nav
  // entries; `SectionId` covers all eight. Widening to a partial record is
  // what lets `hero`, `rhythm` and `start` be looked up without a cast, and
  // `?? item.label` renders the English word rather than an empty link if a
  // catalogue key is ever dropped.
  const navLabels: Partial<Record<SectionId, string>> = nav.items;

  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<SectionId | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  // Close the mobile sheet whenever the route changes. Adjusting state during
  // render is the documented pattern for reacting to a changed input; an
  // effect here would render the stale open sheet for a frame first.
  const [lastPathname, setLastPathname] = useState(pathname);
  if (lastPathname !== pathname) {
    setLastPathname(pathname);
    setMenuOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    // Deferred rather than called inline so the first paint is not a
    // synchronous setState, while a page restored mid-scroll still picks up
    // the wash on its first frame.
    const raf = requestAnimationFrame(onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    if (!isHome) return;

    const elements = SPY_SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    if (elements.length === 0) return;

    // Track every observed section's ratio and pick the most visible one, so
    // scrolling past a short section does not leave the previous item lit.
    const ratios = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          ratios.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
        }
        let best: string | null = null;
        let bestRatio = 0;
        for (const [id, ratio] of ratios) {
          if (ratio > bestRatio) {
            best = id;
            bestRatio = ratio;
          }
        }
        setActiveSection(best as SectionId | null);
      },
      { threshold: [0, 0.15, 0.3, 0.5, 0.75, 1], rootMargin: "-96px 0px -40% 0px" },
    );

    for (const el of elements) observer.observe(el);
    return () => observer.disconnect();
  }, [isHome]);

  // Lock background scroll while the mobile sheet is open.
  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [menuOpen]);

  /** In-page anchor on the narrative page, locale-prefixed route elsewhere. */
  const destination = (anchor: string, href: string) =>
    isHome ? anchor : localePath(locale, href);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-[background-color,backdrop-filter,box-shadow] duration-300 ease-soft",
        scrolled
          ? "bg-white/70 shadow-[0_1px_0_rgb(15_38_72/0.05)] backdrop-blur-xl"
          : "bg-transparent",
      )}
    >
      <div className="mx-auto flex h-20 w-full max-w-none items-center justify-between px-6 sm:px-8 lg:h-28 lg:px-10">
        <Link
          href={localePath(locale, "/")}
          aria-label={brand.homeLabel}
          className="rounded-lg"
        >
          <Logo wordmark={brand.wordmark} />
        </Link>

        <nav aria-label={nav.landmarkMain} className="hidden lg:block">
          <ul className="flex items-center gap-9">
            {NAV_ITEMS.map((item) => {
              const active = isHome
                ? activeSection === item.sectionId
                : route === item.href;
              return (
                <li key={item.href} className="relative">
                  <Link
                    href={destination(item.anchor, item.href)}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "text-nav relative inline-block py-2 transition-colors duration-150 ease-soft",
                      active ? "text-blue-ink" : "text-ink-800 hover:text-blue-ink",
                    )}
                  >
                    <NavLabel label={navLabels[item.sectionId] ?? item.label} />
                    {/*
                      A fixed 52px bar, not a label-width underline. Measured:
                      the `Trust & Approach` label is 123px wide but its bar is
                      only 57px, and `Plans` is 33px with a 51px bar — so
                      `width: 100%` would be wrong in both directions.
                    */}
                    <span
                      aria-hidden
                      className={cn(
                        "pointer-events-none absolute -bottom-1.5 left-1/2 h-0.5 w-13 -translate-x-1/2 rounded-full bg-blue-fill transition-opacity duration-200 ease-soft",
                        active ? "opacity-100" : "opacity-0",
                      )}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="hidden items-center gap-6 lg:flex">
          <Button href={localePath(locale, "/sign-in")} variant="outline" size="sm">
            {cta.signIn}
          </Button>
          <Button href={localePath(locale, "/plans")} variant="primary" size="sm">
            {cta.tryFree}
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          aria-label={menuOpen ? nav.closeMenu : nav.openMenu}
          className="-mr-2 inline-flex size-11 items-center justify-center rounded-full text-ink-800 transition-colors duration-150 hover:bg-white/60 lg:hidden"
        >
          <svg viewBox="0 0 24 24" className="size-6" fill="none" aria-hidden focusable="false">
            {menuOpen ? (
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth={1.6}
                strokeLinecap="round"
              />
            ) : (
              <path
                d="M3.5 7h17M3.5 12h17M3.5 17h17"
                stroke="currentColor"
                strokeWidth={1.6}
                strokeLinecap="round"
              />
            )}
          </svg>
        </button>
      </div>

      {menuOpen && (
        <div
          id="mobile-nav"
          className="border-t border-hairline-faint bg-white/95 backdrop-blur-xl lg:hidden"
        >
          <nav aria-label={nav.landmarkMain} className="px-6 py-6 sm:px-8">
            <ul className="flex flex-col gap-1">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={destination(item.anchor, item.href)}
                    onClick={() => setMenuOpen(false)}
                    className="text-nav block rounded-xl px-3 py-3.5 text-ink-800 transition-colors duration-150 hover:bg-blue-tint-50 hover:text-blue-ink"
                  >
                    <NavLabel label={navLabels[item.sectionId] ?? item.label} />
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-col gap-3">
              <Button
                href={localePath(locale, "/plans")}
                variant="primary"
                size="md"
                className="w-full"
              >
                {cta.tryFree}
              </Button>
              <Button
                href={localePath(locale, "/sign-in")}
                variant="outline"
                size="md"
                className="w-full"
              >
                {cta.signIn}
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
