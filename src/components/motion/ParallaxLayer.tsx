"use client";

import {
  motion,
  useMotionTemplate,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { useRef, type ReactNode } from "react";

/**
 * Scroll-linked vertical drift for a decorative layer.
 *
 * Purpose: depth. The aurora fields sit behind the content, and moving them at
 * a different rate than the copy separates the two planes instead of letting
 * the whole section slide as one flat sheet.
 *
 * Reduced motion disables it outright — parallax is the one effect on this page
 * that is a genuine vestibular trigger, and unlike the reveals there is no
 * degraded version worth keeping. The distance collapses to zero, which leaves
 * the layer exactly where it would have been without this wrapper.
 *
 * The transform is built as an explicit string via `useMotionTemplate` rather
 * than Motion's `y` shorthand, because the shorthand is not hardware
 * accelerated and drops frames while the page is still loading.
 *
 * Accepts Server Component children — the aurora presets stay server-rendered
 * and are passed through as a slot.
 */
export function ParallaxLayer({
  children,
  /** Pixels of travel across the section's full pass through the viewport. */
  distance = 70,
  className,
}: {
  children: ReactNode;
  distance?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const travel = reduce ? 0 : distance;
  const y = useTransform(scrollYProgress, [0, 1], [travel, -travel]);
  const transform = useMotionTemplate`translate3d(0, ${y}px, 0)`;

  return (
    /*
     * Overscanned vertically by more than the travel distance: the aurora
     * fields fill their box exactly, so a layer inset to 0 would expose a bare
     * strip at whichever edge it drifts away from.
     */
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute -inset-y-28 inset-x-0 -z-10"
    >
      <motion.div style={{ transform }} className={className}>
        {children}
      </motion.div>
    </div>
  );
}
