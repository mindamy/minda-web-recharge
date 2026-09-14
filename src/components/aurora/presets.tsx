import { AuroraField, CORE_HUES, OCHRE, type AuroraBundle } from "./AuroraField";

/**
 * Per-section aurora presets — every one a Server Component.
 *
 * ## How to place these
 *
 * Drop a preset as the *first* child of the section and give the section
 * `relative isolate`:
 *
 * ```tsx
 * <section id="start" className="relative isolate">
 *   <CtaAurora />
 *   <div>...content...</div>
 * </section>
 * ```
 *
 * `isolate` creates a stacking context so the field's `-z-10` lands behind the
 * content but still above the section's own background; without it the field
 * can sink behind the page wash and vanish.
 *
 * ## The shared canvas
 *
 * Every field is authored against one normalised 1448 x 960 viewBox and drawn
 * with `preserveAspectRatio="none"`, so a bundle keeps its *share* of whatever
 * height the section renders at. Deck measurements were converted onto it as
 * `y_norm = y_native * 960 / H_native`; the deck pages are 738px, 623px and
 * 830px tall, so the factor differs per section (1.301, 1.541, 1.157).
 * Positions in DESIGN-SPEC.md §2.5's placement table are therefore quoted here
 * as the fraction of section height they actually were, not as raw px.
 *
 * ## Parameters that deviate from DESIGN-SPEC.md §2.5
 *
 * Two of the spec's stated ranges do not reproduce what p-8 shows, and the
 * deck wins:
 *
 * - **Amplitude.** Spec says 18-45px. That fits the hero's thin lower-left
 *   band (used: 50) and nothing else. p-8's lower band fans to ~170px thick
 *   at x=620, which needs an amplitude near 90; the Trust and Plans bands are
 *   wider still. Used here: 50-160.
 * - **Wavelength.** Spec says 320-520px, which puts a caustic waist every
 *   160-260px — 6 to 9 across the width. p-8 has *two* visible knots, at
 *   x = 340 and x = 900, so the spacing is ~560px and the wavelength ~1120.
 *   Used here: 620-1560.
 *
 * Tilt is also kept to 1.5-4 degrees rather than the spec's 8-20. At these
 * wavelengths the wave itself supplies the diagonal drift; adding a 15-degree
 * axis tilt on top slid whole bundles off the canvas.
 *
 * Everything else in §2.5 held up: 28-45 strokes (used 26-45), 0.5-0.9π phase
 * spread (used 0.58-0.62π), 0.10-0.18 per-stroke opacity (used 0.11-0.18),
 * 0.5-1px stroke width (used 0.75-1), and every placement in the table.
 */

/** Every bundle overflows the canvas, per §2.5 "always bleeds off at least one edge". */
const FIELD = "-z-10";

export function HeroAurora({ className }: { className?: string }) {
  const bundles: AuroraBundle[] = [
    // (a) blue, lower-left, bleeding off the left and bottom edges beneath the
    // text column. In `.docs/First Page.jpeg` this one is a *thin* band —
    // ~90px top to bottom with short, tight lenses, not a broad fan — so it is
    // the one bundle in the set whose amplitude and wavelength both sit inside
    // DESIGN-SPEC.md §2.5's stated ranges.
    {
      hue: CORE_HUES.blue,
      strokes: 30,
      baseline: 742,
      amplitude: 50,
      wavelength: 620,
      phaseSpread: 0.62 * Math.PI,
      nodeAt: 70,
      tilt: 2,
      x0: -300,
      x1: 840,
      spread: 4,
      jitter: 0.02,
      stagger: 0.07,
      seed: 11,
      fade: [0, 0.3],
      strokeWidth: 0.8,
      opacity: 0.14,
      drift: "slow",
    },
    // (b) the large bundle across the lower-right quadrant, x 900-1448,
    // bleeding off the right edge and partly behind the translucent trust
    // card. It runs green -> rose -> green rather than green -> rose: the hero
    // JPEG has a second green lens at the far right edge, past the rose one,
    // which the deck's p-8 version does not have. Nodes at x=850 and x=1250
    // put the rose lens at x~1050, matching the reference.
    {
      hue: [
        { color: CORE_HUES.green, at: 0 },
        { color: CORE_HUES.green, at: 0.25 },
        { color: CORE_HUES.rose, at: 0.34 },
        { color: CORE_HUES.rose, at: 0.56 },
        { color: CORE_HUES.green, at: 0.65 },
        { color: CORE_HUES.green, at: 1 },
      ],
      strokes: 45,
      baseline: 648,
      amplitude: 104,
      wavelength: 800,
      phaseSpread: 0.62 * Math.PI,
      nodeAt: 850,
      tilt: -2,
      x0: 500,
      x1: 1760,
      spread: 4,
      jitter: 0.02,
      stagger: 0.07,
      seed: 12,
      fade: [0.3, 0],
      strokeWidth: 0.9,
      opacity: 0.18,
      drift: "slower",
    },
  ];
  return <AuroraField id="aurora-hero" bundles={bundles} className={className ?? FIELD} />;
}

