import type { SVGProps } from "react";

import { cn } from "@/lib/cn";

/**
 * The Recharge mark.
 *
 * An open swirl ring of three arcs — blue upper-left, rose right, green
 * lower-left — with a fourth silver-grey arc set concentrically inside on the
 * left, enclosing a figure with raised arms: grey head, grey arms sweep,
 * blue-violet torso and a green leg hook.
 *
 * NOTE: this is a hand reconstruction traced from a 400 dpi re-render of the
 * design deck, because the source is a flattened raster and no vector asset
 * was supplied. It is faithful at the sizes used here, but the real brand SVG
 * should replace it before launch — the deck's arcs taper along their length,
 * which uniform-width strokes cannot reproduce.
 */
function RechargeMark({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      className={cn("shrink-0", className)}
      aria-hidden
      focusable="false"
      {...props}
    >
      {/* Outer ring — three arcs, r=25, drawn clockwise from the upper left. */}
      <path
        d="M 7.9 25.5 A 25 25 0 0 1 44.5 10.4"
        stroke="#4E9BE0"
        strokeWidth={4.2}
        strokeLinecap="round"
      />
      <path
        d="M 42.6 9.6 A 25 25 0 0 1 37.2 56.4"
        stroke="#E8608C"
        strokeWidth={4.2}
        strokeLinecap="round"
      />
      <path
        d="M 39.3 55.9 A 25 25 0 0 1 8.2 24.3"
        stroke="#6DB498"
        strokeWidth={4.2}
        strokeLinecap="round"
      />

      {/* Inner silver-grey arc, r=19, down the left side. */}
      <path
        d="M 22.5 15.6 A 19 19 0 0 0 22.5 48.4"
        stroke="#9CA6B4"
        strokeWidth={3}
        strokeLinecap="round"
      />

      {/* Figure — arms sweep, passing just below the head. */}
      <path
        d="M 20.5 32 C 25 33.6 29.6 33 34 29.4 S 42.2 21 45.6 18.6"
        stroke="#9CA6B4"
        strokeWidth={2.9}
        strokeLinecap="round"
      />
      {/* Torso. */}
      <path
        d="M 21.6 30.6 C 23.6 35.6 26.6 39.6 29.6 43.6 C 30.7 45.1 31.3 46.3 31.6 47.6"
        stroke="#6E86D8"
        strokeWidth={3}
        strokeLinecap="round"
      />
      {/* Leg hook, sweeping down and out to the lower left. */}
      <path
        d="M 33.6 37 C 34.6 44 31 49.6 25.4 52.2 C 22 53.8 19.4 53.4 17.8 52"
        stroke="#5FB394"
        strokeWidth={3}
        strokeLinecap="round"
      />
      {/* Head. */}
      <circle cx="30.4" cy="22.8" r="3.5" fill="#8B95A6" />
    </svg>
  );
}

/**
 * The full lockup: mark plus the serif wordmark.
 *
 * Measured at the deck's reference width: a 62px mark, a 16px gap, then
 * `Recharge` in the display serif at 38px.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <RechargeMark className="size-11 lg:size-[54px]" />
      <span className="text-wordmark font-display text-ink-900">Recharge</span>
    </span>
  );
}
