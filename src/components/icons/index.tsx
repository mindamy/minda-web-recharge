import type { SVGProps } from "react";

/**
 * Shared props for every icon in this set.
 *
 * House style: thin outline icons on a 24x24 viewBox, `stroke="currentColor"`,
 * `strokeWidth={1.6}`, round caps and joins, no fill. Colour is inherited via
 * `currentColor` so callers set it with a Tailwind `text-*` class. Size is the
 * caller's job too — no width/height is set inside the svg.
 *
 * `{...props}` is spread last so callers can override `strokeWidth`, pass a
 * `className`, or re-expose an icon to the a11y tree when it carries meaning.
 */
export type IconProps = SVGProps<SVGSVGElement>;

/* -------------------------------------------------------------------------- */
/* Chrome & navigation                                                        */
/* -------------------------------------------------------------------------- */

export function ChevronDown(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      focusable="false"
      {...props}
    >
      <path d="M5.4 9 12 15.6 18.6 9" />
    </svg>
  );
}

export function ArrowRight(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      focusable="false"
      {...props}
    >
      <path d="M3.4 12h17.2" />
      <path d="M14 5.4 20.6 12 14 18.6" />
    </svg>
  );
}

export function CheckCircle(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      focusable="false"
      {...props}
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M7.9 12.2 11.1 15.4 16.4 9.3" />
    </svg>
  );
}

/**
 * The one filled icon in the set — a bare play triangle, meant to sit inside a
 * filled circle drawn by the caller (hero `See How It Works`, p-3 audio player).
 */
export function PlayTriangle(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      focusable="false"
      {...props}
    >
      <path d="M8.5 5.6 19 12 8.5 18.4Z" fill="currentColor" stroke="none" />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* Speech bubbles — the `Ask Recharge` family                                  */
/* -------------------------------------------------------------------------- */

/** Canonical `Ask Recharge` mark: rounded bubble, tail lower-left, three dots. */
export function SpeechBubbleDots(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      focusable="false"
      {...props}
    >
      <path d="M7.2 18.2A8.4 8.4 0 1 0 4.1 14.2L2.6 20.4Z" />
      <path d="M8.4 11.3h.01" />
      <path d="M12 11.3h.01" />
      <path d="M15.6 11.3h.01" />
    </svg>
  );
}

/** p-2 banner variant: dotted bubble, a second bubble behind it, a sparkle. */
export function SpeechBubbleSparkle(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      focusable="false"
      {...props}
    >
      <path d="M17.1 8A6.4 6.4 0 0 1 19.1 19.4l2.1 2.3-4.3-.5A6.4 6.4 0 0 1 10.9 18.7" />
      <path d="M6.4 15.6A6.6 6.6 0 1 0 4 12.5L2.2 18.4Z" />
      <path d="M7.6 10.2h.01" />
      <path d="M10.2 10.2h.01" />
      <path d="M12.8 10.2h.01" />
      <path d="M19.4 1.4C19.6 3.3 20.8 4.6 22.8 4.8C20.8 5 19.6 6.3 19.4 8.2C19.2 6.3 18.1 5 16 4.8C18.1 4.6 19.2 3.3 19.4 1.4Z" />
    </svg>
  );
}

/** p-6 / p-7 variant: the same silhouette with no dots. */
export function SpeechBubblePlain(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      focusable="false"
      {...props}
    >
      <path d="M7.2 18.2A8.4 8.4 0 1 0 4.1 14.2L2.6 20.4Z" />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* Trust strip (§2.2)                                                         */
/* -------------------------------------------------------------------------- */

export function ShieldCheck(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      focusable="false"
      {...props}
    >
      <path d="M12 2.2C13.6 4 16.6 5.4 20.6 5.8C21 9.8 20.8 13.8 19.2 16.6C17.6 19.4 15 21.2 12 21.9C9 21.2 6.4 19.4 4.8 16.6C3.2 13.8 3 9.8 3.4 5.8C7.4 5.4 10.4 4 12 2.2Z" />
      <path d="M13.1 8.8A4.4 4.4 0 1 0 16.1 11.5" />
      <path d="M9.6 13.1 11.5 15 16.8 9.4" />
    </svg>
  );
}

export function Padlock(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      focusable="false"
      {...props}
    >
      <rect x="4" y="10.4" width="16" height="10.6" rx="2.6" />
      <path d="M7.4 10.4V8.2a4.6 4.6 0 0 1 9.2 0v2.2" />
      <path d="M12 14.4v2.8" />
    </svg>
  );
}

