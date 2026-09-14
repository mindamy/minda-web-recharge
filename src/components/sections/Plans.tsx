import Link from "next/link";
import type { ComponentType } from "react";

import { AskRechargePlans } from "@/components/chrome/AskRecharge";
import {
  ArrowRight,
  CalendarCheck,
  CheckCircle,
  Plus,
  Star,
  WaveTilde,
  type IconProps,
} from "@/components/icons";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { Button, type ButtonVariants } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow, MicroEyebrow } from "@/components/ui/Eyebrow";
import { GradText } from "@/components/ui/GradText";
import { Section } from "@/components/ui/Section";
import { cn } from "@/lib/cn";
import { CTA, SECTION_IDS } from "@/lib/nav";

/**
 * Section 7 — `FREE TRIAL & PLANS`, per DESIGN-SPEC §3.7.
 *
 * Centred heading, then the 7-day trial banner, then three pricing cards, a
 * footer row and the working-details disclaimer.
 *
 * Two things here are load-bearing rather than cosmetic:
 *
 * 1. **The rose CTAs use the `outlineRose` Button variant, never a hand-rolled
 *    `text-rose-500` label.** The deck sets `Choose Essential` and `Choose Plus`
 *    in rose-500, which measures 3.6:1 on white and fails WCAG AA. The variant
 *    ships `rose-ink` instead (4.6:1) and is visually indistinguishable at this
 *    size. The rose-500 token still appears on the *check glyphs*, where it is
 *    decoration beside a text label and carries no information of its own.
 * 2. **`Rhythm` is the one elevated card in the whole deck.** It is the only
 *    surface using `shadow-card-elevated`, the only one with a border colour,
 *    and the only one that breaks the row's baseline. Flattening it would erase
 *    the single strongest recommendation signal on the page.
 *
 * British spelling is used for `personalisation` throughout, which is the one
 * agreed deviation from the deck's copy.
 */

type Plan = {
  name: string;
  tagline: string;
  icon: ComponentType<IconProps>;
  /** The 62px tinted icon circle: fill plus the icon's own stroke colour. */
  iconClassName: string;
  /** Check-glyph colour for the feature list — rose on the flanks, green in the middle. */
  checkClassName: string;
  features: readonly string[];
  ctaLabel: string;
  ctaVariant: NonNullable<ButtonVariants["variant"]>;
  /** Surface, border and shadow. Only Rhythm gets the elevated treatment. */
  cardClassName: string;
  /**
   * Visual order. DOM order stays Essential / Rhythm / Plus so the desktop row
   * matches the deck, while the stacked layout leads with the recommended plan
   * (§4.2: "1 column, Rhythm first").
   */
  orderClassName: string;
  featured?: boolean;
  href: string;
};

/**
 * `Recharge Experiences` (plural) on Essential against `Recharge Experience
 * access` (singular) on Rhythm and Plus is as rendered in the deck, not a typo.
 */
const PLANS: readonly Plan[] = [
  {
    name: "Essential",
    tagline: "Start simply.",
    icon: Star,
    iconClassName: "bg-rose-tint-100 text-rose-ink",
    checkClassName: "text-rose-500",
    features: [
      "Core Personal Insights",
      "AI-guided Coaching for lighter use",
      "Core Recharge Experiences",
      "Essential personalisation",
    ],
    ctaLabel: "Choose Essential",
    ctaVariant: "outlineRose",
    cardClassName: "bg-surface-card-warm border-hairline shadow-card",
    orderClassName: "order-2 lg:order-1",
    href: "/plans?plan=essential",
  },
  {
    name: "Rhythm",
    tagline: "Build an ongoing rhythm.",
    icon: WaveTilde,
    iconClassName: "bg-green-tint-50 text-green-500",
    checkClassName: "text-green-500",
    features: [
      "Expanded Personal Insights",
      "More AI-guided Coaching",
      "Wider Recharge Experience access",
      "Personalisation that grows with your use",
    ],
    ctaLabel: "Choose Rhythm",
    ctaVariant: "outlineBlueCta",
    cardClassName:
      "bg-surface-card-elevated border-border-blue-strong shadow-card-elevated",
    orderClassName: "order-1 lg:order-2",
    featured: true,
    href: "/plans?plan=rhythm",
  },
  {
    name: "Plus",
    tagline: "Go deeper with more support.",
    icon: Plus,
    iconClassName: "bg-rose-tint-100 text-rose-ink",
    checkClassName: "text-rose-500",
    features: [
      "Deeper Personal Insights",
      "Highest Coaching access",
      "Full Recharge Experience access",
      "Extended personalisation",
    ],
    ctaLabel: "Choose Plus",
    ctaVariant: "outlineRose",
    cardClassName: "bg-surface-card-warm border-hairline shadow-card",
    orderClassName: "order-3",
    href: "/plans?plan=plus",
  },
];

