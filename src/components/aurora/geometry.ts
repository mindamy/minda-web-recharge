/**
 * Aurora wave geometry — pure path math, no React, no DOM, no randomness.
 *
 * See `.planning/quick/quick-kayinleong-001/DESIGN-SPEC.md` §2.5. The deck's
 * decorative wave fields are bundles of 28-45 hairline curves that **pinch to a
 * caustic node** and **fan to a wide spindle** between nodes. Those nodes are
 * the graphic's signature.
 *
 * ## The model
 *
 * Every stroke in a bundle is
 *
 *     θᵢ(x) = k·x + phase + skew·cᵢ
 *     yᵢ(x) = y₀(x) + A(x)·cᵢ·[ sin θᵢ + harmonic·sin(2θᵢ + 0.7) ]
 *
 * where `φᵢ` advances linearly across the bundle and `cᵢ = sin φᵢ` is the
 * stroke's *signed* amplitude coefficient.
 *
 * Two properties fall out of writing the family this way, and both were checked
 * against contrast-boosted 3x crops of `p-8` and `p-3`:
 *
 * 1. **Exact caustic nodes.** Every stroke shares `sin(k·x + phase)`, so all of
 *    them cross `y₀` at the same x — the bundle pinches to a point every
 *    `wavelength / 2` and fans to `2·amplitude` between pinches. A plain phase
 *    offset (`sin(k·x + φᵢ)`, no shared zero) cannot do this: at a φ spread of
 *    0.9π its tightest waist is still ~40% of its widest fan, which reads as a
 *    lumpy ribbon rather than the deck's knotted spindles.
 * 2. **Bright envelope edges.** `cᵢ = sin φᵢ` clusters near ±1 as φ sweeps a
 *    ~π range, so strokes pile up along the spindle's outer envelope exactly
 *    the way the deck's fans have a brighter rim than interior.
 *
 * `skew` shifts each stroke along x in proportion to its own amplitude, which
 * shears the spindles slightly and makes strokes cross near the nodes — the
 * last thing needed to stop the fans looking like nested contour lines.
 *
 * ## Determinism
 *
 * There is no `Math.random()` anywhere in this file. Optional jitter is drawn
 * from `mulberry32(seed)`, so a given spec always yields byte-identical path
 * strings on the server and in the browser. Anything else is a hydration
 * mismatch waiting to happen.
 */

/** Reference viewport width every measurement in DESIGN-SPEC.md is quoted at. */
export const REFERENCE_WIDTH = 1448;

/**
 * mulberry32 — 32-bit PRNG, ~4 ops, uniform enough for decorative jitter.
 * Pure: same seed, same sequence, forever.
 */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type BundleSpec = {
  /** Strokes in the bundle. 28-45 per DESIGN-SPEC.md §2.5. */
  strokes: number;
  /** viewBox width. The bundle's span defaults to overflowing it on both sides. */
  width: number;
  /** viewBox height. Used only to clamp emitted coordinates to a sane band. */
  height: number;
  /** y of the bundle axis at mid-span. */
  baseline: number;
  /**
   * Peak half-thickness of the spindle, before end taper. The widest fan is
   * `2 * amplitude`; at a node the bundle collapses to `spread` px.
   */
  amplitude: number;
  /** Distance between successive crests. Node spacing is half of this. */
  wavelength: number;
  /**
   * Total φ spread across the bundle, in radians. π gives a fully symmetric
   * spindle (strokes reach both +A and -A); below π the spindle goes one-sided
   * and the bundle reads as a leaning ribbon.
   */
  phaseSpread: number;
  /** Shallow drift of the axis across the span, in degrees. */
  tilt?: number;
  /** Points sampled per stroke before Catmull-Rom smoothing. Default 56. */
  samples?: number;
  /** Span start. Default `-0.18 * width` so the bundle bleeds off the left. */
  x0?: number;
  /** Span end. Default `1.18 * width` so the bundle bleeds off the right. */
  x1?: number;
  /**
   * Pin a caustic node to this x. Solves `phase` so `sin(k·x + phase) = 0`
   * there; further nodes land every `wavelength / 2` either side.
   */
  nodeAt?: number;
  /** Phase offset in radians. Ignored when `nodeAt` is given. Default 0. */
  phase?: number;
  /**
   * Fraction of the span over which amplitude ramps from 0, at each end, so
   * ribbons dissolve instead of stopping dead. Default 0.26.
   */
  taper?: number;
  /** Per-stroke x shear, in radians of θ. Default 0.22. Set 0 for nested fans. */
  skew?: number;
  /**
   * Relative weight of the 2nd harmonic, which sharpens one flank of each
   * crest so the wave does not read as a textbook sine. Default 0.16. It is
   * `sin 2θ`, *not* `sin(2θ + φ)`: an offset second harmonic does not vanish
   * where the fundamental does, which fills the caustic nodes back in.
   */
  harmonic?: number;
  /**
   * Per-stroke axis offset spread, px — opens the node from a mathematical
   * point into a thin band, which is what the deck actually shows (p-8's
   * tightest waist is a ~12px band, not a point). Keep it under ~10; beyond
   * that it starts eating the pinch.
   */
  spread?: number;
  /**
   * 0-1 deterministic per-stroke *amplitude* jitter. Default 0.
   *
   * Deliberately not applied to phase: a per-stroke phase offset destroys the
   * shared zero that makes the node, and even 0.07 of amplitude jitter visibly
   * scatters the outer strokes that stack into the bright envelope rim. Values
   * above ~0.03 trade the graphic's signature for texture it does not need.
   */
  jitter?: number;
  /**
   * 0-1 fraction of the span by which stroke ends are scattered, so the two
   * ends of a bundle dissolve instead of collapsing every stroke onto one
   * point. A collapsed end stacks the whole bundle into a single hard line
   * and is very visible if it lands inside the viewBox. Default 0.
   */
  stagger?: number;
  /** Seed for the jitter PRNG. Default 1. */
  seed?: number;
};

