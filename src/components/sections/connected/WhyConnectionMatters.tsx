import type { ComponentType } from "react";

import { Clock, Heart, Search, Target, type IconProps } from "@/components/icons";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { MicroEyebrow } from "@/components/ui/Eyebrow";
import { HardLines } from "@/components/ui/RichText";
import { cn } from "@/lib/cn";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Messages } from "@/lib/i18n/types";

/**
 * The `WHY CONNECTION MATTERS` strip that closes the section.
 *
 * Five cells: a label cell that states the problem, then four benefit cells.
 * At desktop they are separated by vertically inset hairlines; below `lg` the
 * dividers rotate to horizontal rules, because a vertical rule between two
 * stacked cells reads as a rendering error.
 *
 * The card is translucent over the page ground (~70% of `surface-card`), which
 * is what lets the aurora tail behind it stay faintly visible.
 *
 * COPY NOTE: cell 4's body is the one string on this page that departs from
 * the deck. The render reads "…without waiting as you perfect time or place.",
 * a dropped clause; the agreed correction restores "…without waiting for the
 * perfect time or place." That correction now lives in the catalogue, at
 * `sections.connected.why.benefits.inTheMoment.body`, and is what every
 * locale is translated from.
 */

/** The four benefit cells, as keyed in `sections.connected.why.benefits`. */
type BenefitKey = keyof Messages["sections"]["connected"]["why"]["benefits"];

/** Presentation only — title and body come from the catalogue. */
type Benefit = {
  key: BenefitKey;
  icon: ComponentType<IconProps>;
  tint: string;
  glyph: string;
  titleColour: string;
};

const BENEFITS: readonly Benefit[] = [
  {
    key: "lessSearching",
    icon: Search,
    tint: "bg-blue-tint-100",
    glyph: "text-blue-icon",
    titleColour: "text-blue-ink",
  },
  {
    key: "moreRelevant",
    icon: Target,
    tint: "bg-green-tint-100",
    glyph: "text-green-ink",
    titleColour: "text-green-ink",
  },
  {
    key: "inTheMoment",
    icon: Clock,
    tint: "bg-rose-tint-100",
    glyph: "text-rose-500",
    titleColour: "text-rose-ink",
  },
  {
    key: "overTime",
    icon: Heart,
    tint: "bg-violet-tint-100",
    glyph: "text-violet-500",
    titleColour: "text-violet-ink",
  },
];

export async function WhyConnectionMatters() {
  const m = await getDictionary();
  const copy = m.sections.connected.why;

  return (
    <RevealGroup className="rounded-card bg-surface-card/70 px-6 py-7 shadow-card sm:px-7 lg:px-8">
      <div className="grid gap-x-6 gap-y-6 sm:grid-cols-2 lg:grid-cols-[minmax(0,0.85fr)_repeat(4,minmax(0,1fr))] lg:gap-x-0">
        <RevealItem className="sm:col-span-2 lg:col-span-1 lg:pr-6">
          <MicroEyebrow className="text-ink-500">{copy.eyebrow}</MicroEyebrow>
          <HardLines value={[copy.problem]} paragraphClassName="mt-3 text-meta text-ink-500" />
          <HardLines
            value={[copy.answer]}
            paragraphClassName="mt-4 text-meta font-semibold text-ink-800"
          />
        </RevealItem>

        {BENEFITS.map((benefit) => {
          const Glyph = benefit.icon;
          const text = copy.benefits[benefit.key];
          return (
            <RevealItem
              key={benefit.key}
              className={cn(
                "relative max-lg:border-t max-lg:border-hairline-faint max-lg:pt-6",
                // Vertically inset 1px divider, desktop only.
                "lg:px-6 lg:before:absolute lg:before:inset-y-1 lg:before:left-0 lg:before:w-px lg:before:bg-hairline-faint lg:before:content-['']",
              )}
            >
              <div className="flex items-start gap-3">
                <span
                  className={cn(
                    "flex size-11 shrink-0 items-center justify-center rounded-full",
                    benefit.tint,
                  )}
                >
                  <Glyph className={cn("size-5", benefit.glyph)} />
                </span>
                <span className="min-w-0">
                  <span className={cn("block text-meta font-semibold", benefit.titleColour)}>
                    {text.title}
                  </span>
                  <span className="mt-1.5 block text-meta leading-relaxed text-ink-500">
                    {text.body}
                  </span>
                </span>
              </div>
            </RevealItem>
          );
        })}
      </div>
    </RevealGroup>
  );
}