export function Heart(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      focusable="false"
      {...props}
    >
      <path d="M12 19.8C12 19.8 3.6 14.4 3.6 9.1C3.6 6.3 5.8 4.1 8.6 4.1C10.2 4.1 11.3 4.9 12 5.9C12.7 4.9 13.8 4.1 15.4 4.1C18.2 4.1 20.4 6.3 20.4 9.1C20.4 14.4 12 19.8 12 19.8Z" />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* Moments — the six mood cards (p-2)                                         */
/* -------------------------------------------------------------------------- */

/** `I need to focus` — target reticle: ring, four ticks crossing it, centre dot. */
export function Crosshair(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      focusable="false"
      {...props}
    >
      <circle cx="12" cy="12" r="6.6" />
      <path d="M12 2.4v5.4" />
      <path d="M12 16.2v5.4" />
      <path d="M2.4 12h5.4" />
      <path d="M16.2 12h5.4" />
      <circle cx="12" cy="12" r="1.3" />
    </svg>
  );
}

/** `I need a reset` — two half-circle arrows chasing each other. */
export function Refresh(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      focusable="false"
      {...props}
    >
      <path d="M3.6 12a8.7 8.7 0 0 1 16.4-2.4" />
      <path d="M20 4.6v5h-5" />
      <path d="M20.4 12a8.7 8.7 0 0 1-16.4 2.4" />
      <path d="M4 19.4v-5h5" />
    </svg>
  );
}

/** `I'm running low` — horizontal battery, terminal nub, single low-charge cell. */
export function BatteryLow(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      focusable="false"
      {...props}
    >
      <rect x="2.6" y="7.4" width="15.8" height="9.2" rx="2.4" />
      <path d="M18.4 10.4h1.2a1.4 1.4 0 0 1 0 3.2h-1.2" />
      <path d="M12 9.6 13.5 12 12 14.4 10.5 12Z" />
    </svg>
  );
}

/** `I can't switch off` — crescent moon. */
export function Moon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      focusable="false"
      {...props}
    >
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  );
}

/** `I feel stuck` — nucleus with two crossed elliptical orbits. */
export function Atom(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      focusable="false"
      {...props}
    >
      <ellipse cx="12" cy="12" rx="10.6" ry="4.8" transform="rotate(45 12 12)" />
      <ellipse cx="12" cy="12" rx="10.6" ry="4.8" transform="rotate(-45 12 12)" />
      <circle cx="12" cy="12" r="1.3" />
    </svg>
  );
}

/** `I want more clarity` — compass ring with a needle. */
export function Compass(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      focusable="false"
      {...props}
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M16.6 7.4 14.1 14.1 7.4 16.6 9.9 9.9Z" />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* R³ Loop (p-3)                                                              */
/* -------------------------------------------------------------------------- */

/** Head-and-shoulders bust — `Understand yourself` / `Personal to the Moment`. */
export function PersonCircle(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      focusable="false"
      {...props}
    >
      <circle cx="12" cy="7.4" r="4" />
      <path d="M4 20.6a8 8 0 0 1 16 0" />
    </svg>
  );
}

/** Five-bar audio waveform — the `Recharge Experiences` mark. */
export function Waveform(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      focusable="false"
      {...props}
    >
      <path d="M3.8 9.5v5" />
      <path d="M7.9 6.5v11" />
      <path d="M12 3.6v16.8" />
      <path d="M16.1 6.5v11" />
      <path d="M20.2 9.5v5" />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* Connected (p-4)                                                            */
/* -------------------------------------------------------------------------- */

/** Segmented ring chart — `Personal Insights`. */
export function Donut(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      focusable="false"
      {...props}
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 12V3" />
      <path d="M12 12 4.2 16.5" />
      <path d="M12 12 19.8 16.5" />
    </svg>
  );
}

export function BarChart(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      focusable="false"
      {...props}
    >
      <path d="M3.6 3.4v17h16.8" />
      <path d="M7.4 20.4v-5" />
      <path d="M11 20.4v-10" />
      <path d="M14.6 20.4v-7" />
      <path d="M18.2 20.4v-13" />
    </svg>
  );
}

export function LineChart(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      focusable="false"
      {...props}
    >
      <path d="M3.6 17.6 7.9 13.2 11.1 16 16.9 9.4" />
      <circle cx="18.8" cy="7.2" r="1.5" />
    </svg>
  );
}

/** A few horizontal rules standing in for a block of text. */
export function DocumentLines(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      focusable="false"
      {...props}
    >
      <path d="M4 4.8h9" />
      <path d="M4 8.4h16" />
      <path d="M4 12h12" />
      <path d="M4 15.6h9.5" />
      <path d="M4 19.2h6.5" />
    </svg>
  );
}

