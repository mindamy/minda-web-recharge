import Image from "next/image";
import type { ComponentType } from "react";

import { MomentsAurora, MomentsCardAurora } from "@/components/aurora";
import { AskRechargeBanner } from "@/components/chrome/AskRecharge";
import { ScrollCue } from "@/components/chrome/ScrollCue";
import {
  Atom,
  BatteryLow,
  Compass,
  Crosshair,
  Heart,
  Moon,
  Refresh,
  type IconProps,
} from "@/components/icons";
import { ParallaxLayer } from "@/components/motion/ParallaxLayer";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { HardLines, RichText } from "@/components/ui/RichText";
import { Section } from "@/components/ui/Section";
import { cn } from "@/lib/cn";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Messages } from "@/lib/i18n/types";
import { SECTION_IDS } from "@/lib/nav";

/**
 * Moments — `#moments`, DESIGN-SPEC §3.2.
 *
 * The section's signature detail is the 64px icon circle straddling the
 * bottom edge of each card's photo: 24px of the circle sits over the image
 * and the remaining 40px over the white card body. It is produced by a
 * negative top margin on the circle rather than absolute positioning, so
 * the title below it still participates in normal flow and the card can
 * stretch to a shared row height.
 *
 * That overlap is also why the six-card row becomes a horizontal
 * scroll-snap carousel below `md` instead of a 2-column grid (§4.2): a
 * 2-col grid at 390px yields ~170px cards, which collapses the photo below
 * its 7:6 aspect and pushes the two-line body onto four lines.
 */

/**
 * The catalogue key for a card's copy. Deriving it from `Messages` rather
 * than restating the six names means a renamed or misspelt key is a `tsc`
 * error here, not a card that renders with a blank title.
 */
type MomentKey = keyof Messages["sections"]["moments"]["cards"];

/**
 * A card's *presentation*. Copy — title, the two body lines and the photo's
 * alt text — is not here: it is read from `sections.moments.cards[key]`. The
 * alt text in particular is copy, and the §3.2 table it comes from carries
 * editorial meaning, so it is translated like anything else a reader
 * receives.
 */
type Moment = {
  key: MomentKey;
  photo: string;
  Icon: ComponentType<IconProps>;
  /** Pastel circle fill. */
  tint: string;
  /** 2px icon stroke hue. */
  stroke: string;
};

/**
 * Circle tints and icon strokes are the nearest design token to each
 * measured hex; every substitution is within ~1% (e.g. card 2's measured
 * #EAF5F0 against `green-tint-100` #E8F4ED). Using tokens keeps the six
 * cards answerable against §1.1 rather than against six loose hexes.
 *
 * Order is the deck's reading order and belongs to layout, which is why the
 * sequence lives in this array rather than in the catalogue: a translator
 * cannot accidentally reorder the carousel.
 */
const MOMENTS: readonly Moment[] = [
  {
    key: "focus",
    photo: "/images/moment-focus.jpg",
    Icon: Crosshair,
    tint: "bg-blue-tint-50",
    stroke: "text-blue-icon",
  },
  {
    key: "reset",
    photo: "/images/moment-reset.jpg",
    Icon: Refresh,
    tint: "bg-green-tint-100",
    stroke: "text-green-icon",
  },
  {
    key: "runningLow",
    photo: "/images/moment-running-low.jpg",
    Icon: BatteryLow,
    tint: "bg-rose-tint-50",
    stroke: "text-rose-300",
  },
  {
    key: "switchOff",
    photo: "/images/moment-switch-off.jpg",
    Icon: Moon,
    tint: "bg-violet-tint-50",
    stroke: "text-violet-500",
  },
  {
    key: "stuck",
    photo: "/images/moment-stuck.jpg",
    Icon: Atom,
    tint: "bg-violet-tint-50",
    stroke: "text-violet-500",
  },
  {
    key: "clarity",
    photo: "/images/moment-clarity.jpg",
    Icon: Compass,
    tint: "bg-blue-tint-50",
    stroke: "text-blue-icon",
  },
];

