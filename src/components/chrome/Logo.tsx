import type { CSSProperties } from "react";

import { cn } from "@/lib/cn";

/**
 * The Recharge brand mark.
 *
 * A vector trace of `.docs/brand/logo-mark.png` from the supplied logo pack.
 * Its fills are the authoritative hexes from that pack's colour sheet —
 * blue #35C1FC, pink #FC7E9E, green #61E1A3, grey #AAABB1 — not values
 * sampled off a render.
 *
 * Worth knowing if you compare against DESIGN-SPEC §2.1: the spec's logo
 * colours are much duller, because it measured them from the soft,
 * low-resolution deck page. The brand blue is also far brighter than the UI
 * blue (`blue-fill` #2B5FD9); the two are not interchangeable.
 *
 * Served as one cached file rather than inlined, because the lockup appears in
 * the header, the footer and the Connected section, and inlining ~16 KB of path
 * data three times into the HTML costs more than a single same-origin request.
 * `width`/`height` are set so it reserves its box and cannot shift layout.
 */
function RechargeMark({
  className,
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) {
  return (
    /* An SVG needs no resizing or format negotiation, so next/image would add
       a wrapper and a build step without changing a single delivered byte. */
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/logo-mark.svg"
      alt=""
      width={64}
      height={64}
      aria-hidden
      className={cn("shrink-0", className)}
      style={style}
    />
  );
}

/**
 * The full lockup: mark plus the serif wordmark.
 *
 * The wordmark is live text in the display serif rather than part of the image,
 * so it stays selectable, translatable and searchable, and tracks the page's
 * own type scale.
 *
 * `markClassName` and `wordmarkClassName` exist so callers size the parts
 * explicitly. The Connected section previously reached in with
 * `[&>svg]:size-[78px]`, which silently depended on the mark being a direct
 * child `<svg>` — a coupling that broke the moment the mark stopped being
 * inline SVG.
 */
export function Logo({
  className,
  markClassName,
  wordmarkClassName,
}: {
  className?: string;
  markClassName?: string;
  wordmarkClassName?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <RechargeMark className={cn("size-11 lg:size-[54px]", markClassName)} />
      <span className={cn("text-wordmark font-display text-brand-ink", wordmarkClassName)}>
        Recharge
      </span>
    </span>
  );
}
