import type { CSSProperties, ReactNode } from "react";

import {
  ArrowRight,
  CheckCircle,
  SpeechBubbleDots,
  SpeechBubblePlain,
  SpeechBubbleSparkle,
} from "@/components/icons";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { localePath } from "@/lib/i18n/config";
import { getDictionary, getLocale } from "@/lib/i18n/dictionaries";

/**
 * The `Ask Recharge` affordance.
 *
 * It recurs seven times across the deck in five genuinely different layouts —
 * differing in circle diameter, ring treatment, icon hue, line count and
 * which line carries the link. Rather than one component with a dozen props,
 * each layout is its own small export named for where it appears, so every
 * one can be checked against its row in DESIGN-SPEC §2.4 at a glance.
 *
 * Every export is an `async` Server Component reading `getDictionary()`
 * directly. They are only ever rendered from Server Components (Hero,
 * Moments, R3Loop, Rhythm, Trust, Plans, Start), so no slice has to cross the
 * client boundary and no catalogue byte reaches the browser.
 *
 * The copy lives under `common.ask` rather than `chrome.ask`: these blocks are
 * embedded *inside* sections, not in the header or footer, and several of
 * their strings — `label`, `guide` — repeat across four of the seven
 * placements. Storing them once means a translator writes `Ask Recharge` one
 * time and the seven placements cannot drift.
 */

/** The circular icon holder. Diameter, fill and ring all vary by placement. */
function BubbleCircle({
  size,
  className,
  children,
}: {
  size: number;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      style={{ width: size, height: size }}
      className={cn("flex shrink-0 items-center justify-center rounded-full", className)}
    >
      {children}
    </span>
  );
}

/**
 * The `Ask Recharge` destination, locale-prefixed.
 *
 * `/ask` is a bare literal like every other route slug — slugs stay English
 * in all three locales — so this is a string prefix that cannot miss. It was
 * previously a module-level `ASK_HREF` constant, which is exactly the shape
 * that silently kept pointing at the unprefixed route.
 */
async function askHref(): Promise<string> {
  return localePath(await getLocale(), "/ask");
}

/**
 * Hero — an inline meta link sitting right of a hairline divider, alongside
 * the trial meta. The whole string is one link and `Ask Recharge` is not
 * separately coloured here, so `common.ask.hero` carries the entire sentence
 * rather than being concatenated from the question and the label: a
 * translation may well not end on the product name.
 */
