import { cn } from "@/lib/cn";

import { waveformPaths, type WaveformSpec } from "./geometry";

/**
 * The bounded audio-player waveform from p-3 — a Server Component.
 *
 * Same primitive as `AuroraField`, but symmetric about a horizontal axis and
 * horizontally bounded: three lens/spindle lobes separated by two pinch nodes,
 * with amplitude peaking at each lobe centre and reaching exactly zero at every
 * node. DESIGN-SPEC.md §2.5, "The audio waveform (p-3)".
 *
 * Node fractions were re-measured off a 3x contrast-boosted crop of the player
 * card. The drawn wave starts with a ~16% flat lead-in (a near-collapsed
 * bundle, not a gap), then node 1 lands at 42% and node 2 at 68% of the width,
 * matching the spec. The lead-in is modelled as a fourth lobe at 5% amplitude
 * rather than as dead space, because in the deck it is a visible thickened
 * line rather than nothing.
 */

/** Lobe hues, measured left -> right off p-3. */
export const WAVEFORM_HUES = {
  blue: "#A9BEF2",
  rose: "#F06E9A",
  green: "#8CC9AE",
} as const;

/** Fractions of width. Index 0 and 4 are the bounded ends. */
const NODES = [0, 0.16, 0.42, 0.68, 1] as const;

/** Per-lobe peak: flat lead-in, blue, rose (tallest), green (shortest). */
const LOBE_AMPLITUDES = [0.05, 0.88, 1, 0.62] as const;

export type AuroraWaveformProps = {
  /** Unique per mounted waveform — scopes the gradient and clip `<defs>` ids. */
  id: string;
  className?: string;
  /** Default 480 — the measured player width at the 1448px reference. */
  width?: number;
  /** Default 90. */
  height?: number;
  /** Default 30. */
  strokes?: number;
  /** Per-stroke opacity, clamped 0.10-0.18. Default 0.16. */
  opacity?: number;
};

export function AuroraWaveform({
  id,
  className,
  width = 480,
  height = 90,
  strokes = 30,
  opacity = 0.16,
}: AuroraWaveformProps) {
  const base: WaveformSpec = {
    strokes,
    width,
    height,
    amplitude: height * 0.34,
    nodes: NODES,
    lobeAmplitudes: LOBE_AMPLITUDES,
    phaseSpread: Math.PI,
    skew: 6,
    jitter: 0.06,
    seed: 7,
  };

  const paths = waveformPaths(base);

  // Lobes 2 and 3 are the densest in the deck, and density is a stroke *count*,
  // not an opacity — so it gets its own pass, clipped to the span right of
  // node 1. The clip edge is placed exactly on a node, where every stroke has
  // collapsed onto the axis, so the cut has nothing to cut.
  const densePaths = waveformPaths({ ...base, strokes: 14, jitter: 0.3, seed: 23 });

  const gradientId = `${id}-wave`;
  const clipId = `${id}-dense`;
  const alpha = Math.min(0.18, Math.max(0.1, opacity));
  const node1 = NODES[2] * width;

  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      className={cn("pointer-events-none", className)}
    >
      <defs>
        {/*
          Stop opacity carries the left-to-right saturation ramp measured in the
          deck: the blue lobe is the palest, the rose lobe the most saturated.
          Effective alpha is stroke-opacity x stop-opacity, which is the only
          way to vary a single continuous stroke's weight along its own length.
        */}
        <linearGradient
          id={gradientId}
          gradientUnits="userSpaceOnUse"
          x1={0}
          y1={0}
          x2={width}
          y2={0}
        >
          <stop offset="0%" stopColor={WAVEFORM_HUES.blue} stopOpacity={0.66} />
          <stop offset="25%" stopColor={WAVEFORM_HUES.blue} stopOpacity={0.8} />
          <stop offset="45%" stopColor={WAVEFORM_HUES.rose} stopOpacity={1} />
          <stop offset="63%" stopColor={WAVEFORM_HUES.rose} stopOpacity={1} />
          <stop offset="74%" stopColor={WAVEFORM_HUES.green} stopOpacity={0.9} />
          <stop offset="100%" stopColor={WAVEFORM_HUES.green} stopOpacity={0.8} />
        </linearGradient>
        <clipPath id={clipId}>
          <rect x={node1} y={0} width={width - node1} height={height} />
        </clipPath>
      </defs>

      <g
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeWidth={0.7}
        strokeOpacity={alpha}
        strokeLinecap="round"
      >
        {paths.map((d, i) => (
          <path key={i} d={d} vectorEffect="non-scaling-stroke" />
        ))}
      </g>

      <g
        clipPath={`url(#${clipId})`}
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeWidth={0.7}
        strokeOpacity={alpha}
        strokeLinecap="round"
      >
        {densePaths.map((d, i) => (
          <path key={i} d={d} vectorEffect="non-scaling-stroke" />
        ))}
      </g>
    </svg>
  );
}
