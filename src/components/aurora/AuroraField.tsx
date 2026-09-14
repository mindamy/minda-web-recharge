import type { CSSProperties } from "react";

import { cn } from "@/lib/cn";

import { bundlePaths, bundleSpan, type BundleSpec } from "./geometry";

/**
 * Decorative aurora wave field — a Server Component.
 *
 * No `"use client"`, no hooks, no handlers: the whole graphic is static markup
 * computed from its props, and the only motion is a CSS keyframe on the bundle
 * groups. See `geometry.ts` for the path math and DESIGN-SPEC.md §2.5 for the
 * measurements behind the defaults.
 *
 * ### Why every stroke is nearly invisible
 *
 * Per-stroke opacity is capped at 0.18 and stroke width at 1px. The visible
 * ribbon is produced by *accumulation* where 6-40 strokes overlap along a
 * caustic. Raise a single stroke's opacity and the field stops looking like
 * light and starts looking like line art.
 *
 * ### `id` must be unique per mounted field
 *
 * Gradient `<defs>` ids are derived from the `id` prop (`${id}-b0`, `${id}-b1`,
 * ...) — deterministic, so server and client markup match, and never random.
 * Two fields sharing an `id` will collide on those ids and the second one will
 * silently inherit the first one's gradient. The prop is required for exactly
 * that reason.
 */

/** Stroke hues, sampled from the deck. DESIGN-SPEC.md §2.5, "Colours (measured)". */
export const HUES = {
  blue: "#B5C1FB",
  green: "#A8D4BE",
  rose: "#F4C1CF",
  lavender: "#CBD3F7",
} as const;

/**
 * Stroke colours for the prominent fields (hero, final CTA, the Rhythm rose).
 *
 * `HUES` above cannot produce the deck's dense fields, and the arithmetic says
 * why. A 1px stroke at alpha 0.14 over the #F8F9FC ground can shift a pixel by
 * at most `0.14 x 248 = 35` per channel even if the stroke were pure black. The
 * measured #B5C1FB is 67 below the ground in red — so #B5C1FB is not a stroke
 * colour at all, it is what *two or three* saturated hairlines already render
 * as. Treating it as the stroke colour caps the whole field at roughly a third
 * of the deck's contrast, which is exactly what the first render did.
 *
 * These are solved backwards from the deck's peak accumulations instead. For
 * the blue rim of p-8's lower band, measured #A1AEF7 over a #F8F9FC ground with
 * ~6 strokes overlapping at 0.15 (coverage `1 - 0.85^6 = 0.623`):
 *
 *     stroke = ground - (ground - measured) / 0.623  =>  rgb(108, 129, 244)
 *
 * which is #6C81F4 — within a hair of the design system's own
 * `border-blue-cta` #6B8BEC. The same solve on #F6A9BD gives #F57E9B (the
 * deck's own rose-400 neighbourhood) and on #C8E4D9 gives #8ECBAF.
 */
export const CORE_HUES = {
  blue: "#6C81F4",
  green: "#79C3A4",
  rose: "#F57E9B",
  lavender: "#9AA6EE",
} as const;

/**
 * Ochre-neutral, measured at p-8 (700-780, 620-660) where the green and rose
 * halves of the lower band cross: #D9D8CA. Used as the middle stop of a
 * green -> rose bundle, because a straight sRGB blend of the two lands a touch
 * too pink and loses the olive cast.
 */
export const OCHRE = "#CFCDBE";

export type AuroraHue = keyof typeof HUES;

/** A named hue, or any literal hex. */
export type AuroraColor = AuroraHue | `#${string}`;

/**
 * A ramp stop pinned to a position along the bundle's span, `0` = `x0`,
 * `1` = `x1`. Needed when the hue has to change at a specific feature rather
 * than at an even division — p-8's band goes neutral where the green and rose
 * halves actually cross, which is not its midpoint.
 */
export type AuroraGradientStop = {
  color: AuroraColor;
  at: number;
  /**
   * 0-1 multiplier on the bundle's stroke opacity at this point along the
   * span. Effective alpha is `opacity x stop-opacity`, which is the only way
   * to vary a single continuous stroke's weight along its own length — a
   * bundle that runs blue at one end and rose at the other needs it, because
   * the two hues do not reach the deck's density at the same alpha.
   */
  opacity?: number;
};

