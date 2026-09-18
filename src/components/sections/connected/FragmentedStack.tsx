import type { ComponentType } from "react";

import { Donut, SpeechBubbleDots, Waveform, type IconProps } from "@/components/icons";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { MicroEyebrow } from "@/components/ui/Eyebrow";
import { HardLines } from "@/components/ui/RichText";
import { cn } from "@/lib/cn";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Messages } from "@/lib/i18n/types";

/**
 * Zone A of the Connected diagram — the "fragmented support" stack.
 *
 * Three small cards, one per Recharge pillar, stacked vertically. They are the
 * left-hand term of the section's argument: the help exists, but it arrives in
 * separate places. The connecting curves in `ConnectionCurves` leave from this
 * stack's right edge, which is why the cards' vertical rhythm is pinned (88px
 * minimum height, 20px gap) rather than fluid.
 *
 * Card 3 is deliberately allowed to grow taller than the other two: its sub
 * runs to two lines, and the render shows the card growing rather than the
 * text compressing.
 */

/** The three pillars, as keyed in `common.pillars`. */
type PillarKey = keyof Messages["common"]["pillars"];

/**
 * A card's presentation. Its title and sub are the shared
 * `common.pillars[key]` entry — the same strings the R³ loop's nodes render,
 * which is the point: the argument only lands if the fragmented stack and the
 * connected loop name the same three things.
 */
type PillarCard = {
  key: PillarKey;
  icon: ComponentType<IconProps>;
  /** The 58px tinted circle behind the glyph. */
  tint: string;
  /** Glyph stroke colour. */
  glyph: string;
  /** Label colour — each pillar owns a hue. */
  label: string;
};

const CARDS: readonly PillarCard[] = [
  {
    key: "insights",
    icon: Donut,
    tint: "bg-violet-tint-50",
    glyph: "text-violet-ink",
    label: "text-blue-ink",
  },
  {
    key: "coaching",
    icon: SpeechBubbleDots,
    tint: "bg-green-tint-100",
    glyph: "text-green-ink",
    label: "text-green-ink",
  },
  {
    key: "experiences",
    icon: Waveform,
    tint: "bg-rose-tint-100",
    glyph: "text-rose-500",
    label: "text-rose-500",
  },
];

export async function FragmentedStack() {
  const m = await getDictionary();
  const copy = m.sections.connected.fragmented;
  const pillars = m.common.pillars;

  return (
    <div>
      <MicroEyebrow className="text-ink-500">{copy.eyebrow}</MicroEyebrow>
      <HardLines value={[copy.lead]} paragraphClassName="mt-3 text-card-body text-ink-500" />

      <RevealGroup className="mt-7 flex flex-col gap-5">
        {CARDS.map((card) => {
          const Glyph = card.icon;
          const pillar = pillars[card.key];
          return (
            <RevealItem key={card.key}>
              <div className="flex min-h-[88px] items-center gap-3.5 rounded-card bg-surface-card px-3.5 py-4 shadow-card">
                <span
                  className={cn(
                    "flex size-[58px] shrink-0 items-center justify-center rounded-full",
                    card.tint,
                  )}
                >
                  <Glyph className={cn("size-7", card.glyph)} />
                </span>
                <span className="min-w-0">
                  <span className={cn("block text-card-body font-semibold", card.label)}>
                    {pillar.title}
                  </span>
                  {/* Card 3's sub runs to two lines and the card is allowed to
                      grow — but where the break falls is the browser's call,
                      not the catalogue's: the deck's own break sat between two
                      English words. */}
                  <span className="mt-0.5 block text-balance text-card-body text-ink-500">
                    {pillar.sub}
                  </span>
                </span>
              </div>
            </RevealItem>
          );
        })}
      </RevealGroup>
    </div>
  );
}