export async function TrialMeta({
  className,
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) {
  const m = await getDictionary();
  const href = await askHref();

  return (
    <div
      style={style}
      className={cn(
        "text-meta flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5",
        className,
      )}
    >
      <span className="flex items-center gap-2.5 text-ink-500">
        <CheckCircle className="size-4.5 shrink-0" />
        {m.common.cta.trialMeta}
      </span>

      <span aria-hidden className="hidden h-4 w-px bg-hairline sm:block" />

      <a
        href={href}
        className="group flex items-center gap-2 text-ink-500 transition-colors duration-150 ease-soft hover:text-blue-ink"
      >
        <SpeechBubbleDots className="size-5 shrink-0 text-ink-400 transition-colors duration-150 group-hover:text-blue-ink" />
        {m.common.ask.hero}
        <ArrowRight className="size-4 shrink-0 transition-transform duration-150 ease-soft group-hover:translate-x-0.5" />
      </a>
    </div>
  );
}

/** p-2 — the full-width tinted banner. */
export async function AskRechargeBanner({ className }: { className?: string }) {
  const m = await getDictionary();
  const href = await askHref();

  return (
    <div
      className={cn(
        "rounded-card bg-blue-banner flex flex-col gap-6 px-7 py-7 md:flex-row md:items-center md:gap-8 md:px-9",
        className,
      )}
    >
      <BubbleCircle size={62} className="bg-[#DEE9FB]">
        <SpeechBubbleSparkle className="size-8 text-[#2B66E7]" />
      </BubbleCircle>

      {/* An unconditional break: the deck sets the question and the answer on
          separate lines at every width, and they are two catalogue entries,
          so the break is structure rather than wrapping. */}
      <p className="text-[1.375rem] leading-snug font-semibold text-ink-800">
        {m.common.ask.bannerLead}
        <br />
        <span className="text-blue-ink">{m.common.ask.labelDotted}</span>
      </p>

      <span aria-hidden className="hidden h-14 w-px shrink-0 bg-hairline md:block" />

      {/* This used to carry a `<br className="hidden lg:inline" />` after
          "make sense". That was a responsive break — layout, not copy — and
          the catalogue stores the sentence flat, with no split point, because
          a Chinese translation wraps nowhere near the English clause. The
          paragraph is `flex-1`, so it wraps on its own. */}
      <p className="text-body-sm flex-1 text-ink-500">{m.common.ask.bannerBody}</p>

      <Button href={href} variant="outlineBlue" size="lg" className="group shrink-0">
        <SpeechBubblePlain className="size-5" />
        {m.common.ask.label}
        <ArrowRight className="size-5 transition-transform duration-150 ease-soft group-hover:translate-x-0.5" />
      </Button>
    </div>
  );
}

/** p-3 — a two-line block where both lines are blue. */
export async function AskRechargeLoop({ className }: { className?: string }) {
  const m = await getDictionary();
  const href = await askHref();

  return (
    <div className={cn("flex items-center gap-4", className)}>
      <BubbleCircle size={46} className="border border-[#DAE1FA] bg-[#EEF2FD]">
        <SpeechBubbleDots className="size-5.5 text-blue-ink" />
      </BubbleCircle>
      <div>
        <p className="text-meta text-[#2B59F0]">{m.common.ask.loop}</p>
        <a
          href={href}
          className="group text-btn-sm mt-0.5 flex items-center gap-2 font-semibold text-blue-ink"
        >
          {m.common.ask.label}
          <ArrowRight className="size-5 transition-transform duration-150 ease-soft group-hover:translate-x-0.5" />
        </a>
      </div>
    </div>
  );
}

/** p-5 — one line with an inline link and a sub-caption. Green icon here. */
export async function AskRechargePersonal({ className }: { className?: string }) {
  const m = await getDictionary();
  const href = await askHref();

  return (
    <div className={cn("flex items-center gap-4", className)}>
      <BubbleCircle size={46} className="bg-white">
        <SpeechBubbleDots className="size-5.5 text-[#62B292]" />
      </BubbleCircle>
      <div>
        <p className="text-body-sm text-ink-600">
          {m.common.ask.personal}{" "}
          <a
            href={href}
            className="font-medium text-blue-ink transition-colors duration-150 hover:text-blue-fill"
          >
            {m.common.ask.label}
          </a>
        </p>
        <p className="mt-0.5 text-xs text-ink-500">{m.common.ask.guide}</p>
      </div>
    </div>
  );
}

/** p-6 — a single line, transparent circle with a blue ring. */
export async function AskRechargeApproach({ className }: { className?: string }) {
  const m = await getDictionary();
  const href = await askHref();

  return (
    <div className={cn("flex items-center gap-4", className)}>
      <BubbleCircle size={46} className="border border-[#A1BDE7] bg-transparent">
        <SpeechBubblePlain className="size-5.5 text-blue-ink" />
      </BubbleCircle>
      <p className="text-btn-sm font-normal text-ink-600">
        {m.common.ask.approach}{" "}
        <a
          href={href}
          className="group inline-flex items-center gap-1.5 font-semibold text-blue-ink transition-colors duration-150 hover:text-blue-fill"
        >
          {m.common.ask.label}
          <ArrowRight className="size-5 transition-transform duration-150 ease-soft group-hover:translate-x-0.5" />
        </a>
      </p>
    </div>
  );
}

/**
 * p-7 — the plans footer cluster. Note the inversion: here `Help Me Choose`
 * is the link and `Ask Recharge` is a label beneath it.
 */
export async function AskRechargePlans({ className }: { className?: string }) {
  const m = await getDictionary();
  const href = await askHref();

  return (
    <div className={cn("flex items-center gap-4", className)}>
      <BubbleCircle size={54} className="border border-[#C9D7F5] bg-transparent">
        <SpeechBubblePlain className="size-6.5 text-blue-ink" />
      </BubbleCircle>
      <div>
        <p className="text-btn-sm text-ink-600">{m.common.ask.plans}</p>
        <a
          href={href}
          className="group mt-0.5 flex items-center gap-2 text-[1.1875rem] font-medium text-blue-ink"
        >
          {m.common.ask.plansCta}
          <ArrowRight className="size-5 transition-transform duration-150 ease-soft group-hover:translate-x-0.5" />
        </a>
        <p className="text-meta mt-0.5 text-ink-500">{m.common.ask.label}</p>
      </div>
    </div>
  );
}

/** p-8 — two lines, with a 1px blue-to-green gradient ring on the circle. */
export async function AskRechargeStart({ className }: { className?: string }) {
  const m = await getDictionary();
  const href = await askHref();

  return (
    <div className={cn("flex items-center gap-4", className)}>
      {/* A gradient border needs a padded gradient background with an inner
          transparent disc; `border-image` does not follow a border-radius. */}
      <span
        className="shrink-0 rounded-full bg-linear-to-b from-blue-300 to-green-300 p-px"
        style={{ width: 58, height: 58 }}
      >
        <span className="flex size-full items-center justify-center rounded-full bg-bg-base">
          <SpeechBubblePlain className="size-6.5 text-blue-ink" />
        </span>
      </span>
      <div>
        <p className="text-btn font-medium text-ink-800">{m.common.ask.start}</p>
        <p className="text-btn mt-0.5">
          <a
            href={href}
            className="font-medium text-blue-ink transition-colors duration-150 hover:text-blue-fill"
          >
            {m.common.ask.label}
          </a>
          <span className="text-ink-400" aria-hidden>
            {" "}
            &middot;{" "}
          </span>
          <span className="text-ink-500">{m.common.ask.guide}</span>
        </p>
      </div>
    </div>
  );
}
