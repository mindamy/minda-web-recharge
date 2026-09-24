"use client";

import { useId, type ReactElement } from "react";

import { cn } from "@/lib/cn";
import type { Locale } from "@/lib/i18n/config";

/**
 * The flag drawn beside each autonym in the language switcher.
 *
 * ---------------------------------------------------------------------------
 * INLINE SVG, NOT EMOJI FLAGS.
 *
 * `🇬🇧` is not a character. It is a pair of regional-indicator letters, and a
 * flag only appears if the font ships a ligature glyph for that pair. Windows
 * ships none: Segoe UI Emoji contains no flag glyphs at all, so Chrome on
 * Windows — the single largest desktop combination this site serves — falls
 * back to the indicators themselves and draws the literal letters `GB`. Seven
 * rows of two-letter boxes is not a flag set, and there is no font-stack fix
 * because there is no flag font on the machine to fall back *to*. Twemoji
 * would fix it at the cost of a webfont or a sprite request on every page.
 * The artwork is therefore drawn here: identical on every platform, no
 * network request, no font dependency, and it inherits nothing it shouldn't.
 * ---------------------------------------------------------------------------
 *
 * FLAGS ARE COUNTRIES; LANGUAGES ARE NOT COUNTRIES. This is the standard
 * objection to flags in a language picker and it is a fair one. Two of the
 * seven locales have no country to point at: `zh-Hans` and `zh-Hant` are
 * *script* subtags — Simplified and Traditional Han — with no region subtag
 * at all. Showing them CN and TW is a convention, not a fact, and it was an
 * explicit product decision rather than an oversight: for this audience the
 * mainland/Taiwan flags are the fastest visual key to the two script forms,
 * and `zh-HK` exists separately precisely because Hong Kong is a real region
 * with its own catalogue. The decision is only safe because of the next
 * paragraph.
 *
 * THE FLAG IS DECORATION AND MUST NEVER BECOME THE LABEL. Every flag here is
 * `aria-hidden` with `focusable="false"`; the meaning is carried entirely by
 * the autonym next to it (`LOCALE_LABELS`, which also disambiguates the two
 * Traditional entries in words). Never add a `<title>`, never let a caller
 * render this without the text, and never let it become the accessible name —
 * a reader who cannot see it, or who reads TW as "Taiwan" rather than
 * "Traditional Chinese", must lose nothing.
 *
 * ---------------------------------------------------------------------------
 * ALL SEVEN ARE DRAWN ON ONE `viewBox="0 0 60 40"` (3:2).
 *
 * A uniform box is what makes a vertical list of flags look like a list
 * rather than a ransom note, and it lets the caller size them with one pair
 * of utilities. Five of the seven (JP, CN, TW, HK, ID) are natively 3:2 and
 * are therefore drawn at true proportions. GB and MY are natively 2:1 and are
 * *redrawn* to 3:2 — every feature rescaled with the new height — which is
 * the normalisation every flag icon set performs. It is not letterboxing and
 * it is emphatically not `preserveAspectRatio="none"`, which would squash the
 * Union Jack's diagonals off their corners and turn Japan's disc into an egg.
 * ---------------------------------------------------------------------------
 *
 * Budget: at the default 21x14 CSS px, one SVG unit is a third of a pixel.
 * Detail below about one pixel is invisible and is deliberately dropped —
 * the red star inside each Hong Kong petal, the thin blue ring around the
 * Taiwanese sun. What must survive is silhouette and colour.
 */

/**
 * The size, fixed — not a default, and deliberately not a prop.
 *
 * 21x14 is the 3:2 box at the size that sits level with `text-nav` without
 * out-shouting it, and all three call sites (header menu, mobile sheet,
 * footer row) use it, so the flags read as one system rather than three.
 * `rounded-[2px]` matches the hairline ring the caller draws in CSS; there is
 * deliberately no border inside the SVG, because a stroked rect would scale
 * with the viewBox and go blurry.
 *
 * Do not turn this into a `size` prop and do not expect `className` to
 * override it. `cn()` is plain `clsx`, *not* tailwind-merge — see the comment
 * in `@/lib/cn` explaining why that is on purpose. So a caller passing `h-3`
 * does not replace `h-[14px]`: both land in the `class` attribute, both are
 * single-class utilities in Tailwind's `utilities` layer, and the winner is
 * decided by their order in the compiled stylesheet, not by the order they
 * were passed. This repo has already shipped that bug once — see the note in
 * `@/components/sections/Plans.tsx` about `.font-sans` silently beating
 * `.font-display` and rendering the deck's one serif button in Outfit.
 */
