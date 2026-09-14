"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";

import { DIAGRAM_H, DIAGRAM_W } from "./loopNodes";

/**
 * The four gradient arcs of the R³ loop, drawing themselves on scroll.
 *
 * This is the one client component in the section, and it is client-side for a
 * single reason: `useReducedMotion`. The arc draw animates `stroke-dashoffset`
 * (via Motion's `pathLength`), which is neither a transform nor a layout
 * property, so the global `MotionConfig reducedMotion="user"` would let it run
 * anyway. §5 #10 requires "render arcs complete" instead, which means reading
 * the preference here and branching the *values*.
 *
 * Reduced motion branches values only, never JSX. `useReducedMotion` returns
 * `null` while server rendering, so returning different markup for it would
 * hand a hydration mismatch to exactly the visitors who asked for less motion.
 *
 * Why the arcs are Béziers and not an `<ellipse>`: the spec describes an
 * ellipse (centre 421,476 · rx 227 · ry 152) but the render does not draw one.
 * Fitting the measured centre lines gives rx ≈ 160 across the top and rx ≈ 188
 * across the bottom — the loop is four hand-drawn arcs with a wider bowl than
 * dome, and it never closes: there are real gaps beside RECONNECT and REALIGN
 * that a masked ellipse cannot reproduce. Each segment below is a cubic fitted
 * to sampled pixels, checked at t = 0.25 / 0.5 / 0.75.
 *
 * Each segment is a three-stroke bundle rather than one line. That is the §2.5
 * aurora primitive at small scale, and it is visible in the render: the arcs
 * read as two or three near-parallel hairlines that fan ~4px apart mid-span and
 * pinch back to a single bright caustic at each end. The companions share their
 * segment's endpoints and differ only in their control points, which is what
 * makes them converge at the joins.
 */

type Segment = {
  id: string;
  /** Fitted centre line. */
  d: string;
  /** Companions — same endpoints, bowed out and in by ~4 units. */
  bundle: readonly [string, string];
  /** Gradient axis, in diagram units. */
  axis: readonly [number, number, number, number];
  stops: readonly { offset: string; color: string; opacity?: number }[];
  /** Seconds into the 1.4s sequence, overlapping by 30% (§5 #10). */
  delay: number;
};

const DRAW = 0.45;

const SEGMENTS: readonly Segment[] = [
  {
    // RECONNECT -> apex. Blue #99BFFA, fading in where it leaves the node.
    id: "r3-arc-reconnect",
    d: "M133 62C170 26 230 5 285 5",
    bundle: ["M133 62C170 22 230 1 285 5", "M133 62C171 30 230 9 285 5"],
    axis: [133, 62, 285, 5],
    stops: [
      { offset: "0%", color: "#C9DCFC", opacity: 0.3 },
      { offset: "22%", color: "#A6C6FA" },
      { offset: "55%", color: "#9DC9EC" },
      { offset: "100%", color: "#9FD2DF" },
    ],
    delay: 0,
  },
  {
    // Apex -> REALIGN. The blue hands off to green #9ED3B6 at the top vertex.
    id: "r3-arc-realign",
    d: "M285 5C330 5 370 26 395 44",
    bundle: ["M285 5C330 1 374 24 395 44", "M285 5C330 9 367 29 395 44"],
    axis: [285, 5, 395, 44],
    stops: [
      { offset: "0%", color: "#9FD2DF" },
      { offset: "40%", color: "#B6DDD1" },
      { offset: "100%", color: "#9ED3B6" },
    ],
    delay: DRAW * 0.7,
  },
  {
    // REALIGN -> RECHARGE. Green neutralises almost immediately into rose.
    id: "r3-arc-recharge",
    d: "M426 172C406 214 365 233 312 233",
    bundle: ["M426 172C410 216 366 237 312 233", "M426 172C402 211 364 229 312 233"],
    axis: [426, 172, 312, 233],
    stops: [
      { offset: "0%", color: "#C6D2CC", opacity: 0.45 },
      { offset: "18%", color: "#DEB4C2" },
      { offset: "45%", color: "#F7A4BF" },
      { offset: "100%", color: "#F499BB" },
    ],
    delay: DRAW * 1.4,
  },
  {
    // RECHARGE -> RECONNECT, closing the loop. Rose through lavender #C4B0D8
    // back to the pale blue it started from.
    id: "r3-arc-return",
    d: "M244 233C180 233 131 212 103 170",
    bundle: ["M244 233C180 237 127 214 103 170", "M244 233C180 229 134 209 103 170"],
    axis: [244, 233, 103, 170],
    stops: [
      { offset: "0%", color: "#FCA8CC" },
      { offset: "30%", color: "#F6A8D6" },
      { offset: "55%", color: "#DCB4E4" },
      { offset: "78%", color: "#C4B0D8" },
      { offset: "100%", color: "#C3D4F5", opacity: 0.45 },
    ],
    delay: DRAW * 2.1,
  },
];

/** CSS `ease-in-out`, which §5 #10 asks for on the draw. */
const EASE_IN_OUT = [0.42, 0, 0.58, 1] as const;

export function LoopArcs({ className }: { className?: string }) {
  const reduce = useReducedMotion();

  const container: Variants = { hidden: {}, visible: {} };

  const stroke = (delay: number): Variants => ({
    hidden: { pathLength: reduce ? 1 : 0 },
    visible: {
      pathLength: 1,
      transition: {
        duration: reduce ? 0 : DRAW,
        delay: reduce ? 0 : delay,
        ease: EASE_IN_OUT,
      },
    },
  });

  return (
    <motion.svg
      className={className}
      viewBox={`0 0 ${DIAGRAM_W} ${DIAGRAM_H}`}
      fill="none"
      aria-hidden
      focusable="false"
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.25, margin: "0px 0px -18% 0px" }}
    >
      <defs>
        {SEGMENTS.map((segment) => (
          <linearGradient
            key={segment.id}
            id={segment.id}
            gradientUnits="userSpaceOnUse"
            x1={segment.axis[0]}
            y1={segment.axis[1]}
            x2={segment.axis[2]}
            y2={segment.axis[3]}
          >
            {segment.stops.map((stop) => (
              <stop
                key={stop.offset}
                offset={stop.offset}
                stopColor={stop.color}
                stopOpacity={stop.opacity ?? 1}
              />
            ))}
          </linearGradient>
        ))}
      </defs>

      {SEGMENTS.map((segment) => (
        <g key={segment.id} stroke={`url(#${segment.id})`} strokeLinecap="round">
          {segment.bundle.map((d, index) => (
            <motion.path
              key={index}
              d={d}
              strokeWidth={0.8}
              strokeOpacity={0.55}
              variants={stroke(segment.delay)}
            />
          ))}
          <motion.path d={segment.d} strokeWidth={1.9} variants={stroke(segment.delay)} />
        </g>
      ))}
    </motion.svg>
  );
}