export function MomentsAurora({ className }: { className?: string }) {
  const bundles: AuroraBundle[] = [
    // lavender + green bleeding off the left edge, y 76-92% of section height
    {
      hue: [
        { color: CORE_HUES.lavender, at: 0 },
        { color: CORE_HUES.lavender, at: 0.35 },
        { color: CORE_HUES.green, at: 0.55 },
        { color: CORE_HUES.green, at: 1 },
      ],
      strokes: 32,
      baseline: 800,
      amplitude: 108,
      wavelength: 1150,
      phaseSpread: 0.62 * Math.PI,
      nodeAt: 140,
      tilt: 3,
      x0: -320,
      x1: 1060,
      spread: 4,
      jitter: 0.02,
      stagger: 0.07,
      seed: 21,
      fade: [0, 0.3],
      opacity: 0.15,
      drift: "slow",
    },
    // rose off the right edge, y 76-87%
    {
      hue: CORE_HUES.rose,
      strokes: 30,
      baseline: 790,
      amplitude: 86,
      wavelength: 1000,
      phaseSpread: 0.6 * Math.PI,
      nodeAt: 1340,
      tilt: -2.5,
      x0: 780,
      x1: 1740,
      spread: 4,
      jitter: 0.02,
      stagger: 0.07,
      seed: 22,
      fade: [0.3, 0],
      opacity: 0.15,
      drift: "slower",
    },
  ];
  return <AuroraField id="aurora-moments" bundles={bundles} className={className ?? FIELD} />;
}

/**
 * The third Moments bundle: a faint green field *inside* the top-right
 * reassurance card, bleeding off the card's right edge. Separate because it is
 * scoped to a card, not to the section, so it needs the card's own box and
 * `slice` rather than a stretch.
 */
export function MomentsCardAurora({ className }: { className?: string }) {
  const bundles: AuroraBundle[] = [
    {
      hue: CORE_HUES.green,
      strokes: 26,
      baseline: 132,
      amplitude: 60,
      wavelength: 430,
      phaseSpread: 0.62 * Math.PI,
      nodeAt: 70,
      tilt: 3,
      x0: -60,
      x1: 470,
      taper: 0.2,
      spread: 4,
      jitter: 0.03,
      stagger: 0.07,
      seed: 23,
      opacity: 0.13,
      drift: "slower",
    },
  ];
  return (
    <AuroraField
      id="aurora-moments-card"
      bundles={bundles}
      width={360}
      height={200}
      preserveAspectRatio="xMidYMid slice"
      className={className ?? FIELD}
    />
  );
}

export function R3Aurora({ className }: { className?: string }) {
  const bundles: AuroraBundle[] = [
    // green off the bottom-left, x 0-550, y 80-93%
    {
      hue: CORE_HUES.green,
      strokes: 30,
      baseline: 850,
      amplitude: 120,
      wavelength: 1050,
      phaseSpread: 0.62 * Math.PI,
      nodeAt: 90,
      tilt: 3,
      x0: -300,
      x1: 800,
      spread: 4,
      jitter: 0.02,
      stagger: 0.07,
      seed: 31,
      fade: [0, 0.3],
      opacity: 0.12,
      drift: "slow",
    },
    // rose off the bottom-right, y 80-96%
    {
      hue: CORE_HUES.rose,
      strokes: 28,
      baseline: 870,
      amplitude: 104,
      wavelength: 950,
      phaseSpread: 0.6 * Math.PI,
      nodeAt: 1400,
      tilt: -3,
      x0: 1000,
      x1: 1780,
      spread: 4,
      jitter: 0.02,
      stagger: 0.07,
      seed: 32,
      fade: [0.3, 0],
      opacity: 0.12,
      drift: "slower",
    },
  ];
  return <AuroraField id="aurora-r3" bundles={bundles} className={className ?? FIELD} />;
}

