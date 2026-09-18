import * as motion from "motion/react-client";
import Image from "next/image";
import type { CSSProperties, ComponentType } from "react";

import { Laptop, Lightning, MoonStars, StressHead, type IconProps } from "@/components/icons";
import { Reveal } from "@/components/motion/Reveal";
import { EASE_SOFT } from "@/components/motion/ease";
import { cn } from "@/lib/cn";
import { getDictionary } from "@/lib/i18n/dictionaries";

import {
  LABEL_X,
  RAIL_PATH_H,
  RAIL_PATH_V,
  RAIL_VIEWBOX_H,
  RAIL_VIEWBOX_V,
  STRAIGHT_RAIL,
  VERT_H,
  VERT_W,
  VIEW_H,
  nodePlacement,
} from "./timeline";

/**
 * The wavy timeline (DESIGN-SPEC §3.5 "The wavy timeline", §4.2 #5).
 *
 * Construction, and why:
 *
 * - The rail is a single inline SVG path, sampled from a sine in
 *   `./timeline`. It is the only thing inside the SVG — the nodes are HTML
 *   absolutely positioned over it, so every title and sub-label stays real
 *   selectable text instead of becoming `<text>` inside a diagram.
 * - `preserveAspectRatio="none"` lets the rail stretch to the container's
 *   width while its viewBox height matches the element's pixel height
 *   exactly. The vertical scale therefore stays 1:1 and the nodes' design-px
 *   offsets land on the stroke at any width;
 *   `vectorEffect="non-scaling-stroke"` holds the stroke at 1.5px under that
 *   deliberately non-uniform scale.
 * - One DOM serves all three responsive states. Each node carries its
 *   placement as CSS custom properties and the responsive *rules* stay in the
 *   class list: below `lg` a row with its circle on a left-hand rail, at `lg`
 *   a centred column hanging off the horizontal rail.
 *
 * Three rails exist because §4.2 #5 calls for three shapes; only ever one is
 * painted, and all three are decoration (`aria-hidden`).
 *
 * A Server Component, so it reads the catalogue itself rather than being
 * prop-drilled from `Rhythm`. The `motion/react-client` namespace is imported
 * as `motion` so that `m` keeps its site-wide meaning: the message catalogue.
 *
 * `./timeline` is deliberately untouched by the i18n migration — it is pure
 * geometry and holds no user-facing string.
 */

/**
 * Visual data only. Titles, sub-labels and the two photo `alt`s live in the
 * catalogue under `sections.rhythm.timeline`, keyed by `copyKey`.
 *
 * `copyKey` is narrowed per variant rather than typed as the whole key union,
 * which is what lets the photo branch read `.alt` without a cast: only the two
 * photo entries carry one, and the icon entries would be a type error if they
 * tried.
 */
type TimelineNode = {
  /** Diameter at `lg`, per the §3.5 node table. */
  size: number;
  /** Accent, applied to the dot and the sub-label. */
  dot: string;
  label: string;
} & (
  | {
      kind: "photo";
      copyKey: "morning" | "afterWork";
      src: string;
      ring: string;
      ringInset: string;
    }
  | {
      kind: "icon";
      copyKey: "work" | "pressure" | "energyDip" | "night";
      icon: ComponentType<IconProps>;
      iconColor: string;
    }
);

const NODES: readonly TimelineNode[] = [
  {
    kind: "photo",
    copyKey: "morning",
    size: 122,
    src: "/images/rhythm-morning.jpg",
    ring: "border-blue-100",
    ringInset: "-inset-[4px] lg:-inset-[6px]",
    dot: "bg-blue-fill",
    label: "text-blue-ink",
  },
  {
    kind: "icon",
    copyKey: "work",
    size: 81,
    icon: Laptop,
    iconColor: "text-blue-icon",
    dot: "bg-blue-icon",
    label: "text-blue-ink",
  },
  {
    kind: "icon",
    copyKey: "pressure",
    size: 81,
    icon: StressHead,
    iconColor: "text-teal-400",
    dot: "bg-teal-400",
    label: "text-teal-ink",
  },
  {
    kind: "icon",
    copyKey: "energyDip",
    size: 81,
    icon: Lightning,
    iconColor: "text-green-500",
    dot: "bg-green-500",
    label: "text-green-ink",
  },
  {
    kind: "photo",
    copyKey: "afterWork",
    size: 145,
    src: "/images/rhythm-after-work.jpg",
    ring: "border-rose-200",
    ringInset: "-inset-[4px] lg:-inset-[7px]",
    dot: "bg-rose-400",
    label: "text-rose-ink",
  },
  {
    kind: "icon",
    copyKey: "night",
    size: 81,
    icon: MoonStars,
    iconColor: "text-rose-400",
    dot: "bg-rose-400",
    label: "text-rose-ink",
  },
];

/** §3.5: blue -> teal -> green -> rose, left to right (top to bottom vertically). */
const RAIL_STOPS = [
  { offset: "0%", color: "#A9C6F2" },
  { offset: "32%", color: "#8CC6C4" },
  { offset: "55%", color: "#A6D4BC" },
  { offset: "100%", color: "#F6B7CC" },
] as const;

const STRAIGHT_RAIL_GRADIENT =
  "linear-gradient(180deg, #A9C6F2 0%, #8CC6C4 32%, #A6D4BC 55%, #F6B7CC 100%)";

function RailStops() {
  return (
    <>
      {RAIL_STOPS.map((stop) => (
        <stop key={stop.offset} offset={stop.offset} stopColor={stop.color} />
      ))}
    </>
  );
}

