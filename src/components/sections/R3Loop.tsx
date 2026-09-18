import { R3Aurora } from "@/components/aurora";
import { AskRechargeLoop } from "@/components/chrome/AskRecharge";
import { ScrollCue } from "@/components/chrome/ScrollCue";
import { Heart } from "@/components/icons";
import { ParallaxLayer } from "@/components/motion/ParallaxLayer";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { defaultMarks, RichText, type MarkRenderers } from "@/components/ui/RichText";
import { Section } from "@/components/ui/Section";
import { getDictionary } from "@/lib/i18n/dictionaries";
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

/**
 * The lead's emphasis is heavier than the shared `strong` mark: this one run
 * is `font-semibold text-ink-800`, measured off the deck, where the default
 * is a plain `font-medium`. Overriding the renderer here — rather than
 * minting a second mark name in the catalogue — keeps the translator's view
 * of the string as "this clause is emphasised" and nothing more.
 */
const LEAD_MARKS: MarkRenderers = {
  ...defaultMarks,
  strong: (text) => <strong className="font-semibold text-ink-800">{text}</strong>,
};

export async function R3Loop() {
  const m = await getDictionary();
  const copy = m.sections.r3Loop;

  return (
    <Section id={SECTION_IDS.r3Loop}>
      <ParallaxLayer distance={70}>
        <R3Aurora />
      </ParallaxLayer>
      <Container width="wide">
        <div className="grid items-start gap-x-10 gap-y-12 lg:grid-cols-2 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          {/* Left: the copy block, then the loop diagram beneath it. */}
          <div className="min-w-0">
            <RevealGroup stagger={0.07}>
              <RevealItem>
                {/* The `R³` segment in the catalogue is textless — it carries
                    a `rcubed` mark and no `text`, because the superscript is
                    drawn, not spelled. `defaultMarks` renders it. */}
                <Eyebrow>
                  <RichText value={copy.eyebrow} where="sections.r3Loop.eyebrow" />
                </Eyebrow>
              </RevealItem>

              <RevealItem>
                <h2 className="text-h2 mt-5">
                  <RichText value={copy.headline} where="sections.r3Loop.headline" />
                </h2>
              </RevealItem>

              <RevealItem>
                <p className="text-body mt-6 text-balance text-ink-600">
                  <RichText value={copy.lead} marks={LEAD_MARKS} where="sections.r3Loop.lead" />
                </p>
              </RevealItem>

              <RevealItem>
                <p className="text-body mt-6 text-balance font-semibold text-ink-800">
                  {copy.noStart}
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
              {copy.closing}
            </p>
          </div>
          <ScrollCue variant="plain" className="mt-6" />
        </Reveal>
      </Container>
    </Section>
  );
}