/** Lowest-intensity section in the deck — both bundles sit at the 0.10 floor. */
export function ConnectedAurora({ className }: { className?: string }) {
  const bundles: AuroraBundle[] = [
    {
      hue: CORE_HUES.blue,
      strokes: 26,
      baseline: 800,
      amplitude: 92,
      wavelength: 1100,
      phaseSpread: 0.58 * Math.PI,
      nodeAt: 160,
      tilt: 2.5,
      x0: -300,
      x1: 920,
      spread: 4,
      jitter: 0.02,
      stagger: 0.07,
      seed: 41,
      fade: [0, 0.3],
      opacity: 0.11,
      drift: "slower",
    },
    {
      hue: CORE_HUES.rose,
      strokes: 26,
      baseline: 770,
      amplitude: 100,
      wavelength: 1050,
      phaseSpread: 0.58 * Math.PI,
      nodeAt: 1330,
      tilt: -2.5,
      x0: 760,
      x1: 1760,
      spread: 4,
      jitter: 0.02,
      stagger: 0.07,
      seed: 42,
      fade: [0.3, 0],
      opacity: 0.11,
      drift: "slow",
    },
  ];
  return <AuroraField id="aurora-connected" bundles={bundles} className={className ?? FIELD} />;
}

/** Three bundles; the rose one is the busiest single field in the deck. */
export function RhythmAurora({ className }: { className?: string }) {
  const bundles: AuroraBundle[] = [
    // blue off the left edge, upper pass, y 45-61%
    {
      hue: CORE_HUES.blue,
      strokes: 30,
      baseline: 510,
      amplitude: 92,
      wavelength: 1000,
      phaseSpread: 0.62 * Math.PI,
      nodeAt: 130,
      tilt: 3,
      x0: -300,
      x1: 880,
      spread: 4,
      jitter: 0.02,
      stagger: 0.07,
      seed: 51,
      fade: [0, 0.3],
      opacity: 0.14,
      drift: "slow",
    },
    // blue off the left edge again, lower pass, y 77-90%
    {
      hue: CORE_HUES.blue,
      strokes: 28,
      baseline: 800,
      amplitude: 84,
      wavelength: 1150,
      phaseSpread: 0.6 * Math.PI,
      nodeAt: 280,
      tilt: 2,
      x0: -300,
      x1: 840,
      spread: 4,
      jitter: 0.02,
      stagger: 0.07,
      seed: 52,
      fade: [0, 0.3],
      opacity: 0.13,
      drift: "slower",
    },
    // dense rose off the right edge, y 51-77%
    {
      hue: CORE_HUES.rose,
      strokes: 45,
      baseline: 610,
      amplitude: 116,
      wavelength: 1250,
      phaseSpread: 0.62 * Math.PI,
      nodeAt: 1230,
      tilt: -4,
      x0: 600,
      x1: 1800,
      spread: 4,
      jitter: 0.02,
      stagger: 0.07,
      seed: 53,
      fade: [0.3, 0],
      strokeWidth: 0.9,
      opacity: 0.18,
      drift: "slow",
    },
  ];
  return <AuroraField id="aurora-rhythm" bundles={bundles} className={className ?? FIELD} />;
}

/** Rose + blue across the full bottom edge, bleeding left, right and bottom at once. */
export function TrustAurora({ className }: { className?: string }) {
  const bundles: AuroraBundle[] = [
    {
      hue: CORE_HUES.blue,
      strokes: 36,
      baseline: 884,
      amplitude: 108,
      wavelength: 1560,
      phaseSpread: 0.62 * Math.PI,
      nodeAt: 380,
      tilt: 1.5,
      x0: -340,
      x1: 1820,
      spread: 4,
      jitter: 0.02,
      stagger: 0.07,
      seed: 61,
      opacity: 0.16,
      drift: "slow",
    },
    {
      hue: CORE_HUES.rose,
      strokes: 34,
      baseline: 938,
      amplitude: 98,
      wavelength: 1120,
      phaseSpread: 0.6 * Math.PI,
      nodeAt: 1080,
      tilt: -1.5,
      x0: -280,
      x1: 1800,
      spread: 4,
      jitter: 0.02,
      stagger: 0.07,
      seed: 62,
      opacity: 0.16,
      drift: "slower",
    },
  ];
  return <AuroraField id="aurora-trust" bundles={bundles} className={className ?? FIELD} />;
}

export function PlansAurora({ className }: { className?: string }) {
  const bundles: AuroraBundle[] = [
    // blue off the lower-left, y 84-100%
    {
      hue: CORE_HUES.blue,
      strokes: 40,
      baseline: 880,
      amplitude: 126,
      wavelength: 1150,
      phaseSpread: 0.62 * Math.PI,
      nodeAt: 210,
      tilt: 3,
      x0: -320,
      x1: 1040,
      spread: 4,
      jitter: 0.02,
      stagger: 0.07,
      seed: 71,
      fade: [0, 0.3],
      opacity: 0.14,
      drift: "slow",
    },
    // rose off the lower-right, y 75-100%
    {
      hue: CORE_HUES.rose,
      strokes: 42,
      baseline: 840,
      amplitude: 134,
      wavelength: 1250,
      phaseSpread: 0.62 * Math.PI,
      nodeAt: 1340,
      tilt: -3,
      x0: 620,
      x1: 1800,
      spread: 4,
      jitter: 0.02,
      stagger: 0.07,
      seed: 72,
      fade: [0.3, 0],
      opacity: 0.14,
      drift: "slower",
    },
  ];
  return <AuroraField id="aurora-plans" bundles={bundles} className={className ?? FIELD} />;
}

