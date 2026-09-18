/**
 * The single source of truth for navigation, shared by the header, the
 * scroll-spy and the standalone section routes.
 *
 * Routing is hybrid: `/` renders the whole eight-section narrative and the
 * nav uses in-page anchors, while every nav destination is *also* a real
 * route rendering that section on its own. Both readings are supported
 * because the deck argues for both — pages 1-3 carry a "SCROLL TO EXPLORE"
 * affordance, but pages 6 and 7 show an active underline under a nav label.
 *
 * Nav labels are matched to sections by the deck's own eyebrow text rather
 * than by guesswork:
 *
 *   How It Works      -> "RECOGNISE YOUR MOMENT"  (Moments)
 *   The R³ Experience -> "THE R³ RECHARGE LOOP"   (R³ Loop)
 *   Plans             -> "FREE TRIAL & PLANS"     (Plans)
 *   Trust & Approach  -> "TRUST & APPROACH"       (Trust)
 *   About             -> "MORE CONNECTED"         (Connected)
 *
 * The Rhythm section has no nav entry — it belongs to the scroll narrative
 * and to `/about`, which covers what Recharge is and how it adapts.
 */

import { DEFAULT_LOCALE, isLocale, type Locale } from "@/lib/i18n/config";

export const SECTION_IDS = {
  hero: "hero",
  moments: "moments",
  r3Loop: "r3-loop",
  connected: "connected",
  rhythm: "rhythm",
  trust: "trust",
  plans: "plans",
  start: "start",
} as const;

export type SectionId = (typeof SECTION_IDS)[keyof typeof SECTION_IDS];

export type NavItem = {
  /**
   * The English label, kept as a **fallback only**.
   *
   * The label a reader sees comes from `chrome.nav.items[sectionId]` in the
   * message catalogue, keyed by the `sectionId` this item already carries —
   * so no parallel ordering has to be maintained and no field is added here.
   * This literal stays because `Footer` and `Header` both read it through
   * `?? item.label`, which renders the English word rather than an empty link
   * if a catalogue key is ever dropped.
   */
  label: string;
  /** In-page target, used on `/`. */
  anchor: string;
  /** Standalone route for this destination. */
  href: string;
  /** Section this nav item highlights while scrolling `/`. */
  sectionId: SectionId;
};

export const NAV_ITEMS: readonly NavItem[] = [
  {
    label: "How It Works",
    anchor: `#${SECTION_IDS.moments}`,
    href: "/how-it-works",
    sectionId: SECTION_IDS.moments,
  },
  {
    label: "The R³ Experience",
    anchor: `#${SECTION_IDS.r3Loop}`,
    href: "/the-r3-experience",
    sectionId: SECTION_IDS.r3Loop,
  },
  {
    label: "Plans",
    anchor: `#${SECTION_IDS.plans}`,
    href: "/plans",
    sectionId: SECTION_IDS.plans,
  },
  {
    label: "Trust & Approach",
    anchor: `#${SECTION_IDS.trust}`,
    href: "/trust-and-approach",
    sectionId: SECTION_IDS.trust,
  },
  {
    label: "About",
    anchor: `#${SECTION_IDS.connected}`,
    href: "/about",
    sectionId: SECTION_IDS.connected,
  },
] as const;

/** Every section id the scroll-spy should observe, in document order. */
export const SPY_SECTION_IDS: readonly SectionId[] = [
  SECTION_IDS.hero,
  SECTION_IDS.moments,
  SECTION_IDS.r3Loop,
  SECTION_IDS.connected,
  SECTION_IDS.rhythm,
  SECTION_IDS.trust,
  SECTION_IDS.plans,
  SECTION_IDS.start,
];

/*
 * The `CTA` constant that used to live here is gone. It held four strings —
 * `Try Recharge Free`, `Sign In`, `See How It Works` and the trial meta —
 * which now live at `common.cta` in the catalogue, where a translator can
 * reach them. Verified with a grep before removal: nothing imports it.
 *
 * It is deliberately not left behind as a deprecated alias. A module named
 * `nav.ts` exporting ready-made English copy is precisely what the next
 * person reaches for instead of the catalogue, and the result compiles,
 * renders and ships untranslated in all three locales without a warning.
 * This file is structure now: ids, anchors, slugs and the locale split.
 */

/**
 * Splits a locale-prefixed pathname into its locale and its route.
 *
 * Every URL now starts with a locale segment (`/en-GB`, `/zh-Hant/plans`),
 * so any comparison against a bare literal — `pathname === "/"`, or
 * `pathname === item.href` where `href` is `"/plans"` — is permanently false.
 * That failure is silent: types stay happy, the build stays green, and the
 * only symptom is chrome state that never activates. It shipped once already
 * as a scroll-spy that never mounted its IntersectionObserver.
 *
 * Route slugs are English in every locale, so this is a pure segment strip
 * with no lookup table: `NAV_ITEMS[].href` stays a literal and is prefixed
 * with `localePath` at render time.
 *
 *   splitLocalePath("/en-GB")           -> { locale: "en-GB", route: "/" }
 *   splitLocalePath("/zh-Hant/plans")   -> { locale: "zh-Hant", route: "/plans" }
 *   splitLocalePath("/plans")           -> { locale: "en-GB", route: "/plans" }
 *
 * The unprefixed fallback covers the frames before hydration settles and
 * `global-not-found`, which renders outside the `[locale]` segment and so has
 * no locale in its path at all.
 */
export function splitLocalePath(pathname: string): { locale: Locale; route: string } {
  const segments = pathname.split("/");
  const candidate = segments[1];

  if (!isLocale(candidate)) {
    return { locale: DEFAULT_LOCALE, route: normaliseRoute(pathname) };
  }

  return { locale: candidate, route: normaliseRoute(`/${segments.slice(2).join("/")}`) };
}

/** Collapses `""` and a trailing slash to the canonical `"/"`-rooted form. */
function normaliseRoute(route: string): string {
  if (route === "" || route === "/") return "/";
  return route.endsWith("/") ? route.slice(0, -1) : route;
}
