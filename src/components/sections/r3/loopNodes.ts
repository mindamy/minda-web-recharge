import type { ComponentType } from "react";

import { PersonCircle, SpeechBubbleDots, Waveform, type IconProps } from "@/components/icons";

/**
 * The three outer nodes of the R³ loop, declared once.
 *
 * The diagram ships in two irreconcilable forms — an ellipse at `md`/`lg` and a
 * vertical rail at `sm` (DESIGN-SPEC §4.2 "3 R³ Loop": *"abandon the ellipse"*).
 * Those need different markup, not different CSS, so both read their copy,
 * colours and sequence position from here. Duplicating the strings in two
 * components is how the two variants would silently drift apart.
 *
 * Copy is **not** here. Each node names the shared pillar its copy comes
 * from (`common.pillars.*`) and `LoopDiagram` — a Server Component — reads the
 * catalogue and hands the strings to both forms. That keeps this module free
 * of any catalogue import, which matters: `LoopArcs` is the section's one
 * `"use client"` file and it imports `DIAGRAM_W` / `DIAGRAM_H` from here. A
 * static catalogue import reachable from the client graph would bundle all
 * seven locales into the browser chunk with no error and no warning.
 */

/**
 * The three Recharge pillars, as named in `common.pillars`. Declared as a
 * literal union rather than imported from the catalogue types so this file
 * stays catalogue-free; the lookup in `LoopDiagram` is what makes a rename
 * a `tsc` error.
 */
export type PillarKey = "insights" | "coaching" | "experiences";

/**
 * Geometry lives in the diagram's own unit space — a 515 x 322 box measured off
 * the p-3 render, where 1 unit ≈ 1.31 px at the deck's 1448 px reference width.
 * Every position is expressed as a fraction of that box so the ellipse scales
 * with its column while the labels hold their typographic sizes.
 */
export const DIAGRAM_W = 515;
export const DIAGRAM_H = 322;

export type LoopNode = {
  id: "reconnect" | "realign" | "recharge";
  /** Whose label, title and sub this node renders. */
  pillar: PillarKey;
  Icon: ComponentType<IconProps>;
  /** Icon stroke colour, measured per node in §3.3. */
  iconClass: string;
  /** Micro-eyebrow colour — the node's role hue. */
  labelClass: string;
  /** Circle centre, in diagram units. */
  cx: number;
  cy: number;
  /** Circle diameter, in diagram units. */
  d: number;
  /** Icon width as a fraction of the circle. */
  iconWidth: string;
  /**
   * Seconds after the arcs begin drawing. §5 #11: each node pops when its
   * incoming arc reaches it, so these track the arc sequence in `LoopArcs`.
   */
  delay: number;
};

export const LOOP_NODES: readonly LoopNode[] = [
  {
    id: "reconnect",
    pillar: "insights",
    Icon: PersonCircle,
    iconClass: "text-[#164EF3]",
    labelClass: "text-blue-ink",
    cx: 88,
    cy: 53,
    d: 67,
    iconWidth: "w-[58%]",
    delay: 0.05,
  },
  {
    id: "realign",
    pillar: "coaching",
    Icon: SpeechBubbleDots,
    iconClass: "text-[#34AC6C]",
    labelClass: "text-green-500",
    cx: 438,
    cy: 60,
    d: 67,
    iconWidth: "w-[56%]",
    delay: 0.77,
  },
  {
    id: "recharge",
    pillar: "experiences",
    Icon: Waveform,
    iconClass: "text-[#F94082]",
    labelClass: "text-rose-400",
    cx: 278,
    cy: 226,
    d: 70,
    iconWidth: "w-[54%]",
    delay: 1.08,
  },
] as const;

/**
 * The centre `You` squircle — measured x 218→333, y 35→182 in diagram units.
 * Geometry only; its title and status pill are `sections.r3Loop.you`.
 */
export const YOU_NODE = {
  left: 218,
  top: 35,
  width: 115,
  height: 147,
} as const;

/** Percentage helper so every coordinate converts the same way. */
export const pctX = (units: number) => `${((units / DIAGRAM_W) * 100).toFixed(3)}%`;
export const pctY = (units: number) => `${((units / DIAGRAM_H) * 100).toFixed(3)}%`;
