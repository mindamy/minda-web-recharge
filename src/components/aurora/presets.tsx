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
 * - **Amplitude.** Spec says 18-45px. Measured on p-8's lower band, the rose
 *   fan is ~216px thick at x=1008 (1448-normalised), which needs an amplitude
 *   near 110. The spec's figure fits the faintest fields, not the prominent
 *   ones. Used here: 85-175, scaled down for the low-intensity sections.
 * - **Wavelength.** Spec says 320-520px, which puts a caustic node every
 *   160-260px — 6 to 9 nodes across the width. p-8 has *two*, at x = 305 and
 *   x = 991, so node spacing is ~686px and the wavelength ~1370. Used here:
 *   950-1400.
 *
 * Tilt is also kept to 2-5 degrees rather than the spec's 8-20: at this
 * wavelength the wave itself supplies the diagonal drift, and stacking a
 * 15-degree axis tilt on top of it slid whole bundles off the canvas.
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
      amplitude: 46,
      wavelength: 620,
      phaseSpread: Math.PI,
      nodeAt: 70,
      tilt: 2,
      x0: -300,
      x1: 840,
      spread: 4,
      jitter: 0.02,
      stagger: 0.07,
      seed: 11,
      fade: 0.18,
      strokeWidth: 0.8,
      opacity: 0.13,
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
        { color: CORE_HUES.rose, at: 0.44 },
        { color: OCHRE, at: 0.62 },
        { color: CORE_HUES.green, at: 0.78 },
      ],
      strokes: 40,
      baseline: 648,
      amplitude: 118,
      wavelength: 800,
      phaseSpread: Math.PI,
      nodeAt: 850,
      tilt: -2,
      x0: 500,
      x1: 1760,
      spread: 6,
      jitter: 0.02,
      stagger: 0.07,
      seed: 12,
      fade: 0.18,
      strokeWidth: 0.9,
      opacity: 0.16,
      drift: "slower",
    },
  ];
  return <AuroraField id="aurora-hero" bundles={bundles} className={className ?? FIELD} />;
}

