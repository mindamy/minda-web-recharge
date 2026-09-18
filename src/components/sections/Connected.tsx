import { ConnectedAurora } from "@/components/aurora";
import { ParallaxLayer } from "@/components/motion/ParallaxLayer";
import { Reveal } from "@/components/motion/Reveal";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { HardLines, RichText } from "@/components/ui/RichText";
import { Section } from "@/components/ui/Section";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { SECTION_IDS } from "@/lib/nav";

import { CentrePortrait } from "./connected/CentrePortrait";
import { ConnectionCurves } from "./connected/ConnectionCurves";
import { Connector } from "./connected/Connector";
import { FragmentedStack } from "./connected/FragmentedStack";
import { ScatterField } from "./connected/ScatterField";
import { UnifiedCircle } from "./connected/UnifiedCircle";
import { WhyConnectionMatters } from "./connected/WhyConnectionMatters";

/**
 * The Connected section (deck p-4) — "MORE CONNECTED".
 *
 * The section makes one argument in one picture: scattered help on the left,
 * one person in the middle, one connected experience on the right. So the
 * centrepiece is a diagram, not a card grid, and it is built as four grid
 * tracks sized in the deck's own measured proportions (220 / 250 / 325 / 490)
 * with an absolutely positioned hairline curve layer stretched across them.
 *
 * Three separate gradient headlines appear here (DESIGN-SPEC §1.2 rows 4a-4c)
 * and the first of them is the trap: 4a, the section headline, is the only
 * headline in the whole deck with **no** gradient run at all. It is entirely
 * `ink-900`. The gradient runs belong to 4b and 4c, and in both the run is the
 * single word `connected` — wrapped once, around the whole word, never
 * per-letter and never animated.
 *
 * Server Component throughout. The only motion is decorative drift and scroll
 * reveals, which come from `motion/react-client` and the pre-marked `Reveal`
 * family; nothing here needs a hook, so nothing here needs `"use client"`.
 * That is also why every part of this section reads the catalogue directly
 * with `getDictionary()` — there is no client boundary to prop-drill across,
 * and no catalogue bytes reach the browser.
 *
 * Responsive (DESIGN-SPEC §4.2): the diagram cannot reflow, so below `lg` it
 * becomes a vertical narrative — stack, connector, portrait, connector,
 * circle — and the mini-card scatter, the curves and the endpoint dots are
 * dropped outright. They are pure decoration and unreadable compressed.
 */
export async function Connected() {
  const m = await getDictionary();
  const copy = m.sections.connected;

  return (
    <Section id={SECTION_IDS.connected}>
      <ParallaxLayer distance={60}>
        <ConnectedAurora />
      </ParallaxLayer>

      <Container width="narrow">
        <Reveal className="flex flex-col items-center text-center">
          <Eyebrow gradient="forward">{copy.eyebrow}</Eyebrow>

          {/* Headline 4a is the only headline in the deck with no gradient run
              at all, which is why it needs no `marks` override: the catalogue
              gives it two unmarked lines and both render as `ink-900`. */}
          <h2 className="mt-5 text-h2 text-ink-900">
            <RichText value={copy.headline} where="sections.connected.headline" />
          </h2>

          <HardLines value={[copy.lead]} paragraphClassName="mt-6 text-body text-ink-600" />
        </Reveal>
      </Container>

      <Container width="wide" className="mt-12">
        <div className="relative">
          <ConnectionCurves className="pointer-events-none absolute inset-0 hidden lg:block" />

          {/*
            Track widths are the deck's measured zone spans as `fr` units, so
            the curve layer's viewBox lands on the same boundaries at any
            width. `minmax(0, …)` stops a long card label from widening its
            track and shifting everything downstream.
          */}
          <div className="relative grid items-center gap-y-6 lg:grid-cols-[minmax(0,220fr)_minmax(0,250fr)_minmax(0,325fr)_minmax(0,490fr)] lg:gap-x-3 lg:gap-y-0">
            <FragmentedStack />

            <ScatterField className="hidden self-stretch lg:block" />

            <Connector />

            <Reveal>
              <CentrePortrait />
            </Reveal>

            <Connector />

            <Reveal>
              <UnifiedCircle />
            </Reveal>
          </div>
        </div>
      </Container>

      <Container width="wide" className="mt-14">
        <WhyConnectionMatters />
      </Container>
    </Section>
  );
}