export async function Moments() {
  const m = await getDictionary();
  const copy = m.sections.moments;

  return (
    <Section id={SECTION_IDS.moments}>
      <ParallaxLayer distance={70}>
        <MomentsAurora />
      </ParallaxLayer>

      <Container width="wide">
        {/* Two-zone header: copy left, the reassurance card pinned top-right
            at `lg` and stacked directly beneath the lead below that (§4.2). */}
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,483px)] lg:items-start lg:gap-14">
          <Reveal>
            <Eyebrow>{copy.eyebrow}</Eyebrow>

            {/* Two catalogue lines, so the break between them is a real
                `<br />` in every locale — the deck breaks here unconditionally.
                The gradient on line 2 is the shared deck ramp, which
                `defaultMarks` already supplies as `grad`. */}
            <h2 className="text-h2 mt-5">
              <RichText value={copy.headline} where="sections.moments.headline" />
            </h2>

            {/* The deck's `sm:` break here fell mid-sentence between two
                English words. That is layout, not copy, so the catalogue
                stores the lead flat and the wrap is left to `text-balance`. */}
            <p className="text-body mt-6 text-balance text-ink-600">{copy.lead}</p>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="rounded-card bg-surface-card shadow-card relative overflow-hidden p-6 sm:p-7">
              <MomentsCardAurora />
              <div className="flex items-start gap-4">
                <span className="flex size-[46px] shrink-0 items-center justify-center rounded-full bg-[#f6fbf9]">
                  <Heart className="size-5.5 text-green-icon" strokeWidth={1.8} />
                </span>
                <div>
                  <p className="text-card-title text-green-ink">{copy.reassurance.title}</p>
                  <p className="text-card-body mt-2.5 text-balance text-ink-500">
                    {copy.reassurance.body}
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Six moment cards. Carousel below `md`; 3 across at `md`; all six at
            `xl`. The scroller keeps its scrollbar hidden but stays keyboard-
            and touch-scrollable, and `py-2` gives the card shadows room that
            `overflow-x-auto` would otherwise clip. */}
        <RevealGroup
          className={cn(
            "-mx-6 mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-6 px-6 py-2",
            "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
            "sm:-mx-8 sm:scroll-px-8 sm:px-8",
            "md:mx-0 md:grid md:grid-cols-3 md:gap-5 md:overflow-visible md:px-0 md:py-0",
            "xl:grid-cols-6",
          )}
        >
          {MOMENTS.map(({ key, photo, Icon, tint, stroke }) => (
            <RevealItem
              key={key}
              className="w-[76vw] max-w-[300px] shrink-0 snap-center md:w-auto md:max-w-none"
            >
              <article className="rounded-card bg-surface-card shadow-card card-lift flex h-full flex-col p-[5px] pb-8 text-center">
                <div className="rounded-media relative aspect-7/6 overflow-hidden">
                  <Image
                    src={photo}
                    alt={copy.cards[key].alt}
                    fill
                    sizes="(min-width: 1280px) 212px, (min-width: 768px) 30vw, 76vw"
                    className="object-cover"
                  />
                </div>

                {/* The signature overlap: 24px of the circle over the photo. */}
                <span
                  className={cn(
                    "relative z-10 -mt-6 mx-auto flex size-16 items-center justify-center rounded-full",
                    tint,
                  )}
                >
                  <Icon className={cn("size-7", stroke)} strokeWidth={1.8} />
                </span>

                <h3 className="text-card-title mt-5 px-4 font-sans text-ink-800">
                  {copy.cards[key].title}
                </h3>
                {/* Two hard lines, as rendered in the deck — an unconditional
                    break, so it is a catalogue line rather than a `<br>` here. */}
                <HardLines
                  value={[copy.cards[key].body]}
                  paragraphClassName="text-card-body mt-3 px-4 text-ink-500"
                />
              </article>
            </RevealItem>
          ))}
        </RevealGroup>

        {/* The banner is narrower than the six-card row — measured x 190-1259
            at the 1448px reference, i.e. the 1152px container. */}
        <Reveal className="mx-auto mt-12 max-w-narrow">
          <AskRechargeBanner />
        </Reveal>

        <ScrollCue variant="circled" className="mt-12" />
      </Container>
    </Section>
  );
}