export function MomentsAurora({ className }: { className?: string }) {
  const bundles: AuroraBundle[] = [
    // lavender + green bleeding off the left edge, y 76-92% of section height
    {
      hue: ["lavender", "green"],
      strokes: 30,
      baseline: 800,
      amplitude: 115,
      wavelength: 1150,
      phaseSpread: Math.PI,
      nodeAt: 140,
      tilt: 3,
      x0: -320,
      x1: 1060,
      spread: 6,
      jitter: 0.02,
      stagger: 0.07,
      seed: 21,
      fade: 0.16,
      opacity: 0.12,
      drift: "slow",
    },
    // rose off the right edge, y 76-87%
    {
      hue: "rose",
      strokes: 28,
      baseline: 790,
      amplitude: 90,
      wavelength: 1000,
      phaseSpread: 0.92 * Math.PI,
      nodeAt: 1340,
      tilt: -2.5,
      x0: 780,
      x1: 1740,
      spread: 5,
      jitter: 0.02,
      stagger: 0.07,
      seed: 22,
      fade: 0.2,
      opacity: 0.12,
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
      hue: "green",
      strokes: 26,
      baseline: 132,
      amplitude: 62,
      wavelength: 430,
      phaseSpread: Math.PI,
      nodeAt: 70,
      tilt: 3,
      x0: -60,
      x1: 470,
      taper: 0.2,
      spread: 4,
      jitter: 0.03,
      stagger: 0.07,
      seed: 23,
      opacity: 0.11,
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
      hue: "green",
      strokes: 30,
      baseline: 850,
      amplitude: 125,
      wavelength: 1050,
      phaseSpread: Math.PI,
      nodeAt: 90,
      tilt: 3,
      x0: -300,
      x1: 800,
      spread: 5,
      jitter: 0.02,
      stagger: 0.07,
      seed: 31,
      fade: 0.18,
      opacity: 0.12,
      drift: "slow",
    },
    // rose off the bottom-right, y 80-96%
    {
      hue: "rose",
      strokes: 28,
      baseline: 870,
      amplitude: 110,
      wavelength: 950,
      phaseSpread: 0.95 * Math.PI,
      nodeAt: 1400,
      tilt: -3,
      x0: 1000,
      x1: 1780,
      spread: 5,
      jitter: 0.02,
      stagger: 0.07,
      seed: 32,
      fade: 0.22,
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
      hue: "blue",
      strokes: 26,
      baseline: 800,
      amplitude: 95,
      wavelength: 1100,
      phaseSpread: 0.9 * Math.PI,
      nodeAt: 160,
      tilt: 2.5,
      x0: -300,
      x1: 920,
      spread: 5,
      jitter: 0.02,
      stagger: 0.07,
      seed: 41,
      fade: 0.16,
      opacity: 0.1,
      drift: "slower",
    },
    {
      hue: "rose",
      strokes: 26,
      baseline: 770,
      amplitude: 105,
      wavelength: 1050,
      phaseSpread: 0.9 * Math.PI,
      nodeAt: 1330,
      tilt: -2.5,
      x0: 760,
      x1: 1760,
      spread: 5,
      jitter: 0.02,
      stagger: 0.07,
      seed: 42,
      fade: 0.2,
      opacity: 0.1,
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
      hue: "blue",
      strokes: 30,
      baseline: 510,
      amplitude: 95,
      wavelength: 1000,
      phaseSpread: Math.PI,
      nodeAt: 130,
      tilt: 3,
      x0: -300,
      x1: 880,
      spread: 5,
      jitter: 0.02,
      stagger: 0.07,
      seed: 51,
      fade: 0.17,
      opacity: 0.12,
      drift: "slow",
    },
    // blue off the left edge again, lower pass, y 77-90%
    {
      hue: "blue",
      strokes: 28,
      baseline: 800,
      amplitude: 85,
      wavelength: 1150,
      phaseSpread: 0.95 * Math.PI,
      nodeAt: 280,
      tilt: 2,
      x0: -300,
      x1: 840,
      spread: 5,
      jitter: 0.02,
      stagger: 0.07,
      seed: 52,
      fade: 0.17,
      opacity: 0.11,
      drift: "slower",
    },
    // dense rose off the right edge, y 51-77%
    {
      hue: [{ color: "rose", at: 0 }, { color: CORE_HUES.rose, at: 0.55 }],
      strokes: 44,
      baseline: 610,
      amplitude: 125,
      wavelength: 1250,
      phaseSpread: Math.PI,
      nodeAt: 1230,
      tilt: -4,
      x0: 600,
      x1: 1800,
      spread: 6,
      jitter: 0.02,
      stagger: 0.07,
      seed: 53,
      fade: 0.18,
      strokeWidth: 0.9,
      opacity: 0.15,
      drift: "slow",
    },
  ];
  return <AuroraField id="aurora-rhythm" bundles={bundles} className={className ?? FIELD} />;
}

/** Rose + blue across the full bottom edge, bleeding left, right and bottom at once. */
export function TrustAurora({ className }: { className?: string }) {
  const bundles: AuroraBundle[] = [
    {
      hue: "blue",
      strokes: 34,
      baseline: 900,
      amplitude: 150,
      wavelength: 1350,
      phaseSpread: Math.PI,
      nodeAt: 380,
      tilt: 2.5,
      x0: -340,
      x1: 1820,
      spread: 6,
      jitter: 0.02,
      stagger: 0.07,
      seed: 61,
      opacity: 0.12,
      drift: "slow",
    },
    {
      hue: "rose",
      strokes: 32,
      baseline: 930,
      amplitude: 140,
      wavelength: 1200,
      phaseSpread: Math.PI,
      nodeAt: 1080,
      tilt: -2.5,
      x0: -280,
      x1: 1800,
      spread: 6,
      jitter: 0.02,
      stagger: 0.07,
      seed: 62,
      opacity: 0.12,
      drift: "slower",
    },
  ];
  return <AuroraField id="aurora-trust" bundles={bundles} className={className ?? FIELD} />;
}

