import Image from "next/image";
import { Fragment, type ComponentType } from "react";

import { TrustAurora } from "@/components/aurora";
import { AskRechargeApproach } from "@/components/chrome/AskRecharge";
import {
  HandshakeHeart,
  HeadBrain,
  PersonHeart,
  ShieldLock,
  type IconProps,
} from "@/components/icons";
import { ImageReveal } from "@/components/motion/ImageReveal";
import { ParallaxLayer } from "@/components/motion/ParallaxLayer";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { GradText } from "@/components/ui/GradText";
import { Section } from "@/components/ui/Section";
import { cn } from "@/lib/cn";
import { SECTION_IDS } from "@/lib/nav";

/**
 * Trust & Approach — `#trust`, DESIGN-SPEC §3.6.
 *
 * Two things here exist nowhere else in the deck and are easy to lose:
 *
 * 1. The eyebrow runs the aurora ramp *backwards then wrapped*, which is
 *    what `Eyebrow gradient="reverse"` renders.
 * 2. Line 2 of the headline is the only place serif italic and the gradient
 *    combine. It is deliberately not animated — moving `background-position`
 *    under `background-clip: text` fringes italic serif glyphs.
 *
 * The blue-to-rose arc over the portrait is drawn here rather than baked
 * into the image because the supplied crop excludes it.
 */

type TrustCard = {
  Icon: ComponentType<IconProps>;
  tint: string;
  stroke: string;
  /** Title, split at the deck's hard line breaks. */
  title: readonly string[];
  /** Body paragraphs; each is a list of the deck's hard lines. */
  body: readonly (readonly string[])[];
  /**
   * Card 1 carries a visibly larger title-to-body gap than its siblings
   * (~14px extra in the render).
   */
  wideTitleGap?: boolean;
  /** Card 3 only — a rose emphasis line pinned above the lower padding. */
  accent?: string;
};

const TRUST_CARDS: readonly TrustCard[] = [
  {
    Icon: HandshakeHeart,
    tint: "bg-green-tint-100",
    stroke: "text-green-ink",
    title: ["Support, not diagnose."],
    body: [
      [
        "Recharge supports everyday",
        "wellbeing and personal reflection.",
        "It is not intended to diagnose,",
        "treat or cure medical or mental",
        "health conditions, and it does not",
        "replace professional care when",
        "that is needed.",
      ],
    ],
    wideTitleGap: true,
  },
  {
    Icon: HeadBrain,
    tint: "bg-violet-tint-100",
    stroke: "text-violet-ink",
    title: ["AI that guides,", "not defines you."],
    body: [
      ["AI can help you reflect, explore", "perspectives and consider", "possible next steps."],
      ["You remain in control of", "your choices."],
    ],
  },
  {
    Icon: PersonHeart,
    tint: "bg-rose-tint-100",
    stroke: "text-rose-ink",
    // British spelling, per the deck's own body voice.
    title: ["Personalisation", "with purpose."],
    body: [
      [
        "Recharge is designed to become",
        "more relevant through the",
        "information, choices and",
        "interactions that matter to",
        "your experience.",
      ],
    ],
    accent: "More relevant, not more intrusive.",
  },
  {
    Icon: ShieldLock,
    tint: "bg-blue-tint-100",
    stroke: "text-blue-icon",
    title: ["Privacy", "deserves care."],
    body: [
      [
        "Personal wellbeing can involve",
        "information that matters to you.",
        "Recharge approaches privacy,",
        "data and user control",
        "thoughtfully and transparently.",
      ],
    ],
  },
];

/** Joins the deck's hard line breaks without introducing stray whitespace. */
function HardLines({ lines }: { lines: readonly string[] }) {
  return (
    <>
      {lines.map((line, i) => (
        <Fragment key={line}>
          {i > 0 && <br />}
          {line}
        </Fragment>
      ))}
    </>
  );
}

/**
 * The single open arc over the portrait, opening downward.
 *
 * `preserveAspectRatio="none"` lets the arc fill whatever box the portrait
 * occupies — a proper semicircle at `lg`, naturally shallower over the
 * wider contained photo at `md` — and `vector-effect="non-scaling-stroke"`
 * holds the stroke at the measured 3px through that stretch. The two
 * terminus dots are DOM elements rather than SVG circles for the same
 * reason: circles inside a non-uniformly scaled viewBox would render as
 * ellipses.
 *
 * Dropped entirely below `md` (§4.3): a 180-degree arc over a 350px photo
 * dominates the composition and its gradient stops being legible.
 */
