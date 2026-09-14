import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

/**
 * The deck uses three container widths, measured from the renders:
 *
 *   narrow  1152px — hero trust strip, plans grid
 *   wide    1360px — the six-card Moments row
 *   bleed   full   — the header band, and any section that needs its own padding
 */
export type ContainerWidth = "narrow" | "wide" | "bleed";

const WIDTHS: Record<ContainerWidth, string> = {
  narrow: "max-w-narrow",
  wide: "max-w-wide",
  bleed: "max-w-none",
};

export function Container({
  children,
  width = "narrow",
  className,
}: {
  children: ReactNode;
  width?: ContainerWidth;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto w-full px-6 sm:px-8 lg:px-10", WIDTHS[width], className)}>
      {children}
    </div>
  );
}