/**
 * One colour, or a ramp applied along the bundle's length via a
 * `<linearGradient>` on the stroke (p-8's lower band: green left, ochre at the
 * crossing, rose right). Bare colours are spaced evenly across the span.
 */
export type AuroraStops =
  | AuroraColor
  | readonly (AuroraColor | AuroraGradientStop)[];

export type AuroraBundle = Omit<BundleSpec, "width" | "height"> & {
  hue: AuroraStops;
  /** Per-stroke opacity. Clamped to 0.10-0.18. Default 0.14. */
  opacity?: number;
  /** Hairline weight. Clamped to 0.5-1. Default 0.75. */
  strokeWidth?: number;
  /**
   * Which drift keyframe this bundle rides. Offsetting bundles onto different
   * speeds is what makes the field breathe instead of sliding as one sheet.
   */
  drift?: "slow" | "slower" | "none";
  /**
   * Fraction of the span at each end over which the bundle fades to fully
   * transparent, via a mask.
   *
   * Needed whenever a bundle *ends* inside the viewBox. The geometry's
   * amplitude taper collapses every stroke onto the axis at the span's ends,
   * which stacks the entire bundle into one hard, fully-opaque line — barely
   * noticeable off-canvas, glaring on-canvas. Fading the paint out over the
   * same region is what actually makes a ribbon dissolve.
   */
  fade?: number;
};

export type AuroraFieldProps = {
  /** Unique per mounted field — scopes the gradient `<defs>` ids. */
  id: string;
  bundles: readonly AuroraBundle[];
  /** viewBox width. Defaults to the deck's 1448px reference. */
  width?: number;
  /** viewBox height. Defaults to the shared 960px normalised canvas. */
  height?: number;
  className?: string;
  /**
   * Defaults to `"none"`.
   *
   * A section field is a full-bleed decorative band whose placement is
   * proportional to the section box, so stretching it is correct: the bundles
   * keep their share of the section however tall it renders, and every path
   * carries `vectorEffect="non-scaling-stroke"` so hairlines stay hairlines
   * under any non-uniform scale. Pass `"xMidYMid slice"` instead when the field
   * is inside a card, where the wave's own shape has to survive intact and
   * cropping is preferable to squashing.
   */
  preserveAspectRatio?: string;
  style?: CSSProperties;
};

/** The shared normalised canvas all section presets are authored against. */
export const FIELD_WIDTH = 1448;
export const FIELD_HEIGHT = 960;

const MIN_OPACITY = 0.1;
const MAX_OPACITY = 0.18;
const MIN_STROKE = 0.5;
const MAX_STROKE = 1;

const DRIFT_CLASS = {
  slow: "animate-drift-slow",
  slower: "animate-drift-slower",
  none: undefined,
} as const;

/**
 * `transform-box: view-box` makes the keyframe's percentage translate resolve
 * against the SVG viewport rather than the group's own tight bounding box, so
 * every bundle drifts by the same distance instead of by a fraction of its own
 * size. Declared here rather than in globals.css because it is a property of
 * *this* usage of the animation, not of the animation.
 */
const DRIFT_STYLE: CSSProperties = {
  transformBox: "view-box",
  transformOrigin: "center",
  willChange: "transform",
};

function resolveColor(c: AuroraColor): string {
  return c in HUES ? HUES[c as AuroraHue] : c;
}

type ResolvedStop = { color: string; offset: string; opacity: number };

function resolveStops(
  hue: AuroraStops,
): { single: string } | { ramp: readonly ResolvedStop[] } {
  if (!Array.isArray(hue)) return { single: resolveColor(hue as AuroraColor) };

  const list = hue as readonly (AuroraColor | AuroraGradientStop)[];
  if (list.length === 1) return { single: resolveColor(list[0] as AuroraColor) };

  const last = list.length - 1;
  return {
    ramp: list.map((stop, i) => {
      const even = i / last;
      const at = typeof stop === "string" ? even : clamp(stop.at, 0, 1);
      return {
        color: resolveColor(typeof stop === "string" ? stop : stop.color),
        offset: `${(at * 100).toFixed(2)}%`,
        opacity: typeof stop === "string" ? 1 : clamp(stop.opacity ?? 1, 0, 1),
      };
    }),
  };
}

