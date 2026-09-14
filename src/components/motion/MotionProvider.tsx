"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

import { EASE_SOFT } from "./ease";

/**
 * Global motion defaults, mounted once in the root layout.
 *
 * `reducedMotion="user"` makes Motion drop transform and layout animations for
 * visitors who ask for reduced motion while still allowing opacity to animate,
 * which is the fallback we actually want — content appears, it just does not
 * travel. This pairs with the `prefers-reduced-motion` block in globals.css so
 * both Motion-driven and CSS-driven animation are covered.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user" transition={{ ease: EASE_SOFT }}>
      {children}
    </MotionConfig>
  );
}
