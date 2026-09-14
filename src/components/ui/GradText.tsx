import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

/**
 * A gradient headline run.
 *
 * Highlighted phrases in the deck are one continuous left-to-right gradient
 * across the whole run, not a colour per word — confirmed by column-scanning
 * the glyph cores, where the ink travels teal -> mauve -> rose *within* a
 * single word. So a run must be wrapped once, around the entire phrase;
 * wrapping each word separately would restart the ramp on every word and is
 * the failure mode to avoid.
 *
 * The ramp always terminates on rose at its right edge and never ends on blue.
 *
 * `hero` selects the warmer, more violet ramp measured from the supplied hero
 * JPEG, which differs from the ramp used by the other seven headlines.
 *
 * Not animated, deliberately: animating `background-position` under
 * `background-clip: text` repaints the text layer every frame and fringes the
 * sub-pixel-antialiased serif glyphs.
 */
export function GradText({
  children,
  ramp = "deck",
  className,
}: {
  children: ReactNode;
  ramp?: "deck" | "hero";
  className?: string;
}) {
  return (
    <span className={cn(ramp === "hero" ? "grad-text-hero" : "grad-text", className)}>
      {children}
    </span>
  );
}

/** Renders "R³" with the superscript the deck uses (0.62em, raised 0.42em). */
export function RCubed() {
  return (
    <>
      R<sup className="top-[-0.42em] text-[0.62em] leading-none">3</sup>
    </>
  );
}

/**
 * A gradient run with explicit stops.
 *
 * The hero headline does not reuse the shared deck ramp — it carries three
 * separate runs, each with its own measured range (`better sleep,` runs
 * #1663DA -> #0F8FCB, `calmer mind,` runs #0A81B9 -> #295A9D -> #46397E, and
 * so on). Rather than minting a one-off utility per run, this takes the stops
 * directly.
 *
 * `pb`/`-mb` keep serif descenders from being clipped by the
 * background-clip box.
 */
export function GradRun({
  children,
  stops,
  className,
}: {
  children: ReactNode;
  /** Comma-separated gradient stops, e.g. "#1663DA 0%, #0F8FCB 100%". */
  stops: string;
  className?: string;
}) {
  return (
    <span
      style={{ backgroundImage: `linear-gradient(90deg, ${stops})` }}
      className={cn(
        "inline-block bg-clip-text pb-[0.12em] -mb-[0.12em] text-transparent",
        "[-webkit-text-fill-color:transparent]",
        className,
      )}
    >
      {children}
    </span>
  );
}