/** Four-point star. */
export function Sparkle(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      focusable="false"
      {...props}
    >
      <path d="M12 2.4C12.5 8.2 15.8 11.5 21.6 12C15.8 12.5 12.5 15.8 12 21.6C11.5 15.8 8.2 12.5 2.4 12C8.2 11.5 11.5 8.2 12 2.4Z" />
    </svg>
  );
}

export function MusicNote(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      focusable="false"
      {...props}
    >
      <circle cx="5.8" cy="18.4" r="2.3" />
      <circle cx="16.2" cy="15.8" r="2.3" />
      <path d="M8.1 18.4V7.2" />
      <path d="M18.5 15.8V4.6" />
      <path d="M8.1 7.2 18.5 4.6" />
      <path d="M8.1 10.2 18.5 7.6" />
    </svg>
  );
}

export function Search(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      focusable="false"
      {...props}
    >
      <circle cx="10.6" cy="10.6" r="7" />
      <path d="M6.7 12A4.2 4.2 0 0 0 7.9 7.4" />
      <path d="M15.8 15.8 20.8 20.8" />
    </svg>
  );
}

/** Concentric rings with a centre dot — `More relevant`. */
export function Target(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      focusable="false"
      {...props}
    >
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="4.6" />
      <circle cx="12" cy="12" r="1.2" />
    </svg>
  );
}

export function Clock(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      focusable="false"
      {...props}
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.2V12l3.6 2.6" />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* Rhythm (p-5)                                                               */
/* -------------------------------------------------------------------------- */

/** `Work` / `Focus` — open laptop, front view. */
export function Laptop(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      focusable="false"
      {...props}
    >
      <path d="M6 4h12a1.7 1.7 0 0 1 1.7 1.7v9.2H4.3V5.7A1.7 1.7 0 0 1 6 4Z" />
      <path d="M4.3 14.9 2.4 18.9a1.1 1.1 0 0 0 1 1.6h17.2a1.1 1.1 0 0 0 1-1.6l-1.9-4" />
      <path d="M10.3 18h3.4" />
    </svg>
  );
}

/** `Pressure` / `Reset` — a bust under three small bolts (stress). */
export function StressHead(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      focusable="false"
      {...props}
    >
      <path d="M12.7 2.6 11.1 4.8h1.6L11.5 7.4" />
      <path d="M6.8 3.8 5.4 5.8h1.4L5.9 8.1" />
      <path d="M18.6 3.8 17.2 5.8h1.4L17.7 8.1" />
      <circle cx="12" cy="12.6" r="3.6" />
      <path d="M6.2 21.8a5.8 5.8 0 0 1 11.6 0" />
    </svg>
  );
}

/** `Energy Dip` / `Recharge` — outline bolt. */
export function Lightning(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      focusable="false"
      {...props}
    >
      <path d="M15.4 2.2 3.8 13.4h6.2l-1.2 8.4 11.4-11.2h-6.2Z" />
    </svg>
  );
}

/** `Night` / `Rest` — crescent with two sparkles. */
export function MoonStars(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      focusable="false"
      {...props}
    >
      <path d="M9.2 6.2a4.4 4.4 0 0 0 6.6 6.6 6.6 6.6 0 1 1-6.6-6.6Z" />
      <path d="M19.6 2.8C19.8 4.8 20.9 5.8 22.8 6C20.9 6.2 19.8 7.2 19.6 9.2C19.4 7.2 18.3 6.2 16.4 6C18.3 5.8 19.4 4.8 19.6 2.8Z" />
      <path d="M19.4 11.8C19.5 13.1 20.3 13.9 21.6 14C20.3 14.1 19.5 14.9 19.4 16.2C19.3 14.9 18.5 14.1 17.2 14C18.5 13.9 19.3 13.1 19.4 11.8Z" />
    </svg>
  );
}

/** `More Personal Over Time` — bar chart with a rising arrow. */
export function ChartUp(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      focusable="false"
      {...props}
    >
      <path d="M4.4 20.6v-3.6" />
      <path d="M9 20.6v-6.4" />
      <path d="M13.6 20.6v-9" />
      <path d="M18.2 20.6v-11.6" />
      <path d="M14.8 7.4 20.8 2.6" />
      <path d="M16.6 2.6h4.2v4.2" />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* Trust (p-6) — the four card icons                                          */
/* -------------------------------------------------------------------------- */

/** `Support, not diagnose.` — clasped hands under a heart. */
export function HandshakeHeart(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      focusable="false"
      {...props}
    >
      <path d="M4 12C4 8 5.8 4.8 8.5 4.8C10.2 4.8 11.4 6.3 12 8C12.6 6.3 13.8 4.8 15.5 4.8C18.2 4.8 20 8 20 12" />
      <path d="M4 12 11.2 18.2A2.1 2.1 0 0 1 8.4 21.3L2.6 16.3" />
      <path d="M9.4 16.7 7.2 19.2" />
      <path d="M7.6 15.1 5.4 17.6" />
      <path d="M20 12 12.8 18.2A2.1 2.1 0 0 0 15.6 21.3L21.4 16.3" />
      <path d="M14.6 16.7 16.8 19.2" />
      <path d="M16.4 15.1 18.6 17.6" />
    </svg>
  );
}

