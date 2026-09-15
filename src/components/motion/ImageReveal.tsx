"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import type { ReactNode } from "react";

import { EASE_SOFT } from "./ease";

/**
 * Entrance for the large photographs.
 *
 * Purpose: preventing a jarring change. A full-height portrait that simply
 * appears at full opacity reads as a layout jump; settling it from a slight
 * overscale lets the eye arrive with it.
 *
 * The scale starts at 1.04, never at 0 — nothing in the real world appears
 * from nothing, and starting from zero also means the first frame is a
 * degenerate box. Overflow is clipped by the caller's rounded frame, so the
 * overscale never bleeds past the mask.
 *
 * Reduced motion branches the values, not the markup: the hook returns `null`
 * during server rendering, so branching the returned JSX would hand a
 * hydration mismatch to exactly the visitors who asked for less motion.
 */
export function ImageReveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();

  const variants: Variants = {
    hidden: { opacity: 0, transform: reduce ? "none" : "scale(1.04)" },
    visible: {
      opacity: 1,
      transform: "scale(1)",
      transition: {
        duration: reduce ? 0 : 0.9,
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
      viewport={{ once: true, amount: 0.2, margin: "0px 0px -12% 0px" }}
    >
      {children}
    </motion.div>
  );
}