export function Plans() {
  return (
    <Section id={SECTION_IDS.plans}>
      {/* aurora: <PlansAurora /> mounted by the page */}

      <Container width="narrow">
        <Reveal className="text-center">
          <Eyebrow>FREE TRIAL & PLANS</Eyebrow>

          <h2 className="text-h2 mt-5">
            Choose the Recharge that <GradText>fits you.</GradText>
          </h2>

          <p className="text-body mx-auto mt-6 max-w-[46rem] text-ink-600">
            Try Recharge free for 7 days, then choose the level of support that feels
            right for you.
          </p>
        </Reveal>

        {/* ── 7-day free-trial banner ─────────────────────────────────────── */}
        <Reveal className="mt-12">
          <div className="rounded-card-lg border-hairline-faint bg-blue-banner-faint border p-7 md:p-9">
            <div className="flex flex-col gap-7 md:flex-row md:items-center md:gap-10">
              <span className="flex size-14 shrink-0 items-center justify-center rounded-full border border-[#c9d7f5] bg-white sm:size-[78px]">
                <CalendarCheck className="size-7 text-blue-ink" strokeWidth={2} />
              </span>

              <div className="md:flex-1">
                <MicroEyebrow className="text-blue-ink">7-DAY FREE TRIAL</MicroEyebrow>

                <h3 className="text-h3 mt-2">{CTA.tryFree}</h3>

                <p className="text-body-sm mt-3 text-ink-500">
                  Experience Personal Insights, AI-guided Coaching
                  <br className="hidden sm:inline" /> and Recharge Experiences together
                  before
                  <br className="hidden sm:inline" /> choosing a plan.
                </p>
              </div>

              <div className="flex flex-col gap-3 md:items-end">
                {/*
                  The one serif button label in the deck — every other button is
                  sans. Size and weight are set inline rather than by class so
                  they win over the `size` variant's own type classes outright;
                  the clamp covers the drop to 19px at `sm` (§4.2).
                */}
                <Button
                  href="/plans"
                  variant="primary"
                  size="lg"
                  className="font-display w-full md:w-[276px]"
                  style={{
                    fontSize: "clamp(1.1875rem, 1rem + 0.8vw, 1.375rem)",
                    fontWeight: 400,
                  }}
                >
                  {CTA.tryFree}
                </Button>

                <p className="text-meta text-ink-400 md:text-right">{CTA.trialMeta}</p>
              </div>
            </div>
          </div>
        </Reveal>

        {/* ── Three pricing cards ─────────────────────────────────────────── */}
        <RevealGroup
          className="mt-6 grid grid-cols-1 items-stretch gap-5 lg:grid-cols-3"
          stagger={0.08}
        >
          {PLANS.map((plan) => {
            const { icon: Icon } = plan;

            return (
              <RevealItem
                key={plan.name}
                className={cn(
                  "flex",
                  plan.orderClassName,
                  /*
                    The row-breaking elevation, measured at ~4px above and below
                    its neighbours. A negative block margin does this inside a
                    stretched grid row without a transform, so it cannot fight
                    the reveal animation. Dropped when the cards stack, where it
                    would read as a mis-alignment (§4.2).
                  */
                  plan.featured && "lg:-my-1",
                )}
              >
                <article
                  className={cn(
                    "rounded-card-lg flex w-full flex-col border p-7",
                    plan.cardClassName,
                  )}
                >
                  {plan.featured ? (
                    <p className="bg-blue-tint-50 mx-auto mb-3.5 rounded-full px-3 py-1 text-xs font-medium text-blue-ink">
                      Most popular
                    </p>
                  ) : null}

                  <div className="flex items-center gap-6">
                    <span
                      className={cn(
                        "flex size-[62px] shrink-0 items-center justify-center rounded-full",
                        plan.iconClassName,
                      )}
                    >
                      <Icon className="size-7" strokeWidth={2} />
                    </span>

                    <div>
                      <h3 className="text-h3">{plan.name}</h3>
                      <p className="text-card-body mt-1 text-ink-500">{plan.tagline}</p>
                    </div>
                  </div>

                  <hr className="border-hairline mt-6 border-t" />

                  <p className="text-btn-sm mt-5 text-center font-normal text-ink-500">
                    Price coming soon
                  </p>

                  <ul className="mt-6 space-y-2">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3.5">
                        <CheckCircle
                          className={cn(
                            "mt-0.5 size-[18px] shrink-0",
                            plan.checkClassName,
                          )}
                          strokeWidth={1.8}
                        />
                        <span className="text-btn-sm leading-6 font-normal text-ink-600">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* `mt-auto` keeps the three CTAs on one line despite unequal
                      feature-label wrapping. */}
                  <div className="mt-auto pt-7">
                    <Button
                      href={plan.href}
                      variant={plan.ctaVariant}
                      size="md"
                      className="w-full"
                      style={{ height: "3rem" }}
                    >
                      {plan.ctaLabel}
                    </Button>
                  </div>
                </article>
              </RevealItem>
            );
          })}
        </RevealGroup>

        {/* ── Footer row ──────────────────────────────────────────────────── */}
        <Reveal className="mt-11">
          <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-center md:gap-8">
            {/* The feature-comparison table lives on the standalone Plans route. */}
            <Link
              href="/plans#compare"
              className="group text-btn ease-soft flex items-center gap-3.5 text-blue-ink transition-colors duration-150 hover:text-blue-fill"
            >
              Compare all features
              <ArrowRight className="ease-soft size-5 transition-transform duration-150 group-hover:translate-x-0.5" />
            </Link>

            <span
              aria-hidden
              className="bg-hairline-faint h-px w-full md:h-11 md:w-px"
            />

            <AskRechargePlans />
          </div>

          <p className="text-meta mt-11 text-center text-ink-400">
            Working plan details. Names, prices and usage limits to be confirmed.
          </p>
        </Reveal>
      </Container>
    </Section>
  );
}
