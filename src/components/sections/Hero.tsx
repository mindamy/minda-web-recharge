import Image from "next/image";

import { ParallaxLayer } from "@/components/motion/ParallaxLayer";
import { HeroAurora } from "@/components/aurora";
import { TrialMeta } from "@/components/chrome/AskRecharge";
import { ScrollCue } from "@/components/chrome/ScrollCue";
import { TrustStrip } from "@/components/chrome/TrustStrip";
import { PlayTriangle } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { GradRun } from "@/components/ui/GradText";
import { Section } from "@/components/ui/Section";
import { CTA, SECTION_IDS } from "@/lib/nav";

/**
 * Hero.
 *
 * Sourced from `.docs/First Page.jpeg`, which supersedes page 1 of the design
 * deck. The deck's own page 1 showed a different hero — a portrait plus an app
 * mockup — and is deliberately not built.
 *
 * The headline's highlighted phrases do NOT use the shared deck ramp. The hero
 * JPEG runs warmer and more violet, and each of its three runs was measured
 * separately, so they are passed as explicit stops. `discomfort` is a flat
 * violet rather than a gradient, which is what the render shows.
 *
 * Entrances here are CSS animations, not Motion. Motion serialises its
 * `initial` variant into the server HTML as an inline `opacity:0`, which means
 * the most important content on the site would stay invisible if scripting
 * were unavailable or hydration failed. A CSS animation cannot fail that way.
 * Below-the-fold sections still use Motion, where the trade-off is acceptable
 * and the `scripting: none` net in globals.css covers the gap.
 */

/** Staggered entrance delays, in milliseconds. */
const RISE = {
  eyebrow: 0,
  headline: 70,
  serifLead: 150,
  sansLead: 210,
  ctas: 270,
  meta: 330,
  trustStrip: 400,
  scrollCue: 470,
} as const;

/**
 * The full-bleed sunrise photograph.
 *
 * The supplied hero JPEG has the entire page UI — nav, headline, buttons,
 * trust card — baked into the photograph, so it cannot be used as-is. This is
 * the largest completely UI-free sub-rectangle of that frame (848x754 at
 * x600,y82), which is also the resolution ceiling: page 1 of the PDF embeds
 * only a 1448x965 raster, so no sharper source exists. The image is a soft,
 * low-detail sunrise, which upscales forgivingly.
 *
 * Three layers keep the photo clear of the copy:
 *   - a vertical mask, so it dissolves before reaching the trust strip
 *   - a horizontal scrim following the measured opacity profile (photo reads
 *     ~0 at 30% of the frame, 0.45 at 40%, 0.8 at 50%, full from 72%)
 *   - a flat scrim below `lg`, where the copy spans the full width and there
 *     is no left region left to protect
 */
function HeroPhoto() {
  const fade = "linear-gradient(to bottom, #000 68%, transparent 84%)";

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <Image
        src="/images/hero-sunrise-clean.jpg"
        alt=""
        fill
        sizes="100vw"
        /* Above the fold. `loading`/`fetchPriority` rather than the `priority`
           prop, which Next 16 deprecated — and which emits no warning to tell
           you it is stale. */
        loading="eager"
        fetchPriority="high"
        className="object-cover object-[70%_38%] lg:object-[center_40%]"
        style={{ maskImage: fade, WebkitMaskImage: fade }}
      />
      <div
        className="absolute inset-0 hidden lg:block"
        style={{
          background:
            "linear-gradient(to right, var(--color-bg-base) 0%, var(--color-bg-base) 30%, color-mix(in srgb, var(--color-bg-base) 62%, transparent) 40%, color-mix(in srgb, var(--color-bg-base) 24%, transparent) 50%, transparent 72%)",
        }}
      />
      <div className="absolute inset-0 bg-white/55 lg:hidden" />
    </div>
  );
}

export function Hero() {
  return (
    <Section
      id={SECTION_IDS.hero}
      spacing="none"
      className="flex min-h-[760px] flex-col justify-center pt-[clamp(0.5rem,1.6vh,2rem)] pb-[clamp(0.5rem,0.8vh,2.5rem)] md:min-h-svh"
    >
      <HeroPhoto />
      <ParallaxLayer distance={40}>
        <HeroAurora />
      </ParallaxLayer>

      <Container width="wide">
        <div className="max-w-[34rem]">
          <Eyebrow
            className="animate-rise"
            style={{ animationDelay: `${RISE.eyebrow}ms` }}
          >
            Your personal wellbeing companion
          </Eyebrow>

          {/*
            Five hard line breaks at the deck's reference width. Below `lg` the
            text reflows naturally — forcing the deck's breaks at 390px would
            strand single words on their own lines.
          */}
          <h1
            className="text-h1 animate-rise mt-[clamp(0.75rem,3vh,2.5rem)] text-ink-900"
            style={{ animationDelay: `${RISE.headline}ms` }}
          >
            What if <GradRun stops="#1663DA 0%, #0F8FCB 100%">better sleep,</GradRun>
            <br className="hidden lg:inline" /> a{" "}
            <GradRun stops="#0A81B9 0%, #295A9D 55%, #46397E 100%">calmer mind,</GradRun> and
            <br className="hidden lg:inline" /> relief from{" "}
            <GradRun stops="#7A4B81 0%, #C56F97 100%">migraine</GradRun>
            <br className="hidden lg:inline" /> <span className="text-[#82458C]">discomfort</span>{" "}
            were
            <br className="hidden lg:inline" /> within reach?
          </h1>

          <p
            className="text-lead-serif animate-rise mt-[clamp(1rem,3vh,2.5rem)] font-display text-ink-900"
            style={{ animationDelay: `${RISE.serifLead}ms` }}
          >
            Recharge your body. Calm your mind.
            <br className="hidden sm:inline" /> Wake up feeling refreshed.
          </p>

          <p
            className="text-lead animate-rise mt-[clamp(0.875rem,2.4vh,2rem)] text-ink-600"
            style={{ animationDelay: `${RISE.sansLead}ms` }}
          >
            Give yourself the rest and recovery you deserve.
          </p>

          <div
            className="animate-rise mt-[clamp(1rem,3vh,2.625rem)] flex flex-wrap items-center gap-5"
            style={{ animationDelay: `${RISE.ctas}ms` }}
          >
            <Button href="/plans" variant="primary" size="md" className="min-w-[225px]">
              {CTA.tryFree}
            </Button>
            <Button href="/how-it-works" variant="outlineBlue" size="md">
              <PlayTriangle className="size-3.5 text-blue-fill" />
              {CTA.seeHowItWorks}
            </Button>
          </div>

          <TrialMeta
            className="animate-rise mt-[clamp(0.875rem,2.1vh,1.75rem)]"
            style={{ animationDelay: `${RISE.meta}ms` }}
          />
        </div>
      </Container>

      <Container
        width="narrow"
        className="animate-rise mt-[clamp(1.25rem,3.2vh,3.75rem)]"
        style={{ animationDelay: `${RISE.trustStrip}ms` }}
      >
        <TrustStrip />
      </Container>

      <ScrollCue
        variant="bare"
        className="animate-rise mt-[clamp(0.875rem,1.8vh,1.625rem)]"
        style={{ animationDelay: `${RISE.scrollCue}ms` }}
      />
    </Section>
  );
}
