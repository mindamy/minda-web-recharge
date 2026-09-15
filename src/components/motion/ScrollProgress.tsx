"use client";

import { motion, useScroll, useSpring } from "motion/react";

/**
 * A hairline progress bar across the top of the viewport.
 *
 * Purpose: orientation. The home page is ~9,000px of continuous narrative with
 * a sticky header, so there is no other cue for how far through it you are.
 *
 * Deliberately NOT gated on reduced motion. It is scroll-linked rather than
 * time-based — it tracks the scrollbar one-to-one and initiates no motion of
 * its own, so it carries none of the vestibular risk that autonomous or
 * parallax motion does. The spring only smooths the scroll value; it never
 * moves on its own.
 *
 * Carries the shared aurora ramp so the bar reads as part of the brand rather
 * than as a browser affordance.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 260,
    damping: 40,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX, transformOrigin: "0% 50%" }}
      className="fixed inset-x-0 top-0 z-[60] h-[3px] bg-[linear-gradient(90deg,#2F6BEE_0%,#5AA2D8_20%,#6ABDB9_40%,#79C3AE_55%,#9C88B4_72%,#F5538C_100%)]"
    />
  );
}