export function PlansAurora({ className }: { className?: string }) {
  const bundles: AuroraBundle[] = [
    // blue off the lower-left, y 84-100%
    {
      hue: "blue",
      strokes: 30,
      baseline: 880,
      amplitude: 135,
      wavelength: 1150,
      phaseSpread: Math.PI,
      nodeAt: 210,
      tilt: 3,
      x0: -320,
      x1: 1040,
      spread: 6,
      jitter: 0.02,
      stagger: 0.07,
      seed: 71,
      fade: 0.16,
      opacity: 0.12,
      drift: "slow",
    },
    // rose off the lower-right, y 75-100%
    {
      hue: "rose",
      strokes: 32,
      baseline: 840,
      amplitude: 150,
      wavelength: 1250,
      phaseSpread: Math.PI,
      nodeAt: 1340,
      tilt: -3,
      x0: 620,
      x1: 1800,
      spread: 6,
      jitter: 0.02,
      stagger: 0.07,
      seed: 72,
      fade: 0.18,
      opacity: 0.13,
      drift: "slower",
    },
  ];
  return <AuroraField id="aurora-plans" bundles={bundles} className={className ?? FIELD} />;
}

/**
 * The most prominent field in the deck, and the one every parameter here was
 * fitted against. Nodes, axis heights and fan widths come straight off p-8:
 * the upper bundle pinches at x=305 and its left edge opens to y 723-979,
 * against a measured 745-928; the lower one pinches at x=991 and goes
 * ochre-neutral at the crossing near x=965. The three cross at approximately
 * (733, 833) — the spec's (560, 640) in deck-native px.
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
        { color: CORE_HUES.blue, at: 0 },
        { color: CORE_HUES.blue, at: 0.5 },
        { color: CORE_HUES.green, at: 0.64 },
        { color: OCHRE, at: 0.72 },
        { color: CORE_HUES.rose, at: 0.82 },
        { color: CORE_HUES.rose, at: 1 },
      ],
      strokes: 45,
      baseline: 800,
      amplitude: 132,
      wavelength: 1360,
      phaseSpread: Math.PI,
      nodeAt: 305,
      tilt: -4,
      x0: -320,
      x1: 1520,
      spread: 4,
      jitter: 0.02,
      stagger: 0.07,
      seed: 81,
      strokeWidth: 1,
      opacity: 0.16,
      drift: "slow",
    },
    // lower band: pinches at x=991, bleeding off the right and bottom
    {
      hue: [
        { color: CORE_HUES.blue, at: 0 },
        { color: CORE_HUES.blue, at: 0.34 },
        { color: CORE_HUES.green, at: 0.5 },
        { color: OCHRE, at: 0.59 },
        { color: CORE_HUES.rose, at: 0.68 },
        { color: CORE_HUES.rose, at: 1 },
      ],
      strokes: 45,
      baseline: 826,
      amplitude: 138,
      wavelength: 1400,
      phaseSpread: Math.PI,
      nodeAt: 991,
      tilt: 2.5,
      x0: -200,
      x1: 1780,
      spread: 4,
      jitter: 0.02,
      stagger: 0.07,
      seed: 82,
      strokeWidth: 1,
      opacity: 0.16,
      drift: "slower",
    },
    // the third pass along the bottom, x 0-916, bleeding off the bottom
    {
      hue: [
        { color: CORE_HUES.blue, at: 0 },
        { color: CORE_HUES.green, at: 0.38 },
        { color: CORE_HUES.green, at: 1 },
      ],
      strokes: 34,
      baseline: 905,
      amplitude: 84,
      wavelength: 950,
      phaseSpread: 0.95 * Math.PI,
      nodeAt: 130,
      tilt: 2,
      x0: -280,
      x1: 1100,
      spread: 6,
      jitter: 0.02,
      stagger: 0.07,
      seed: 83,
      fade: 0.17,
      strokeWidth: 0.95,
      opacity: 0.16,
      drift: "slow",
    },
  ];
  return <AuroraField id="aurora-cta" bundles={bundles} className={className ?? FIELD} />;
}
