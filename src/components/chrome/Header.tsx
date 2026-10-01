"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { localePath } from "@/lib/i18n/config";
import { useMessages } from "@/lib/i18n/MessagesProvider";
import { NAV_ITEMS, SPY_SECTION_IDS, splitLocalePath, type SectionId } from "@/lib/nav";

import { LanguageSwitcher } from "./LanguageSwitcher";
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
 * graph bundles **all six** locales into the browser chunk, with no error,
 * no warning, and a site that still works perfectly in every language.
 * ---------------------------------------------------------------------------
 */
/**
 * Locales whose translated header nav labels overflow the bar at `xl` (1280px)
 * and so defer the horizontal nav to a wider breakpoint, staying on the burger
 * until then. Every other locale clears `xl`, so only these two pay for their
 * longer copy rather than the whole site dropping to a later breakpoint.
 *
 * Malay is the binding case and the threshold is measured, not guessed. With
 * the quick-008 pack its nav runs 598px at `gap-9` (582 at the `gap-8` used
 * below `2xl`); against a 223px logo and the 469px flag-form CTA cluster inside
 * a 1280-80 track that needs ~1354px, so the nav is deferred to 1400px. The
 * quick-006 pack needed 1600px — this pack shortened `Kepercayaan & Pendekatan`
 * to `Pendekatan Kami` and `Tentang Kami` to `Tentang`, which bought ~220px.
 * Re-measure if either label grows again.
 */
const WIDE_NAV_LOCALES = new Set(["ms-MY", "id-ID"]);

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

  // Wide-label locales defer the horizontal nav to `min-[1400px]`; every other
  // locale keeps the original `xl` (1280px) breakpoint. Written as whole-literal
  // classes so Tailwind emits both variants (see WIDE_NAV_LOCALES above).
  const wideNav = WIDE_NAV_LOCALES.has(locale);
  const navShow = wideNav ? "min-[1400px]:block" : "xl:block";
  const clusterShow = wideNav ? "min-[1400px]:flex" : "xl:flex";
  const barHide = wideNav ? "min-[1400px]:hidden" : "xl:hidden";

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

        {/*
          The horizontal nav appears at `xl` (1280px) for most locales; Malay
          and Indonesian defer it to 1400px (see WIDE_NAV_LOCALES), because their
          labels still overflow the `xl` track and wrap to two lines against the
          wordmark. Below the breakpoint the burger sheet carries the links, and
          the language switcher rides in the bar beside the burger (see the
          mobile controls below), so nothing is lost.
        */}
        <nav aria-label={nav.landmarkMain} className={cn("hidden", navShow)}>
          {/*
            `gap-8` until `2xl`, then `gap-9`. At `xl` (1280px) — where this nav
            first appears for the non-wide locales — the bar has 1200px of track
            for the 223px logo, this nav and the CTA cluster, and the tighter
            `gap-8` is what lets English clear it; `gap-9` returns at `2xl` where
            the design's intended rhythm has room. The wide locales only show the
            nav from 1600px, comfortably inside the `gap-9` band.
          */}
          <ul className="flex items-center gap-8 2xl:gap-9">
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

        <div className={cn("hidden items-center gap-6", clusterShow)}>
          {/* Sits with the CTA cluster rather than in the nav list: it is not
              a destination in the site's story, it is a control over how the
              story is read — the same category as Sign In. */}
          <LanguageSwitcher />
          <Button href={localePath(locale, "/sign-in")} variant="outline" size="sm">
            {cta.signIn}
          </Button>
          <Button href={localePath(locale, "/plans")} variant="primary" size="sm">
            {cta.tryFree}
          </Button>
        </div>

        {/*
          Bar controls shown until the horizontal nav takes over (`xl`, or 1600px
          for the wide-label locales). The language switcher sits OUT HERE beside
          the burger, not only inside the sheet: a reader who has landed in a
          script they cannot read must be able to change it without first
          discovering that the way out is hidden behind a burger. It is the same
          disclosure control the desktop bar uses.
        */}
        <div className={cn("flex items-center gap-1.5", barHide)}>
          <LanguageSwitcher />
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? nav.closeMenu : nav.openMenu}
            className="-mr-2 inline-flex size-11 items-center justify-center rounded-full text-ink-800 transition-colors duration-150 hover:bg-white/60"
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
      </div>

      {menuOpen && (
        <div
          id="mobile-nav"
          className={cn("border-t border-hairline-faint bg-white/95 backdrop-blur-xl", barHide)}
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
