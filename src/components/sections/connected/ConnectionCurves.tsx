import { cn } from "@/lib/cn";

/**
 * The hairline curve system that knits zone A -> C -> D together.
 *
 * Three strands — blue, green, rose, one per pillar — fan out of the
 * fragmented stack, thread through the mini-card scatter, converge on the
 * portrait's left edge, and re-fan out of its right edge into the unified
 * circle. That convergence *is* the section's argument, drawn rather than
 * written, so the strands are the one piece of decoration here that carries
 * meaning.
 *
 * Two implementation notes that are easy to get wrong:
 *
 * 1. `preserveAspectRatio="none"` lets the viewBox map exactly onto the
 *    diagram's four grid tracks (220 / 250 / 325 / 490 fr, 12px gaps) at any
 *    container width, so the endpoints stay glued to the cards and the
 *    portrait as the layout breathes. `vectorEffect="non-scaling-stroke"`
 *    then keeps the hairlines 1px and the dots round under that distortion —
 *    without it, the stretch would turn every dot into an ellipse.
 * 2. Each strand is stroked with a gradient that fades to zero alpha at both
 *    ends, which is how the deck's strands dissolve into the ground instead of
 *    stopping dead.
 *
 * Dropped entirely below `lg` by `Connected` — see DESIGN-SPEC §4.2.
 */

const HUES = {
  blue: "#3b82f0",
  green: "#3ea876",
  rose: "#e8467c",
} as const;

type Hue = keyof typeof HUES;

/** Left fan: card right edge -> through the scatter -> portrait left edge. */
const INBOUND: readonly { hue: Hue; d: string }[] = [
  {
    hue: "blue",
    d: "M 220 148 C 300 148 362 158 430 164 C 466 167 486 172 500 178",
  },
  {
    hue: "green",
    d: "M 220 256 C 300 256 380 240 450 224 C 478 218 490 214 496 210",
  },
  {
    hue: "rose",
    d: "M 220 364 C 300 364 360 330 430 292 C 466 272 486 254 500 242",
  },
];

/** Right fan: portrait right edge -> out to the unified circle's ring. */
const OUTBOUND: readonly { hue: Hue; d: string }[] = [
  {
    hue: "blue",
    d: "M 813 178 C 836 170 856 150 884 128 C 900 116 906 108 908 100",
  },
  {
    hue: "green",
    d: "M 817 210 C 846 210 862 206 880 204 C 890 203 896 202 900 202",
  },
  {
    hue: "rose",
    d: "M 813 242 C 836 252 856 272 884 292 C 900 304 906 312 908 320",
  },
];

/** Endpoint dots. Three on each edge of the portrait, six loose in the scatter. */
const DOTS: readonly { hue: Hue; x: number; y: number; r: number }[] = [
  { hue: "blue", x: 500, y: 178, r: 5 },
  { hue: "green", x: 496, y: 210, r: 5 },
  { hue: "rose", x: 500, y: 242, r: 5 },
  { hue: "blue", x: 813, y: 178, r: 5 },
  { hue: "green", x: 817, y: 210, r: 5 },
  { hue: "rose", x: 813, y: 242, r: 5 },
  { hue: "blue", x: 241, y: 73, r: 5 },
  { hue: "blue", x: 349, y: 92, r: 4 },
  { hue: "green", x: 246, y: 215, r: 5 },
  { hue: "rose", x: 259, y: 283, r: 5 },
  { hue: "rose", x: 336, y: 308, r: 4 },
  { hue: "rose", x: 258, y: 345, r: 5 },
];

export function ConnectionCurves({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1321 420"
      preserveAspectRatio="none"
      fill="none"
      aria-hidden
      focusable="false"
      className={cn("h-full w-full", className)}
    >
      <defs>
        {(Object.keys(HUES) as Hue[]).map((hue) => (
          <linearGradient key={hue} id={`connected-strand-${hue}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={HUES[hue]} stopOpacity={0} />
            <stop offset="26%" stopColor={HUES[hue]} stopOpacity={0.4} />
            <stop offset="74%" stopColor={HUES[hue]} stopOpacity={0.4} />
            <stop offset="100%" stopColor={HUES[hue]} stopOpacity={0} />
          </linearGradient>
        ))}
      </defs>

      {[...INBOUND, ...OUTBOUND].map((strand) => (
        <path
          key={strand.d}
          d={strand.d}
          stroke={`url(#connected-strand-${strand.hue})`}
          strokeWidth={1}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      ))}

      {DOTS.map((dot) => (
        // A round cap on a near-zero-length path renders a true circle whose
        // diameter is immune to the viewBox stretch, which `<circle>` is not.
        <path
          key={`${dot.hue}-${dot.x}-${dot.y}`}
          d={`M ${dot.x} ${dot.y} h 0.01`}
          stroke={HUES[dot.hue]}
          strokeWidth={dot.r}
          strokeLinecap="round"
          strokeOpacity={0.85}
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  );
}
