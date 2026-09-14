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
 * Copy is verbatim from §3.3 with one agreed change: the RECHARGE title is
 * `Personalised` rather than the deck's `Personalized`, standardising on the
 * deck's own British body voice.
 */

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
  /** Micro-eyebrow, 12px / 600 / +0.14em. */
  label: string;
  /** 15px / 600 / ink-800. */
  title: string;
  /** 14px / 400 / ink-500. */
  sub: string;
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
    label: "RECONNECT",
    title: "Personal Insights",
    sub: "Understand yourself.",
    Icon: PersonCircle,
    iconClass: "text-[#164EF3]",
    labelClass: "text-blue-ink",
    cx: 88,
    cy: 53,
    d: 67,
    iconWidth: "w-[58%]",
    delay: 0.1,
  },
  {
    id: "realign",
    label: "REALIGN",
    title: "AI-guided Coaching",
    sub: "Find what you need.",
    Icon: SpeechBubbleDots,
    iconClass: "text-[#34AC6C]",
    labelClass: "text-green-500",
    cx: 438,
    cy: 60,
    d: 67,
    iconWidth: "w-[56%]",
    delay: 0.72,
  },
  {
    id: "recharge",
    label: "RECHARGE",
    title: "Personalised Recharge Experiences",
    sub: "Feel better in the moment.",
    Icon: Waveform,
    iconClass: "text-[#F94082]",
    labelClass: "text-rose-400",
    cx: 278,
    cy: 226,
    d: 70,
    iconWidth: "w-[54%]",
    delay: 1.15,
  },
] as const;

/** The centre `You` squircle — measured x 218→333, y 35→182 in diagram units. */
export const YOU_NODE = {
  title: "You",
  pill: ["Right now:", "I need a reset"],
  left: 218,
  top: 35,
  width: 115,
  height: 147,
} as const;

/** Percentage helper so every coordinate converts the same way. */
export const pctX = (units: number) => `${((units / DIAGRAM_W) * 100).toFixed(3)}%`;
export const pctY = (units: number) => `${((units / DIAGRAM_H) * 100).toFixed(3)}%`;
