import { Fragment } from "react";
import type { ComponentType } from "react";

import { RhythmAurora } from "@/components/aurora";
import { AskRechargePersonal } from "@/components/chrome/AskRecharge";
import { ChartUp, Heart, PersonCircle, type IconProps } from "@/components/icons";
import { ParallaxLayer } from "@/components/motion/ParallaxLayer";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { RichText } from "@/components/ui/RichText";
import { Section } from "@/components/ui/Section";
import { cn } from "@/lib/cn";
import { getDictionary } from "@/lib/i18n/dictionaries";
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
 *
 * Migrated per the `Footer.tsx` worked example: a Server Component, so it
 * reads the catalogue directly and nothing is prop-drilled.
 */

type StripCell = {
  /** Catalogue key under `sections.rhythm.strip`. */
  copyKey: "moment" | "you" | "overTime";
  icon: ComponentType<IconProps>;
  /** 2px ring and icon stroke share one colour, per the §3.5 strip table. */
  accent: string;
};

/**
 * Visual data only. The titles and bodies moved to the catalogue, keyed by
 * `copyKey` — the array keeps the deck's left-to-right order, so the
 * catalogue needs no parallel ordering of its own.
 */
const STRIP: readonly StripCell[] = [
  { copyKey: "moment", icon: PersonCircle, accent: "text-blue-icon border-blue-icon" },
  { copyKey: "you", icon: Heart, accent: "text-green-icon border-green-icon" },
  { copyKey: "overTime", icon: ChartUp, accent: "text-rose-400 border-rose-400" },
];

export async function Rhythm() {
  const m = await getDictionary();
  const copy = m.sections.rhythm;

  return (
    <Section id={SECTION_IDS.rhythm}>
      <ParallaxLayer distance={80}>
        <RhythmAurora />
      </ParallaxLayer>

      <Container width="wide">
        <Reveal>
          <div className="max-w-[768px]">
            <Eyebrow>{copy.eyebrow}</Eyebrow>

            {/* Line 2's break is unconditional, so it is copy structure and
                lives in the catalogue as a second line. */}
            <h2 className="text-h2 mt-5">
              <RichText value={copy.headline} where="sections.rhythm.headline" />
            </h2>

            {/* §3.5 sets four hard lines here at desktop only. They were
                `<br className="hidden lg:inline" />`, i.e. responsive layout
                rather than copy, so the catalogue stores one flat sentence
                and the measure below re-breaks it — a translation would not
                honour English break points in any case. */}
            <p className="text-body text-ink-600 mt-6 max-w-[480px]">{copy.lead}</p>
          </div>
        </Reveal>

        <div className="mt-12">
          <RhythmTimeline />
        </div>

        <Reveal>
          <p className="font-display text-ink-900 mt-10 text-center text-[1.3125rem] leading-snug lg:text-[1.625rem]">
            {copy.closing}
          </p>
        </Reveal>
      </Container>

      <Container width="narrow">
        <RevealGroup className="rounded-card bg-surface-card shadow-card mt-14 flex flex-col lg:flex-row">
          {STRIP.map((cell, index) => (
            <Fragment key={cell.copyKey}>
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
                    {copy.strip[cell.copyKey].title}
                  </p>
                  {/* The deck's desktop-only break inside these bodies was
                      also responsive; the cell is narrow enough that the
                      sentence still wraps to two lines without it. */}
                  <p className="text-card-body text-ink-500 mt-1.5">
                    {copy.strip[cell.copyKey].body}
                  </p>
                </div>
              </RevealItem>
            </Fragment>
          ))}
        </RevealGroup>

        <Reveal>
          {/* §4.2 #5: centred at desktop, left-aligned at `sm`. */}
          <p className="text-body text-ink-800 mt-14 text-left sm:text-center">{copy.noTwo}</p>
          <div className="mt-6 flex justify-start sm:justify-center">
            <AskRechargePersonal />
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
