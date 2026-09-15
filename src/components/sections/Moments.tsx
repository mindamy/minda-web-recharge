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
import { GradText } from "@/components/ui/GradText";
import { Section } from "@/components/ui/Section";
import { cn } from "@/lib/cn";
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

type Moment = {
  photo: string;
  /** Photo subject, per the §3.2 table — the images carry editorial meaning. */
  alt: string;
  Icon: ComponentType<IconProps>;
  /** Pastel circle fill. */
  tint: string;
  /** 2px icon stroke hue. */
  stroke: string;
  title: string;
  /** Two hard lines, as rendered in the deck. */
  body: readonly [string, string];
};

/**
 * Circle tints and icon strokes are the nearest design token to each
 * measured hex; every substitution is within ~1% (e.g. card 2's measured
 * #EAF5F0 against `green-tint-100` #E8F4ED). Using tokens keeps the six
 * cards answerable against §1.1 rather than against six loose hexes.
 */
const MOMENTS: readonly Moment[] = [
  {
    photo: "/images/moment-focus.jpg",
    alt: "A young man at a desk writing beside a laptop, a bright window behind him.",
    Icon: Crosshair,
    tint: "bg-blue-tint-50",
    stroke: "text-blue-icon",
    title: "I need to focus",
    body: ["I want to be clear,", "productive and in flow."],
  },
  {
    photo: "/images/moment-reset.jpg",
    alt: "A woman reclining on a sofa under a knit throw with her eyes closed.",
    Icon: Refresh,
    tint: "bg-green-tint-100",
    stroke: "text-green-icon",
    title: "I need a reset",
    body: ["I feel overwhelmed", "and need to reset."],
  },
  {
    photo: "/images/moment-running-low.jpg",
    alt: "A woman outdoors in a green jacket holding a water bottle.",
    Icon: BatteryLow,
    tint: "bg-rose-tint-50",
    stroke: "text-rose-300",
    title: "I’m running low",
    body: ["I feel drained and", "need to recharge."],
  },
  {
    photo: "/images/moment-switch-off.jpg",
    alt: "A man at a table at night by a warm lamp, one hand at his temple.",
    Icon: Moon,
    tint: "bg-violet-tint-50",
    stroke: "text-violet-500",
    title: "I can’t switch off",
    body: ["My mind is busy", "and I need to unwind."],
  },
  {
    photo: "/images/moment-stuck.jpg",
    alt: "A woman seated indoors, chin resting on her hand, looking away.",
    Icon: Atom,
    tint: "bg-violet-tint-50",
    stroke: "text-violet-500",
    title: "I feel stuck",
    body: ["I need a shift in", "perspective."],
  },
  {
    photo: "/images/moment-clarity.jpg",
    alt: "A man outdoors at dusk beside a lake, mountains behind him.",
    Icon: Compass,
    tint: "bg-blue-tint-50",
    stroke: "text-blue-icon",
    title: "I want more clarity",
    body: ["I’m looking for direction", "and inner clarity."],
  },
];

export function Moments() {
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
            <Eyebrow>RECOGNISE YOUR MOMENT</Eyebrow>

            <h2 className="text-h2 mt-5">
              What do you need right now?
              <br />
              <GradText>Your moment matters.</GradText>
            </h2>

            <p className="text-body mt-6 text-ink-600">
              We all move through different moments. Recognising how you feel
              <br className="hidden sm:inline" /> is the first step to finding what can
              help.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="rounded-card bg-surface-card shadow-card relative overflow-hidden p-6 sm:p-7">
              <MomentsCardAurora />
              <div className="flex items-start gap-4">
                <span className="flex size-[46px] shrink-0 items-center justify-center rounded-full bg-[#f6fbf9]">
                  <Heart className="size-5.5 text-green-icon" strokeWidth={1.8} />
                </span>
                <div>
                  <p className="text-card-title text-green-ink">
                    It&rsquo;s normal to have ups and downs.
                  </p>
                  <p className="text-card-body mt-2.5 text-ink-500">
                    Recharge is here to support you, wherever
                    <br className="hidden sm:inline" /> you are in your day.
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
          {MOMENTS.map(({ photo, alt, Icon, tint, stroke, title, body }) => (
            <RevealItem
              key={title}
              className="w-[76vw] max-w-[300px] shrink-0 snap-center md:w-auto md:max-w-none"
            >
              <article className="rounded-card bg-surface-card shadow-card card-lift flex h-full flex-col p-[5px] pb-8 text-center">
                <div className="rounded-media relative aspect-7/6 overflow-hidden">
                  <Image
                    src={photo}
                    alt={alt}
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
                  {title}
                </h3>
                <p className="text-card-body mt-3 px-4 text-ink-500">
                  {body[0]}
                  <br />
                  {body[1]}
                </p>
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
