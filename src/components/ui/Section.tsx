import type { ReactNode } from "react";

import { cn } from "@/lib/cn";
import type { SectionId } from "@/lib/nav";

/**
 * A page section.
 *
 * Every section must be self-contained: the hybrid routing means each one is
 * mounted both inside the `/` scroll narrative and on its own standalone
 * route, so none may depend on a sibling's presence or scroll position.
 *
 * `scroll-mt` offsets the sticky header so an anchored heading is not hidden
 * underneath it when linked to directly.
 */
export function Section({
  id,
  children,
  className,
  /** Desktop padding is 120px top and bottom, per the measured section rhythm. */
  spacing = "default",
}: {
  id: SectionId;
  children: ReactNode;
  className?: string;
  spacing?: "default" | "tight" | "none";
}) {
  return (
    <section
      id={id}
      className={cn(
        "relative isolate scroll-mt-28 overflow-hidden",
        spacing === "default" && "py-20 md:py-28 lg:py-30",
        spacing === "tight" && "py-14 md:py-20",
        className,
      )}
    >
      {children}
    </section>
  );
}
