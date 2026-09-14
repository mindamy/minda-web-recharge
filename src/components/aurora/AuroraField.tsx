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
 * These are solved backwards from the deck's peak accumulations instead. The
 * blue rim of p-8's lower band measures #A1AEF7; in a nested ribbon only about
 * three strokes overlap there, so at alpha 0.18 the coverage is
 * `1 - 0.82^3 = 0.449` and
 *
 *     stroke = ground - (ground - measured) / 0.449  =>  rgb(56, 83, 241)
 *
 * The answer lands on the project's own `blue-fill` / `blue-ink` pair, and the
 * same solve on #F6A9BD gives the `rose-400`/`rose-500` neighbourhood. That is
 * the actual technique behind the graphic: hairlines in the *brand* colours at
 * ~15% opacity, where two or three overlapping strokes render as the pale
 * values in `HUES`. These values are deliberately a step back from fully
 * saturated brand colour, because the deck's fans overlap more than three deep
 * in places and full saturation turns those spots into ink.
 */
export const CORE_HUES = {
  blue: "#3A57EE",
  green: "#5FB894",
  rose: "#F04A78",
  lavender: "#6E77E8",
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
   * Fraction of the span over which the bundle fades to fully transparent, via
   * a mask. A single number fades both ends; `[start, end]` fades them
   * independently, and `0` on one side leaves it at full strength.
   *
   * Needed whenever a bundle *ends* inside the viewBox. The geometry's
   * amplitude taper collapses every stroke onto the axis at the span's ends,
   * which stacks the entire bundle into one hard, fully-opaque line — barely
   * noticeable off-canvas, glaring on-canvas. Fading the paint out over the
   * same region is what actually makes a ribbon dissolve, so the fade wants to
   * be at least as wide as `taper` (0.26 by default).
   *
   * Use the tuple form for a bundle that ends inside the box at one end and
   * bleeds off an edge at the other, which is most of them: a symmetric fade
   * would dim the bleeding edge, and a field that fades out before it reaches
   * the viewport edge stops reading as something that continues past it.
   */
  fade?: number | readonly [number, number];
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
    const [fadeIn, fadeOut] = Array.isArray(bundle.fade)
      ? [clamp(bundle.fade[0], 0, 0.5), clamp(bundle.fade[1], 0, 0.5)]
      : [
          clamp((bundle.fade as number) ?? 0, 0, 0.5),
          clamp((bundle.fade as number) ?? 0, 0, 0.5),
        ];
    const fade = fadeIn > 0 || fadeOut > 0;

    return {
      key: `${id}-b${index}`,
      paths: bundlePaths(spec),
      stroke:
        "ramp" in resolvedHue ? `url(#${gradientId})` : resolvedHue.single,
      gradient:
        "ramp" in resolvedHue && gradientId
          ? { id: gradientId, x0, x1, stops: resolvedHue.ramp }
          : undefined,
      mask: fade
        ? { id: `${id}-m${index}`, x0, x1, fadeIn, fadeOut, height }
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
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full",
        /*
         * Damped on small screens. The field scales with
         * `preserveAspectRatio="none"`, so a bundle tuned at the deck's
         * 1448px reference gets squeezed to roughly a quarter of that width
         * on a phone — which packs the same stroke count into a quarter of
         * the horizontal space and turns a whisper into a visible ribbon.
         * DESIGN-SPEC §4 asks for decoration to be simplified at these
         * widths; damping the whole field is the least destructive way,
         * since it keeps the geometry and the caustic nodes intact.
         */
        "opacity-45 sm:opacity-70 lg:opacity-100",
        className,
      )}
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
                <stop
                  key={i}
                  offset={stop.offset}
                  stopColor={stop.color}
                  stopOpacity={stop.opacity}
                />
              ))}
            </linearGradient>
          ))}

          {masks.map((m) => (
            /* The mask *region* is declared explicitly. `maskUnits` only
               governs x/y/width/height, whose defaults are -10%/-10%/120%/120%
               — under `userSpaceOnUse` that resolves against the viewport and
               would clip a bundle at 110% of the viewBox width, which several
               of these deliberately exceed. */
            <mask
              key={m.id}
              id={m.id}
              maskUnits="userSpaceOnUse"
              x={m.x0}
              y={-m.height}
              width={m.x1 - m.x0}
              height={m.height * 3}
            >
              <linearGradient
                id={`${m.id}-ramp`}
                gradientUnits="userSpaceOnUse"
                x1={m.x0}
                y1={0}
                x2={m.x1}
                y2={0}
              >
                <stop offset="0%" stopColor="#fff" stopOpacity={m.fadeIn > 0 ? 0 : 1} />
                <stop
                  offset={`${(m.fadeIn * 100).toFixed(2)}%`}
                  stopColor="#fff"
                  stopOpacity={1}
                />
                <stop
                  offset={`${((1 - m.fadeOut) * 100).toFixed(2)}%`}
                  stopColor="#fff"
                  stopOpacity={1}
                />
                <stop offset="100%" stopColor="#fff" stopOpacity={m.fadeOut > 0 ? 0 : 1} />
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