/** `AI that guides, not defines you.` — head in profile with a brain inside. */
export function HeadBrain(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      focusable="false"
      {...props}
    >
      <path d="M19.3 22v-3.2c0-.7.3-1.3.8-1.8C21.3 15.7 22 14 22 12.1C22 6.6 17.5 2.2 12 2.2C6.9 2.2 2.7 6 2.1 10.9C2 11.5 2.2 12.1 2.6 12.5L4.4 14.3C4.7 14.6 4.9 15 4.9 15.5V17.5C4.9 18.4 5.6 19.1 6.5 19.1H8.8V22" />
      <path d="M5.8 12.6C5.8 7.9 8.6 4.5 12 4.5C15.5 4.5 18.4 7.6 18.4 11.9C18.4 14.4 17.3 16.4 15.6 17.3" />
      <path d="M12 4.5v8.1c0 .9.7 1.6 1.6 1.6" />
      <path d="M8 8.6 9.9 9.8" />
      <path d="M7.5 11.5 9.5 12.1" />
      <path d="M15.9 8 14.4 9.6" />
      <path d="M16.6 11.1 14.6 11.9" />
    </svg>
  );
}

/** `Personalization with purpose.` — bust with a heart at the lower right. */
export function PersonHeart(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      focusable="false"
      {...props}
    >
      <circle cx="9.4" cy="7.2" r="3.9" />
      <path d="M2.2 20.4a7.2 7.2 0 0 1 14.4 0" />
      <path d="M18 21.2C18 21.2 14.4 18.9 14.4 16.6C14.4 15.4 15.3 14.4 16.5 14.4C17.2 14.4 17.7 14.8 18 15.2C18.3 14.8 18.8 14.4 19.5 14.4C20.7 14.4 21.6 15.4 21.6 16.6C21.6 18.9 18 21.2 18 21.2Z" />
    </svg>
  );
}

/** `Privacy deserves care.` — shield with a padlock inside. */
export function ShieldLock(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      focusable="false"
      {...props}
    >
      <path d="M12 2.2C13.6 4 16.6 5.4 20.6 5.8C21 9.8 20.8 13.8 19.2 16.6C17.6 19.4 15 21.2 12 21.9C9 21.2 6.4 19.4 4.8 16.6C3.2 13.8 3 9.8 3.4 5.8C7.4 5.4 10.4 4 12 2.2Z" />
      <rect x="8.6" y="11.6" width="6.8" height="5.8" rx="1.2" />
      <path d="M10.2 11.6v-1.4a1.8 1.8 0 0 1 3.6 0v1.4" />
      <path d="M12 13.9v1.6" />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* Plans (p-7)                                                                */
/* -------------------------------------------------------------------------- */

/** 7-day trial banner — calendar with a check inside. */
export function CalendarCheck(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      focusable="false"
      {...props}
    >
      <rect x="3.4" y="5.4" width="17.2" height="16" rx="2.4" />
      <path d="M3.4 10.2h17.2" />
      <path d="M8.4 2.8v4" />
      <path d="M15.6 2.8v4" />
      <path d="M8.6 14.8 11.4 17.6 16 12.6" />
    </svg>
  );
}

/** `Essential` — five-point star. */
export function Star(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      focusable="false"
      {...props}
    >
      <path d="M12 2.6 14.7 8.7 21.3 9.4 16.4 13.8 17.8 20.3 12 17 6.2 20.3 7.6 13.8 2.7 9.4 9.3 8.7Z" />
    </svg>
  );
}

/** `Rhythm` — two stacked sine strokes. */
export function WaveTilde(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      focusable="false"
      {...props}
    >
      <path d="M3.2 9.6C6.1 6.1 9.1 6.1 12 9.6S17.9 13.1 20.8 9.6" />
      <path d="M3.2 14.4C6.1 10.9 9.1 10.9 12 14.4S17.9 17.9 20.8 14.4" />
    </svg>
  );
}

/** `Plus` — two crossed strokes. */
export function Plus(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      focusable="false"
      {...props}
    >
      <path d="M12 4.2v15.6" />
      <path d="M4.2 12h15.6" />
    </svg>
  );
}
