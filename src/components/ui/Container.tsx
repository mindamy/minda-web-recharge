import type { CSSProperties, ReactNode } from "react";

import { cn } from "@/lib/cn";

/**
 * The deck uses three container widths, measured from the renders:
 *
 *   narrow  1152px — hero trust strip, plans grid
 *   wide    1360px — the six-card Moments row
 *   bleed   full   — the header band, and any section that needs its own padding
 */
export type ContainerWidth = "narrow" | "wide" | "bleed";

/*
 * The max-width includes the gutter, so the *content* box lands on the
 * measured width rather than the measured width minus padding.
 *
 * The obvious `max-w-narrow px-10` spelling is wrong: it caps the outer box at
 * 1152px and then subtracts 80px of padding, leaving 1072px of content — so
 * every section sat 80px narrower than the deck, which starved the trust
 * strip's columns badly enough to wrap their copy to three lines.
 *
 * Gutters are 24 / 32 / 40px, so each cap is the design width plus twice that.
 */
const WIDTHS: Record<ContainerWidth, string> = {
  narrow: "max-w-[1200px] sm:max-w-[1216px] lg:max-w-[1232px]",
  wide: "max-w-[1408px] sm:max-w-[1424px] lg:max-w-[1440px]",
  bleed: "max-w-none",
};

export function Container({
  children,
  width = "narrow",
  className,
  style,
}: {
  children: ReactNode;
  width?: ContainerWidth;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      style={style}
      className={cn("mx-auto w-full px-6 sm:px-8 lg:px-10", WIDTHS[width], className)}
    >
      {children}
    </div>
  );
}