const FIXED_SIZE = "h-[14px] w-[21px] shrink-0 rounded-[2px]";

export function FlagIcon({
  locale,
  className,
}: {
  locale: Locale;
  /**
   * Additive, non-conflicting utilities only.
   *
   * This exists for the edge the switcher draws — `ring-1 ring-black/10`, so
   * the white-heavy Japan and Indonesia flags do not dissolve into the menu
   * sheet's `bg-white/95` — plus the occasional opacity or margin. Anything
   * that competes with `FIXED_SIZE` (`h-*`, `w-*`, `rounded-*`, `shrink-*`)
   * will *not* reliably win; see `FIXED_SIZE` above for why, and change the
   * constant rather than fighting it from a call site.
   */
  className?: string;
}): ReactElement {
  const Artwork = FLAG_ARTWORK[locale];
  return (
    <svg viewBox="0 0 60 40" className={cn(FIXED_SIZE, className)} aria-hidden focusable="false">
      <Artwork />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* Shared geometry                                                            */
/* -------------------------------------------------------------------------- */

/**
 * Two decimal places — a hundredth of a unit is a three-hundredth of a pixel
 * at the rendered size, so nothing is lost, and it keeps each path short.
 *
 * It also removes the only hydration hazard in this file. These paths are
 * built with `Math.sin`/`Math.cos`, which the spec permits to differ in the
 * last bit between implementations, and this is a Client Component: the
 * server renders the `d` attribute in Node and the browser re-renders it in
 * its own engine. Quantising to 0.01 makes a 1-ulp disagreement unobservable.
 */
const round = (value: number) => Math.round(value * 100) / 100;

/**
 * A regular star polygon: `points` outer vertices at `radius`, alternating
 * with `points` inner vertices at `radius * innerRatio`, first vertex
 * pointing straight up.
 *
 * One helper covers all three stars in this file, which is why they are
 * generated rather than pasted as opaque literals: China's five-pointed stars
 * (`innerRatio` 0.382, the pentagram constant), Malaysia's 14-pointed star,
 * and Taiwan's 12-rayed sun — which is a 12-point star with `innerRatio` 0.5,
 * because the flag's own specification puts the white disc at exactly half
 * the ray circle.
 */
function starPath(cx: number, cy: number, radius: number, points = 5, innerRatio = 0.381966) {
  const step = Math.PI / points;
  let d = "";
  for (let i = 0; i < points * 2; i += 1) {
    const r = i % 2 === 0 ? radius : radius * innerRatio;
    const angle = -Math.PI / 2 + i * step;
    d += `${i === 0 ? "M" : "L"}${round(cx + r * Math.cos(angle))},${round(cy + r * Math.sin(angle))}`;
  }
  return `${d}Z`;
}

/* -------------------------------------------------------------------------- */
/* The flags                                                                  */
/* -------------------------------------------------------------------------- */

/** Japan: white field, red disc dead centre, diameter 3/5 of the hoist. */
function JapanArtwork() {
  return (
    <>
      <rect width="60" height="40" fill="#FFFFFF" />
      <circle cx="30" cy="20" r="12" fill="#BC002D" />
    </>
  );
}

/** Indonesia: red over white, split exactly on the horizontal centre line. */
function IndonesiaArtwork() {
  return (
    <>
      <rect width="60" height="40" fill="#FFFFFF" />
      <rect width="60" height="20" fill="#CE1126" />
    </>
  );
}

/**
 * China. Drawn on the official 30x20 construction grid doubled to 60x40, so
 * every coordinate below is the published one times two: the large star is
 * centred at (10,10) with radius 6, and the four small stars — radius 2 — sit
 * at (20,4), (24,8), (24,14) and (20,18).
 *
 * Their positions are the part that must be exact; an arc of four evenly
 * spaced stars is the commonest way this flag is drawn wrong. Each is canted
 * so one point aims at the large star, which is why the rotations are
 * irregular: they are `atan2` of the offset to (10,10), rounded to a degree.
 */
const CN_SMALL_STARS = [
  { x: 20, y: 4, rotate: -121 },
  { x: 24, y: 8, rotate: -98 },
  { x: 24, y: 14, rotate: -74 },
  { x: 20, y: 18, rotate: -51 },
];

function ChinaArtwork() {
  return (
    <>
      <rect width="60" height="40" fill="#EE1C25" />
      <g fill="#FFDE00">
        <path d={starPath(10, 10, 6)} />
        {CN_SMALL_STARS.map((star) => (
          <path
            key={`${star.x}-${star.y}`}
            d={starPath(star.x, star.y, 2)}
            transform={`rotate(${star.rotate} ${star.x} ${star.y})`}
          />
        ))}
      </g>
    </>
  );
}

/**
 * Taiwan: red field, blue canton over the top-left quarter (30x20), white sun
 * centred in it at (15,10).
 *
 * The sun is one 12-point star plus one disc. Because `innerRatio` is 0.5 the
 * star's valleys land at 3.7 — exactly the disc radius — so the two shapes
 * fuse into the serrated ring the flag actually has, with no seam to align.
 * The real flag separates disc from rays with a thin blue ring; at this size
 * that ring is a fifth of a pixel, so it is dropped rather than drawn as mud.
 */
function TaiwanArtwork() {
  return (
    <>
      <rect width="60" height="40" fill="#FE0000" />
      <rect width="30" height="20" fill="#000095" />
      <g fill="#FFFFFF">
        <path d={starPath(15, 10, 7.4, 12, 0.5)} />
        <circle cx="15" cy="10" r="3.7" />
      </g>
    </>
  );
}

/**
 * Hong Kong: red field, white bauhinia centred.
 *
 * Five petals, each an ellipse whose centre sits 5.6 out from (30,20) and
 * which is then rotated about that centre in 72 degree steps — so the major
 * axis always points radially outward and the five overlap into a solid core.
 * The flower spans 23.6 units, a shade under 3/5 of the hoist.
 *
 * Two details of the real flower are deliberately absent: each petal carries
 * a small red five-pointed star (under half a pixel here — it would only
 * dirty the white) and the petals pinwheel rather than sitting symmetrically.
 * What has to survive is "five white petals on red", and that does.
 */
const HK_PETAL_ANGLES = [0, 72, 144, 216, 288];

function HongKongArtwork() {
  return (
    <>
      <rect width="60" height="40" fill="#EE1C25" />
      <g fill="#FFFFFF">
        {HK_PETAL_ANGLES.map((angle) => (
          <ellipse
            key={angle}
            cx="30"
            cy="14.4"
            rx="3.6"
            ry="6.2"
            transform={`rotate(${angle} 30 20)`}
          />
        ))}
      </g>
    </>
  );
}

/**
 * Malaysia, renormalised from 2:1 to 3:2.
 *
 * Fourteen stripes over a 40-unit hoist is 40/14 per stripe — an awkward
 * number left unrounded on purpose, because rounding it would accumulate a
 * visible gap by the fourteenth stripe. The field is laid down white and the
 * seven red stripes are painted over it at even indices, so the top stripe is
 * red and the bottom is white (getting that pair the wrong way round is the
 * classic Jalur Gemilang error).
 *
 * The canton is blue over the top eight stripes and, on the renormalised box,
 * the hoist half of the width. The crescent is a yellow disc with a blue disc
 * bitten out of its right — no mask needed, because the only thing behind it
 * is flat canton blue. The star is 14-pointed, one point per stripe, nestled
 * in the crescent's opening with about 0.7 units of clearance.
 */
const MY_STRIPE = 40 / 14;
const MY_CANTON_HEIGHT = MY_STRIPE * 8;
const MY_EMBLEM_Y = MY_CANTON_HEIGHT / 2;
const MY_RED_STRIPES = [0, 1, 2, 3, 4, 5, 6];

function MalaysiaArtwork() {
  return (
    <>
      <rect width="60" height="40" fill="#FFFFFF" />
      <g fill="#CC0001">
        {MY_RED_STRIPES.map((index) => (
          <rect key={index} y={round(index * 2 * MY_STRIPE)} width="60" height={round(MY_STRIPE)} />
        ))}
      </g>
      <rect width="30" height={round(MY_CANTON_HEIGHT)} fill="#010066" />
      <circle cx="12.6" cy={round(MY_EMBLEM_Y)} r="6.2" fill="#FFCC00" />
      <circle cx="15" cy={round(MY_EMBLEM_Y)} r="5.2" fill="#010066" />
      <path d={starPath(22, round(MY_EMBLEM_Y), 5.2, 14, 0.58)} fill="#FFCC00" />
    </>
  );
}

/**
 * The Union Flag, renormalised from 2:1 to 3:2 — every stroke width is the
 * canonical 60x30 construction scaled by 4/3, which is why they read as
 * thirds: white saltire 8, red saltire 5.33, white cross 13.33, red cross 8.
 * Draw order is load-bearing, each layer painting over the last.
 *
 * ---------------------------------------------------------------------------
 * THE COUNTERCHANGE. The red St Patrick saltire is NOT centred on the white
 * St Andrew saltire; it is offset within it, and the offset reverses across
 * the centre so the flag has 180-degree rotational symmetry and no mirror
 * symmetry. Drawing the red diagonals centred is the mistake that makes an
 * otherwise convincing Union Jack look subtly fake; drawing the offset the
 * wrong way round is flying it upside down, which is a recognised distress
 * signal and a headline.
 *
 * The trick below does both correctly in two lines: stroke the same two
 * diagonals in red at 5.33, then clip that stroke to four triangles that each
 * bisect a quadrant along its own diagonal. Clipping a centred 5.33 stroke to
 * one side of its own centreline leaves 2.67 of red hard against the
 * centreline, so the 8-wide white band underneath shows 4 on one side and
 * 1.33 on the other — the 3:2:1 broad-white / red / narrow-white banding of
 * the real flag, for free.
 *
 * The four triangles are the canonical ones, scaled to this box. The one that
 * fixes the orientation is the first: keeping the region BELOW the hoist
 * diagonal puts the red below it, so the broad white is ABOVE the red in the
 * top-left quadrant. That is the right way up. Do not "tidy" these four
 * paths — check them against the 180-degree rotation (x,y) -> (60-x,40-y),
 * which maps the set onto itself.
 * ---------------------------------------------------------------------------
 */
const GB_SALTIRE = "M0,0 L60,40 M60,0 L0,40";
const GB_COUNTERCHANGE =
  "M0,0 L0,20 L30,20 Z M30,20 L30,0 L60,0 Z M30,20 L30,40 L0,40 Z M30,20 L60,20 L60,40 Z";

function UnionJackArtwork() {
  // All seven flags can be on screen at once, and a duplicated SVG id is
  // resolved by document order rather than by proximity — so two menus, or a
  // menu and a footer row, would silently share one clip. `useId` is the
  // SSR-safe unique source; React 19 wraps it in guillemets (`«r0»`), which
  // `url(#...)` happens to tolerate but `querySelector` does not, so the
  // non-alphanumerics are stripped to leave a plain NCName.
  const clipId = `uj-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;

  return (
    <>
      <defs>
        <clipPath id={clipId}>
          <path d={GB_COUNTERCHANGE} />
        </clipPath>
      </defs>
      <rect width="60" height="40" fill="#012169" />
      {/* `fill="none"` on all four: SVG's default fill is *black*, and these
          are stroke-only shapes. It happens to be invisible today because
          every subpath here is a single straight segment and so encloses no
          area — but add one vertex without it and two black triangles appear
          over the flag. */}
      <g fill="none">
        <path d={GB_SALTIRE} stroke="#FFFFFF" strokeWidth="8" />
        <path d={GB_SALTIRE} stroke="#C8102E" strokeWidth="5.33" clipPath={`url(#${clipId})`} />
        <path d="M0,20 H60 M30,0 V40" stroke="#FFFFFF" strokeWidth="13.33" />
        <path d="M0,20 H60 M30,0 V40" stroke="#C8102E" strokeWidth="8" />
      </g>
    </>
  );
}

/**
 * The locale -> artwork map.
 *
 * `Record<Locale, ...>` — total, never `Partial`, for the same reason the
 * `dictionaries` loader map is (see `@/lib/i18n/dictionaries`). Adding an
 * eighth locale to `LOCALES` without drawing its flag is then a
 * `tsc --noEmit` failure at this line, rather than one blank gap in a menu
 * that nobody on the team can read anyway.
 *
 * The values are components, not elements, because `UnionJackArtwork` calls
 * `useId`. Rendering it as `<Artwork />` gives it its own hooks slot; calling
 * the stored function inline instead would make that a conditional hook in
 * `FlagIcon` and blow up the moment a reader switched locale.
 */
const FLAG_ARTWORK: Record<Locale, () => ReactElement> = {
  "en-GB": UnionJackArtwork,
  "ms-MY": MalaysiaArtwork,
  "id-ID": IndonesiaArtwork,
  "zh-Hans": ChinaArtwork,
  "zh-Hant": TaiwanArtwork,
  "zh-HK": HongKongArtwork,
  "ja-JP": JapanArtwork,
};