const DEFAULT_SAMPLES = 56;
const DEFAULT_TAPER = 0.26;
const DEFAULT_SKEW = 0.22;
const DEFAULT_HARMONIC = 0.16;

/** Smoothstep-based end taper: 0 at both span ends, 1 across the middle. */
export function endTaper(u: number, taper: number): number {
  if (taper <= 0) return 1;
  const t = Math.min(taper, 0.5);
  return smoothstep(u / t) * smoothstep((1 - u) / t);
}

function smoothstep(v: number): number {
  const c = v <= 0 ? 0 : v >= 1 ? 1 : v;
  return c * c * (3 - 2 * c);
}

function clamp(v: number, lo: number, hi: number): number {
  return v < lo ? lo : v > hi ? hi : v;
}

/**
 * The x span a bundle actually occupies, applying the same defaults as
 * {@link bundlePaths}. Callers need this to anchor a `<linearGradient>` in user
 * space to the bundle's length rather than to its bounding box.
 */
export function bundleSpan(spec: Pick<BundleSpec, "width" | "x0" | "x1">): [number, number] {
  return [spec.x0 ?? -0.18 * spec.width, spec.x1 ?? 1.18 * spec.width];
}

/**
 * x positions of the caustic nodes that fall inside `[0, width]`. Useful for
 * placing a hue transition on a node, and for eyeballing a field in dev.
 */
export function bundleNodes(spec: BundleSpec): number[] {
  const k = (2 * Math.PI) / spec.wavelength;
  const phase = spec.nodeAt === undefined ? (spec.phase ?? 0) : -k * spec.nodeAt;
  const half = spec.wavelength / 2;
  // sin(k·x + phase) = 0  =>  x = (nπ - phase) / k
  const first = -phase / k;
  const out: number[] = [];
  const n0 = Math.ceil((0 - first) / half);
  for (let n = n0; ; n++) {
    const x = first + n * half;
    if (x > spec.width) break;
    out.push(round2(x));
  }
  return out;
}

/**
 * Build one SVG path string per stroke in the bundle.
 *
 * Paths are cubic (`C`) throughout — a polyline of `L` segments is visibly
 * faceted at 0.5-1px and 0.1 opacity, where every kink reads as a dark pixel.
 */
export function bundlePaths(spec: BundleSpec): string[] {
  const {
    strokes,
    width,
    height,
    baseline,
    amplitude,
    wavelength,
    phaseSpread,
    tilt = 0,
    samples = DEFAULT_SAMPLES,
    nodeAt,
    taper = DEFAULT_TAPER,
    skew = DEFAULT_SKEW,
    harmonic = DEFAULT_HARMONIC,
    spread = 0,
    jitter = 0,
    stagger = 0,
    seed = 1,
  } = spec;

  const n = Math.max(2, Math.round(strokes));
  const m = Math.max(8, Math.round(samples));
  const [x0, x1] = bundleSpan(spec);
  const k = (2 * Math.PI) / wavelength;
  const phase = nodeAt === undefined ? (spec.phase ?? 0) : -k * nodeAt;
  const slope = Math.tan((tilt * Math.PI) / 180);
  const midX = width / 2;

  // One PRNG for the whole bundle, advanced in a fixed order per stroke, so
  // jitter is reproducible from `seed` alone.
  const rand = mulberry32(seed);
  const yLo = -height;
  const yHi = 2 * height;

  const out: string[] = [];
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    // φ walks linearly across the bundle; c = sin φ clusters at ±1, which is
    // what puts the bright rim on the spindle envelope.
    const c = Math.sin((t - 0.5) * phaseSpread);
    const ampJitter = 1 + (rand() - 0.5) * 2 * jitter;
    const axisOffset = (t - 0.5) * spread;

    // Scatter this stroke's own start and end inside the bundle's span.
    const lead = stagger === 0 ? 0 : rand() * stagger;
    const trail = stagger === 0 ? 0 : rand() * stagger;
    const sx0 = x0 + (x1 - x0) * lead;
    const sx1 = x1 - (x1 - x0) * trail;

    const pts: [number, number][] = new Array(m);
    for (let s = 0; s < m; s++) {
      const v = s / (m - 1);
      const x = sx0 + (sx1 - sx0) * v;
      // Taper is measured against the *bundle's* span, not the stroke's, so
      // staggered strokes stay in step with the bundle envelope.
      const env = endTaper((x - x0) / (x1 - x0), taper);
      const theta = k * x + phase + skew * c;
      const osc = Math.sin(theta) + harmonic * Math.sin(2 * theta);
      const y =
        baseline +
        slope * (x - midX) +
        env * (axisOffset + amplitude * ampJitter * c * osc);
      pts[s] = [x, clamp(y, yLo, yHi)];
    }
    out.push(toPath(pts));
  }
  return out;
}

