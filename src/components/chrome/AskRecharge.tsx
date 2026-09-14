import type { ReactNode } from "react";

import {
  ArrowRight,
  CheckCircle,
  SpeechBubbleDots,
  SpeechBubblePlain,
  SpeechBubbleSparkle,
} from "@/components/icons";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { CTA } from "@/lib/nav";

/**
 * The `Ask Recharge` affordance.
 *
 * It recurs seven times across the deck in five genuinely different layouts —
 * differing in circle diameter, ring treatment, icon hue, line count and
 * which line carries the link. Rather than one component with a dozen props,
 * each layout is its own small export named for where it appears, so every
 * one can be checked against its row in DESIGN-SPEC §2.4 at a glance.
 */

const ASK_HREF = "/ask";

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
 * Hero — an inline meta link sitting right of a hairline divider, alongside
 * the trial meta. The whole string is one link and `Ask Recharge` is not
 * separately coloured here.
 */
export function TrialMeta({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "text-meta flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5",
        className,
      )}
    >
      <span className="flex items-center gap-2.5 text-ink-400">
        <CheckCircle className="size-4.5 shrink-0" />
        {CTA.trialMeta}
      </span>

      <span aria-hidden className="hidden h-4 w-px bg-hairline sm:block" />

      <a
        href={ASK_HREF}
        className="group flex items-center gap-2 text-ink-500 transition-colors duration-150 ease-soft hover:text-blue-ink"
      >
        <SpeechBubbleDots className="size-5 shrink-0 text-ink-400 transition-colors duration-150 group-hover:text-blue-ink" />
        Not sure where to start? Ask Recharge
        <ArrowRight className="size-4 shrink-0 transition-transform duration-150 ease-soft group-hover:translate-x-0.5" />
      </a>
    </div>
  );
}

/** p-2 — the full-width tinted banner. */
export function AskRechargeBanner({ className }: { className?: string }) {
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

      <p className="text-[1.375rem] leading-snug font-semibold text-ink-800">
        Not sure where to start?
        <br />
        <span className="text-blue-ink">Ask Recharge.</span>
      </p>

      <span aria-hidden className="hidden h-14 w-px shrink-0 bg-hairline md:block" />

      <p className="text-body-sm flex-1 text-ink-500">
        Our AI companion can help you make sense
        <br className="hidden lg:inline" /> of how you feel and find what might help.
      </p>

      <Button href={ASK_HREF} variant="outlineBlue" size="lg" className="group shrink-0">
        <SpeechBubblePlain className="size-5" />
        Ask Recharge
        <ArrowRight className="size-5 transition-transform duration-150 ease-soft group-hover:translate-x-0.5" />
      </Button>
    </div>
  );
}

/** p-3 — a two-line block where both lines are blue. */
export function AskRechargeLoop({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-4", className)}>
      <BubbleCircle size={46} className="border border-[#DAE1FA] bg-[#EEF2FD]">
        <SpeechBubbleDots className="size-5.5 text-blue-ink" />
      </BubbleCircle>
      <div>
        <p className="text-meta text-[#2B59F0]">Questions about the loop?</p>
        <a
          href={ASK_HREF}
          className="group text-btn-sm mt-0.5 flex items-center gap-2 font-semibold text-blue-ink"
        >
          Ask Recharge
          <ArrowRight className="size-5 transition-transform duration-150 ease-soft group-hover:translate-x-0.5" />
        </a>
      </div>
    </div>
  );
}

/** p-5 — one line with an inline link and a sub-caption. Green icon here. */
export function AskRechargePersonal({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-4", className)}>
      <BubbleCircle size={46} className="bg-white">
        <SpeechBubbleDots className="size-5.5 text-[#62B292]" />
      </BubbleCircle>
      <div>
        <p className="text-body-sm text-ink-600">
          How does Recharge become personal?{" "}
          <a
            href={ASK_HREF}
            className="font-medium text-blue-ink transition-colors duration-150 hover:text-blue-fill"
          >
            Ask Recharge
          </a>
        </p>
        <p className="mt-0.5 text-xs text-ink-400">Website guide</p>
      </div>
    </div>
  );
}

/** p-6 — a single line, transparent circle with a blue ring. */
export function AskRechargeApproach({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-4", className)}>
      <BubbleCircle size={46} className="border border-[#A1BDE7] bg-transparent">
        <SpeechBubblePlain className="size-5.5 text-blue-ink" />
      </BubbleCircle>
      <p className="text-btn-sm font-normal text-ink-600">
        Questions about our approach?{" "}
        <a
          href={ASK_HREF}
          className="group inline-flex items-center gap-1.5 font-semibold text-blue-ink transition-colors duration-150 hover:text-blue-fill"
        >
          Ask Recharge
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
export function AskRechargePlans({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-4", className)}>
      <BubbleCircle size={54} className="border border-[#C9D7F5] bg-transparent">
        <SpeechBubblePlain className="size-6.5 text-blue-ink" />
      </BubbleCircle>
      <div>
        <p className="text-btn-sm text-ink-600">Not sure which plan fits you?</p>
        <a
          href={ASK_HREF}
          className="group mt-0.5 flex items-center gap-2 text-[1.1875rem] font-medium text-blue-ink"
        >
          Help Me Choose
          <ArrowRight className="size-5 transition-transform duration-150 ease-soft group-hover:translate-x-0.5" />
        </a>
        <p className="text-meta mt-0.5 text-ink-400">Ask Recharge</p>
      </div>
    </div>
  );
}

/** p-8 — two lines, with a 1px blue-to-green gradient ring on the circle. */
export function AskRechargeStart({ className }: { className?: string }) {
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
        <p className="text-btn font-medium text-ink-800">
          Still have a question before you begin?
        </p>
        <p className="text-btn mt-0.5">
          <a
            href={ASK_HREF}
            className="font-medium text-blue-ink transition-colors duration-150 hover:text-blue-fill"
          >
            Ask Recharge
          </a>
          <span className="text-ink-400"> &middot; </span>
          <span className="text-ink-400">Website guide</span>
        </p>
      </div>
    </div>
  );
}
