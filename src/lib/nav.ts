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
  label: string;
  /** In-page target, used on `/`. */
  anchor: string;
  /** Standalone route for this destination. */
  href: string;
  /** Section this nav item highlights while scrolling `/`. */
  sectionId: SectionId;
  /**
   * Renders the `3` of "R³" as a superscript. The deck sets it at roughly
   * 0.62em, raised 0.42em.
   */
  superscript?: boolean;
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
    superscript: true,
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

/** Shared CTA copy, verbatim from the deck. */
export const CTA = {
  tryFree: "Try Recharge Free",
  signIn: "Sign In",
  seeHowItWorks: "See How It Works",
  trialMeta: "7 days · No credit card required",
} as const;