export async function RhythmTimeline() {
  const m = await getDictionary();
  const timeline = m.sections.rhythm.timeline;

  return (
    <div
      className="relative h-[var(--stack-h)] w-full lg:h-[var(--rail-h)]"
      style={
        {
          "--stack-h": `${VERT_H}px`,
          "--rail-h": `${VIEW_H}px`,
        } as CSSProperties
      }
    >
      {/* Mobile (< sm): a straight vertical rail. §4.2 #5 — a sine at 390px
          reads as a rendering error. */}
      <span
        aria-hidden
        className="absolute w-[1.5px] rounded-full sm:hidden"
        style={{
          left: STRAIGHT_RAIL.x,
          top: STRAIGHT_RAIL.top,
          height: STRAIGHT_RAIL.height,
          backgroundImage: STRAIGHT_RAIL_GRADIENT,
        }}
      />

      {/* Tablet (sm to lg): the same wave, turned vertical down the left edge. */}
      <svg
        aria-hidden
        focusable="false"
        viewBox={RAIL_VIEWBOX_V}
        className="pointer-events-none absolute top-0 left-0 hidden sm:block lg:hidden"
        style={{ width: VERT_W, height: VERT_H }}
      >
        <defs>
          <linearGradient id="rhythm-rail-v" x1="0" y1="0" x2="0" y2="1">
            <RailStops />
          </linearGradient>
        </defs>
        <path
          d={RAIL_PATH_V}
          fill="none"
          stroke="url(#rhythm-rail-v)"
          strokeWidth={1.5}
          strokeLinecap="round"
        />
      </svg>

      {/* Desktop: the horizontal wave the nodes sit on. */}
      <svg
        aria-hidden
        focusable="false"
        viewBox={RAIL_VIEWBOX_H}
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-x-0 top-0 hidden w-full lg:block"
        style={{ height: VIEW_H }}
      >
        <defs>
          <linearGradient id="rhythm-rail-h" x1="0" y1="0" x2="1" y2="0">
            <RailStops />
          </linearGradient>
        </defs>
        {/* The only motion this section owns: the rail draws itself in once.
            Purpose is continuity — it reads as a day unfolding rather than as
            six unrelated circles. §2.5 hands this section the deck's busiest
            aurora field, so nothing else here moves. */}
        <motion.path
          d={RAIL_PATH_H}
          fill="none"
          stroke="url(#rhythm-rail-h)"
          strokeWidth={1.5}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1.4, ease: [...EASE_SOFT] }}
        />
      </svg>

      {/* `absolute inset-0` gives the reveal the container's exact box, so the
          nodes inside keep positioning against it while it animates. */}
      <Reveal className="absolute inset-0" y={16}>
        {NODES.map((node, index) => (
          <div
            key={node.copyKey}
            style={nodePlacement(index, node.size) as CSSProperties}
            className={cn(
              // Below lg: a full-width row — circle on the rail, labels right.
              "absolute inset-x-0 top-[var(--row-y)] h-[var(--row-h)]",
              // lg: a centred column hanging from the node axis.
              "lg:top-0 lg:right-auto lg:left-[var(--node-x)] lg:h-auto lg:w-auto",
              "lg:flex lg:-translate-x-1/2 lg:flex-col lg:items-center lg:pt-[var(--node-pt)]",
            )}
          >
            <div
              className={cn(
                "absolute top-1/2 left-[var(--circle-x)] -translate-x-1/2 -translate-y-1/2",
                "sm:left-[var(--circle-x-md)]",
                "lg:static lg:translate-none",
              )}
            >
              <div className="relative">
                {node.kind === "photo" ? (
                  <>
                    {/* A bordered sibling rather than `ring-offset`: a
                        transparent ring-offset fills its gap with the ring
                        colour, and the ground behind it is the page's
                        gradient, not a flat fill that could be matched. */}
                    <span
                      aria-hidden
                      className={cn("absolute rounded-full border-2", node.ring, node.ringInset)}
                    />
                    {/* The source is a 252px square whose corners carry ring
                        and dot artwork — only its inscribed circle is clean,
                        so this mask is load-bearing, not decorative. */}
                    <span className="relative block size-22 overflow-hidden rounded-full lg:size-[var(--node-size)]">
                      <Image
                        src={node.src}
                        alt={timeline[node.copyKey].alt}
                        fill
                        sizes={`(min-width: 1024px) ${node.size}px, 88px`}
                        className="object-cover"
                      />
                    </span>
                  </>
                ) : (
                  <span className="bg-surface-card shadow-node flex size-15 items-center justify-center rounded-full lg:size-[81px]">
                    <node.icon className={cn("size-6 lg:size-8", node.iconColor)} />
                  </span>
                )}

                {/* §3.5: an 8px dot on the wave beneath the node, bridging
                    circle and line. Only the horizontal rail runs under the
                    nodes, so the dot is a desktop detail. */}
                <span
                  aria-hidden
                  className={cn(
                    "absolute bottom-0 left-1/2 hidden size-2 -translate-x-1/2 rounded-full lg:block",
                    node.dot,
                  )}
                />
              </div>
            </div>

            <div
              className="absolute top-1/2 -translate-y-1/2 lg:static lg:mt-4 lg:translate-none lg:text-center"
              style={{ left: LABEL_X }}
            >
              <p className="text-card-title text-ink-800">{timeline[node.copyKey].title}</p>
              <p className={cn("text-[0.9375rem] leading-[1.35] font-medium", node.label)}>
                {timeline[node.copyKey].sub}
              </p>
            </div>
          </div>
        ))}
      </Reveal>
    </div>
  );
}
