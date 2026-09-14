import { Fragment } from "react";
import type { ComponentType } from "react";

import { RhythmAurora } from "@/components/aurora";
import { AskRechargePersonal } from "@/components/chrome/AskRecharge";
import { ChartUp, Heart, PersonCircle, type IconProps } from "@/components/icons";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { GradText } from "@/components/ui/GradText";
import { Section } from "@/components/ui/Section";
import { cn } from "@/lib/cn";
import { SECTION_IDS } from "@/lib/nav";

import { RhythmTimeline } from "./rhythm/RhythmTimeline";

/**
 * Rhythm — `#rhythm`, DESIGN-SPEC §3.5.
 *
 * The section's argument is that the product meets you at different points of
 * a day and gets more relevant over time, so its centre of gravity is the
 * six-node wavy timeline (see `./rhythm/RhythmTimeline`). Everything else here
 * is type and one card strip.
 *
 * Two containers, not one: §3.5's header block and timeline span the `wide`
 * container (nodes measured from x 182 to x 1265 at the 1448px reference),
 * while the card strip, closing line and Ask block sit in the `narrow` one
 * (the strip measures x 190 to 1276).
 */

type StripCell = {
  icon: ComponentType<IconProps>;
  /** 2px ring and icon stroke share one colour, per the §3.5 strip table. */
  accent: string;
  title: string;
  body: readonly string[];
};

const STRIP: readonly StripCell[] = [
  {
    icon: PersonCircle,
    accent: "text-blue-icon border-blue-icon",
    title: "Personal to the Moment",
    body: ["What do you need right now?"],
  },
  {
    icon: Heart,
    accent: "text-green-icon border-green-icon",
    title: "Personal to You",
    body: ["Your preferences, patterns", "and responses."],
  },
  {
    icon: ChartUp,
    accent: "text-rose-400 border-rose-400",
    title: "More Personal Over Time",
    body: ["The experience can evolve", "with you."],
  },
];

export function Rhythm() {
  return (
    <Section id={SECTION_IDS.rhythm}>
      <RhythmAurora />

      <Container width="wide">
        <Reveal>
          <div className="max-w-[768px]">
            <Eyebrow>PERSONAL TO YOUR RHYTHM</Eyebrow>

            <h2 className="text-h2 mt-5">
              Meets you where you are.
              <br />
              Gets to know <GradText>your rhythm</GradText> over time.
            </h2>

            {/* Four hard lines at desktop, per §3.5. They are dropped below
                `lg`, where the measure is too narrow to honour them. */}
            <p className="text-body text-ink-600 mt-6 max-w-[480px]">
              Your needs can change throughout the day and over time.
              <br className="hidden lg:inline" /> Recharge is designed to respond to the moment,
              learn from
              <br className="hidden lg:inline" /> what matters to you, and become more relevant as
              your
              <br className="hidden lg:inline" /> experience continues.
            </p>
          </div>
        </Reveal>

        <div className="mt-12">
          <RhythmTimeline />
        </div>

        <Reveal>
          <p className="font-display text-ink-900 mt-10 text-center text-[1.3125rem] leading-snug lg:text-[1.625rem]">
            Everyday moments, at your own pace.
          </p>
        </Reveal>
      </Container>

      <Container width="narrow">
        <RevealGroup className="rounded-card bg-surface-card shadow-card mt-14 flex flex-col lg:flex-row">
          {STRIP.map((cell, index) => (
            <Fragment key={cell.title}>
              {index > 0 && (
                <span
                  aria-hidden
                  className="bg-hairline-faint mx-7 h-px shrink-0 lg:mx-0 lg:my-7 lg:h-auto lg:w-px"
                />
              )}
              <RevealItem className="flex flex-1 items-center gap-5 px-7 py-7">
                <span
                  className={cn(
                    "flex size-[62px] shrink-0 items-center justify-center rounded-full border-2",
                    cell.accent,
                  )}
                >
                  <cell.icon className="size-6.5" />
                </span>
                <div>
                  <p className="text-ink-800 text-[0.9375rem] leading-[1.3] font-semibold">
                    {cell.title}
                  </p>
                  <p className="text-card-body text-ink-500 mt-1.5">
                    {/* The break is a desktop detail; the space survives it
                        because leading white space is dropped at the start of
                        a line, so the copy still reads as one sentence when
                        the break is off. */}
                    {cell.body.map((line, lineIndex) => (
                      <Fragment key={line}>
                        {lineIndex > 0 && (
                          <>
                            <br className="hidden lg:inline" />{" "}
                          </>
                        )}
                        {line}
                      </Fragment>
                    ))}
                  </p>
                </div>
              </RevealItem>
            </Fragment>
          ))}
        </RevealGroup>

        <Reveal>
          {/* §4.2 #5: centred at desktop, left-aligned at `sm`. */}
          <p className="text-body text-ink-800 mt-14 text-left sm:text-center">
            No two people are the same. No two moments are either.
          </p>
          <div className="mt-6 flex justify-start sm:justify-center">
            <AskRechargePersonal />
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