export type WaveformSpec = {
  /** Strokes in the bundle. ~30 for the p-3 player. */
  strokes: number;
  /** Drawing width. */
  width: number;
  /** Drawing height; the axis sits at `height / 2` unless `axis` is given. */
  height: number;
  /** y of the symmetry axis. Default `height / 2`. */
  axis?: number;
  /** Peak half-height of the tallest lobe. */
  amplitude: number;
  /**
   * Node positions as fractions of width, ascending, including the two ends.
   * `nodes.length - 1` lobes are drawn between them.
   */
  nodes: readonly number[];
  /** Per-lobe peak, 0-1, one per gap in `nodes`. Default all 1. */
  lobeAmplitudes?: readonly number[];
  /** Total φ spread. π = fully symmetric about the axis. Default π. */
  phaseSpread?: number;
  /** Per-stroke x shear in px. Default 5. Makes strokes cross near the nodes. */
  skew?: number;
  /** Points sampled per stroke. Default 72 — the lobes are tighter than a field. */
  samples?: number;
  /** 0-1 deterministic jitter. Default 0. */
  jitter?: number;
  /** Seed for the jitter PRNG. Default 1. */
  seed?: number;
};

/**
 * Lens/spindle envelope for a multi-lobe standing wave: `peak · sin(π·t)`
 * inside each internode gap, exactly 0 on every node.
 */
export function lobeEnvelope(
  u: number,
  nodes: readonly number[],
  peaks: readonly number[],
): number {
  if (u <= nodes[0] || u >= nodes[nodes.length - 1]) return 0;
  for (let j = 0; j < nodes.length - 1; j++) {
    const a = nodes[j];
    const b = nodes[j + 1];
    if (u >= a && u <= b) {
      const t = b === a ? 0 : (u - a) / (b - a);
      return (peaks[j] ?? 1) * Math.sin(Math.PI * t);
    }
  }
  return 0;
}

/**
 * The bounded p-3 player waveform: the same primitive as {@link bundlePaths},
 * but symmetric about a horizontal axis with the nodes pinned to fixed
 * fractions of the width instead of falling out of a wavelength.
 */
export function waveformPaths(spec: WaveformSpec): string[] {
  const {
    strokes,
    width,
    height,
    axis = height / 2,
    amplitude,
    nodes,
    lobeAmplitudes,
    phaseSpread = Math.PI,
    skew = 5,
    samples = 72,
    jitter = 0,
    seed = 1,
  } = spec;

  const n = Math.max(2, Math.round(strokes));
  const m = Math.max(16, Math.round(samples));
  const peaks = lobeAmplitudes ?? nodes.slice(1).map(() => 1);
  const rand = mulberry32(seed);

  const out: string[] = [];
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    const c = Math.sin((t - 0.5) * phaseSpread);
    const ampJitter = 1 + (rand() - 0.5) * 2 * jitter;
    const shift = (skew * c) / width;

    const pts: [number, number][] = new Array(m);
    for (let s = 0; s < m; s++) {
      const u = s / (m - 1);
      const e = lobeEnvelope(u + shift, nodes, peaks);
      pts[s] = [u * width, axis + amplitude * ampJitter * c * e];
    }
    out.push(toPath(pts));
  }
  return out;
}

/**
 * Catmull-Rom through the sampled points, converted to cubic Beziers. Endpoints
 * are duplicated so the curve starts and ends exactly on the sampled points.
 */
function toPath(pts: readonly [number, number][]): string {
  if (pts.length === 0) return "";
  if (pts.length === 1) return `M${fmt(pts[0][0])} ${fmt(pts[0][1])}`;

  let d = `M${fmt(pts[0][0])} ${fmt(pts[0][1])}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i === 0 ? 0 : i - 1];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2 >= pts.length ? pts.length - 1 : i + 2];
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += `C${fmt(c1x)} ${fmt(c1y)} ${fmt(c2x)} ${fmt(c2y)} ${fmt(p2[0])} ${fmt(p2[1])}`;
  }
  return d;
}

function round2(v: number): number {
  const r = Math.round(v * 100) / 100;
  return Object.is(r, -0) ? 0 : r;
}

/** 2dp, no trailing zeros, no `-0` — keeps the DOM payload small. */
function fmt(v: number): string {
  return String(round2(v));
}
