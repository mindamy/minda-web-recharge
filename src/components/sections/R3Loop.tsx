import { R3Aurora } from "@/components/aurora";
import { AskRechargeLoop } from "@/components/chrome/AskRecharge";
import { ScrollCue } from "@/components/chrome/ScrollCue";
import { Heart } from "@/components/icons";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { GradText, RCubed } from "@/components/ui/GradText";
import { Section } from "@/components/ui/Section";
import { SECTION_IDS } from "@/lib/nav";

import { ExperienceCard } from "./r3/ExperienceCard";
import { LoopDiagram } from "./r3/LoopDiagram";

/**
 * Section 3 — the R³ Recharge Loop (DESIGN-SPEC §3.3, deck page 3).
 *
 * Two columns at `lg`, stacked below: copy, then the loop diagram, then the
 * player card, then the Ask Recharge block, then a centred closing cluster
 * spanning the full width.
 *
 * The column ratio is 1.4 / 1 at `xl`, not the ≈52/48 §3.3 states in prose.
 * §3.3's own measurements disagree with itself: the card it describes occupies
 * x 858 → 1376 of a 1265px content band, which is 41%, and 1.4 / 1 is what
 * puts the card back at its measured 518px. `lg` falls back to an even split
 * because 41% of a 1024px viewport is too narrow for the card to hold its
 * two-line body copy.
 *
 * `Recharge` is the only gradient run in the headline — mapping 3 in §1.2 —
 * and it is wrapped once around the whole word rather than per letter, so the
 * ramp runs continuously blue → teal → rose across the eight glyphs instead of
 * restarting. `How` and `helps` stay `ink-900`.
 */
export function R3Loop() {
  return (
    <Section id={SECTION_IDS.r3Loop}>
      <R3Aurora />
      <Container width="wide">
        <div className="grid items-start gap-x-10 gap-y-12 lg:grid-cols-2 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          {/* Left: the copy block, then the loop diagram beneath it. */}
          <div className="min-w-0">
            <RevealGroup stagger={0.07}>
              <RevealItem>
                <Eyebrow>
                  THE <RCubed /> RECHARGE LOOP
                </Eyebrow>
              </RevealItem>

              <RevealItem>
                <h2 className="text-h2 mt-5">
                  How <GradText>Recharge</GradText> helps
                </h2>
              </RevealItem>

              <RevealItem>
                <p className="text-body mt-6 text-ink-600">
                  One connected loop to help you understand yourself,{" "}
                  <br className="hidden sm:inline" />
                  find what you need and{" "}
                  <strong className="font-semibold text-ink-800">
                    feel better in the moment.
                  </strong>
                </p>
              </RevealItem>

              <RevealItem>
                <p className="text-body mt-6 font-semibold text-ink-800">
                  There is no fixed starting point. <br className="hidden sm:inline" />
                  Start wherever you are.
                </p>
              </RevealItem>
            </RevealGroup>

            <LoopDiagram className="mt-10 lg:mt-8" />
          </div>

          {/* Right: the experience card, then the Ask Recharge block. */}
          <div className="min-w-0">
            <Reveal y={20}>
              <ExperienceCard />
            </Reveal>
            <Reveal delay={0.12}>
              <AskRechargeLoop className="mt-8" />
            </Reveal>
          </div>
        </div>

        {/* Closing cluster, full width and centred. */}
        <Reveal className="mt-14">
          <div className="flex flex-col items-center gap-4 text-center">
            {/* Neutral grey, not rose — §3.3 is explicit about it. */}
            <Heart className="size-[26px] text-[#99A4B5]" strokeWidth={1.9} />
            <p className="font-display text-[1.375rem] leading-snug text-ink-900 sm:text-[1.625rem]">
              Start where you are. Move with what you need.
            </p>
          </div>
          <ScrollCue variant="plain" className="mt-6" />
        </Reveal>
      </Container>
    </Section>
  );
}
