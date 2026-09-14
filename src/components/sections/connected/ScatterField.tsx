import * as m from "motion/react-client";
import type { ComponentType } from "react";

import {
  BarChart,
  DocumentLines,
  LineChart,
  MusicNote,
  PlayTriangle,
  Sparkle,
  SpeechBubbleDots,
  type IconProps,
} from "@/components/icons";
import { cn } from "@/lib/cn";

/**
 * Zone B — the mini-card scatter.
 *
 * Eight small floating chips carrying abstract glyph stand-ins, not real copy:
 * they read as "the pieces of your wellbeing data", drifting between the
 * fragmented stack and the portrait. Positions are irregular by design — the
 * deck has no grid here, and the chips cluster into a loose vertical band
 * roughly a third of the way across the zone with only ~100px of horizontal
 * jitter, which is what the percentages below reproduce.
 *
 * Pure decoration: `Connected` drops this entire layer below `lg`, where the
 * chips would compress into illegible confetti.
 *
 * Server Component. The drift uses `motion/react-client`, so no `"use client"`
 * boundary is needed here — importing `motion/react` instead would typecheck
 * and then fail at prerender.
 */

type Chip = {
  icon: ComponentType<IconProps>;
  glyph: string;
  /** Percentage of the zone's width / height, measured from the render. */
  left: number;
  top: number;
  /** Chip edge in px — the deck varies these between 28 and 42. */
  size: number;
  /** Drift cycle in seconds, staggered so the field never pulses in unison. */
  duration: number;
  delay: number;
};

const CHIPS: readonly Chip[] = [
  { icon: BarChart, glyph: "text-violet-500", left: 20, top: 15, size: 42, duration: 7.5, delay: 0 },
  { icon: LineChart, glyph: "text-blue-icon", left: 17, top: 30, size: 40, duration: 8.5, delay: 0.9 },
  { icon: DocumentLines, glyph: "text-blue-icon", left: 40, top: 36, size: 40, duration: 9.5, delay: 0.4 },
  { icon: SpeechBubbleDots, glyph: "text-green-500", left: 17, top: 46, size: 38, duration: 8, delay: 1.4 },
  { icon: Sparkle, glyph: "text-green-300", left: 46, top: 50, size: 32, duration: 10, delay: 0.7 },
  { icon: DocumentLines, glyph: "text-green-icon", left: 28, top: 59, size: 38, duration: 9, delay: 1.9 },
  { icon: PlayTriangle, glyph: "text-rose-500", left: 28, top: 76, size: 40, duration: 8.5, delay: 1.1 },
  { icon: MusicNote, glyph: "text-rose-400", left: 43, top: 86, size: 40, duration: 7.5, delay: 2.2 },
];

export function ScatterField({ className }: { className?: string }) {
  return (
    <div className={cn("relative", className)} aria-hidden>
      {CHIPS.map((chip, i) => {
        const Glyph = chip.icon;
        return (
          <div
            key={`${chip.left}-${chip.top}-${i}`}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${chip.left}%`, top: `${chip.top}%` }}
          >
            <m.div
              className="flex items-center justify-center rounded-lg bg-surface-card shadow-node"
              style={{ width: chip.size, height: chip.size }}
              animate={{ y: [0, -5, 0] }}
              transition={{
                duration: chip.duration,
                delay: chip.delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Glyph className={cn("h-1/2 w-1/2", chip.glyph)} />
            </m.div>
          </div>
        );
      })}
    </div>
  );
}