/**
 * The most prominent field in the deck, and the one every parameter here was
 * fitted against. Nodes, axis heights and fan widths come straight off p-8:
 * both main bundles pinch at x=340, the upper one again at x=900 and the lower
 * one at x=1090 (the deck's two visible knots, re-measured at 1448-normalised
 * scale), and each hue transition is pinned to the offset of a pinch along its
 * own bundle's span so the colour turns exactly where the ribbon knots — which
 * is what p-8 does. Sharing the phase at x=340 is deliberate: it keeps the two
 * passes in step at the left edge, where the deck's are near-parallel, and lets
 * them separate toward the right rather than weaving into a lattice.
 *
 * §2.5's placement table decomposes this field into "a blue bundle", "a green
 * bundle" and "a rose bundle", which reads as three differently-coloured
 * bundles but is not what p-8 shows. Each bundle there runs the *whole* width
 * and changes hue along its own length, blue at the left edge through green at
 * the crossing to rose at the right. Colouring a bundle a single hue puts blue
 * strokes in the top-right corner, where the deck has nothing but rose.
 */
export function CtaAurora({ className }: { className?: string }) {
  const bundles: AuroraBundle[] = [
    // upper band: enters at the left edge, pinches at x=305, rises right
    {
      hue: [
        { color: CORE_HUES.blue, at: 0, opacity: 0.75 },
        { color: CORE_HUES.blue, at: 0.55, opacity: 0.75 },
        { color: CORE_HUES.green, at: 0.62, opacity: 0.55 },
        { color: OCHRE, at: 0.663, opacity: 0.7 },
        { color: CORE_HUES.rose, at: 0.73, opacity: 1 },
        { color: CORE_HUES.rose, at: 1, opacity: 1 },
      ],
      strokes: 45,
      baseline: 812,
      amplitude: 88,
      wavelength: 1120,
      phaseSpread: 0.6 * Math.PI,
      nodeAt: 340,
      tilt: -4,
      x0: -320,
      x1: 1520,
      spread: 4,
      jitter: 0.02,
      stagger: 0.07,
      seed: 81,
      strokeWidth: 1,
      opacity: 0.14,
      drift: "slow",
    },
    // lower band: pinches at x=991, bleeding off the right and bottom
    {
      hue: [
        { color: CORE_HUES.blue, at: 0, opacity: 0.75 },
        { color: CORE_HUES.blue, at: 0.46, opacity: 0.75 },
        { color: CORE_HUES.green, at: 0.56, opacity: 0.55 },
        { color: OCHRE, at: 0.652, opacity: 0.7 },
        { color: CORE_HUES.rose, at: 0.73, opacity: 1 },
        { color: CORE_HUES.rose, at: 1, opacity: 1 },
      ],
      strokes: 45,
      baseline: 848,
      amplitude: 92,
      wavelength: 1500,
      phaseSpread: 0.62 * Math.PI,
      nodeAt: 340,
      tilt: 2.5,
      x0: -200,
      x1: 1780,
      spread: 4,
      jitter: 0.02,
      stagger: 0.07,
      seed: 82,
      strokeWidth: 1,
      opacity: 0.14,
      drift: "slower",
    },
    // the third pass along the bottom, x 0-916, bleeding off the bottom
    {
      hue: [
        { color: CORE_HUES.blue, at: 0, opacity: 0.7 },
        { color: CORE_HUES.green, at: 0.38, opacity: 0.55 },
        { color: CORE_HUES.green, at: 1, opacity: 0.55 },
      ],
      strokes: 34,
      baseline: 902,
      amplitude: 68,
      wavelength: 950,
      phaseSpread: 0.6 * Math.PI,
      nodeAt: 130,
      tilt: 2,
      x0: -280,
      x1: 1100,
      spread: 4,
      jitter: 0.02,
      stagger: 0.07,
      seed: 83,
      fade: [0, 0.3],
      strokeWidth: 0.95,
      opacity: 0.14,
      drift: "slow",
    },
  ];
  return <AuroraField id="aurora-cta" bundles={bundles} className={className ?? FIELD} />;
}
