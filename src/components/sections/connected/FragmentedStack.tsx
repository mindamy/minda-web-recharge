import type { ComponentType } from "react";

import { Donut, SpeechBubbleDots, Waveform, type IconProps } from "@/components/icons";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { MicroEyebrow } from "@/components/ui/Eyebrow";
import { cn } from "@/lib/cn";

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

type PillarCard = {
  icon: ComponentType<IconProps>;
  /** The 58px tinted circle behind the glyph. */
  tint: string;
  /** Glyph stroke colour. */
  glyph: string;
  /** Label colour — each pillar owns a hue. */
  label: string;
  title: string;
  /** Hard line breaks as rendered in the deck. */
  sub: readonly string[];
};

const CARDS: readonly PillarCard[] = [
  {
    icon: Donut,
    tint: "bg-violet-tint-50",
    glyph: "text-violet-ink",
    label: "text-blue-ink",
    title: "Personal Insights",
    sub: ["Understand yourself."],
  },
  {
    icon: SpeechBubbleDots,
    tint: "bg-green-tint-100",
    glyph: "text-green-ink",
    label: "text-green-ink",
    title: "AI-guided Coaching",
    sub: ["Find what you need."],
  },
  {
    icon: Waveform,
    tint: "bg-rose-tint-100",
    glyph: "text-rose-500",
    label: "text-rose-500",
    title: "Recharge Experiences",
    sub: ["Feel better in", "the moment."],
  },
];

export function FragmentedStack() {
  return (
    <div>
      <MicroEyebrow className="text-ink-500">FRAGMENTED SUPPORT</MicroEyebrow>
      <p className="mt-3 text-card-body text-ink-500">
        <span className="block">Help can come from many</span>
        <span className="block">places, but rarely works together.</span>
      </p>

      <RevealGroup className="mt-7 flex flex-col gap-5">
        {CARDS.map((card) => {
          const Glyph = card.icon;
          return (
            <RevealItem key={card.title}>
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
                    {card.title}
                  </span>
                  <span className="mt-0.5 block text-card-body text-ink-500">
                    {card.sub.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
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
