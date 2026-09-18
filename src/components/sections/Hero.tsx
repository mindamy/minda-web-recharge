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
import { defaultMarks, RichText, type MarkRenderers } from "@/components/ui/RichText";
import { Section } from "@/components/ui/Section";
import { localePath } from "@/lib/i18n/config";
import { getDictionary, getLocale } from "@/lib/i18n/dictionaries";
import { SECTION_IDS } from "@/lib/nav";

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
 * Those measured stops stay in this file — see `HERO_MARKS`. The catalogue
 * carries only a `mark` *name* per run (`grad-1` / `grad-2` / `grad-3` /
 * `violet`), never a colour, so a translator moving `better sleep,` to a
 * different position in the sentence cannot take the wrong ramp with it, and
 * re-measuring the JPEG never means editing three JSON files.
 *
 * Entrances here are CSS animations, not Motion. Motion serialises its
 * `initial` variant into the server HTML as an inline `opacity:0`, which means
 * the most important content on the site would stay invisible if scripting
 * were unavailable or hydration failed. A CSS animation cannot fail that way.
 * Below-the-fold sections still use Motion, where the trade-off is acceptable
 * and the `scripting: none` net in globals.css covers the gap.
 */

/**
 * The four treatments the hero headline names.
 *
 * Each `stops` string is the range measured off `.docs/First Page.jpeg` for
 * that run and is reproduced here byte-for-byte from the pre-catalogue markup.
 * `violet` is a flat fill, not a ramp — the render shows `discomfort` as one
 * colour — so it is a plain `<span>` rather than a one-stop `GradRun`.
 *
 * Spread over `defaultMarks` rather than replacing it: the shared `grad`,
 * `strong` and `rcubed` marks stay available, so a future translation that
 * reaches for one of them renders instead of failing the build.
 */
const HERO_MARKS: MarkRenderers = {
  ...defaultMarks,
  "grad-1": (text) => <GradRun stops="#1663DA 0%, #0F8FCB 100%">{text}</GradRun>,
  "grad-2": (text) => <GradRun stops="#0A81B9 0%, #295A9D 55%, #46397E 100%">{text}</GradRun>,
  "grad-3": (text) => <GradRun stops="#7A4B81 0%, #C56F97 100%">{text}</GradRun>,
  violet: (text) => <span className="text-[#82458C]">{text}</span>,
};

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

export async function Hero() {
  const locale = await getLocale();
  const m = await getDictionary();

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
            {m.sections.hero.eyebrow}
          </Eyebrow>

          {/*
            The deck breaks this headline five times at its reference width.
            Those breaks were `hidden lg:inline` <br>s placed between English
            words — two of the four fell *inside* a phrase rather than on a
            gradient-run boundary, so they cannot be expressed as catalogue
            lines and they would be wrong for Han text regardless. Wrapping is
            therefore left to the `text-wrap: balance` globals.css already
            applies to every h1/h2/h3 — which those `<br>`s were in fact
            overriding at `lg`. The unconditional breaks the deck does carry
            are still catalogue lines; this headline simply has none.
          */}
          <h1
            className="text-h1 animate-rise mt-[clamp(0.75rem,3vh,2.5rem)] text-ink-900"
            style={{ animationDelay: `${RISE.headline}ms` }}
          >
            <RichText
              value={m.sections.hero.headline}
              marks={HERO_MARKS}
              where="sections.hero.headline"
            />
          </h1>

          <p
            className="text-lead-serif animate-rise mt-[clamp(1rem,3vh,2.5rem)] text-balance font-display text-ink-900"
            style={{ animationDelay: `${RISE.serifLead}ms` }}
          >
            {m.sections.hero.leadSerif}
          </p>

          <p
            className="text-lead animate-rise mt-[clamp(0.875rem,2.4vh,2rem)] text-ink-600"
            style={{ animationDelay: `${RISE.sansLead}ms` }}
          >
            {m.sections.hero.leadSans}
          </p>

          <div
            className="animate-rise mt-[clamp(1rem,3vh,2.625rem)] flex flex-wrap items-center gap-5"
            style={{ animationDelay: `${RISE.ctas}ms` }}
          >
            <Button
              href={localePath(locale, "/plans")}
              variant="primary"
              size="md"
              className="min-w-[225px]"
            >
              {m.common.cta.tryFree}
            </Button>
            <Button href={localePath(locale, "/how-it-works")} variant="outlineBlue" size="md">
              <PlayTriangle className="size-3.5 text-blue-fill" />
              {m.common.cta.seeHowItWorks}
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
