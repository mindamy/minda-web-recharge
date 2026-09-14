import Image from "next/image";

import { AskRechargeStart } from "@/components/chrome/AskRecharge";
import { ArrowRight } from "@/components/icons";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { GradText } from "@/components/ui/GradText";
import { Section } from "@/components/ui/Section";
import { CTA, SECTION_IDS } from "@/lib/nav";

/**
 * Section 8 — the final CTA, `START YOUR RECHARGE`, per DESIGN-SPEC §3.8.
 *
 * Two columns at 42/58: the text column left, the arc-framed portrait right.
 *
 * The section carries the deck's most prominent aurora field, so everything
 * this component draws itself stays deliberately restrained — the arc is a
 * single hairline ring and two trailing dots, and nothing here animates beyond
 * the shared section reveal.
 */

/**
 * The open ring around the portrait.
 *
 * The supplied crop excludes the ring, so it is drawn here from the geometry
 * measured off the deck render: a true circle (least-squares fit over 115 ring
 * samples returned a max residual of 2px), centre and radius normalised to a
 * 640-unit box so the ring inscribes the portrait frame with room for the
 * trailing dots. It runs from a lower-left terminus at 126 degrees, clockwise
 * through the apex, to a lower-right terminus at 42 degrees — an 84-degree gap
 * at the bottom.
 *
 * The gradient travels *along the ring's length* (blue at the lower-left
 * terminus, sky, teal near the apex, rose at the lower-right), which no single
 * linear gradient can follow around a curve. So the ring is two arcs meeting at
 * the apex, each with its own gradient laid along its chord and both carrying
 * the same colour at the join, which leaves no visible seam. Stop colours are
 * sampled from the render at 10-degree intervals.
 *
 * The lower-left terminus fades out via stop-opacity; the lower-right keeps its
 * round cap, as rendered, and the two rose dots trail beyond it. Dots are
 * dropped below `lg` and the whole ring below `md` (§4.3 drop matrix).
 */
function PortraitArc() {
  return (
    <svg
      viewBox="0 0 640 640"
      fill="none"
      aria-hidden
      focusable="false"
      className="pointer-events-none absolute inset-0 hidden size-full md:block"
    >
      <defs>
        <linearGradient
          id="start-arc-rise"
          gradientUnits="userSpaceOnUse"
          x1="143.7"
          y1="562.7"
          x2="320"
          y2="20"
        >
          <stop offset="0" stopColor="#8fc5fb" stopOpacity="0" />
          <stop offset="0.1" stopColor="#7db6f9" />
          <stop offset="0.55" stopColor="#74aefb" />
          <stop offset="0.88" stopColor="#78b5f3" />
          <stop offset="1" stopColor="#7dc2d7" />
        </linearGradient>

        <linearGradient
          id="start-arc-fall"
          gradientUnits="userSpaceOnUse"
          x1="320"
          y1="20"
          x2="542.9"
          y2="520.7"
        >
          <stop offset="0" stopColor="#7dc2d7" />
          <stop offset="0.12" stopColor="#82cbbf" />
          <stop offset="0.3" stopColor="#84d0cf" />
          <stop offset="0.5" stopColor="#9ec3c8" />
          <stop offset="0.66" stopColor="#f2a7c0" />
          <stop offset="1" stopColor="#f89fb9" />
        </linearGradient>
      </defs>

      <g strokeWidth="5.5" strokeLinecap="round">
        <path d="M143.7 562.7A300 300 0 0 1 320 20" stroke="url(#start-arc-rise)" />
        <path d="M320 20A300 300 0 0 1 542.9 520.7" stroke="url(#start-arc-fall)" />
      </g>

      <g fill="#faaec1" className="hidden lg:block">
        <circle cx="533.2" cy="549.2" r="4" />
        <circle cx="509.6" cy="571.6" r="3.6" />
      </g>
    </svg>
  );
}

export function Start() {
  return (
    <Section id={SECTION_IDS.start}>
      {/* aurora: <CtaAurora /> mounted by the page */}

      <Container width="wide">
        <div className="grid items-center gap-14 lg:grid-cols-[42fr_58fr] lg:gap-12">
          <Reveal>
            <Eyebrow>START YOUR RECHARGE</Eyebrow>

            {/* `you are.` is one gradient run across the whole phrase, never
                per-word, and the run is never animated. */}
            <h2 className="text-h1 mt-5">
              Start where
              <br />
              <GradText>you are.</GradText>
            </h2>

            <p className="text-lead mt-6 text-ink-600">
              Try Recharge for yourself and
              <br className="hidden sm:inline" /> discover what works for you.
            </p>

            {/* 19px sans label, set inline so it wins over the `size` variant's
                own type classes rather than racing them in the cascade. */}
            <Button
              href="/plans"
              variant="primary"
              size="lg"
              className="mt-8 w-full sm:w-[333px]"
              style={{ fontSize: "1.1875rem" }}
            >
              {CTA.tryFree}
            </Button>

            <p className="text-btn-sm mt-5 font-normal text-ink-400">{CTA.trialMeta}</p>

            <Button href="/plans" variant="ghost" size="none" className="group mt-5">
              Explore Plans
              <ArrowRight className="ease-soft size-5 transition-transform duration-150 group-hover:translate-x-0.5" />
            </Button>

            <AskRechargeStart className="mt-11" />
          </Reveal>

          <Reveal y={28}>
            <div className="relative mx-auto w-full max-w-[34rem] lg:max-w-none">
              {/*
                The portrait is the emotional payload of the section, so it is
                kept at every width (§4.1) — cropped to 4:5 and anchored to the
                subject's face on small screens, square at `lg`. It sits below
                the fold, so it lazy-loads: `priority` is deprecated in Next 16
                and would be wrong here regardless.

                The top edge feathers into the page ground at `lg`, as rendered.
              */}
              <div className="rounded-card-lg relative aspect-[4/5] w-full overflow-hidden lg:aspect-square lg:[mask-image:linear-gradient(to_bottom,transparent_0%,black_14%,black_100%)]">
                <Image
                  src="/images/cta-portrait.jpg"
                  alt="A woman in loose cream linen sitting cross-legged beside a calm lake at sunrise, looking up towards the light"
                  fill
                  sizes="(min-width: 1024px) 58vw, (min-width: 640px) 34rem, 100vw"
                  className="object-cover object-[50%_28%]"
                />
              </div>

              <PortraitArc />
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
