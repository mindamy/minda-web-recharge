import { ChevronDown } from "@/components/icons";
import { cn } from "@/lib/cn";

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
 * assistive technology rather than announced.
 */
export function ScrollCue({
  variant = "bare",
  label = "Scroll to explore",
  className,
}: {
  variant?: "bare" | "circled" | "plain";
  label?: string;
  className?: string;
}) {
  if (variant === "plain") {
    return (
      <div className={cn("flex justify-center", className)} aria-hidden>
        <ChevronDown className="h-3 w-[22px] text-blue-ink" strokeWidth={1.8} />
      </div>
    );
  }

  return (
    <div
      className={cn("flex items-center justify-center gap-5.5", className)}
      aria-hidden
    >
      {variant === "circled" ? (
        <span className="shadow-node flex size-9 items-center justify-center rounded-full border border-[#DFE4F2] bg-white">
          <ChevronDown className="size-4 text-blue-ink" strokeWidth={1.8} />
        </span>
      ) : (
        <ChevronDown className="h-2.5 w-[18px] text-blue-fill" strokeWidth={2.2} />
      )}
      <span className="text-scroll uppercase text-blue-ink">{label}</span>
    </div>
  );
}
