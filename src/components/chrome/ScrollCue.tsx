import type { CSSProperties } from "react";

import { ChevronDown } from "@/components/icons";
import { cn } from "@/lib/cn";
import { getDictionary } from "@/lib/i18n/dictionaries";

/**
 * The `SCROLL TO EXPLORE` affordance.
 *
 * Three variants appear across the deck:
 *
 *   bare     hero and deck p-1 — an 18x10 chevron to the LEFT of the label,
 *            with a 22px gap. Not above it.
 *   circled  p-2 — the chevron inside a 36px white circle with a hairline
 *            ring and a soft node shadow.
 *   plain    p-3 — a larger chevron alone, centred below the closing serif
 *            line, with no label at all.
 *
 * Decorative and duplicated by the scrollbar itself, so it is hidden from
 * assistive technology rather than announced. That is *not* a reason to leave
 * the label as a literal: `aria-hidden` removes it from the accessibility
 * tree, but it is still rendered text a reader of the page sees, so it comes
 * from the catalogue like any other copy.
 *
 * A Server Component, so it reads `getDictionary()` directly — the `plain`
 * variant returns before the label is used, and the await costs nothing
 * because the catalogue is already resolved for the page.
 */
export async function ScrollCue({
  variant = "bare",
  label,
  className,
  style,
}: {
  variant?: "bare" | "circled" | "plain";
  /** Overrides `chrome.scrollCue.label`; no caller needs to today. */
  label?: string;
  className?: string;
  style?: CSSProperties;
}) {
  if (variant === "plain") {
    return (
      <div className={cn("flex justify-center", className)} style={style} aria-hidden>
        <ChevronDown className="h-3 w-[22px] text-blue-ink" strokeWidth={1.8} />
      </div>
    );
  }

  const m = await getDictionary();

  return (
    <div
      className={cn("flex items-center justify-center gap-5.5", className)}
      style={style}
      aria-hidden
    >
      {variant === "circled" ? (
        <span className="shadow-node flex size-9 items-center justify-center rounded-full border border-[#DFE4F2] bg-white">
          <ChevronDown className="size-4 text-blue-ink" strokeWidth={1.8} />
        </span>
      ) : (
        <ChevronDown className="h-2.5 w-[18px] text-blue-fill" strokeWidth={2.2} />
      )}
      <span className="text-scroll uppercase text-blue-ink">{label ?? m.chrome.scrollCue.label}</span>
    </div>
  );
}
