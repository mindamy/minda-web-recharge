import Image from "next/image";
import type { ComponentType } from "react";

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
import { HardLines, RichText, defaultMarks, type MarkRenderers } from "@/components/ui/RichText";
import { Section } from "@/components/ui/Section";
import { cn } from "@/lib/cn";
import { getDictionary } from "@/lib/i18n/dictionaries";
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

/**
 * The one mark this section adds to {@link defaultMarks}.
 *
 * `grad-italic` is the gradient run *and* serif italic — the combination that
 * appears only on this headline. The treatment stays here, in the component
 * that measured it, while the catalogue carries nothing but the mark's name:
 * spread rather than replace, so `grad`, `strong` and `rcubed` keep working
 * if this section's copy ever grows one.
 */
const trustMarks: MarkRenderers = {
  ...defaultMarks,
  "grad-italic": (text) => <GradText className="italic">{text}</GradText>,
};

type TrustCard = {
  /** Catalogue key under `sections.trust.cards`. */
  copyKey: "support" | "ai" | "personalisation" | "privacy";
  Icon: ComponentType<IconProps>;
  tint: string;
  stroke: string;
  /**
   * Card 1 carries a visibly larger title-to-body gap than its siblings
   * (~14px extra in the render).
   */
  wideTitleGap?: boolean;
};

/**
 * Visual data only — icon, tint and the one spacing exception. Titles,
 * bodies and card 3's accent line live in the catalogue, where each title and
 * body keeps the deck's *unconditional* hard line breaks as arrays. Those
 * breaks are copy: the cards are sized around them.
 */
const TRUST_CARDS: readonly TrustCard[] = [
  {
    copyKey: "support",
    Icon: HandshakeHeart,
    tint: "bg-green-tint-100",
    stroke: "text-green-ink",
    wideTitleGap: true,
  },
  { copyKey: "ai", Icon: HeadBrain, tint: "bg-violet-tint-100", stroke: "text-violet-ink" },
  {
    copyKey: "personalisation",
    Icon: PersonHeart,
    tint: "bg-rose-tint-100",
    stroke: "text-rose-ink",
  },
  { copyKey: "privacy", Icon: ShieldLock, tint: "bg-blue-tint-100", stroke: "text-blue-icon" },
];

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

export async function Trust() {
  const m = await getDictionary();
  const copy = m.sections.trust;

  return (
    <Section id={SECTION_IDS.trust}>
      <ParallaxLayer distance={70}>
        <TrustAurora />
      </ParallaxLayer>

      <Container width="narrow">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,46fr)_minmax(0,54fr)] lg:items-start lg:gap-10">
          <Reveal>
            <Eyebrow gradient="reverse">{copy.eyebrow}</Eyebrow>

            <h2 className="text-h2 mt-5">
              <RichText
                value={copy.headline}
                marks={trustMarks}
                where="sections.trust.headline"
              />
            </h2>

            {/* The deck's break after "and" was
                `<br className="hidden sm:inline" />` — responsive layout, not
                copy — so the catalogue stores one flat sentence and the
                measure re-breaks it. The typographic apostrophe in
                "Here’s" now comes from the catalogue rather than `&rsquo;`. */}
            <p className="text-body mt-6 text-ink-600">{copy.lead}</p>
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
                  alt={copy.portraitAlt}
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
          {TRUST_CARDS.map(({ copyKey, Icon, tint, stroke, wideTitleGap }) => {
            const card = copy.cards[copyKey];

            return (
              <RevealItem key={copyKey}>
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
                    {/* A title is plain lines, so it is lifted into the
                        shared renderer's segment shape rather than given a
                        second local line-joiner. */}
                    <RichText
                      value={card.title.map((line) => [{ text: line }])}
                      where={`sections.trust.cards.${copyKey}.title`}
                    />
                  </h3>

                  {/* `HardLines` emits one `<p>` per paragraph; the spacing
                      between them stays on this wrapper. */}
                  <div
                    className={cn(
                      "text-card-body space-y-1.5 text-ink-500",
                      wideTitleGap ? "mt-10" : "mt-6",
                    )}
                  >
                    <HardLines value={card.body} />
                  </div>

                  {/* Card 3 only. `in` rather than a flag on `TRUST_CARDS`, so
                      the accent's presence is decided by the catalogue and
                      cannot drift out of step with it. */}
                  {"accent" in card ? (
                    <p className="text-card-body text-rose-ink mt-auto pt-6 font-semibold">
                      {card.accent}
                    </p>
                  ) : null}
                </article>
              </RevealItem>
            );
          })}
        </RevealGroup>

        <Reveal className="mt-14 flex flex-col items-center text-center">
          <p className="text-[0.9375rem] leading-relaxed text-ink-600">{copy.closingLead}</p>
          <p className="font-display mt-4 text-[1.625rem] leading-snug text-ink-900">
            {copy.closingSerif}
          </p>
          <AskRechargeApproach className="mt-6" />
        </Reveal>
      </Container>
    </Section>
  );
}
