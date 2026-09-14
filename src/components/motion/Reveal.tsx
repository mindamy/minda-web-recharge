"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import type { ReactNode } from "react";

import { DURATION, EASE_SOFT } from "./ease";

/**
 * Scroll-triggered reveals — the workhorse for every section on the page.
 *
 * Purpose: preventing a jarring change. Content that enters the viewport fades
 * and rises a short distance instead of snapping in.
 *
 * Two rules encoded here that are easy to get wrong:
 *
 * 1. `once: true` on every viewport. Re-triggering a reveal when the visitor
 *    scrolls back up reads as a bug, not as polish.
 * 2. Reduced motion branches the animated *values*, never the JSX. Motion's
 *    `useReducedMotion` returns `null` during server rendering, so branching
 *    the returned markup would produce a hydration mismatch for exactly the
 *    visitors who asked for less motion.
 */

type RevealProps = {
  children: ReactNode;
  /** Seconds to wait before starting. Use for hand-tuned section choreography. */
  delay?: number;
  /** Pixels travelled on the way in. */
  y?: number;
  className?: string;
};

export function Reveal({ children, delay = 0, y = 24, className }: RevealProps) {
  const reduce = useReducedMotion();

  const variants: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : y },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: reduce ? 0 : DURATION.reveal,
        delay: reduce ? 0 : delay,
        ease: EASE_SOFT,
      },
    },
  };

  return (
    <motion.div
      data-reveal
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.25, margin: "0px 0px -10% 0px" }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Staggered container for card grids and the pricing table.
 *
 * Pair with `RevealItem`. Variants propagate from parent to child
 * automatically, which is why `RevealItem` declares no `initial` or
 * `whileInView` of its own.
 */
export function RevealGroup({
  children,
  className,
  stagger = 0.09,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
}) {
  const reduce = useReducedMotion();

  const container: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: reduce ? 0 : stagger,
        delayChildren: reduce ? 0 : 0.05,
      },
    },
  };

  return (
    <motion.div
      data-reveal
      className={className}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15, margin: "0px 0px -10% 0px" }}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({
  children,
  className,
  y = 20,
}: {
  children: ReactNode;
  className?: string;
  y?: number;
}) {
  const reduce = useReducedMotion();

  const child: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : y },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: reduce ? 0 : DURATION.reveal, ease: EASE_SOFT },
    },
  };

  return (
    <motion.div data-reveal className={className} variants={child}>
      {children}
    </motion.div>
  );
}