function PortraitArc() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 hidden md:block">
      <svg
        viewBox="0 0 640 420"
        preserveAspectRatio="none"
        className="absolute inset-0 size-full"
      >
        <defs>
          <linearGradient id="trust-arc-ramp" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#82bea2" />
            <stop offset="12%" stopColor="#82b6d4" />
            <stop offset="26%" stopColor="#7db6f9" />
            <stop offset="52%" stopColor="#c39bc0" />
            <stop offset="100%" stopColor="#faafb0" />
          </linearGradient>
        </defs>
        <path
          d="M18 378A302 302 0 0 1 622 376"
          fill="none"
          stroke="url(#trust-arc-ramp)"
          strokeWidth={3}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      <span className="bg-green-300 absolute left-[2.8%] top-[90%] size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full" />
      <span className="bg-rose-200 absolute left-[97.2%] top-[89.5%] size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full" />
    </div>
  );
}

export function Trust() {
  return (
    <Section id={SECTION_IDS.trust}>
      <ParallaxLayer distance={70}>
        <TrustAurora />
      </ParallaxLayer>

      <Container width="narrow">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,46fr)_minmax(0,54fr)] lg:items-start lg:gap-10">
          <Reveal>
            <Eyebrow gradient="reverse">TRUST &amp; APPROACH</Eyebrow>

            <h2 className="text-h2 mt-5">
              Support you can trust,
              <br />
              <GradText className="italic">every step of the way.</GradText>
            </h2>

            <p className="text-body mt-6 text-ink-600">
              Recharge is built around care, clarity and
              <br className="hidden sm:inline" /> clear boundaries. Here&rsquo;s what that
              means for you.
            </p>
          </Reveal>

          {/*
            The deck's photo region here is a wide 2.4:1 room scene with the
            blue-to-rose arc drawn over it. Excluding that arc — so it can be
            redrawn as SVG and stay crisp — forced the crop down to a 620x762
            portrait, because the arc's legs come down level with the subject's
            head on both sides. So the frame follows the asset's own 4:5
            proportion instead of the deck's landscape bleed.

            The earlier attempt kept the deck's bleed (the inner layer running
            50vw past the container), which stretched the box to roughly 3.6:1.
            `object-cover` from a 0.81:1 source then cropped everything but a
            thin horizontal band across the subject's chin.
          */}
          <ImageReveal delay={0.1}>
            <div className="rounded-card-lg relative mx-auto aspect-4/5 w-full max-w-[360px] overflow-hidden lg:mr-0 lg:ml-auto lg:max-w-[400px]">
              <div className="absolute inset-0">
                <Image
                  src="/images/trust-portrait.jpg"
                  alt="A woman in a cream cable-knit sweater sitting on a pale sofa, holding a mug in both hands and looking up."
                  fill
                  sizes="(min-width: 1024px) 400px, (min-width: 640px) 360px, 100vw"
                  className="object-cover object-[50%_35%]"
                />
              </div>

              <PortraitArc />
            </div>
          </ImageReveal>
        </div>

        {/* 4-up at `lg`, 2-up at `md`, 1 column below. Cards keep their left
            alignment and stretch to a shared height — card 3 is one accent
            line taller than its siblings. */}
        <RevealGroup className="mt-14 grid items-stretch gap-6 md:grid-cols-2 lg:grid-cols-4">
          {TRUST_CARDS.map(({ Icon, tint, stroke, title, body, wideTitleGap, accent }) => (
            <RevealItem key={title.join(" ")}>
              <article className="rounded-card-lg bg-surface-card shadow-card card-lift flex h-full flex-col p-7">
                <span
                  className={cn(
                    "flex size-[58px] items-center justify-center rounded-full",
                    tint,
                  )}
                >
                  <Icon className={cn("size-6.5", stroke)} strokeWidth={1.8} />
                </span>

                <h3
                  className={cn(
                    "text-card-title mt-7.5 font-sans leading-[1.5] text-ink-800",
                  )}
                >
                  <HardLines lines={title} />
                </h3>

                <div
                  className={cn(
                    "text-card-body space-y-1.5 text-ink-500",
                    wideTitleGap ? "mt-10" : "mt-6",
                  )}
                >
                  {body.map((paragraph) => (
                    <p key={paragraph[0]}>
                      <HardLines lines={paragraph} />
                    </p>
                  ))}
                </div>

                {accent ? (
                  <p className="text-card-body text-rose-ink mt-auto pt-6 font-semibold">
                    {accent}
                  </p>
                ) : null}
              </article>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal className="mt-14 flex flex-col items-center text-center">
          <p className="text-[0.9375rem] leading-relaxed text-ink-600">
            Recharge is designed to support you with care, clarity and respect.
          </p>
          <p className="font-display mt-4 text-[1.625rem] leading-snug text-ink-900">
            Trust should be part of the experience.
          </p>
          <AskRechargeApproach className="mt-6" />
        </Reveal>
      </Container>
    </Section>
  );
}