function clamp(v: number, lo: number, hi: number): number {
  return v < lo ? lo : v > hi ? hi : v;
}

export function AuroraField({
  id,
  bundles,
  width = FIELD_WIDTH,
  height = FIELD_HEIGHT,
  className,
  preserveAspectRatio = "none",
  style,
}: AuroraFieldProps) {
  const resolved = bundles.map((bundle, index) => {
    const spec: BundleSpec = { ...bundle, width, height };
    const resolvedHue = resolveStops(bundle.hue);
    const gradientId = "ramp" in resolvedHue ? `${id}-b${index}` : undefined;
    const [x0, x1] = bundleSpan(spec);
    const fade = clamp(bundle.fade ?? 0, 0, 0.5);

    return {
      key: `${id}-b${index}`,
      paths: bundlePaths(spec),
      stroke:
        "ramp" in resolvedHue ? `url(#${gradientId})` : resolvedHue.single,
      gradient:
        "ramp" in resolvedHue && gradientId
          ? { id: gradientId, x0, x1, stops: resolvedHue.ramp }
          : undefined,
      mask:
        fade > 0
          ? { id: `${id}-m${index}`, x0, x1, fade, width, height }
          : undefined,
      opacity: clamp(bundle.opacity ?? 0.14, MIN_OPACITY, MAX_OPACITY),
      strokeWidth: clamp(bundle.strokeWidth ?? 0.75, MIN_STROKE, MAX_STROKE),
      driftClass: DRIFT_CLASS[bundle.drift ?? "none"],
    };
  });

  const gradients = resolved.flatMap((b) => (b.gradient ? [b.gradient] : []));
  const masks = resolved.flatMap((b) => (b.mask ? [b.mask] : []));

  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio={preserveAspectRatio}
      className={cn("pointer-events-none absolute inset-0 h-full w-full", className)}
      style={style}
    >
      {(gradients.length > 0 || masks.length > 0) && (
        <defs>
          {gradients.map((g) => (
            <linearGradient
              key={g.id}
              id={g.id}
              gradientUnits="userSpaceOnUse"
              x1={g.x0}
              y1={0}
              x2={g.x1}
              y2={0}
            >
              {g.stops.map((stop, i) => (
                <stop key={i} offset={stop.offset} stopColor={stop.color} />
              ))}
            </linearGradient>
          ))}

          {masks.map((m) => (
            <mask key={m.id} id={m.id} maskUnits="userSpaceOnUse">
              <linearGradient
                id={`${m.id}-ramp`}
                gradientUnits="userSpaceOnUse"
                x1={m.x0}
                y1={0}
                x2={m.x1}
                y2={0}
              >
                <stop offset="0%" stopColor="#fff" stopOpacity={0} />
                <stop offset={`${(m.fade * 100).toFixed(2)}%`} stopColor="#fff" stopOpacity={1} />
                <stop
                  offset={`${((1 - m.fade) * 100).toFixed(2)}%`}
                  stopColor="#fff"
                  stopOpacity={1}
                />
                <stop offset="100%" stopColor="#fff" stopOpacity={0} />
              </linearGradient>
              {/* Covers the whole span, not just the viewBox, so the ramp is
                  anchored to the bundle and unaffected by the drift transform. */}
              <rect
                x={m.x0}
                y={-m.height}
                width={m.x1 - m.x0}
                height={m.height * 3}
                fill={`url(#${m.id}-ramp)`}
              />
            </mask>
          ))}
        </defs>
      )}

      {resolved.map((bundle) => (
        <g
          key={bundle.key}
          className={bundle.driftClass}
          style={bundle.driftClass ? DRIFT_STYLE : undefined}
          mask={bundle.mask ? `url(#${bundle.mask.id})` : undefined}
          fill="none"
          stroke={bundle.stroke}
          strokeWidth={bundle.strokeWidth}
          strokeOpacity={bundle.opacity}
          strokeLinecap="round"
        >
          {bundle.paths.map((d, i) => (
            <path key={i} d={d} vectorEffect="non-scaling-stroke" />
          ))}
        </g>
      ))}
    </svg>
  );
}
